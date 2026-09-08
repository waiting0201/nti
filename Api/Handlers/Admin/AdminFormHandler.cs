using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Nti.Api.Common;
using Nti.Api.Data;
using Nti.Api.Services;
using System.Text;

namespace Nti.Api.Handlers.Admin;

/// <summary>
/// 17 quote ／ 18 contact 的後台檢視與處理（docs/09 §17、§18）。
/// <para>
/// <b>客戶填寫的內容一律唯讀</b>，只能改 Status／AssigneeId／InternalNote／RepliedAt。
/// 允許改客戶送出的內容等於毀掉這筆紀錄的證據價值（個資同意時間、需求原文都是）。
/// </para>
/// </summary>
public sealed class AdminFormHandler(AppDbContext db, IBlobStorageService blobs)
{
    // ── 17 quote ─────────────────────────────────────────────────────────
    public async Task<IActionResult> GetQuotesAsync(HttpRequest req)
    {
        var paging = Paging.From(req);
        var status = QueryValues.Text(req, "status");

        var query = db.QuoteRequest.AsNoTracking().Where(q => !q.IsDeleted);
        if (status is not null) query = query.Where(q => q.Status == status);
        query = KeywordSearch.Apply(query, db.Model.FindEntityType(typeof(Models.Entities.QuoteRequest))!,
            QueryValues.Text(req, "keyword"));

        var total = await query.CountAsync();
        var rows  = await query.OrderByDescending(q => q.SubmittedAt)
            .Skip(paging.Skip).Take(paging.PageSize)
            .Select(q => new
            {
                q.Id, q.QuoteNo, q.FullName, q.Company, q.Email, q.Phone,
                q.Quantity, q.Status, q.AssigneeId, q.SubmittedAt, q.RepliedAt, q.SourceLang,
                attachmentCount = db.QuoteAttachment.Count(a => a.QuoteRequestId == q.Id),
            })
            .ToListAsync();

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(new
        {
            items = rows, totalCount = total, page = paging.Page,
            pageSize = paging.PageSize,
            totalPages = Math.Max(1, (int)Math.Ceiling((double)total / paging.PageSize)),
        }));
    }

    public async Task<IActionResult> GetQuoteAsync(HttpRequest req, string rawId)
    {
        var id    = ParseId(rawId);
        var quote = await db.QuoteRequest.AsNoTracking().FirstOrDefaultAsync(q => q.Id == id && !q.IsDeleted)
            ?? throw AppException.NotFound("QuoteRequest");

        var attachments = await db.QuoteAttachment.AsNoTracking()
            .Where(a => a.QuoteRequestId == id)
            .Select(a => new { a.Id, a.OriginalName, a.ContentType, a.SizeBytes, a.CreatedAt })
            .ToListAsync();

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(new { quote, attachments }));
    }

    public async Task<IActionResult> UpdateQuoteAsync(HttpRequest req, string rawId)
    {
        var id  = ParseId(rawId);
        var dto = await req.ReadFromJsonAsync<FormStatusDto>() ?? new FormStatusDto();

        var quote = await db.QuoteRequest.FirstOrDefaultAsync(q => q.Id == id && !q.IsDeleted)
            ?? throw AppException.NotFound("QuoteRequest");

        if (dto.Status is not null)
        {
            if (!QuoteStatusValues.Contains(dto.Status))
                throw AppException.BadRequest(ErrorCodes.ValidationFormat,
                    $"status 必須是 {string.Join("／", QuoteStatusValues)}。");

            quote.Status = dto.Status;
        }

        quote.AssigneeId   = dto.AssigneeId ?? quote.AssigneeId;
        quote.InternalNote = dto.InternalNote ?? quote.InternalNote;
        if (dto.MarkReplied) quote.RepliedAt = Clock.UtcNow;

        await db.SaveChangesAsync();

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok("已更新。"));
    }

    /// <summary>
    /// 匯出 CSV（權限 <c>quote.export</c>，僅超管）——匯出等於把一整份客戶個資帶出系統。
    /// </summary>
    public async Task<IActionResult> ExportQuotesAsync(HttpRequest req)
    {
        var rows = await db.QuoteRequest.AsNoTracking().Where(q => !q.IsDeleted)
            .OrderByDescending(q => q.SubmittedAt).ToListAsync();

        var csv = new StringBuilder("quoteNo,submittedAt,status,fullName,company,email,phone,quantity,sizeText,targetDate,requirement\n");
        foreach (var q in rows)
        {
            csv.Append(string.Join(',',
                Csv(q.QuoteNo), Csv(q.SubmittedAt.ToString("yyyy-MM-dd HH:mm")), Csv(q.Status),
                Csv(q.FullName), Csv(q.Company), Csv(q.Email), Csv(q.Phone ?? ""),
                Csv(q.Quantity), Csv(q.SizeText ?? ""), Csv(q.TargetDate?.ToString("yyyy-MM-dd") ?? ""),
                Csv(q.Requirement))).Append('\n');
        }

        CacheControl.NoStore(req.HttpContext.Response);
        // BOM：Excel 開 UTF-8 沒有 BOM 的 CSV 會把中文顯示成亂碼。
        // ⚠ `new UTF8Encoding(true)` 只影響 GetPreamble()，GetBytes() 永遠不含 BOM——
        // 原本這樣寫等於沒有 BOM，而且從回應本身看不出來（2026-09-08 修正）
        return new FileContentResult(
            [.. Encoding.UTF8.GetPreamble(), .. Encoding.UTF8.GetBytes(csv.ToString())], "text/csv")
        {
            FileDownloadName = $"quotes-{Clock.Today:yyyyMMdd}.csv",
        };
    }

    /// <summary>
    /// 下載報價附件（權限 <c>quote.download</c>，僅超管）。
    /// <para>
    /// <b>本期不做病毒掃描</b>（2026-09-08 決策，見 docs/09 §17）：接掃描服務要每月固定成本，
    /// 與這個案子的規模不成比例。原本擋在 <c>ScanStatus = 'Clean'</c> 的閘因此拿掉——
    /// 留著只會讓後台永遠下載不到任何附件，等於報價功能有一半是壞的。
    /// </para>
    /// <para>
    /// 拿掉閘之後靠三件事把風險壓住：權限限超管、<b>一律以 <c>application/octet-stream</c>
    /// 送出</b>（不讓瀏覽器依 Content-Type 直接開啟 PDF／SVG，SVG 尤其可以帶腳本）、
    /// 外加 <c>nosniff</c> 擋掉瀏覽器自行猜型別。檔案本身仍未經掃描，後台介面有明示警語。
    /// </para>
    /// </summary>
    public async Task<IActionResult> DownloadAttachmentAsync(HttpRequest req, string rawQuoteId, string rawAttachmentId)
    {
        var quoteId      = ParseId(rawQuoteId);
        var attachmentId = ParseId(rawAttachmentId);

        var attachment = await db.QuoteAttachment.AsNoTracking()
            .FirstOrDefaultAsync(a => a.Id == attachmentId && a.QuoteRequestId == quoteId)
            ?? throw AppException.NotFound("QuoteAttachment");

        var file = await blobs.DownloadAsync(UploadRules.Containers.QuoteAttachments, attachment.FilePath)
            ?? throw AppException.NotFound("附件檔案");

        CacheControl.NoStore(req.HttpContext.Response);
        req.HttpContext.Response.Headers["X-Content-Type-Options"] = "nosniff";

        // 一律 octet-stream：存進來的 ContentType 是上傳端說了算，照它送等於讓外部
        // 檔案決定瀏覽器怎麼開。附件只有「存檔」一種用途，不需要能預覽。
        return new FileStreamResult(file.Content, "application/octet-stream")
        {
            FileDownloadName = attachment.OriginalName,
        };
    }

    // ── 18 contact ───────────────────────────────────────────────────────
    public async Task<IActionResult> GetContactsAsync(HttpRequest req)
    {
        var paging = Paging.From(req);
        var status = QueryValues.Text(req, "status");

        var query = db.ContactMessage.AsNoTracking().Where(c => !c.IsDeleted);
        if (status is not null) query = query.Where(c => c.Status == status);
        query = KeywordSearch.Apply(query, db.Model.FindEntityType(typeof(Models.Entities.ContactMessage))!,
            QueryValues.Text(req, "keyword"));

        var total = await query.CountAsync();
        var rows  = await query.OrderByDescending(c => c.SubmittedAt)
            .Skip(paging.Skip).Take(paging.PageSize).ToListAsync();

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(
            PagedResult<Models.Entities.ContactMessage>.From(rows, total, paging.Page, paging.PageSize)));
    }

    public async Task<IActionResult> GetContactAsync(HttpRequest req, string rawId)
    {
        var id  = ParseId(rawId);
        var row = await db.ContactMessage.AsNoTracking().FirstOrDefaultAsync(c => c.Id == id && !c.IsDeleted)
            ?? throw AppException.NotFound("ContactMessage");

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(row));
    }

    public async Task<IActionResult> UpdateContactAsync(HttpRequest req, string rawId)
    {
        var id  = ParseId(rawId);
        var dto = await req.ReadFromJsonAsync<FormStatusDto>() ?? new FormStatusDto();

        var message = await db.ContactMessage.FirstOrDefaultAsync(c => c.Id == id && !c.IsDeleted)
            ?? throw AppException.NotFound("ContactMessage");

        if (dto.Status is not null)
        {
            if (!ContactStatusValues.Contains(dto.Status))
                throw AppException.BadRequest(ErrorCodes.ValidationFormat,
                    $"status 必須是 {string.Join("／", ContactStatusValues)}。");

            message.Status = dto.Status;
        }

        message.AssigneeId   = dto.AssigneeId ?? message.AssigneeId;
        message.InternalNote = dto.InternalNote ?? message.InternalNote;
        if (dto.MarkReplied) message.RepliedAt = Clock.UtcNow;

        await db.SaveChangesAsync();

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok("已更新。"));
    }

    private static readonly string[] QuoteStatusValues =
        [QuoteStatuses.New, QuoteStatuses.InProgress, QuoteStatuses.Quoted, QuoteStatuses.Closed, QuoteStatuses.Spam];

    private static readonly string[] ContactStatusValues =
        [ContactStatuses.New, ContactStatuses.Replied, ContactStatuses.Closed, ContactStatuses.Spam];

    private static int ParseId(string rawId) =>
        int.TryParse(rawId, out var id)
            ? id
            : throw AppException.BadRequest(ErrorCodes.ValidationFormat, "id 必須是數字。");

    private static string Csv(string value) =>
        value.Contains(',') || value.Contains('"') || value.Contains('\n')
            ? $"\"{value.Replace("\"", "\"\"")}\""
            : value;
}

/// <summary>後台唯一能改的四個欄位。</summary>
public sealed class FormStatusDto
{
    public string? Status       { get; set; }
    public int?    AssigneeId   { get; set; }
    public string? InternalNote { get; set; }
    public bool    MarkReplied  { get; set; }
}
