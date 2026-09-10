using Microsoft.Extensions.Logging;
using Nti.Api.Common;

namespace Nti.Api.Services;

/// <summary>
/// 後台按下「移除」（或換掉一張圖、刪掉一筆資料）之後，把不再被任何欄位引用的檔案
/// 立刻從 <c>media</c> 容器刪掉。
/// <para>
/// 沒有這支的話，唯一的清除機制是 <c>OrphanMediaFunction</c>——它預設只報告不刪除
/// （<c>OrphanMediaDeleteEnabled</c>），而且有 7 天寬限期。也就是說：編輯者移除了一張圖、
/// 前台頁面也確實不再顯示它，那個檔案卻仍然掛在公開可取的代理路由
/// <c>/files/media/{path}</c> 上，網址知道的人照樣抓得到。對「我已經把它拿掉了」的人來說，
/// 那就是沒拿掉。報價附件早就是按下刪除當場刪檔（<c>AdminFormHandler</c>），
/// 內容圖片沒有理由是另一套。
/// </para>
/// <para>
/// <b>刪之前一定重掃一次引用。</b> 同一個路徑可能同時被別筆資料、或另一個語系的內文引用
/// （複製貼上一段含圖的內文就會這樣）。只憑「這筆不再引用」就刪，會把還在用的圖刪掉。
/// </para>
/// <para>
/// <b>不受 <c>OrphanMediaDeleteEnabled</c> 管。</b> 那道開關防的是夜間掃描的誤判——
/// 它是反過來推論「整個容器裡沒人引用的都是孤兒」，欄位清單漏一個就是整批誤刪。
/// 這支的範圍是「編輯者這一次動作親手拿掉的那幾個路徑」，而且刪除正是那個動作的本意。
/// </para>
/// <para>
/// <b>永遠不影響存檔的結果。</b> Blob 刪不掉只記 log：資料已經寫進去了，
/// 這時候回錯只會讓編輯者以為要重存一次。漏掉的檔案仍由夜間掃描收尾。
/// </para>
/// </summary>
public sealed class MediaCleaner(
    DroppedMediaPaths     dropped,
    MediaReferenceScanner scanner,
    IBlobStorageService   blobs,
    ILogger<MediaCleaner> logger) : IMediaCleaner
{
    public async Task PurgeAsync(CancellationToken cancellationToken = default)
    {
        var candidates = dropped.Drain();
        if (candidates.Count == 0) return;   // 絕大多數的存檔都走這條：沒動到檔案就不掃

        try
        {
            var referenced = await scanner.CollectReferencedPathsAsync(cancellationToken);

            foreach (var path in candidates)
            {
                if (referenced.Contains(path))
                {
                    logger.LogInformation("{Path} 仍被其他內容引用，保留。", path);
                    continue;
                }

                await blobs.DeleteAsync(UploadRules.Containers.Media, path);
                logger.LogInformation("已刪除不再被引用的檔案 {Path}。", path);
            }
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex,
                "清除已移除的檔案失敗（{Count} 個），改由夜間的孤兒檔清除收尾。", candidates.Count);
        }
    }
}
