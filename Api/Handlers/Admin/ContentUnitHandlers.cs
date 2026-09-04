using Nti.Api.Data;
using Nti.Api.Models.Dtos;
using Nti.Api.Models.Entities;
using System.Linq.Expressions;

namespace Nti.Api.Handlers.Admin;

/*  內容單元 01–14 的後台 CRUD（docs/09 §2）。
 *
 *  共用邏輯全在 AdminContentHandler；每個單元只宣告自己的清單標題欄位——
 *  各單元的標題欄位名稱不同（Title／Name／Question／H1…），泛型猜不到。
 *  一單元一個型別，讓 Router 與 DI 註冊維持逐條可讀，也對得上權限碼。
 */

/// <summary>01 home-banner。沒有標題欄位，清單用圖片 alt 當識別。</summary>
public sealed class AdminHomeBannerHandler(AppDbContext db) : AdminContentHandler<HomeBanner, HomeBannerI18n>(db)
{
    protected override Expression<Func<HomeBannerI18n, AdminI18nSummary>> I18nSummary =>
        i => new AdminI18nSummary { OwnerId = i.HomeBannerId, Lang = i.Lang, Title = i.ImageAlt };
}

/// <summary>02 solution。固定 4 筆，後台不提供新增與刪除（路由不掛 POST／DELETE）。</summary>
public sealed class AdminSolutionHandler(AppDbContext db) : AdminContentHandler<Solution, SolutionI18n>(db)
{
    protected override Expression<Func<SolutionI18n, AdminI18nSummary>> I18nSummary =>
        i => new AdminI18nSummary { OwnerId = i.SolutionId, Lang = i.Lang, Title = i.Name };
}

/// <summary>02 solution 的品項卡。掛在 <c>/admin/solution/item</c>，共用 solution.* 權限。</summary>
public sealed class AdminSolutionItemHandler(AppDbContext db) : AdminContentHandler<SolutionItem, SolutionItemI18n>(db)
{
    protected override Expression<Func<SolutionItemI18n, AdminI18nSummary>> I18nSummary =>
        i => new AdminI18nSummary { OwnerId = i.SolutionItemId, Lang = i.Lang, Title = i.Name };
}

/// <summary>03 project。</summary>
public sealed class AdminProjectHandler(AppDbContext db) : AdminContentHandler<Project, ProjectI18n>(db)
{
    protected override Expression<Func<ProjectI18n, AdminI18nSummary>> I18nSummary =>
        i => new AdminI18nSummary { OwnerId = i.ProjectId, Lang = i.Lang, Title = i.Title };
}

/// <summary>04 news。無 SortOrder——列表照 PublishDate 排。</summary>
public sealed class AdminNewsHandler(AppDbContext db) : AdminContentHandler<News, NewsI18n>(db)
{
    protected override Expression<Func<NewsI18n, AdminI18nSummary>> I18nSummary =>
        i => new AdminI18nSummary { OwnerId = i.NewsId, Lang = i.Lang, Title = i.Title };
}

/// <summary>05 vlog。</summary>
public sealed class AdminVlogHandler(AppDbContext db) : AdminContentHandler<Vlog, VlogI18n>(db)
{
    protected override Expression<Func<VlogI18n, AdminI18nSummary>> I18nSummary =>
        i => new AdminI18nSummary { OwnerId = i.VlogId, Lang = i.Lang, Title = i.Title };
}

/// <summary>06 faq。</summary>
public sealed class AdminFaqHandler(AppDbContext db) : AdminContentHandler<Faq, FaqI18n>(db)
{
    protected override Expression<Func<FaqI18n, AdminI18nSummary>> I18nSummary =>
        i => new AdminI18nSummary { OwnerId = i.FaqId, Lang = i.Lang, Title = i.Question };
}

/// <summary>07 trend。</summary>
public sealed class AdminTrendHandler(AppDbContext db) : AdminContentHandler<IndustryTrend, IndustryTrendI18n>(db)
{
    protected override Expression<Func<IndustryTrendI18n, AdminI18nSummary>> I18nSummary =>
        i => new AdminI18nSummary { OwnerId = i.IndustryTrendId, Lang = i.Lang, Title = i.Title };
}

/// <summary>08 certification。</summary>
public sealed class AdminCertificationHandler(AppDbContext db) : AdminContentHandler<Certification, CertificationI18n>(db)
{
    protected override Expression<Func<CertificationI18n, AdminI18nSummary>> I18nSummary =>
        i => new AdminI18nSummary { OwnerId = i.CertificationId, Lang = i.Lang, Title = i.Name };
}

/// <summary>10 facility。</summary>
public sealed class AdminFacilityHandler(AppDbContext db) : AdminContentHandler<FacilityItem, FacilityItemI18n>(db)
{
    protected override Expression<Func<FacilityItemI18n, AdminI18nSummary>> I18nSummary =>
        i => new AdminI18nSummary { OwnerId = i.FacilityItemId, Lang = i.Lang, Title = i.Name };
}

/// <summary>11 job。</summary>
public sealed class AdminJobHandler(AppDbContext db) : AdminContentHandler<JobPosting, JobPostingI18n>(db)
{
    protected override Expression<Func<JobPostingI18n, AdminI18nSummary>> I18nSummary =>
        i => new AdminI18nSummary { OwnerId = i.JobPostingId, Lang = i.Lang, Title = i.Title };
}

/// <summary>12 supplier-notice。無 SortOrder——列表照 NoticeDate 排。</summary>
public sealed class AdminSupplierNoticeHandler(AppDbContext db) : AdminContentHandler<SupplierNotice, SupplierNoticeI18n>(db)
{
    protected override Expression<Func<SupplierNoticeI18n, AdminI18nSummary>> I18nSummary =>
        i => new AdminI18nSummary { OwnerId = i.SupplierNoticeId, Lang = i.Lang, Title = i.Title };
}

/// <summary>13 supplier-spec。</summary>
public sealed class AdminSupplierSpecHandler(AppDbContext db) : AdminContentHandler<SupplierSpec, SupplierSpecI18n>(db)
{
    protected override Expression<Func<SupplierSpecI18n, AdminI18nSummary>> I18nSummary =>
        i => new AdminI18nSummary { OwnerId = i.SupplierSpecId, Lang = i.Lang, Title = i.Title };
}

/// <summary>14 supplier-download。</summary>
public sealed class AdminSupplierDownloadHandler(AppDbContext db) : AdminContentHandler<SupplierDownload, SupplierDownloadI18n>(db)
{
    protected override Expression<Func<SupplierDownloadI18n, AdminI18nSummary>> I18nSummary =>
        i => new AdminI18nSummary { OwnerId = i.SupplierDownloadId, Lang = i.Lang, Title = i.Name };
}
