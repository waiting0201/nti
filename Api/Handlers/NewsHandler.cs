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

        // 分頁雙模式（docs/10 §5.3）：帶 page/pageSize 回 PagedResult，否則回平面陣列
        object data = paging.IsPaged
            ? await reads.GetPagedAsync(lang, categoryId, paging)
            : await reads.GetAllAsync(lang, categoryId);

        CacheControl.Public(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(data));
    }

    public async Task<IActionResult> GetBySlugAsync(HttpRequest req, string slug)
    {
        var lang = LangResolver.Resolve(req);
        var dto  = await reads.GetBySlugAsync(lang, slug) ?? throw AppException.NotFound("News");

        CacheControl.Public(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(dto));
    }
}
