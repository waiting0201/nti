using System.Globalization;
using System.Net;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Nti.Api.Common;
using Nti.Api.Data;
using Nti.Api.Models.Entities;

namespace Nti.Api.Services;

/// <summary>
/// 前台表單的通知信與確認信（docs/10 §9.4）：從資料庫的那一筆組出信件內容，再交給 <see cref="IEmailService"/> 寄。
/// <para>
/// <b>內容一律從原始資料重組，不存在 EmailLog</b>——表單送出與後台重寄走同一條路，
/// 兩邊寄出去的信一模一樣；EmailLog 也不必多存一份客戶個資。
/// 代價是原始資料被刪掉之後就不能重寄，這時回 409 說清楚。
/// </para>
/// </summary>
public interface IFormMailService
{
    /// <summary>報價：寄內部通知 + 客戶確認信。</summary>
    Task SendQuoteMailsAsync(int quoteId, CancellationToken cancellationToken = default);

    /// <summary>聯絡：寄內部通知。</summary>
    Task SendContactNotifyAsync(int contactId, CancellationToken cancellationToken = default);

    /// <summary>
    /// 重寄既有的 EmailLog（後台單元 24 的 audit.resend）。找不到回 null。
    /// <para>
    /// 內部通知改寄<b>目前</b>的收件者設定（通知寄不出去，常常就是因為收件者填錯，改好設定再重寄才有意義）；
    /// 客戶確認信寄回原本的客戶信箱。
    /// </para>
    /// </summary>
    Task<bool?> ResendAsync(long emailLogId, CancellationToken cancellationToken = default);
}

