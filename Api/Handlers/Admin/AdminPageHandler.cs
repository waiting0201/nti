using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Nti.Api.Common;
using Nti.Api.Data;
using Nti.Api.Models.Entities;
using System.Text;

namespace Nti.Api.Handlers.Admin;

/// <summary>
/// 15 page。29 筆固定頁**不可增刪**（權限矩陣也沒有 <c>page.delete</c>），
/// 只能改 SEO 欄位；<c>HasRichBody = 1</c> 的兩頁另可編輯內文。
/// </summary>
public sealed class AdminPageHandler(AppDbContext db)
{
    public async Task<IActionResult> GetListAsync(HttpRequest req)
    {
        var rows = await db.Page.AsNoTracking().Where(p => !p.IsDeleted)
            .OrderBy(p => p.Id)
            .Select(p => new
            {
                p.Id, p.PageKey, p.RouteTemplate, p.HasRichBody, p.IsIndexable, p.OgImagePath, p.UpdatedAt,
                i18n = db.PageI18n.Where(i => i.PageId == p.Id)
                    .Select(i => new { i.Lang, i.Slug, i.SeoTitle, i.SeoDescription })
                    .ToList(),
            })
            .ToListAsync();

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(rows));
    }

    public async Task<IActionResult> GetByKeyAsync(HttpRequest req, string pageKey)
    {
        var page = await db.Page.AsNoTracking().FirstOrDefaultAsync(p => p.PageKey == pageKey && !p.IsDeleted)
            ?? throw AppException.NotFound("Page");

        var i18ns = await db.PageI18n.AsNoTracking().Where(i => i.PageId == page.Id).ToListAsync();

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(new
        {
            item = page,
            i18n = i18ns.ToDictionary(i => i.Lang, i => i),
        }));
    }

    public async Task<IActionResult> UpdateAsync(HttpRequest req, string pageKey)
    {
        var page = await db.Page.FirstOrDefaultAsync(p => p.PageKey == pageKey && !p.IsDeleted)
            ?? throw AppException.NotFound("Page");

        var dto = await req.ReadFromJsonAsync<PageUpdateDto>()
            ?? throw AppException.BadRequest(ErrorCodes.ValidationRequired, "缺少內容。");

        // PageKey 與 RouteTemplate 不可改：前端是照 PageKey 取 SEO 的，改了會整頁抓不到
        page.OgImagePath = dto.OgImagePath;
        page.IsIndexable = dto.IsIndexable;

        foreach (var (lang, body) in dto.I18n)
        {
            if (!Langs.All.Contains(lang)) continue;

            var i18n = await db.PageI18n.FirstOrDefaultAsync(i => i.PageId == page.Id && i.Lang == lang);
            if (i18n is null)
            {
                i18n = new PageI18n { PageId = page.Id, Lang = lang, Slug = body.Slug ?? lang };
                db.PageI18n.Add(i18n);
            }

            if (!string.IsNullOrWhiteSpace(body.Slug)) i18n.Slug = body.Slug.Trim();

            i18n.SeoTitle       = Limit(body.SeoTitle, 70, "seoTitle");
            i18n.SeoDescription = Limit(body.SeoDescription, 180, "seoDescription");
            i18n.CanonicalUrl   = body.CanonicalUrl;
            i18n.OgTitle        = Limit(body.OgTitle, 90, "ogTitle");
            i18n.OgDescription  = Limit(body.OgDescription, 200, "ogDescription");

            // 內文只有 HasRichBody = 1 的兩頁（privacy-legal、預留的 green-csr）能編
            if (page.HasRichBody) i18n.BodyHtml = body.BodyHtml;
        }

        await db.SaveChangesAsync();

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok("已更新。"));
    }

    /// <summary>SEO 欄位長度上限（05-seo）。超過就擋，不要靜默截斷。</summary>
    private static string? Limit(string? value, int max, string field)
    {
        if (value is null) return null;

        return value.Length <= max
            ? value
            : throw AppException.BadRequest(ErrorCodes.ValidationRange, $"{field} 不可超過 {max} 字。");
    }
}

public sealed class PageUpdateDto
{
    public string? OgImagePath { get; set; }
    public bool    IsIndexable { get; set; } = true;
    public Dictionary<string, PageI18nDto> I18n { get; set; } = [];
}

public sealed class PageI18nDto
{
    public string? Slug           { get; set; }
    public string? SeoTitle       { get; set; }
    public string? SeoDescription { get; set; }
    public string? CanonicalUrl   { get; set; }
    public string? OgTitle        { get; set; }
    public string? OgDescription  { get; set; }
    public string? BodyHtml       { get; set; }
}

