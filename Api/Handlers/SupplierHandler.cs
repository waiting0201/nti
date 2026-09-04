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

        CacheControl.Public(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(data));
    }

    public async Task<IActionResult> GetSpecsAsync(HttpRequest req)
    {
        var rows = await reads.GetSpecsAsync(LangResolver.Resolve(req));

        CacheControl.Public(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(rows));
    }

    public async Task<IActionResult> GetDownloadsAsync(HttpRequest req)
    {
        var rows = await reads.GetDownloadsAsync(LangResolver.Resolve(req));

        CacheControl.Public(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok(rows));
    }

    /// <summary>
    /// 累計下載次數（<c>POST /supplier/downloads/{id}/hit</c>）。
    /// <para>
    /// <c>RequireLogin = 1</c> 的受控文件需要會員憑證。目前會員系統未上線（P6），
    /// 前台不會出現這種項目；這裡先擋住，等 <c>/auth</c> 做完就自動生效——
    /// Router 已經驗過會員 token 並寫入 <c>HttpContext.User</c>。
    /// </para>
    /// </summary>
    public async Task<IActionResult> HitDownloadAsync(HttpRequest req, string rawId)
    {
        if (!int.TryParse(rawId, out var id))
            throw AppException.BadRequest(ErrorCodes.ValidationFormat, "id 必須是數字。");

        var lang = LangResolver.Resolve(req);
        var item = await reads.GetDownloadAsync(lang, id) ?? throw AppException.NotFound("SupplierDownload");

        if (item.RequireLogin && req.HttpContext.User.Identity?.IsAuthenticated != true)
            throw AppException.Unauthorized("此檔案需登入後才能下載。");

        await reads.IncrementDownloadCountAsync(id);

        CacheControl.NoStore(req.HttpContext.Response);
        return new OkObjectResult(ApiResponse.Ok("Success"));
    }
}
