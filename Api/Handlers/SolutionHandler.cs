using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Nti.Api.Common;
using Nti.Api.Services.Dapper;

namespace Nti.Api.Handlers;

/// <summary>單元 02 solution。</summary>
public sealed class SolutionHandler(ISolutionReadService reads)
{
    public async Task<IActionResult> GetListAsync(HttpRequest req)
    {
        var lang = LangResolver.Resolve(req);
        var rows = await reads.GetPublishedAsync(lang);

        CacheControl.Public(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(rows));
    }

    public async Task<IActionResult> GetBySlugAsync(HttpRequest req, string slug)
    {
        var lang = LangResolver.Resolve(req);

        // 缺語系不 fallback（docs/08 §2.5）：該語系沒有這筆就是 404，不會退回另一個語系
        var dto = await reads.GetBySlugAsync(lang, slug)
            ?? throw AppException.NotFound("Solution");

        CacheControl.Public(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(dto));
    }
}
