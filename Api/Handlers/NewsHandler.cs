using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Nti.Api.Common;
using Nti.Api.Services.Dapper;

namespace Nti.Api.Handlers;

/// <summary>單元 04 news。</summary>
public sealed class NewsHandler(INewsReadService reads)
{
    public async Task<IActionResult> GetListAsync(HttpRequest req)
    {
        var lang       = LangResolver.Resolve(req);
        var paging     = Paging.From(req);
        var categoryId = QueryValues.Int(req, "categoryId");
        // `?tag=` 是標籤封存頁 /{lang}/news/tag/{slug} 用的。slug 不分語系（見 Tag 實體），
        // 所以這個參數不隨語系變，中英兩頁打同一個值。
        var tagSlug    = QueryValues.Text(req, "tag");

        // 分頁雙模式（docs/10 §5.3）：帶 page/pageSize 回 PagedResult，否則回平面陣列
        object data = paging.IsPaged
            ? await reads.GetPagedAsync(lang, categoryId, paging, tagSlug)
            : await reads.GetAllAsync(lang, categoryId, tagSlug);

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(data));
    }

    public async Task<IActionResult> GetBySlugAsync(HttpRequest req, string slug)
    {
        var lang = LangResolver.Resolve(req);
        var dto  = await reads.GetBySlugAsync(lang, slug) ?? throw AppException.NotFound("News");

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(dto));
    }
}
