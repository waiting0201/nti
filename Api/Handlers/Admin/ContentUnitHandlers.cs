using System.Text.Json.Nodes;
using Microsoft.EntityFrameworkCore;
using Nti.Api.Data;
using Nti.Api.Models.Entities;

namespace Nti.Api.Handlers.Admin;

/*  內容單元 01–14 的後台 CRUD（docs/09 §2）。
 *
 *  CRUD 全在 AdminContentHandler，這裡只綁定各單元的 entity 與 i18n 型別。
 *  沒有共用成一個泛型註冊，是為了讓 Router 的路由表與 Program.cs 的 DI 清單
 *  維持逐條可讀，也對得上 24 個單元代號與權限碼。
 */

/// <summary>01 home-banner。沒有標題欄位，清單用圖片 alt 當識別。</summary>
public sealed class AdminHomeBannerHandler(AppDbContext db) : AdminContentHandler<HomeBanner, HomeBannerI18n>(db);

/// <summary>02 solution。固定 4 筆，後台不提供新增與刪除（路由不掛 POST／DELETE）。</summary>
public sealed class AdminSolutionHandler(AppDbContext db) : AdminContentHandler<Solution, SolutionI18n>(db);

/// <summary>02 solution 的品項卡。掛在 <c>/admin/solution/item</c>，共用 solution.* 權限。</summary>
public sealed class AdminSolutionItemHandler(AppDbContext db) : AdminContentHandler<SolutionItem, SolutionItemI18n>(db);

/// <summary>03 project。</summary>
public sealed class AdminProjectHandler(AppDbContext db) : AdminContentHandler<Project, ProjectI18n>(db);

/// <summary>04 news。無 SortOrder——列表照 PublishDate 排。</summary>
public sealed class AdminNewsHandler(AppDbContext db) : AdminContentHandler<News, NewsI18n>(db)
{
    // 用基底的 Db，不要另外擷取一份 db（CS9107，見 AdminContentHandler.Db）
    /// <summary>
    /// 標籤（`NewsTag`）。請求裡的 <c>tags</c> 是標籤 Id 的陣列，**整組取代**——
    /// 後台的編輯畫面送回來的就是完整的勾選結果，逐一 diff 只會多一層出錯的機會。
    /// <para>
    /// 沒有帶 <c>tags</c> 的請求不動關聯：`UpdateAsync` 是 PATCH 語意（沒帶的欄位保持原值），
    /// 這裡跟著同一條規則，否則從別的地方送一個只改上架狀態的請求就會把標籤清光。
    /// </para>
    /// </summary>
    protected override async Task SaveRelationsAsync(int id, JsonObject body)
    {
        if (body["tags"] is not JsonArray array) return;

        var wanted = array.Select(n => (int?)n?.GetValue<int>() ?? 0).Where(x => x > 0).Distinct().ToList();

        // 不存在或已軟刪的標籤直接濾掉，不要讓 FK 在 SaveChanges 才爆
        var valid = await Db.Tag.Where(t => wanted.Contains(t.Id) && !t.IsDeleted)
            .Select(t => t.Id).ToListAsync();

        var current = await Db.NewsTag.Where(nt => nt.NewsId == id).ToListAsync();

        Db.NewsTag.RemoveRange(current.Where(nt => !valid.Contains(nt.TagId)));
        foreach (var tagId in valid.Where(t => current.All(nt => nt.TagId != t)))
            Db.NewsTag.Add(new NewsTag { NewsId = id, TagId = tagId });

        await Db.SaveChangesAsync();
    }

    /// <summary>編輯畫面要知道這篇目前掛了哪些標籤，才能把晶片勾起來。</summary>
    protected override async Task DecorateAsync(int id, Dictionary<string, object?> row)
    {
        row["tags"] = await Db.NewsTag.AsNoTracking()
            .Where(nt => nt.NewsId == id)
            .Join(Db.Tag.Where(t => !t.IsDeleted), nt => nt.TagId, t => t.Id, (_, t) => new { t.Id, t.SortOrder })
            .OrderBy(t => t.SortOrder).ThenBy(t => t.Id)
            .Select(t => t.Id)
            .ToListAsync();
    }
}

/// <summary>05 vlog。</summary>
public sealed class AdminVlogHandler(AppDbContext db) : AdminContentHandler<Vlog, VlogI18n>(db);

/// <summary>06 faq。</summary>
public sealed class AdminFaqHandler(AppDbContext db) : AdminContentHandler<Faq, FaqI18n>(db);

/// <summary>07 trend。</summary>
public sealed class AdminTrendHandler(AppDbContext db) : AdminContentHandler<IndustryTrend, IndustryTrendI18n>(db);

/// <summary>08 certification。</summary>
public sealed class AdminCertificationHandler(AppDbContext db) : AdminContentHandler<Certification, CertificationI18n>(db);

/// <summary>10 facility。</summary>
public sealed class AdminFacilityHandler(AppDbContext db) : AdminContentHandler<FacilityItem, FacilityItemI18n>(db);

/// <summary>11 job。</summary>
public sealed class AdminJobHandler(AppDbContext db) : AdminContentHandler<JobPosting, JobPostingI18n>(db);

/// <summary>12 supplier-notice。無 SortOrder——列表照 NoticeDate 排。</summary>
public sealed class AdminSupplierNoticeHandler(AppDbContext db) : AdminContentHandler<SupplierNotice, SupplierNoticeI18n>(db);

/// <summary>13 supplier-spec。</summary>
public sealed class AdminSupplierSpecHandler(AppDbContext db) : AdminContentHandler<SupplierSpec, SupplierSpecI18n>(db);

/// <summary>14 supplier-download。</summary>
public sealed class AdminSupplierDownloadHandler(AppDbContext db) : AdminContentHandler<SupplierDownload, SupplierDownloadI18n>(db);
