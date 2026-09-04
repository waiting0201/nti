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

        CacheControl.Public(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(dto));
    }
}
