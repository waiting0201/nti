using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Nti.Api.Common;
using Nti.Api.Services;

namespace Nti.Api.Functions;

/// <summary>
/// 孤兒檔清除（docs/10 §9.9）：把 Blob 裡沒有任何欄位引用的檔案刪掉。
/// <para>
/// 決議 2 定的是「不建資產表」，代價就是這支——沒有 asset 表可以 JOIN，
/// 只能反過來把所有引用來源掃一遍（<see cref="MediaReferenceScanner"/>）。
/// </para>
/// <para>
/// <b>這是安全網，不是主要機制。</b> 編輯者移除或換掉的檔案由
/// <see cref="IMediaCleaner"/> 在存檔當下就刪掉；留給這支的是它看不到的殘餘——
/// 刪整筆時被 FK CASCADE 帶走的子表內文插圖、即時清除失敗的那幾個、
/// 以及上傳了卻從來沒存檔的孤兒。
/// </para>
/// <para>
/// <b>兩道安全閘，因為這支會真的刪檔案：</b>
/// </para>
/// <list type="number">
///   <item>
///     <b>預設只報告不刪除。</b> 要真的刪必須把 <c>OrphanMediaDeleteEnabled</c> 設為 true。
///     誤刪的檔案救不回來，而這支的判斷是反過來推論的——「整個容器裡沒人引用的都是孤兒」，
///     <see cref="MediaReferenceScanner"/> 的欄位清單漏一個就是整批誤刪。
///     （即時清除不受這道閘管：它的範圍只有編輯者這次親手拿掉的那幾個路徑。）
///   </item>
///   <item>
///     <b>寬限期。</b> 剛上傳但還沒按下儲存的檔案（編輯上傳圖片、兩分鐘後才存檔）
///     在 DB 裡還沒有任何引用，沒有寬限期就會被這支刪掉。
///   </item>
/// </list>
/// </summary>
public sealed class OrphanMediaFunction(
    MediaReferenceScanner scanner,
    IBlobStorageService   blobs,
    IConfiguration        cfg,
    ILogger<OrphanMediaFunction> logger)
{
    /// <summary>上傳後多久之內不視為孤兒。</summary>
    private static readonly TimeSpan GracePeriod = TimeSpan.FromDays(7);

    [Function(nameof(OrphanMediaFunction))]
    public async Task RunAsync([TimerTrigger("%OrphanMediaCron%")] TimerInfo timer)
    {
        if (timer.IsPastDue)
            logger.LogInformation("OrphanMedia 觸發延遲，照常執行。");

        var referenced = await scanner.CollectReferencedPathsAsync();
        var stored     = await blobs.ListAsync(UploadRules.Containers.Media);
        var cutoff     = DateTimeOffset.UtcNow - GracePeriod;

        var orphans = stored
            .Where(b => !referenced.Contains(b.Path))
            .Where(b => b.CreatedOn is null || b.CreatedOn < cutoff)
            .Select(b => b.Path)
            .ToList();

        if (orphans.Count == 0)
        {
            logger.LogInformation("OrphanMedia：沒有孤兒檔（容器內 {Total} 個檔案）。", stored.Count);
            return;
        }

        var deleteEnabled = string.Equals(cfg["OrphanMediaDeleteEnabled"], "true", StringComparison.OrdinalIgnoreCase);

        if (!deleteEnabled)
        {
            // 預設走這條：先看幾輪報告確認清單合理，再打開刪除
            logger.LogWarning(
                "OrphanMedia：找到 {Count} 個疑似孤兒檔（未刪除，OrphanMediaDeleteEnabled 未開啟）。前 20 筆：{Sample}",
                orphans.Count, string.Join(", ", orphans.Take(20)));
            return;
        }

        foreach (var path in orphans)
            await blobs.DeleteAsync(UploadRules.Containers.Media, path);

        logger.LogInformation("OrphanMedia：刪除 {Count} 個孤兒檔。", orphans.Count);
    }
}
