using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Nti.Api.Common;
using Nti.Api.Services.Dapper;

namespace Nti.Api.Handlers;

/// <summary>單元 03 project。無詳細頁，卡片即完整內容。</summary>
public sealed class ProjectHandler(IProjectReadService reads)
{
    public async Task<IActionResult> GetListAsync(HttpRequest req)
    {
        var lang       = LangResolver.Resolve(req);
        var paging     = Paging.From(req);
        var categoryId = QueryValues.Int(req, "categoryId");

        object data = paging.IsPaged
            ? await reads.GetPagedAsync(lang, categoryId, paging)
            : await reads.GetAllAsync(lang, categoryId);

        CacheControl.Public(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(data));
    }
}
