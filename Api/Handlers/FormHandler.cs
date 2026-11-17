using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.Extensions.Logging;
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
    IFormMailService       mails,
    IBotCheckService       botCheck,
    IRateLimitService      rateLimit,
    ILogger<FormHandler>   logger)
{
    /// <summary>SQL Server 唯一鍵衝突的錯誤碼（2601 唯一索引／2627 唯一約束）。</summary>
    private static readonly int[] UniqueViolationNumbers = [2601, 2627];

    /// <summary>單號衝突重試次數。</summary>
    private const int QuoteNoRetries = 3;

    /// <summary>
    /// reCAPTCHA token 也可以放在這個標頭（前端一律這樣送）。放在標頭才能在
    /// <b>讀取本文之前</b>驗證——放在 multipart 欄位裡，伺服器得先收完近 100MB 才看得到它。
    /// </summary>
    public const string BotTokenHeader = "X-Recaptcha-Token";

    public async Task<IActionResult> CreateQuoteAsync(HttpRequest req)
    {
        var sourceIp = RequestContext.SourceIp(req);
        RequireBodyWithin(req, UploadRules.QuoteRequestMaxBytes);

        // 先驗機器人與頻率、再收本文：沒通過的請求不該讓伺服器先把附件收進暫存。
        // 標頭沒帶 token 的舊用戶端退回讀完本文再驗（本文大小已被上面與 FormOptions 限住）。
        var headerToken = req.Headers[BotTokenHeader].FirstOrDefault();
        if (!string.IsNullOrWhiteSpace(headerToken))
            await GuardPublicWriteAsync(req, headerToken, BotCheckActions.Quote, sourceIp,
                () => rateLimit.IsQuoteLimitExceededAsync(sourceIp));

        var (dto, files) = await ReadQuoteAsync(req);

        if (string.IsNullOrWhiteSpace(headerToken))
            await GuardPublicWriteAsync(req, dto.RecaptchaToken, BotCheckActions.Quote, sourceIp,
                () => rateLimit.IsQuoteLimitExceededAsync(sourceIp));

        ValidateQuote(dto, files);
        // 全部附件先驗完才開始上傳：原本逐個驗、逐個傳，第 3 個被擋時前 2 個已經進了 Blob，
        // 而 quote-attachments 容器不在孤兒檔排程的範圍內，會永久留著。
        var incoming = await InspectAttachmentsAsync(files);

        var now = Clock.UtcNow;
        var quote = new QuoteRequest
        {
            FullName               = dto.FullName!.Trim(),
            Company                = dto.Company!.Trim(),
            Email                  = dto.Email!.Trim(),
            Phone                  = dto.Phone?.Trim(),
            SolutionId             = dto.SolutionId ?? await SolutionIdByCodeAsync(dto.SolutionCode),
            IndustryCategoryId     = dto.IndustryCategoryId
                                     ?? await CategoryIdByCodeAsync(CategoryTypes.Industry, dto.IndustryCode),
            Quantity               = dto.Quantity!.Trim(),
            SizeText               = dto.SizeText?.Trim(),
            MaterialCategoryId     = dto.MaterialCategoryId
                                     ?? await CategoryIdByCodeAsync(CategoryTypes.QuoteMaterial, dto.MaterialCode),
            TargetDate             = dto.TargetDate,
            NeedsSustainableAdvice = dto.NeedsSustainableAdvice,
            Requirement            = dto.Requirement!.Trim(),
            ConsentAt              = now,
            Status                 = QuoteStatuses.New,
            SourceIp               = sourceIp,
            UserAgent              = RequestContext.UserAgent(req),
            SourceLang             = LangResolver.Resolve(req),
            SubmittedAt            = now,
        };

        // 附件先上傳 Blob 再落庫：上傳失敗就整筆不進 DB，不會留下指向不存在檔案的紀錄。
        // 反過來落庫失敗時要把剛傳的檔收回，否則就是沒有任何紀錄指著的客戶檔案。
        var attachments = await UploadAttachmentsAsync(incoming);
        try
        {
            await SaveQuoteWithRetryAsync(quote, attachments);
        }
        catch
        {
            await DeleteUploadedAsync(attachments);
            throw;
        }
        // 寄信失敗不影響已回 200 的提交（docs/10 §9.4），失敗只留在 EmailLog 等後台重寄
        await mails.SendQuoteMailsAsync(quote.Id);

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(new QuoteCreatedDto { QuoteNo = quote.QuoteNo }));
    }

    public async Task<IActionResult> CreateContactAsync(HttpRequest req)
    {
        RequireBodyWithin(req, UploadRules.ContactRequestMaxBytes);
        var dto      = await ReadJsonOrFormAsync<ContactCreateDto>(req, BindContact, UploadRules.ContactRequestMaxBytes);
        var sourceIp = RequestContext.SourceIp(req);

        await GuardPublicWriteAsync(req, dto.RecaptchaToken, BotCheckActions.Contact, sourceIp,
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

        await mails.SendContactNotifyAsync(message.Id);

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok("Success"));
    }

    // ── 公開寫入的共同防護（docs/10 §9.6）────────────────────────────────
    private async Task GuardPublicWriteAsync(
        HttpRequest req, string? token, string action, string? sourceIp, Func<Task<bool>> isLimitExceeded)
    {
        if (!await botCheck.VerifyAsync(token, action, sourceIp))
            throw AppException.BadRequest(ErrorCodes.BotCheckFailed, "機器人驗證未通過，請重新整理後再試。");

        if (await isLimitExceeded())
            throw new AppException(ErrorCodes.RateLimited, "提交次數過於頻繁，請稍後再試。", 429);
    }

    // ── 報價：讀取、驗證、上傳、落庫、寄信 ────────────────────────────────
    private static async Task<(QuoteCreateDto Dto, IFormFileCollection Files)> ReadQuoteAsync(HttpRequest req)
    {
        if (!req.HasFormContentType)
            return (await ReadJsonAsync<QuoteCreateDto>(req), new FormFileCollection());

        var form = await ReadFormWithinAsync(req, UploadRules.QuoteRequestMaxBytes);
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

        if (files.Sum(f => f.Length) > UploadRules.QuoteAttachmentMaxTotalBytes)
            throw AppException.BadRequest(ErrorCodes.UploadSize,
                $"附件合計超過 {UploadRules.QuoteAttachmentMaxTotalBytes / 1024 / 1024}MB。");
    }

    /// <summary>
    /// 代號 → Id。查不到就回 null 而不是丟錯：這三個欄位本來就是選填，
    /// 因為一個對不到的代號把整張詢價單擋掉，是拿客戶的生意去換資料整齊。
    /// 對不到會留一行 log，才知道表單與種子資料何時對不上。
    /// </summary>
    private async Task<int?> CategoryIdByCodeAsync(string categoryType, string? code)
    {
        if (string.IsNullOrWhiteSpace(code)) return null;

        var id = await db.Category.AsNoTracking()
            .Where(c => c.CategoryType == categoryType && c.Code == code && c.IsActive && !c.IsDeleted)
            .Select(c => (int?)c.Id)
            .FirstOrDefaultAsync();

        if (id is null) logger.LogWarning("報價表單送來對不到的分類代號：{Type}／{Code}。", categoryType, code);
        return id;
    }

    private async Task<int?> SolutionIdByCodeAsync(string? code)
    {
        if (string.IsNullOrWhiteSpace(code)) return null;

        var id = await db.Solution.AsNoTracking()
            .Where(s => s.Code == code && !s.IsDeleted)
            .Select(s => (int?)s.Id)
            .FirstOrDefaultAsync();

        if (id is null) logger.LogWarning("報價表單送來對不到的方案代號：{Code}。", code);
        return id;
    }

    /// <summary>通過檢查、準備上傳的附件。檔名已淨化，Content-Type 由副檔名決定。</summary>
    private sealed record IncomingAttachment(IFormFile File, string SafeName, string ContentType);

    /// <summary>
    /// 每個附件依序過：副檔名白名單 → 大小 → 檔頭 → ZIP 內容。
    /// <b>檔名先淨化再取副檔名</b>：白名單判斷的對象必須是後台日後顯示的那個名字。
    /// </summary>
    private static async Task<List<IncomingAttachment>> InspectAttachmentsAsync(IFormFileCollection files)
    {
        var incoming = new List<IncomingAttachment>();

        foreach (var file in files)
        {
            var name = UploadFileName.Sanitize(file.FileName);
            var ext  = Path.GetExtension(name);

            if (!UploadRules.QuoteAttachmentContentTypes.TryGetValue(ext, out var contentType))
                throw AppException.BadRequest(ErrorCodes.UploadType,
                    $"不支援的檔案格式：{ext}。可接受 {string.Join("、", UploadRules.QuoteAttachmentExtensions)}。");

            if (file.Length == 0)
                throw AppException.BadRequest(ErrorCodes.UploadType, $"{name} 是空檔案。");

            if (file.Length > UploadRules.QuoteAttachmentMaxBytes)
                throw AppException.BadRequest(ErrorCodes.UploadSize, $"{name} 超過 20MB。");

            await using var stream = file.OpenReadStream();

            // 只信檔頭：副檔名與 Content-Type 都是使用者說了算（docs/10 §9.5）
            if (!await FileSignatureValidator.IsValidAsync(stream, name))
                throw AppException.BadRequest(ErrorCodes.UploadType, $"{name} 的內容與副檔名不符。");

            if (ext.Equals(".zip", StringComparison.OrdinalIgnoreCase)
                && ZipInspector.Inspect(stream, name) is { } reason)
                throw AppException.BadRequest(ErrorCodes.UploadContent, reason);

            incoming.Add(new IncomingAttachment(file, name, contentType));
        }

        return incoming;
    }

    private async Task<List<QuoteAttachment>> UploadAttachmentsAsync(List<IncomingAttachment> incoming)
    {
        var attachments = new List<QuoteAttachment>();

        try
        {
            foreach (var item in incoming)
            {
                await using var stream = item.File.OpenReadStream();

                var path = await blobs.UploadAsync(
                    UploadRules.Containers.QuoteAttachments, item.SafeName, stream, item.ContentType);

                attachments.Add(new QuoteAttachment
                {
                    FilePath     = path,
                    OriginalName = item.SafeName,
                    ContentType  = item.ContentType,
                    SizeBytes    = item.File.Length,
                    CreatedAt    = Clock.UtcNow,
                });
            }
        }
        catch
        {
            // 傳到一半失敗：已經傳上去的不會有任何紀錄指著，當場收回
            await DeleteUploadedAsync(attachments);
            throw;
        }

        return attachments;
    }

    /// <summary>盡力刪除；刪不掉只留 log，不蓋掉原本的例外。</summary>
    private async Task DeleteUploadedAsync(List<QuoteAttachment> attachments)
    {
        foreach (var attachment in attachments)
        {
            try
            {
                await blobs.DeleteAsync(UploadRules.Containers.QuoteAttachments, attachment.FilePath);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "報價附件回收失敗，Blob 會殘留：{Path}", attachment.FilePath);
            }
        }
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

    // ── 讀取請求（JSON 或 multipart 皆可）─────────────────────────────────

    /// <summary>
    /// 有 <c>Content-Length</c> 就在讀本文之前擋掉過大的請求（413）。
    /// chunked 請求沒有這個標頭，由 <see cref="ReadFormWithinAsync"/> 的 <c>FormOptions</c> 在讀取途中擋。
    /// </summary>
    private static void RequireBodyWithin(HttpRequest req, long maxBytes)
    {
        if (req.ContentLength is long length && length > maxBytes)
            throw new AppException(ErrorCodes.UploadSize,
                $"請求內容過大（上限 {maxBytes / 1024 / 1024.0:0.#}MB）。", 413);
    }

    /// <summary>
    /// 帶上限的 <c>ReadFormAsync</c>。預設的 <c>FormOptions</c> 允許 128MB 本文、1024 個欄位，
    /// 公開端點不需要那麼寬。欄位數把檔案也算在內，所以同時擋住「一次塞上萬個小檔」。
    /// </summary>
    private static async Task<IFormCollection> ReadFormWithinAsync(HttpRequest req, long maxBytes)
    {
        var options = new FormOptions
        {
            MultipartBodyLengthLimit = maxBytes,
            BufferBodyLengthLimit    = maxBytes,
            ValueCountLimit          = 64,
            ValueLengthLimit         = 64 * 1024,
            KeyLengthLimit           = 256,
        };

        try
        {
            return await req.ReadFormAsync(options);
        }
        catch (InvalidDataException ex)
        {
            // 超過 FormOptions 任一上限時 ASP.NET Core 拋這個；不接住會變成 500
            throw new AppException(ErrorCodes.UploadSize, $"請求內容超過上限：{ex.Message}", 413);
        }
    }

    private static async Task<T> ReadJsonOrFormAsync<T>(HttpRequest req, Func<IFormCollection, T> bind, long maxBytes)
        where T : new()
    {
        if (!req.HasFormContentType) return await ReadJsonAsync<T>(req);
        return bind(await ReadFormWithinAsync(req, maxBytes));
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
        SolutionCode           = form["solution"],
        IndustryCode           = form["industry"],
        MaterialCode           = form["material"],
        RecaptchaToken         = form["recaptchaToken"],
    };

    private static ContactCreateDto BindContact(IFormCollection form) => new()
    {
        Name           = form["name"],
        Email          = form["email"],
        Company        = form["company"],
        Phone          = form["phone"],
        Message        = form["message"],
        Consent        = ParseBool(form["consent"]),
        RecaptchaToken = form["recaptchaToken"],
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
