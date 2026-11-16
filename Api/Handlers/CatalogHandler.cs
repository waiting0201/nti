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

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(rows));
    }
}

/// <summary>單元 06 faq。</summary>
public sealed class FaqHandler(IFaqReadService reads)
{
    public async Task<IActionResult> GetListAsync(HttpRequest req)
    {
        var rows = await reads.GetPublishedAsync(LangResolver.Resolve(req), QueryValues.Int(req, "categoryId"));

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(rows));
    }
}

/// <summary>單元 07 trend。</summary>
public sealed class TrendHandler(ITrendReadService reads)
{
    public async Task<IActionResult> GetListAsync(HttpRequest req)
    {
        var rows = await reads.GetPublishedAsync(LangResolver.Resolve(req));

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(rows));
    }

    public async Task<IActionResult> GetBySlugAsync(HttpRequest req, string slug)
    {
        var dto = await reads.GetBySlugAsync(LangResolver.Resolve(req), slug) ?? throw AppException.NotFound("IndustryTrend");

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(dto));
    }

    /// <summary>
    /// <c>GET /industry-trends/{slug}/moved</c>：舊 slug 搬到哪裡去了。前台詳細頁找不到文章時才打
    /// （與 <c>/news/{slug}/moved</c> 同一套）。
    /// </summary>
    public async Task<IActionResult> GetMovedAsync(HttpRequest req, string slug)
    {
        var to = await reads.GetMovedToAsync(LangResolver.Resolve(req), slug) ?? throw AppException.NotFound("Redirect");

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(new { toPath = to }));
    }
}

/// <summary>單元 08 certification。</summary>
public sealed class CertificationHandler(ICertificationReadService reads)
{
    public async Task<IActionResult> GetListAsync(HttpRequest req)
    {
        var rows = await reads.GetPublishedAsync(LangResolver.Resolve(req));

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(rows));
    }

    /// <summary>認證頁的文字清單（色彩標準／GMI 通路／獎項），前台依 section 分組。</summary>
    public async Task<IActionResult> GetListItemsAsync(HttpRequest req)
    {
        var rows = await reads.GetListItemsAsync(LangResolver.Resolve(req));

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(rows));
    }

    /// <summary>碳效率頁的績效表（指標／期間／結果），依排序。</summary>
    public async Task<IActionResult> GetPerformanceMetricsAsync(HttpRequest req)
    {
        var rows = await reads.GetPerformanceMetricsAsync(LangResolver.Resolve(req));

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(rows));
    }

    /// <summary>ESG 頁的「南台彩藝永續目標」表（目標／時程），依排序。</summary>
    public async Task<IActionResult> GetSustainabilityGoalsAsync(HttpRequest req)
    {
        var rows = await reads.GetSustainabilityGoalsAsync(LangResolver.Resolve(req));

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(rows));
    }
}

/// <summary>單元 09 client。</summary>
public sealed class ClientHandler(IClientReadService reads)
{
    public async Task<IActionResult> GetListAsync(HttpRequest req)
    {
        var rows = await reads.GetPublishedAsync();

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(rows));
    }
}

/// <summary>單元 10 facility。<c>?group=</c> 收 Category.Code（五個子頁的路徑名）。</summary>
public sealed class FacilityHandler(IFacilityReadService reads)
{
    public async Task<IActionResult> GetListAsync(HttpRequest req)
    {
        var rows = await reads.GetPublishedAsync(LangResolver.Resolve(req), QueryValues.Text(req, "group"));

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(rows));
    }
}

/// <summary>單元 11 job（careers 頁）。</summary>
public sealed class JobHandler(IJobReadService reads)
{
    public async Task<IActionResult> GetListAsync(HttpRequest req)
    {
        var rows = await reads.GetPublishedAsync(LangResolver.Resolve(req));

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(rows));
    }
}
