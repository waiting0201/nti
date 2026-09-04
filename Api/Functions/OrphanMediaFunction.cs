using Microsoft.Azure.Functions.Worker;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Nti.Api.Common;
using Nti.Api.Data;
using Nti.Api.Services;
using System.Text.RegularExpressions;

namespace Nti.Api.Functions;

/// <summary>
/// 孤兒檔清除（docs/10 §9.9）：把 Blob 裡沒有任何欄位引用的檔案刪掉。
/// <para>
/// 決議 2 定的是「不建資產表」，代價就是這支——沒有 asset 表可以 JOIN，
/// 只能反過來把所有引用來源掃一遍。
/// </para>
/// <para>
/// <b>兩道安全閘，因為這支會真的刪檔案：</b>
/// </para>
/// <list type="number">
///   <item>
///     <b>預設只報告不刪除。</b> 要真的刪必須把 <c>OrphanMediaDeleteEnabled</c> 設為 true。
///     誤刪的檔案救不回來，而「哪些算孤兒」的判斷依賴下面那份欄位清單是否完整——
///     新增一個 <c>*Path</c> 欄位卻忘了加進來，就會把正在用的圖當成孤兒。
///   </item>
///   <item>
///     <b>寬限期。</b> 剛上傳但還沒按下儲存的檔案（編輯上傳圖片、兩分鐘後才存檔）
///     在 DB 裡還沒有任何引用，沒有寬限期就會被這支刪掉。
///   </item>
/// </list>
/// <para>
/// <b>富文本內的插圖必須一起算</b>（db/README 已知缺口 #2）：內文圖只存在
/// <c>*Html</c> 欄位的 <c>&lt;img src&gt;</c> 裡，不掃就會被整批誤刪。
/// </para>
/// </summary>
public sealed class OrphanMediaFunction(
    AppDbContext        db,
    IBlobStorageService blobs,
    IConfiguration      cfg,
    ILogger<OrphanMediaFunction> logger)
{
    /// <summary>上傳後多久之內不視為孤兒。</summary>
    private static readonly TimeSpan GracePeriod = TimeSpan.FromDays(7);

    /// <summary>抓 <c>&lt;img src="..."&gt;</c>。只取 src，不做完整 HTML 解析。</summary>
    private static readonly Regex ImgSrc = new(
        """<img\b[^>]*?\bsrc\s*=\s*["']([^"']+)["']""",
        RegexOptions.IgnoreCase | RegexOptions.Compiled, TimeSpan.FromSeconds(2));

    [Function(nameof(OrphanMediaFunction))]
    public async Task RunAsync([TimerTrigger("%OrphanMediaCron%")] TimerInfo timer)
    {
        if (timer.IsPastDue)
            logger.LogInformation("OrphanMedia 觸發延遲，照常執行。");

        var referenced = await CollectReferencedPathsAsync();
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

    /// <summary>
    /// 蒐集所有被引用的路徑。
    /// <para>
    /// ⚠ <b>新增任何 <c>*Path</c> 或 <c>*Html</c> 欄位時，這裡要一起補</b>，
    /// 否則那些檔案會被當成孤兒。這是本專案「不建資產表」這個決定的維護成本。
    /// </para>
    /// </summary>
    private async Task<HashSet<string>> CollectReferencedPathsAsync()
    {
        var paths = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        void AddRange(IEnumerable<string?> values)
        {
            foreach (var value in values)
                if (!string.IsNullOrWhiteSpace(value)) paths.Add(Normalize(value));
        }

        // ── 主表的 *Path 欄位 ─────────────────────────────────────────────
        AddRange(await db.HomeBanner.Select(x => x.ImagePath).ToListAsync());
        AddRange(await db.HomeBanner.Select(x => x.ImagePathMobile).ToListAsync());
        AddRange(await db.HomeBanner.Select(x => x.VideoPath).ToListAsync());
        AddRange(await db.Solution.Select(x => x.CoverImagePath).ToListAsync());
        AddRange(await db.Solution.Select(x => x.OgImagePath).ToListAsync());
        AddRange(await db.SolutionItem.Select(x => x.ImagePath).ToListAsync());
        AddRange(await db.Project.Select(x => x.ImagePath).ToListAsync());
        AddRange(await db.News.Select(x => x.CoverImagePath).ToListAsync());
        AddRange(await db.News.Select(x => x.OgImagePath).ToListAsync());
        AddRange(await db.Vlog.Select(x => x.ThumbOverridePath).ToListAsync());
        AddRange(await db.Certification.Select(x => x.LogoPath).ToListAsync());
        AddRange(await db.ClientLogo.Select(x => x.LogoPath).ToListAsync());
        AddRange(await db.FacilityItem.Select(x => x.ImagePath).ToListAsync());
        AddRange(await db.SupplierNotice.Select(x => x.AttachmentPath).ToListAsync());
        AddRange(await db.SupplierDownload.Select(x => x.FilePath).ToListAsync());
        AddRange(await db.Page.Select(x => x.OgImagePath).ToListAsync());

        // ── 富文本內的 <img src>（缺口 #2）────────────────────────────────
        AddHtmlImages(paths, await db.SolutionI18n.Select(x => x.IntroHtml).ToListAsync());
        AddHtmlImages(paths, await db.NewsI18n.Select(x => x.BodyHtml).ToListAsync());
        AddHtmlImages(paths, await db.FaqI18n.Select(x => x.AnswerHtml).ToListAsync());
        AddHtmlImages(paths, await db.IndustryTrendI18n.Select(x => x.BodyHtml).ToListAsync());
        AddHtmlImages(paths, await db.JobPostingI18n.Select(x => x.DescriptionHtml).ToListAsync());
        AddHtmlImages(paths, await db.SupplierNoticeI18n.Select(x => x.BodyHtml).ToListAsync());
        AddHtmlImages(paths, await db.PageI18n.Select(x => x.BodyHtml).ToListAsync());

        return paths;
    }

    private static void AddHtmlImages(HashSet<string> paths, IEnumerable<string?> htmlColumns)
    {
        foreach (var html in htmlColumns)
        {
            if (string.IsNullOrWhiteSpace(html)) continue;

            foreach (Match match in ImgSrc.Matches(html))
                paths.Add(Normalize(match.Groups[1].Value));
        }
    }

    /// <summary>
    /// 統一成容器內的相對路徑。內文的 <c>src</c> 可能是完整 URL 或帶前導斜線，
    /// 與 DB 欄位存的相對路徑對不起來就會誤判成孤兒。
    /// </summary>
    private static string Normalize(string value)
    {
        var path = value.Trim();

        if (Uri.TryCreate(path, UriKind.Absolute, out var uri)) path = uri.AbsolutePath;

        path = path.TrimStart('/');

        // 去掉容器名前綴（前端組 URL 時會帶上）
        var prefix = UploadRules.Containers.Media + "/";
        if (path.StartsWith(prefix, StringComparison.OrdinalIgnoreCase)) path = path[prefix.Length..];

        return path;
    }
}
