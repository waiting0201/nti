using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Nti.Api.Common;
using Nti.Api.Services.Dapper;

namespace Nti.Api.Handlers;

/// <summary>單元 15 page（前台唯讀部分）：固定頁的 SEO 欄位。</summary>
public sealed class PageHandler(IPageReadService reads)
{
    public async Task<IActionResult> GetByKeyAsync(HttpRequest req, string pageKey)
    {
        var dto = await reads.GetByKeyAsync(LangResolver.Resolve(req), pageKey)
            ?? throw AppException.NotFound("Page");

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(dto));
    }

    /// <summary><c>GET /pages</c>：每個固定頁的 pageKey 與「允許索引」，前台 sitemap 用來排除 noindex 的頁。</summary>
    public async Task<IActionResult> GetIndexabilityAsync(HttpRequest req)
    {
        var rows = await reads.GetIndexabilityAsync();

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(rows.Select(r => new { pageKey = r.PageKey, isIndexable = r.IsIndexable })));
    }

    /// <summary>
    /// <c>GET /redirects/lookup?path=/old-page</c>：後台單元 16 的轉址對照，給前台 middleware 查。
    /// <para>
    /// 查不到回 <b>200 + data = null</b>，不是 404：middleware 要分得出「資料庫說沒有這條」
    /// （照辦，不轉）與「API 沒回應」（退回前台內建的舊站對照表）。兩者混在一起的話，
    /// 後台停用或刪掉的轉址會被內建表又救回來。
    /// </para>
    /// </summary>
    public async Task<IActionResult> LookupRedirectAsync(HttpRequest req)
    {
        var path = (QueryValues.Text(req, "path") ?? "").Trim().ToLowerInvariant();
        if (path.Length > 1) path = path.TrimEnd('/');
        if (!path.StartsWith('/') || path.Length > 400)
            throw AppException.BadRequest(ErrorCodes.ValidationFormat, "path 必須是以 / 開頭的站內路徑。");

        var hit = await reads.LookupRedirectAsync(path);

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(hit is null ? null : new { toPath = hit.ToPath, statusCode = hit.StatusCode }));
    }
}
