using Azure;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Nti.Api.Services;

/// <summary>Azure Blob Storage（正式為 <c>stntiprod</c>，本機為 Azurite）。</summary>
public sealed class BlobStorageService : IBlobStorageService
{
    private readonly BlobServiceClient _client;
    private readonly ILogger<BlobStorageService> _logger;

    public BlobStorageService(IConfiguration cfg, ILogger<BlobStorageService> logger)
    {
        var connStr = cfg["BlobStorageConnection"]
            ?? throw new InvalidOperationException("BlobStorageConnection is required.");

        // 釘住 API 版本：SDK 預設會用最新版，本機 Azurite 不一定跟得上（會回 400
        // InvalidHeaderValue，訊息完全不指向版本問題）。固定一個保守版本，dev 與 prod 都相容。
        var options = new BlobClientOptions(BlobClientOptions.ServiceVersion.V2024_11_04);

        _client = new BlobServiceClient(connStr, options);
        _logger = logger;
    }

    public async Task<string> UploadAsync(string container, string fileName, Stream content, string contentType)
    {
        var now  = Common.Clock.UtcNow;
        var ext  = Path.GetExtension(fileName);
        var path = $"{now:yyyy}/{now:MM}/{Guid.NewGuid():N}{ext}";

        var client = _client.GetBlobContainerClient(container);

        // PublicAccessType.None：容器一律 private（docs/10 §9.5）
        await client.CreateIfNotExistsAsync(PublicAccessType.None);

        await client.GetBlobClient(path).UploadAsync(content, new BlobUploadOptions
        {
            HttpHeaders = new BlobHttpHeaders { ContentType = contentType },
        });

        return path;
    }

    public async Task DeleteAsync(string container, string relativePath) =>
        await _client.GetBlobContainerClient(container).GetBlobClient(relativePath).DeleteIfExistsAsync();

    public async Task<(Stream Content, string ContentType)?> DownloadAsync(string container, string relativePath)
    {
        try
        {
            var client = _client.GetBlobContainerClient(container);
            if (!await client.ExistsAsync()) return null;

            var blob = client.GetBlobClient(relativePath);
            if (!await blob.ExistsAsync()) return null;

            var download = await blob.DownloadAsync();
            return (download.Value.Content, download.Value.ContentType ?? "application/octet-stream");
        }
        catch (RequestFailedException ex) when (ex.Status == 404 || ex.ErrorCode is "ContainerNotFound" or "BlobNotFound")
        {
            // 找不到降為 null → 上層回 404。其他狀態（403／5xx）往上拋，才看得到真正的問題。
            return null;
        }
        catch (RequestFailedException ex)
        {
            _logger.LogError(ex, "Blob 取得失敗（非 404）：container={Container} path={Path} status={Status} code={Code}",
                container, relativePath, ex.Status, ex.ErrorCode);
            throw;
        }
    }
}
