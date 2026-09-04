using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Nti.Api.Common;
using Nti.Api.Services.Dapper;

namespace Nti.Api.Handlers;

/// <summary>單元 21 setting（前台唯讀部分）。Mail 群組的內部設定由 ReadService 濾掉。</summary>
public sealed class SettingHandler(ISiteSettingReadService reads)
{
    public async Task<IActionResult> GetPublicAsync(HttpRequest req)
    {
        var rows = await reads.GetPublicAsync(LangResolver.Resolve(req));

        CacheControl.Public(req.HttpContext.Response, CacheControl.StaticSeconds);
        return new OkObjectResult(ApiResponse.Ok(rows));
    }
}