public sealed class FormMailService(
    AppDbContext              db,
    IEmailService             email,
    IConfiguration            cfg,
    ILogger<FormMailService>  logger) : IFormMailService
{
    /// <summary>
    /// 通知收件者沒設定時的退路：聯絡頁公布的信箱（reference/現有網站盤點與內容遷移.md D1）。
    /// 設定被清空時至少還有人收得到，不會把詢價默默丟掉。
    /// <para>
    /// ⚠ 收件者<b>一定要走設定</b>：報價通知原本是寫死的 <c>quote@nti-printing.com</c>，
    /// 後台的「報價通知收件者」怎麼填都不會被讀到——客戶改了設定、信照樣寄到別處，畫面上不會有任何異狀。
    /// </para>
    /// </summary>
    private const string FallbackRecipient = "service@nti-printing.com";

    /// <summary>資料庫存 UTC；信裡給人看的時間一律換成台灣時間（UTC+8，無日光節約）。</summary>
    private static readonly TimeSpan TaiwanOffset = TimeSpan.FromHours(8);

    // 表單送出時的兩個入口一律不往外丟例外：資料已經落庫，客戶該拿到 200。
    // SMTP 的錯誤 EmailService 自己會吞並寫 EmailLog；這裡防的是組信件時讀 DB 出錯——
    // 那種情況連 EmailLog 都沒有，只能靠 log 發現，所以記成 Error。

    public async Task SendQuoteMailsAsync(int quoteId, CancellationToken cancellationToken = default)
    {
        try
        {
            var view = await LoadQuoteAsync(quoteId, cancellationToken)
                       ?? throw new InvalidOperationException($"QuoteRequest {quoteId} 不存在。");

            await SendQuoteNotifyAsync(view, cancellationToken);
            await SendQuoteConfirmAsync(view, view.Quote.Email, cancellationToken);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "報價信件組裝失敗，未寄出：quoteId={QuoteId}", quoteId);
        }
    }

    public async Task SendContactNotifyAsync(int contactId, CancellationToken cancellationToken = default)
    {
        try
        {
            var message = await db.ContactMessage.AsNoTracking().FirstOrDefaultAsync(x => x.Id == contactId, cancellationToken)
                          ?? throw new InvalidOperationException($"ContactMessage {contactId} 不存在。");

            await SendContactNotifyAsync(message, cancellationToken);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "聯絡通知組裝失敗，未寄出：contactId={ContactId}", contactId);
        }
    }

    public async Task<bool?> ResendAsync(long emailLogId, CancellationToken cancellationToken = default)
    {
        var log = await db.EmailLog.AsNoTracking().FirstOrDefaultAsync(x => x.Id == emailLogId, cancellationToken);
        if (log is null) return null;

        switch (log.MailType)
        {
            case MailTypes.QuoteNotify:
            case MailTypes.QuoteConfirm:
            {
                var view = await LoadQuoteAsync(log.RelatedId, cancellationToken) ?? throw SourceGone("報價需求");
                return log.MailType == MailTypes.QuoteNotify
                    ? await SendQuoteNotifyAsync(view, cancellationToken)
                    : await SendQuoteConfirmAsync(view, log.ToAddress, cancellationToken);
            }
            case MailTypes.ContactNotify:
            {
                var message = log.RelatedId is int id
                    ? await db.ContactMessage.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, cancellationToken)
                    : null;
                return await SendContactNotifyAsync(message ?? throw SourceGone("聯絡訊息"), cancellationToken);
            }
            default:
                throw AppException.Conflict(ErrorCodes.ConflictState, $"「{log.MailType}」類型的信件不支援重寄。");
        }
    }

    private static AppException SourceGone(string what) =>
        AppException.Conflict(ErrorCodes.ConflictState, $"原本的{what}已被刪除，無法重組信件內容，所以不能重寄。");

    // ── 報價 ──────────────────────────────────────────────────────────

    /// <summary>報價單加上它引用的名稱（方案／產業別／材質，中英各一）與附件清單。</summary>
    private sealed record QuoteView(
        QuoteRequest Quote,
        Dictionary<string, string> SolutionName,
        Dictionary<string, string> IndustryName,
        Dictionary<string, string> MaterialName,
        List<QuoteAttachment> Attachments)
    {
        public string? Name(Dictionary<string, string> names, string lang) =>
            names.TryGetValue(lang, out var n) ? n : names.Values.FirstOrDefault();
    }

    private async Task<QuoteView?> LoadQuoteAsync(int? quoteId, CancellationToken ct)
    {
        if (quoteId is null) return null;
        var quote = await db.QuoteRequest.AsNoTracking().FirstOrDefaultAsync(x => x.Id == quoteId, ct);
        if (quote is null) return null;

        return new QuoteView(
            quote,
            quote.SolutionId is int s
                ? await db.SolutionI18n.AsNoTracking().Where(x => x.SolutionId == s).ToDictionaryAsync(x => x.Lang, x => x.Name, ct)
                : [],
            await CategoryNamesAsync(quote.IndustryCategoryId, ct),
            await CategoryNamesAsync(quote.MaterialCategoryId, ct),
            await db.QuoteAttachment.AsNoTracking().Where(x => x.QuoteRequestId == quote.Id).OrderBy(x => x.Id).ToListAsync(ct));
    }

    private async Task<Dictionary<string, string>> CategoryNamesAsync(int? categoryId, CancellationToken ct) =>
        categoryId is int id
            ? await db.CategoryI18n.AsNoTracking().Where(x => x.CategoryId == id).ToDictionaryAsync(x => x.Lang, x => x.Name, ct)
            : [];

    private async Task<bool> SendQuoteNotifyAsync(QuoteView v, CancellationToken ct)
    {
        var q = v.Quote;
        var rows = new List<(string, string?)>
        {
            ("單號",           Esc(q.QuoteNo)),
            ("送出時間",       Esc(TaiwanTime(q.SubmittedAt))),
            ("姓名",           Esc(q.FullName)),
            ("公司",           Esc(q.Company)),
            ("Email",          MailLink(q.Email)),
            ("電話",           Esc(q.Phone)),
            ("需求方案",       Esc(v.Name(v.SolutionName, Langs.Zh))),
            ("產業別",         Esc(v.Name(v.IndustryName, Langs.Zh))),
            ("數量",           Esc(q.Quantity)),
            ("尺寸（長×寬×高 mm）", Esc(q.SizeText)),
            ("材質偏好",       Esc(v.Name(v.MaterialName, Langs.Zh)) ?? "未指定（請我們建議）"),
            ("希望交期",       Esc(q.TargetDate?.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture))),
            ("需要每單碳排估算", q.NeedsSustainableAdvice ? "是" : "否"),
            ("需求說明",       Multiline(q.Requirement)),
            ("附件",           AttachmentList(v.Attachments, "附件請至後台報價單下載（限超級管理員）。")),
            ("填表語系",       q.SourceLang == Langs.En ? "英文版網站" : "中文版網站"),
        };

        var body = Layout(
            $"新的報價需求 {Esc(q.QuoteNo)}",
            $"<p style=\"margin:0 0 16px\">{Esc(q.Company)} 的 {Esc(q.FullName)} 從官網送出了一筆報價需求。直接回覆這封信就會回給客戶。</p>"
            + Table(rows)
            + AdminLink("quote", q.Id, "到後台查看這筆報價單"));

        return await email.SendAsync(MailTypes.QuoteNotify, await NotifyAddressAsync("mail.quote_notify_to", ct),
            $"[NTI] 新的報價需求 {q.QuoteNo}｜{q.Company}", body, nameof(QuoteRequest), q.Id, replyTo: q.Email, cancellationToken: ct);
    }

    private async Task<bool> SendQuoteConfirmAsync(QuoteView v, string toAddress, CancellationToken ct)
    {
        var q    = v.Quote;
        var lang = q.SourceLang == Langs.En ? Langs.En : Langs.Zh;
        var en   = lang == Langs.En;
        var company = await SettingAsync("company.name", lang, ct) ?? "NTI Printing";

        var rows = new List<(string, string?)>
        {
            (en ? "Reference no."    : "單號",       Esc(q.QuoteNo)),
            (en ? "Solution"         : "需求方案",   Esc(v.Name(v.SolutionName, lang))),
            (en ? "Industry"         : "產業別",     Esc(v.Name(v.IndustryName, lang))),
            (en ? "Quantity"         : "數量",       Esc(q.Quantity)),
            (en ? "Size (L×W×H mm)"  : "尺寸（長×寬×高 mm）", Esc(q.SizeText)),
            (en ? "Material"         : "材質偏好",   Esc(v.Name(v.MaterialName, lang)) ?? (en ? "No preference — advise me" : "未指定（請我們建議）")),
            (en ? "Target date"      : "希望交期",   Esc(q.TargetDate?.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture))),
            (en ? "Carbon estimate"  : "每單碳排估算", q.NeedsSustainableAdvice ? (en ? "Requested" : "需要") : null),
            (en ? "Requirements"     : "需求說明",   Multiline(q.Requirement)),
            (en ? "Attachments"      : "附件",       AttachmentList(v.Attachments, null)),
        };

        var intro = en
            ? $"<p style=\"margin:0 0 12px\">Dear {Esc(q.FullName)},</p>"
              + $"<p style=\"margin:0 0 16px\">Thank you for your quote request. We have received the details below and our team will get back to you shortly. Please quote reference <b>{Esc(q.QuoteNo)}</b> in any follow-up.</p>"
            : $"<p style=\"margin:0 0 12px\">{Esc(q.FullName)} 您好：</p>"
              + $"<p style=\"margin:0 0 16px\">感謝您的詢價，我們已收到以下內容，將盡快與您聯繫。後續聯絡時請提供單號 <b>{Esc(q.QuoteNo)}</b>。</p>";

        var body = Layout(
            en ? "We've received your quote request" : "我們已收到您的報價需求",
            intro + Table(rows) + await ContactFooterAsync(lang, company, ct));

        var subject = en
            ? $"[NTI] We've received your quote request {q.QuoteNo}"
            : $"[NTI] 我們已收到您的報價需求 {q.QuoteNo}";

        return await email.SendAsync(MailTypes.QuoteConfirm, toAddress, subject, body,
            nameof(QuoteRequest), q.Id, cancellationToken: ct);
    }

    // ── 聯絡 ──────────────────────────────────────────────────────────

    private async Task<bool> SendContactNotifyAsync(ContactMessage m, CancellationToken ct)
    {
        var rows = new List<(string, string?)>
        {
            ("送出時間", Esc(TaiwanTime(m.SubmittedAt))),
            ("姓名",     Esc(m.Name)),
            ("公司",     Esc(m.Company)),
            ("Email",    MailLink(m.Email)),
            ("電話",     Esc(m.Phone)),
            ("訊息",     Multiline(m.Message)),
            ("填表語系", m.SourceLang == Langs.En ? "英文版網站" : "中文版網站"),
        };

        var who = string.IsNullOrWhiteSpace(m.Company) ? Esc(m.Name) : $"{Esc(m.Company)} 的 {Esc(m.Name)}";
        var body = Layout(
            "新的聯絡訊息",
            $"<p style=\"margin:0 0 16px\">{who} 從官網「聯絡我們」送出了一則訊息。直接回覆這封信就會回給對方。</p>"
            + Table(rows)
            + AdminLink("contact", m.Id, "到後台查看這則訊息"));

        return await email.SendAsync(MailTypes.ContactNotify, await NotifyAddressAsync("mail.contact_notify_to", ct),
            $"[NTI] 新的聯絡訊息：{m.Name}", body, nameof(ContactMessage), m.Id, replyTo: m.Email, cancellationToken: ct);
    }

    // ── 設定 ──────────────────────────────────────────────────────────

    private async Task<string> NotifyAddressAsync(string settingKey, CancellationToken ct) =>
        await db.SiteSetting.AsNoTracking()
            .Where(x => x.SettingKey == settingKey)
            .Select(x => x.ValueZh)
            .FirstOrDefaultAsync(ct) is { Length: > 0 } address ? address : FallbackRecipient;

    /// <summary>網站設定的值：多語的取該語系，沒填就落回中文欄（不分語系的設定只存在中文欄）。</summary>
    private async Task<string?> SettingAsync(string key, string lang, CancellationToken ct)
    {
        var s = await db.SiteSetting.AsNoTracking().FirstOrDefaultAsync(x => x.SettingKey == key, ct);
        if (s is null) return null;
        var value = lang == Langs.En && s.IsLocalized ? s.ValueEn : s.ValueZh;
        return string.IsNullOrWhiteSpace(value) ? (string.IsNullOrWhiteSpace(s.ValueZh) ? null : s.ValueZh) : value;
    }

    /// <summary>客戶確認信的頁尾：公司名稱、電話、信箱都讀網站設定，客戶在後台改了就跟著變。</summary>
    private async Task<string> ContactFooterAsync(string lang, string company, CancellationToken ct)
    {
        var phone = await SettingAsync("company.phone", lang, ct);
        var mail  = await SettingAsync("company.email", lang, ct);
        var lines = new List<string> { $"<b>{Esc(company)}</b>" };
        if (phone is not null) lines.Add((lang == Langs.En ? "Tel: " : "電話：") + Esc(phone));
        if (mail is not null)  lines.Add((lang == Langs.En ? "Email: " : "信箱：") + MailLink(mail));
        return $"<p style=\"margin:24px 0 0;padding-top:16px;border-top:1px solid #e5e7eb;color:#4b5563;font-size:13px;line-height:1.7\">{string.Join("<br>", lines)}</p>";
    }

    /// <summary>
    /// 後台連結：設了 <c>Mail__AdminUrl</c>（例如 <c>https://www.nti-printing.com/admin</c>）才出現。
    /// 網域還沒綁定前寫死預覽網址，換網域那天信裡的連結就全錯了，所以走設定。
    /// </summary>
    private string AdminLink(string unit, int id, string text)
    {
        var baseUrl = cfg["Mail:AdminUrl"]?.TrimEnd('/');
        if (string.IsNullOrWhiteSpace(baseUrl)) return "";
        var href = $"{baseUrl}/u/{unit}/{id}";
        return $"<p style=\"margin:20px 0 0\"><a href=\"{Esc(href)}\" style=\"display:inline-block;padding:10px 18px;background:#1f3a5f;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:600\">{Esc(text)}</a></p>";
    }

    // ── HTML 小工具：所有使用者輸入一律先 HtmlEncode ─────────────────────

    private static string? Esc(string? s) => string.IsNullOrWhiteSpace(s) ? null : WebUtility.HtmlEncode(s.Trim());

    private static string? Multiline(string? s) => Esc(s)?.Replace("\r\n", "\n").Replace("\n", "<br>");

    private static string MailLink(string address) =>
        $"<a href=\"mailto:{WebUtility.HtmlEncode(address)}\" style=\"color:#1f3a5f\">{WebUtility.HtmlEncode(address)}</a>";

    private static string TaiwanTime(DateTime utc) =>
        DateTime.SpecifyKind(utc, DateTimeKind.Utc).Add(TaiwanOffset).ToString("yyyy-MM-dd HH:mm", CultureInfo.InvariantCulture) + "（台灣時間）";

    private static string? AttachmentList(List<QuoteAttachment> files, string? note)
    {
        if (files.Count == 0) return null;
        var items = string.Join("<br>", files.Select(f => $"{Esc(f.OriginalName)}（{FileSize(f.SizeBytes)}）"));
        return note is null ? items : $"{items}<br><span style=\"color:#6b7280;font-size:12px\">{Esc(note)}</span>";
    }

    private static string FileSize(long bytes) =>
        bytes >= 1024 * 1024
            ? (bytes / 1024d / 1024d).ToString("0.0", CultureInfo.InvariantCulture) + " MB"
            : Math.Max(1, bytes / 1024).ToString(CultureInfo.InvariantCulture) + " KB";

    /// <summary>空值的列不印——客戶沒填的欄位，在信裡出現一排「—」只是雜訊。值必須已經 encode 過。</summary>
    private static string Table(IEnumerable<(string Label, string? Html)> rows)
    {
        var sb = new StringBuilder("<table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:100%;border-collapse:collapse;font-size:14px\">");
        foreach (var (label, html) in rows.Where(r => !string.IsNullOrWhiteSpace(r.Html)))
        {
            sb.Append("<tr>")
              .Append($"<th align=\"left\" valign=\"top\" style=\"width:150px;padding:8px 12px 8px 0;border-bottom:1px solid #e5e7eb;color:#6b7280;font-weight:600\">{WebUtility.HtmlEncode(label)}</th>")
              .Append($"<td valign=\"top\" style=\"padding:8px 0;border-bottom:1px solid #e5e7eb;color:#111827;line-height:1.6\">{html}</td>")
              .Append("</tr>");
        }
        return sb.Append("</table>").ToString();
    }

    /// <summary>信件外框：只用 inline style（多數郵件軟體會丟掉 &lt;style&gt;），寬度上限 640px。</summary>
    private static string Layout(string titleHtml, string contentHtml) =>
        "<!doctype html><html><body style=\"margin:0;padding:24px;background:#f3f4f6;font-family:-apple-system,'Segoe UI','PingFang TC','Microsoft JhengHei',sans-serif\">"
        + "<div style=\"max-width:640px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden\">"
        + "<div style=\"height:4px;background:#3a9a5b\"></div>"
        + "<div style=\"padding:28px 28px 32px\">"
        + $"<h1 style=\"margin:0 0 16px;font-size:20px;color:#1f3a5f\">{titleHtml}</h1>"
        + contentHtml
        + "</div></div></body></html>";
}
