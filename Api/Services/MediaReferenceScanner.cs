using Microsoft.EntityFrameworkCore;
using Nti.Api.Common;
using Nti.Api.Data;

namespace Nti.Api.Services;

/// <summary>
/// 「這個檔案還有沒有人在用」的唯一答案來源。
/// <para>
/// 決議 2 定的是「不建資產表」，代價就是這支——沒有 asset 表可以 JOIN，
/// 只能反過來把所有引用來源掃一遍。
/// </para>
/// <para>
/// 兩處都靠它：存檔當下的即時清除（<see cref="IMediaCleaner"/>）與夜間的孤兒檔掃描
/// （<c>OrphanMediaFunction</c>）。兩邊各維護一份欄位清單遲早會分岔，
/// 而分岔的症狀是其中一邊把還在用的檔案刪掉。
/// </para>
/// </summary>
public sealed class MediaReferenceScanner(AppDbContext db)
{
    /// <summary>
    /// 蒐集所有被引用的路徑（已正規化）。
    /// <para>
    /// ⚠ <b>新增任何 <c>*Path</c> 或 <c>*Html</c> 欄位時，這裡要一起補</b>，
    /// 否則那些檔案會被當成孤兒。這是本專案「不建資產表」這個決定的維護成本。
    /// </para>
    /// </summary>
    public async Task<HashSet<string>> CollectReferencedPathsAsync(CancellationToken ct = default)
    {
        var paths = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        void AddRange(IEnumerable<string?> values)
        {
            foreach (var value in values)
                if (!string.IsNullOrWhiteSpace(value)) paths.Add(MediaPaths.Normalize(value));
        }

        void AddHtml(IEnumerable<string?> htmlColumns)
        {
            foreach (var html in htmlColumns)
                foreach (var path in MediaPaths.ExtractImagePaths(html))
                    paths.Add(path);
        }

        // ── 主表的 *Path 欄位 ─────────────────────────────────────────────
        AddRange(await db.HomeBanner.Select(x => x.ImagePath).ToListAsync(ct));
        AddRange(await db.HomeBanner.Select(x => x.ImagePathMobile).ToListAsync(ct));
        AddRange(await db.HomeBanner.Select(x => x.VideoPath).ToListAsync(ct));
        AddRange(await db.Solution.Select(x => x.CoverImagePath).ToListAsync(ct));
        AddRange(await db.Solution.Select(x => x.OgImagePath).ToListAsync(ct));
        AddRange(await db.SolutionItem.Select(x => x.ImagePath).ToListAsync(ct));
        AddRange(await db.Project.Select(x => x.ImagePath).ToListAsync(ct));
        AddRange(await db.News.Select(x => x.CoverImagePath).ToListAsync(ct));
        AddRange(await db.News.Select(x => x.OgImagePath).ToListAsync(ct));
        AddRange(await db.Vlog.Select(x => x.ThumbOverridePath).ToListAsync(ct));
        AddRange(await db.Certification.Select(x => x.LogoPath).ToListAsync(ct));
        AddRange(await db.ClientLogo.Select(x => x.LogoPath).ToListAsync(ct));
        AddRange(await db.FacilityItem.Select(x => x.ImagePath).ToListAsync(ct));
        AddRange(await db.SupplierNotice.Select(x => x.AttachmentPath).ToListAsync(ct));
        AddRange(await db.SupplierDownload.Select(x => x.FilePath).ToListAsync(ct));
        AddRange(await db.Page.Select(x => x.OgImagePath).ToListAsync(ct));

        // ── 富文本內的 <img src>（db/README 已知缺口 #2）──────────────────
        AddHtml(await db.SolutionI18n.Select(x => x.IntroHtml).ToListAsync(ct));
        AddHtml(await db.NewsI18n.Select(x => x.BodyHtml).ToListAsync(ct));
        AddHtml(await db.FaqI18n.Select(x => x.AnswerHtml).ToListAsync(ct));
        AddHtml(await db.IndustryTrendI18n.Select(x => x.BodyHtml).ToListAsync(ct));
        AddHtml(await db.JobPostingI18n.Select(x => x.DescriptionHtml).ToListAsync(ct));
        AddHtml(await db.SupplierNoticeI18n.Select(x => x.BodyHtml).ToListAsync(ct));
        AddHtml(await db.PageI18n.Select(x => x.BodyHtml).ToListAsync(ct));

        return paths;
    }
}