/// <summary>16 redirect。舊站 301 對照，內容遷移（P8）會一次匯入幾百筆，故有 CSV 匯出入。</summary>
public sealed class AdminRedirectHandler(AppDbContext db)
{
    public async Task<IActionResult> GetListAsync(HttpRequest req)
    {
        var paging = Paging.From(req);
        var query  = db.Redirect.AsNoTracking().Where(r => !r.IsDeleted);

        var total = await query.CountAsync();
        var rows  = await query.OrderBy(r => r.FromPath)
            .Skip(paging.Skip).Take(paging.PageSize).ToListAsync();

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(PagedResult<Redirect>.From(rows, total, paging.Page, paging.PageSize)));
    }

    public async Task<IActionResult> CreateAsync(HttpRequest req)
    {
        var dto = await req.ReadFromJsonAsync<Redirect>()
            ?? throw AppException.BadRequest(ErrorCodes.ValidationRequired, "缺少內容。");

        Validate(dto);

        if (await db.Redirect.AnyAsync(r => r.FromPath == dto.FromPath))
            throw AppException.Conflict(ErrorCodes.ConflictDuplicate, $"{dto.FromPath} 已存在。");

        dto.Id = 0;
        db.Redirect.Add(dto);
        await db.SaveChangesAsync();

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(new { id = dto.Id }));
    }

    public async Task<IActionResult> UpdateAsync(HttpRequest req, string rawId)
    {
        var item = await FindAsync(rawId);
        var dto  = await req.ReadFromJsonAsync<Redirect>()
            ?? throw AppException.BadRequest(ErrorCodes.ValidationRequired, "缺少內容。");

        Validate(dto);

        item.FromPath   = Normalize(dto.FromPath);
        item.ToPath     = dto.ToPath;
        item.StatusCode = dto.StatusCode;
        item.IsActive   = dto.IsActive;
        await db.SaveChangesAsync();

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok("已更新。"));
    }

    public async Task<IActionResult> DeleteAsync(HttpRequest req, string rawId)
    {
        db.Redirect.Remove(await FindAsync(rawId));
        await db.SaveChangesAsync();

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok("已刪除。"));
    }

    /// <summary>匯出 CSV。內容遷移時要跟舊站清單對照，用試算表比對比在畫面上翻頁快得多。</summary>
    public async Task<IActionResult> ExportAsync(HttpRequest req)
    {
        var rows = await db.Redirect.AsNoTracking().Where(r => !r.IsDeleted)
            .OrderBy(r => r.FromPath).ToListAsync();

        var csv = new StringBuilder("fromPath,toPath,statusCode,isActive,hitCount\n");
        foreach (var r in rows)
            csv.Append($"{Csv(r.FromPath)},{Csv(r.ToPath)},{r.StatusCode},{(r.IsActive ? 1 : 0)},{r.HitCount}\n");

        CacheControl.NoStore(req.HttpContext.Response);
        return new FileContentResult(new UTF8Encoding(true).GetBytes(csv.ToString()), "text/csv")
        {
            FileDownloadName = $"redirects-{Clock.Today:yyyyMMdd}.csv",
        };
    }

    /// <summary>匯入 CSV。已存在的 fromPath 更新、沒有的新增——重跑同一份檔案不會產生重複。</summary>
    public async Task<IActionResult> ImportAsync(HttpRequest req)
    {
        if (!req.HasFormContentType)
            throw AppException.BadRequest(ErrorCodes.UploadType, "請以 multipart/form-data 上傳 CSV。");

        var form = await req.ReadFormAsync();
        var file = form.Files.FirstOrDefault()
            ?? throw AppException.BadRequest(ErrorCodes.ValidationRequired, "缺少檔案。");

        using var reader = new StreamReader(file.OpenReadStream());
        var (created, updated, skipped) = (0, 0, 0);
        var lineNumber = 0;

        while (await reader.ReadLineAsync() is { } line)
        {
            lineNumber++;
            if (lineNumber == 1 && line.StartsWith("fromPath", StringComparison.OrdinalIgnoreCase)) continue;
            if (string.IsNullOrWhiteSpace(line)) continue;

            var parts = line.Split(',');
            if (parts.Length < 2) { skipped++; continue; }

            var fromPath = Normalize(parts[0].Trim().Trim('"'));
            var toPath   = parts[1].Trim().Trim('"');
            var status   = parts.Length > 2 && short.TryParse(parts[2], out var s) ? s : (short)301;

            if (string.IsNullOrWhiteSpace(fromPath) || string.IsNullOrWhiteSpace(toPath)
                || status is not (301 or 302 or 308))
            {
                skipped++;
                continue;
            }

            var existing = await db.Redirect.FirstOrDefaultAsync(r => r.FromPath == fromPath);
            if (existing is null)
            {
                db.Redirect.Add(new Redirect { FromPath = fromPath, ToPath = toPath, StatusCode = status });
                created++;
            }
            else
            {
                existing.ToPath     = toPath;
                existing.StatusCode = status;
                existing.IsDeleted  = false;
                updated++;
            }
        }

        await db.SaveChangesAsync();

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(new { created, updated, skipped }));
    }

    private static void Validate(Redirect dto)
    {
        if (string.IsNullOrWhiteSpace(dto.FromPath) || string.IsNullOrWhiteSpace(dto.ToPath))
            throw AppException.BadRequest(ErrorCodes.ValidationRequired, "fromPath 與 toPath 為必填。");

        if (dto.StatusCode is not (301 or 302 or 308))
            throw AppException.BadRequest(ErrorCodes.ValidationFormat, "statusCode 只能是 301／302／308。");

        dto.FromPath = Normalize(dto.FromPath);
    }

    /// <summary>一律小寫、含前導斜線（docs/08 §4.11）——大小寫不同的同一條路徑會變成兩筆，永遠有一筆沒生效。</summary>
    private static string Normalize(string path)
    {
        var trimmed = path.Trim().ToLowerInvariant();
        return trimmed.StartsWith('/') ? trimmed : $"/{trimmed}";
    }

    private static string Csv(string value) =>
        value.Contains(',') || value.Contains('"') ? $"\"{value.Replace("\"", "\"\"")}\"" : value;

    private async Task<Redirect> FindAsync(string rawId)
    {
        if (!int.TryParse(rawId, out var id))
            throw AppException.BadRequest(ErrorCodes.ValidationFormat, "id 必須是數字。");

        return await db.Redirect.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted)
            ?? throw AppException.NotFound("Redirect");
    }
}
