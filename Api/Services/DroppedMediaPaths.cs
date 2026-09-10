using Nti.Api.Common;

namespace Nti.Api.Services;

/// <summary>
/// 這次請求裡「被拿掉引用」的檔案路徑。<c>AppDbContext</c> 在存檔時放進來，
/// <see cref="IMediaCleaner"/> 在存檔成功後取走。
/// <para>
/// 用一個 Scoped 的小袋子而不是讓 DbContext 直接刪檔，是為了不把 Blob 的網路 I/O
/// 塞進 <c>SaveChanges</c> 裡：存檔失敗要回滾的是資料庫，檔案卻刪不回來。
/// 順序必須是「先存檔成功，再刪檔」。
/// </para>
/// </summary>
public sealed class DroppedMediaPaths
{
    private readonly HashSet<string> paths = new(StringComparer.OrdinalIgnoreCase);

    public void Add(string path)
    {
        var normalized = MediaPaths.Normalize(path);
        if (normalized.Length > 0) paths.Add(normalized);
    }

    /// <summary>取走並清空。同一個請求存兩次檔時，第二次不該再看到第一次的清單。</summary>
    public IReadOnlyCollection<string> Drain()
    {
        var taken = paths.ToArray();
        paths.Clear();
        return taken;
    }
}
