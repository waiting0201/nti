namespace Nti.Api.Services;

/// <summary>
/// Blob 儲存（docs/10 §9.5）。
/// <para>
/// <b>所有容器一律 private</b>：前台取檔一律經後端代理路由，不給直連 URL——
/// 這樣才能對報價附件施加授權（需 <c>quote.download</c> 且 <c>ScanStatus = 'Clean'</c>）。
/// </para>
/// <para>
/// DB 只存**相對路徑**（docs/08 §2.6），不存完整 URL：換儲存體或換網域時不用改資料。
/// </para>
/// </summary>
public interface IBlobStorageService
{
    /// <summary>上傳並回傳相對路徑（<c>{yyyy}/{MM}/{guid}{ext}</c>）。</summary>
    Task<string> UploadAsync(string container, string fileName, Stream content, string contentType);

    Task DeleteAsync(string container, string relativePath);

    /// <summary>下載；找不到回 null（讓上層回 404 而不是 500）。</summary>
    Task<(Stream Content, string ContentType)?> DownloadAsync(string container, string relativePath);
}
