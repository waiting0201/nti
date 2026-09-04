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
public sealed class AdminNewsHandler(AppDbContext db) : AdminContentHandler<News, NewsI18n>(db);

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
