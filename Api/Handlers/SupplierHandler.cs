using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Nti.Api.Common;
using Nti.Api.Services.Dapper;

namespace Nti.Api.Handlers;

/// <summary>單元 12／13／14 供應商專區。</summary>
public sealed class SupplierHandler(ISupplierReadService reads)
{
    public async Task<IActionResult> GetNoticesAsync(HttpRequest req)
    {
        var lang       = LangResolver.Resolve(req);
        var paging     = Paging.From(req);
        var categoryId = QueryValues.Int(req, "categoryId");

        object data = paging.IsPaged
            ? await reads.GetNoticesPagedAsync(lang, categoryId, paging)
            : await reads.GetNoticesAsync(lang, categoryId);

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(data));
    }

    public async Task<IActionResult> GetSpecsAsync(HttpRequest req)
    {
        var rows = await reads.GetSpecsAsync(LangResolver.Resolve(req));

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(rows));
    }

    public async Task<IActionResult> GetDownloadsAsync(HttpRequest req)
    {
        var rows = await reads.GetDownloadsAsync(LangResolver.Resolve(req));

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(rows));
    }

    /// <summary>累計下載次數（<c>POST /supplier/downloads/{id}/hit</c>）。全部項目一律公開下載。</summary>
    public async Task<IActionResult> HitDownloadAsync(HttpRequest req, string rawId)
    {
        if (!int.TryParse(rawId, out var id))
            throw AppException.BadRequest(ErrorCodes.ValidationFormat, "id 必須是數字。");

        var lang = LangResolver.Resolve(req);
        var item = await reads.GetDownloadAsync(lang, id) ?? throw AppException.NotFound("SupplierDownload");

        await reads.IncrementDownloadCountAsync(id);

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok("Success"));
    }
}
