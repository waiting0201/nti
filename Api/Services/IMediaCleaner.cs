namespace Nti.Api.Services;

/// <summary>後台存檔後把不再被引用的檔案從 Blob 刪掉。實作見 <see cref="MediaCleaner"/>。</summary>
public interface IMediaCleaner
{
    /// <summary>清掉這次請求移除掉的檔案。失敗只記 log，不拋例外。</summary>
    Task PurgeAsync(CancellationToken cancellationToken = default);
}
