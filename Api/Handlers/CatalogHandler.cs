using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Nti.Api.Common;
using Nti.Api.Services.Dapper;

namespace Nti.Api.Handlers;

/// <summary>單元 05 vlog。</summary>
public sealed class VlogHandler(IVlogReadService reads)
{
    public async Task<IActionResult> GetListAsync(HttpRequest req)
    {
        var rows = await reads.GetPublishedAsync(LangResolver.Resolve(req), QueryValues.Int(req, "categoryId"));

        CacheControl.Public(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(rows));
    }
}

/// <summary>單元 06 faq。</summary>
public sealed class FaqHandler(IFaqReadService reads)
{
    public async Task<IActionResult> GetListAsync(HttpRequest req)
    {
        var rows = await reads.GetPublishedAsync(LangResolver.Resolve(req), QueryValues.Int(req, "categoryId"));

        CacheControl.Public(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(rows));
    }
}

/// <summary>單元 07 trend。</summary>
public sealed class TrendHandler(ITrendReadService reads)
{
    public async Task<IActionResult> GetListAsync(HttpRequest req)
    {
        var rows = await reads.GetPublishedAsync(LangResolver.Resolve(req));

        CacheControl.Public(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(rows));
    }
}

/// <summary>單元 08 certification。</summary>
public sealed class CertificationHandler(ICertificationReadService reads)
{
    public async Task<IActionResult> GetListAsync(HttpRequest req)
    {
        var rows = await reads.GetPublishedAsync(LangResolver.Resolve(req));

        CacheControl.Public(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(rows));
    }
}

/// <summary>單元 09 client。</summary>
public sealed class ClientHandler(IClientReadService reads)
{
    public async Task<IActionResult> GetListAsync(HttpRequest req)
    {
        var rows = await reads.GetPublishedAsync();

        CacheControl.Public(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(rows));
    }
}

/// <summary>單元 10 facility。<c>?group=</c> 收 Category.Code（五個子頁的路徑名）。</summary>
public sealed class FacilityHandler(IFacilityReadService reads)
{
    public async Task<IActionResult> GetListAsync(HttpRequest req)
    {
        var rows = await reads.GetPublishedAsync(LangResolver.Resolve(req), QueryValues.Text(req, "group"));

        CacheControl.Public(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(rows));
    }
}

/// <summary>單元 11 job（careers 頁）。</summary>
public sealed class JobHandler(IJobReadService reads)
{
    public async Task<IActionResult> GetListAsync(HttpRequest req)
    {
        var rows = await reads.GetPublishedAsync(LangResolver.Resolve(req));

        CacheControl.Public(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(rows));
    }
}
