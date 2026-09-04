using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Nti.Api.Common;
using Nti.Api.Services;

namespace Nti.Api.Handlers;

/// <summary>
/// Blob 代理（04-api §2「下載一律經後端代理路由」）。
/// <para>
/// 所有容器都是 private（docs/10 §9.5），前端拿不到可直連的 URL。走代理有三個好處：
/// 不必開放公開讀取、不會有跨網域問題、需要授權的檔案可以在這裡擋。
/// </para>
/// <para>
/// <b>只開放 <c>media</c> 容器</b>：報價附件走 <c>/admin/quote/{id}/attachments/{attId}</c>，
/// 那條有 <c>quote.download</c> 權限與掃描狀態檢查。若把容器名開放成參數，
/// 任何人只要猜到路徑就能繞過那些檢查把附件抓走。
/// </para>
/// </summary>
public sealed class FileHandler(IBlobStorageService blobs)
{
    /// <summary>後台上傳的內容圖片。檔名含 GUID，內容不可變，可以長快取。</summary>
    private const int CacheSeconds = 31536000;   // 1 年

    public async Task<IActionResult> GetMediaAsync(HttpRequest req, string path)
    {
        // 路徑穿越防護：blob 名稱本來就不該有 ..，有的話直接拒絕
        if (path.Contains("..", StringComparison.Ordinal))
            throw AppException.BadRequest(ErrorCodes.ValidationFormat, "路徑不合法。");

        var file = await blobs.DownloadAsync(UploadRules.Containers.Media, path)
            ?? throw AppException.NotFound("檔案");

        req.HttpContext.Response.Headers.CacheControl = $"public, max-age={CacheSeconds}, immutable";
        return new FileStreamResult(file.Content, file.ContentType);
    }
}
