using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using Nti.Api.Common;
using Nti.Api.Data;
using Nti.Api.Models.Entities;
using System.Net;
using System.Net.Mail;

namespace Nti.Api.Services;

/// <summary>SMTP 寄信 + EmailLog。Scoped——它要寫 <see cref="AppDbContext"/>。</summary>
public sealed class EmailService(
    IConfiguration cfg,
    AppDbContext db,
    ILogger<EmailService> logger) : IEmailService
{
    public async Task<bool> SendAsync(
        string  mailType,
        string  toAddress,
        string  subject,
        string  htmlBody,
        string? relatedEntity = null,
        int?    relatedId     = null,
        string? replyTo       = null,
        CancellationToken cancellationToken = default)
    {
        string? error = null;

        try
        {
            // 本機看信用：設了 Smtp__PickupDirectory 就不連 SMTP，改把每封信寫成 .eml 放進那個資料夾
            // （用郵件軟體或瀏覽器打開就看得到實際排版）。正式環境不要設。
            var pickup = cfg["Smtp:PickupDirectory"];
            var from   = cfg["Smtp:From"] is { Length: > 0 } f && !f.StartsWith("REPLACE", StringComparison.Ordinal)
                ? f
                : pickup is { Length: > 0 } ? "noreply@localhost" : throw new InvalidOperationException("Smtp:From is required.");

            using var client = pickup is { Length: > 0 }
                ? new SmtpClient
                {
                    DeliveryMethod          = SmtpDeliveryMethod.SpecifiedPickupDirectory,
                    PickupDirectoryLocation = Directory.CreateDirectory(pickup).FullName,
                }
                : new SmtpClient(
                    cfg["Smtp:Host"] ?? throw new InvalidOperationException("Smtp:Host is required."),
                    int.TryParse(cfg["Smtp:Port"], out var p) ? p : 587)
                {
                    EnableSsl   = true,
                    Credentials = new NetworkCredential(cfg["Smtp:User"], cfg["Smtp:Password"]),
                };

            using var message = new MailMessage { From = new MailAddress(from), Subject = subject, Body = htmlBody, IsBodyHtml = true };
            message.To.Add(toAddress);  // 接受逗號分隔的多組位址
            if (!string.IsNullOrWhiteSpace(replyTo)) message.ReplyToList.Add(replyTo);
            foreach (var bcc in await BccAddressesAsync(cancellationToken)) message.Bcc.Add(bcc);

            await client.SendMailAsync(message, cancellationToken);
        }
        catch (Exception ex)
        {
            // 收件者信箱格式錯、SMTP 認證失敗、對方伺服器拒收……都不該讓表單提交失敗。
            // 日誌不寫完整 email（docs/10 §9.10），細節在 EmailLog 裡。
            error = ex.Message.Length > 1000 ? ex.Message[..1000] : ex.Message;
            logger.LogError(ex, "寄信失敗：mailType={MailType} relatedEntity={Entity} relatedId={Id}",
                mailType, relatedEntity, relatedId);
        }

        db.EmailLog.Add(new EmailLog
        {
            MailType      = mailType,
            ToAddress     = toAddress,
            Subject       = subject,
            RelatedEntity = relatedEntity,
            RelatedId     = relatedId,
            Status        = error is null ? "Sent" : "Failed",
            ErrorMessage  = error,
            SentAt        = Clock.UtcNow,
        });
        await db.SaveChangesAsync(cancellationToken);

        return error is null;
    }

    /// <summary>
    /// 後台「網站設定 → 密件副本」（<c>mail.bcc</c>），逗號或分號分隔。
    /// 格式不對的那一組跳過並留 log——不能因為設定打錯一個字，整封信寄不出去。
    /// </summary>
    private async Task<IReadOnlyList<MailAddress>> BccAddressesAsync(CancellationToken cancellationToken)
    {
        var raw = await db.SiteSetting.AsNoTracking()
            .Where(x => x.SettingKey == "mail.bcc")
            .Select(x => x.ValueZh)
            .FirstOrDefaultAsync(cancellationToken);
        if (string.IsNullOrWhiteSpace(raw)) return [];

        var list = new List<MailAddress>();
        foreach (var part in raw.Split([',', ';'], StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries))
        {
            if (MailAddress.TryCreate(part, out var address)) list.Add(address);
            else logger.LogWarning("mail.bcc 有一組格式不正確，已略過。");
        }
        return list;
    }
}
