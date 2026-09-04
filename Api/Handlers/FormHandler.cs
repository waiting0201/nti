using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Nti.Api.Common;
using Nti.Api.Data;
using Nti.Api.Models.Dtos;
using Nti.Api.Models.Entities;
using Nti.Api.Services;

namespace Nti.Api.Handlers;

/// <summary>
/// 單元 17 quote ／ 18 contact 的**公開寫入**（04-api §3.2）。
/// 後台的檢視與改狀態在 <see cref="AdminFormHandler"/>。
/// </summary>
public sealed class FormHandler(
    AppDbContext           db,
    IQuoteNumberGenerator  quoteNumbers,
    IBlobStorageService    blobs,
    IEmailService          email,
    ITurnstileService      turnstile,
    IRateLimitService      rateLimit)
{
    /// <summary>SQL Server 唯一鍵衝突的錯誤碼（2601 唯一索引／2627 唯一約束）。</summary>
    private static readonly int[] UniqueViolationNumbers = [2601, 2627];

    /// <summary>單號衝突重試次數。</summary>
    private const int QuoteNoRetries = 3;

    public async Task<IActionResult> CreateQuoteAsync(HttpRequest req)
    {
        var (dto, files) = await ReadQuoteAsync(req);
        var sourceIp     = RequestContext.SourceIp(req);

        await GuardPublicWriteAsync(req, dto.TurnstileToken, sourceIp,
            () => rateLimit.IsQuoteLimitExceededAsync(sourceIp));

        ValidateQuote(dto, files);

        var now = Clock.UtcNow;
        var quote = new QuoteRequest
        {
            FullName               = dto.FullName!.Trim(),
            Company                = dto.Company!.Trim(),
            Email                  = dto.Email!.Trim(),
            Phone                  = dto.Phone?.Trim(),
            SolutionId             = dto.SolutionId,
            IndustryCategoryId     = dto.IndustryCategoryId,
            Quantity               = dto.Quantity!.Trim(),
            SizeText               = dto.SizeText?.Trim(),
            MaterialCategoryId     = dto.MaterialCategoryId,
            TargetDate             = dto.TargetDate,
            NeedsSustainableAdvice = dto.NeedsSustainableAdvice,
            Requirement            = dto.Requirement!.Trim(),
            ConsentAt              = now,
            Status                 = QuoteStatuses.New,
            SourceIp               = sourceIp,
            UserAgent              = RequestContext.UserAgent(req),
            SourceLang             = LangResolver.Resolve(req),
            SubmittedAt            = now,
            // 登入會員送出的報價要掛在他的帳號下，之後 /me/quotes 才查得到
            MemberId               = RequestContext.UserId(req.HttpContext.User),
        };

        // 附件先上傳 Blob 再落庫：上傳失敗就整筆不進 DB，不會留下指向不存在檔案的紀錄
        var attachments = await UploadAttachmentsAsync(files);

        await SaveQuoteWithRetryAsync(quote, attachments);
        await SendQuoteMailsAsync(quote);

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(new QuoteCreatedDto { QuoteNo = quote.QuoteNo }));
    }

    public async Task<IActionResult> CreateContactAsync(HttpRequest req)
    {
        var dto      = await ReadJsonOrFormAsync<ContactCreateDto>(req, BindContact);
        var sourceIp = RequestContext.SourceIp(req);

        await GuardPublicWriteAsync(req, dto.TurnstileToken, sourceIp,
            () => rateLimit.IsContactLimitExceededAsync(sourceIp));

        Require(dto.Name, "name");
        Require(dto.Email, "email");
        Require(dto.Message, "message");
        RequireEmail(dto.Email!);
        RequireConsent(dto.Consent);

        var now = Clock.UtcNow;
        var message = new ContactMessage
        {
            Name        = dto.Name!.Trim(),
            Email       = dto.Email!.Trim(),
            Company     = dto.Company?.Trim(),
            Phone       = dto.Phone?.Trim(),
            Message     = dto.Message!.Trim(),
            ConsentAt   = now,
            Status      = ContactStatuses.New,
            SourceIp    = sourceIp,
            UserAgent   = RequestContext.UserAgent(req),
            SourceLang  = LangResolver.Resolve(req),
            SubmittedAt = now,
        };

        db.ContactMessage.Add(message);
        await db.SaveChangesAsync();

        await email.SendAsync("ContactNotify", NotifyAddress(req), $"[NTI] 新的聯絡訊息：{message.Name}",
            $"<p>{System.Net.WebUtility.HtmlEncode(message.Message)}</p>", nameof(ContactMessage), message.Id);

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok("Success"));
    }

    // ── 公開寫入的共同防護（docs/10 §9.6）────────────────────────────────
    private async Task GuardPublicWriteAsync(
        HttpRequest req, string? turnstileToken, string? sourceIp, Func<Task<bool>> isLimitExceeded)
    {
        if (!await turnstile.VerifyAsync(turnstileToken, sourceIp))
            throw AppException.BadRequest(ErrorCodes.BotCheckFailed, "機器人驗證未通過，請重新整理後再試。");

        if (await isLimitExceeded())
            throw new AppException(ErrorCodes.RateLimited, "提交次數過於頻繁，請稍後再試。", 429);
    }

    // ── 報價：讀取、驗證、上傳、落庫、寄信 ────────────────────────────────
    private static async Task<(QuoteCreateDto Dto, IFormFileCollection Files)> ReadQuoteAsync(HttpRequest req)
    {
        if (!req.HasFormContentType)
            return (await ReadJsonAsync<QuoteCreateDto>(req), new FormFileCollection());

        var form = await req.ReadFormAsync();
        return (BindQuote(form), form.Files);
    }

    private static void ValidateQuote(QuoteCreateDto dto, IFormFileCollection files)
    {
        Require(dto.FullName, "fullName");
        Require(dto.Company, "company");
        Require(dto.Email, "email");
        Require(dto.Quantity, "quantity");
        Require(dto.Requirement, "requirement");
        RequireEmail(dto.Email!);
        RequireConsent(dto.Consent);

        if (files.Count > UploadRules.QuoteAttachmentMaxCount)
            throw AppException.BadRequest(ErrorCodes.UploadSize,
                $"附件最多 {UploadRules.QuoteAttachmentMaxCount} 個。");
    }

    private async Task<List<QuoteAttachment>> UploadAttachmentsAsync(IFormFileCollection files)
    {
        var attachments = new List<QuoteAttachment>();

        foreach (var file in files)
        {
            var ext = Path.GetExtension(file.FileName);

            if (!UploadRules.QuoteAttachmentExtensions.Contains(ext, StringComparer.OrdinalIgnoreCase))
                throw AppException.BadRequest(ErrorCodes.UploadType,
                    $"不支援的檔案格式：{ext}。可接受 {string.Join("、", UploadRules.QuoteAttachmentExtensions)}。");

            if (file.Length > UploadRules.QuoteAttachmentMaxBytes)
                throw AppException.BadRequest(ErrorCodes.UploadSize, $"{file.FileName} 超過 20MB。");

            await using var stream = file.OpenReadStream();

            // 只信檔頭：副檔名與 Content-Type 都是使用者說了算（docs/10 §9.5）
            if (!await FileSignatureValidator.IsValidAsync(stream, file.FileName))
                throw AppException.BadRequest(ErrorCodes.UploadType,
                    $"{file.FileName} 的內容與副檔名不符。");

            var path = await blobs.UploadAsync(
                UploadRules.Containers.QuoteAttachments, file.FileName, stream, file.ContentType);

            attachments.Add(new QuoteAttachment
            {
                FilePath     = path,
                OriginalName = file.FileName,
                ContentType  = file.ContentType,
                SizeBytes    = file.Length,
                ScanStatus   = "Pending",     // 掃描通過前不提供下載（docs/09 §17）
                CreatedAt    = Clock.UtcNow,
            });
        }

        return attachments;
    }

    private async Task SaveQuoteWithRetryAsync(QuoteRequest quote, List<QuoteAttachment> attachments)
    {
        for (var attempt = 1; ; attempt++)
        {
            quote.QuoteNo = await quoteNumbers.NextAsync();

            try
            {
                // 多表寫入包在 execution strategy 內：啟用了 EnableRetryOnFailure，
                // 直接 BeginTransaction 會被擋下（docs/10 §8.1）
                var strategy = db.Database.CreateExecutionStrategy();
                await strategy.ExecuteAsync(async () =>
                {
                    await using var tx = await db.Database.BeginTransactionAsync();

                    db.QuoteRequest.Add(quote);
                    await db.SaveChangesAsync();

                    foreach (var attachment in attachments)
                    {
                        attachment.QuoteRequestId = quote.Id;
                        db.QuoteAttachment.Add(attachment);
                    }
                    if (attachments.Count > 0) await db.SaveChangesAsync();

                    await tx.CommitAsync();
                });

                return;
            }
            catch (DbUpdateException ex)
                when (attempt < QuoteNoRetries
                      && ex.InnerException is SqlException sql
                      && UniqueViolationNumbers.Contains(sql.Number))
            {
                // 同一秒有另一筆搶到同一個號碼：清掉追蹤狀態後換號重試
                db.ChangeTracker.Clear();
                quote.Id = 0;
                foreach (var attachment in attachments) attachment.Id = 0;
            }
        }
    }

    private async Task SendQuoteMailsAsync(QuoteRequest quote)
    {
        // 寄信失敗不影響已回 200 的提交（docs/10 §9.4），失敗只留在 EmailLog 等後台重寄
        await email.SendAsync("QuoteNotify", InternalQuoteRecipient, $"[NTI] 新的報價需求 {quote.QuoteNo}",
            $"<p>{System.Net.WebUtility.HtmlEncode(quote.Company)}／{System.Net.WebUtility.HtmlEncode(quote.FullName)}</p>",
            nameof(QuoteRequest), quote.Id);

        await email.SendAsync("QuoteConfirm", quote.Email, $"[NTI] 我們已收到您的報價需求 {quote.QuoteNo}",
            $"<p>單號 {quote.QuoteNo}</p>", nameof(QuoteRequest), quote.Id);
    }

    /// <summary>
    /// 業務通知信的收件者。實際位址存在 <c>SiteSetting</c> 的 Mail 群組（前台不外露），
    /// 這裡先讀設定、讀不到才退回設定檔。
    /// </summary>
    private const string InternalQuoteRecipient = "quote@nti-printing.com";

    private string NotifyAddress(HttpRequest req) =>
        db.SiteSetting.AsNoTracking()
            .Where(x => x.SettingKey == "mail.contact_notify_to")
            .Select(x => x.ValueZh)
            .FirstOrDefault() ?? InternalQuoteRecipient;

    // ── 讀取請求（JSON 或 multipart 皆可）─────────────────────────────────
    private static async Task<T> ReadJsonOrFormAsync<T>(HttpRequest req, Func<IFormCollection, T> bind)
        where T : new()
    {
        if (!req.HasFormContentType) return await ReadJsonAsync<T>(req);
        return bind(await req.ReadFormAsync());
    }

    private static async Task<T> ReadJsonAsync<T>(HttpRequest req) where T : new()
    {
        try
        {
            return await req.ReadFromJsonAsync<T>() ?? new T();
        }
        catch (System.Text.Json.JsonException)
        {
            throw AppException.BadRequest(ErrorCodes.ValidationFormat, "請求內容不是有效的 JSON。");
        }
    }

    private static QuoteCreateDto BindQuote(IFormCollection form) => new()
    {
        FullName               = form["fullName"],
        Company                = form["company"],
        Email                  = form["email"],
        Phone                  = form["phone"],
        SolutionId             = ParseInt(form["solutionId"]),
        IndustryCategoryId     = ParseInt(form["industryCategoryId"]),
        Quantity               = form["quantity"],
        SizeText               = form["sizeText"],
        MaterialCategoryId     = ParseInt(form["materialCategoryId"]),
        TargetDate             = DateOnly.TryParse(form["targetDate"], out var d) ? d : null,
        NeedsSustainableAdvice = ParseBool(form["needsSustainableAdvice"]),
        Requirement            = form["requirement"],
        Consent                = ParseBool(form["consent"]),
        TurnstileToken         = form["turnstileToken"],
    };

    private static ContactCreateDto BindContact(IFormCollection form) => new()
    {
        Name           = form["name"],
        Email          = form["email"],
        Company        = form["company"],
        Phone          = form["phone"],
        Message        = form["message"],
        Consent        = ParseBool(form["consent"]),
        TurnstileToken = form["turnstileToken"],
    };

    private static int? ParseInt(string? value) => int.TryParse(value, out var v) ? v : null;

    private static bool ParseBool(string? value) =>
        value is not null && (value == "1" || value.Equals("true", StringComparison.OrdinalIgnoreCase)
                                           || value.Equals("on", StringComparison.OrdinalIgnoreCase));

    // ── 驗證 ──────────────────────────────────────────────────────────────
    private static void Require(string? value, string field)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw AppException.BadRequest(ErrorCodes.ValidationRequired, $"{field} 為必填。");
    }

    private static void RequireEmail(string email)
    {
        // 不做完整 RFC 驗證：真正的驗證是寄得出去。這裡只擋明顯打錯的。
        if (!email.Contains('@') || email.StartsWith('@') || email.EndsWith('@'))
            throw AppException.BadRequest(ErrorCodes.ValidationFormat, "email 格式不正確。");
    }

    private static void RequireConsent(bool consent)
    {
        if (!consent)
            throw AppException.BadRequest(ErrorCodes.ValidationRequired, "必須同意隱私權政策。");
    }
}
