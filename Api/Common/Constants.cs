namespace Nti.Api.Common;

/// <summary>
/// 權限碼（docs/10 §9.2）。權威來源：docs/09 §6 的權限矩陣
/// ＝ <c>db/seed/110_role_permission.sql</c>（171 列＝SuperAdmin 83／Editor 67／Viewer 21）
/// ＝ <c>apps/admin/src/lib/permissions.ts</c>。
/// <para>格式 <c>{單元代號}.{action}</c>，單元代號逐字對應 docs/09 §2，不做單複數轉換。</para>
/// <para>這些字串在程式中不得再出現字面值。</para>
/// </summary>
public static class PermissionCodes
{
    // ── 內容單元 01–14：四個動作一致（docs/09 §2）──────────────────────
    public const string HomeBannerView             = "home-banner.view";
    public const string HomeBannerEdit             = "home-banner.edit";
    public const string HomeBannerPublish          = "home-banner.publish";
    public const string HomeBannerDelete           = "home-banner.delete";
    public const string SolutionView               = "solution.view";
    public const string SolutionEdit               = "solution.edit";
    public const string SolutionPublish            = "solution.publish";
    public const string SolutionDelete             = "solution.delete";
    public const string ProjectView                = "project.view";
    public const string ProjectEdit                = "project.edit";
    public const string ProjectPublish             = "project.publish";
    public const string ProjectDelete              = "project.delete";
    public const string NewsView                   = "news.view";
    public const string NewsEdit                   = "news.edit";
    public const string NewsPublish                = "news.publish";
    public const string NewsDelete                 = "news.delete";
    public const string VlogView                   = "vlog.view";
    public const string VlogEdit                   = "vlog.edit";
    public const string VlogPublish                = "vlog.publish";
    public const string VlogDelete                 = "vlog.delete";
    public const string FaqView                    = "faq.view";
    public const string FaqEdit                    = "faq.edit";
    public const string FaqPublish                 = "faq.publish";
    public const string FaqDelete                  = "faq.delete";
    public const string TrendView                  = "trend.view";
    public const string TrendEdit                  = "trend.edit";
    public const string TrendPublish               = "trend.publish";
    public const string TrendDelete                = "trend.delete";
    public const string CertificationView          = "certification.view";
    public const string CertificationEdit          = "certification.edit";
    public const string CertificationPublish       = "certification.publish";
    public const string CertificationDelete        = "certification.delete";
    public const string ClientView                 = "client.view";
    public const string ClientEdit                 = "client.edit";
    public const string ClientPublish              = "client.publish";
    public const string ClientDelete               = "client.delete";
    public const string FacilityView               = "facility.view";
    public const string FacilityEdit               = "facility.edit";
    public const string FacilityPublish            = "facility.publish";
    public const string FacilityDelete             = "facility.delete";
    public const string JobView                    = "job.view";
    public const string JobEdit                    = "job.edit";
    public const string JobPublish                 = "job.publish";
    public const string JobDelete                  = "job.delete";
    public const string SupplierNoticeView         = "supplier-notice.view";
    public const string SupplierNoticeEdit         = "supplier-notice.edit";
    public const string SupplierNoticePublish      = "supplier-notice.publish";
    public const string SupplierNoticeDelete       = "supplier-notice.delete";
    public const string SupplierSpecView           = "supplier-spec.view";
    public const string SupplierSpecEdit           = "supplier-spec.edit";
    public const string SupplierSpecPublish        = "supplier-spec.publish";
    public const string SupplierSpecDelete         = "supplier-spec.delete";
    public const string SupplierDownloadView       = "supplier-download.view";
    public const string SupplierDownloadEdit       = "supplier-download.edit";
    public const string SupplierDownloadPublish    = "supplier-download.publish";
    public const string SupplierDownloadDelete     = "supplier-download.delete";

    // ── 00 待辦總覽（唯讀聚合） ──
    public const string DashboardView              = "dashboard.view";

    // ── 15 固定頁：29 筆不可增刪，故無 delete ──
    public const string PageView                   = "page.view";
    public const string PageEdit                   = "page.edit";

    // ── 16 轉址 ──
    public const string RedirectView               = "redirect.view";
    public const string RedirectEdit               = "redirect.edit";
    public const string RedirectDelete             = "redirect.delete";
    public const string RedirectExport             = "redirect.export";

    // ── 17 報價：download／export 僅 SuperAdmin ──
    public const string QuoteView                  = "quote.view";
    public const string QuoteEdit                  = "quote.edit";
    public const string QuoteDownload              = "quote.download";
    public const string QuoteExport                = "quote.export";

    // ── 18 聯絡訊息 ──
    public const string ContactView                = "contact.view";
    public const string ContactEdit                = "contact.edit";

    // ── 19 會員 ──
    public const string MemberView                 = "member.view";
    public const string MemberEdit                 = "member.edit";

    // ── 20 訂單 ──
    public const string OrderView                  = "order.view";
    public const string OrderEdit                  = "order.edit";

    // ── 21 網站設定 ──
    public const string SettingView                = "setting.view";
    public const string SettingEdit                = "setting.edit";

    // ── 22 分類 ──
    public const string CategoryView               = "category.view";
    public const string CategoryEdit               = "category.edit";
    public const string CategoryDelete             = "category.delete";

    // ── 23 管理員與角色 ──
    public const string AdminView                  = "admin.view";
    public const string AdminEdit                  = "admin.edit";
    public const string AdminDelete                = "admin.delete";

    // ── 24 操作紀錄：resend 為 EmailLog 重寄 ──
    public const string AuditView                  = "audit.view";
    public const string AuditResend                = "audit.resend";


    /// <summary>全部 83 個權限碼（SuperAdmin 的授權範圍）。</summary>
    public static readonly IReadOnlySet<string> All = new HashSet<string>(StringComparer.Ordinal)
    {
        HomeBannerView, HomeBannerEdit, HomeBannerPublish, HomeBannerDelete,
        SolutionView, SolutionEdit, SolutionPublish, SolutionDelete,
        ProjectView, ProjectEdit, ProjectPublish, ProjectDelete,
        NewsView, NewsEdit, NewsPublish, NewsDelete,
        VlogView, VlogEdit, VlogPublish, VlogDelete,
        FaqView, FaqEdit, FaqPublish, FaqDelete,
        TrendView, TrendEdit, TrendPublish, TrendDelete,
        CertificationView, CertificationEdit, CertificationPublish, CertificationDelete,
        ClientView, ClientEdit, ClientPublish, ClientDelete,
        FacilityView, FacilityEdit, FacilityPublish, FacilityDelete,
        JobView, JobEdit, JobPublish, JobDelete,
        SupplierNoticeView, SupplierNoticeEdit, SupplierNoticePublish, SupplierNoticeDelete,
        SupplierSpecView, SupplierSpecEdit, SupplierSpecPublish, SupplierSpecDelete,
        SupplierDownloadView, SupplierDownloadEdit, SupplierDownloadPublish, SupplierDownloadDelete,
        DashboardView, PageView, PageEdit, RedirectView,
        RedirectEdit, RedirectDelete, RedirectExport, QuoteView,
        QuoteEdit, QuoteDownload, QuoteExport, ContactView,
        ContactEdit, MemberView, MemberEdit, OrderView,
        OrderEdit, SettingView, SettingEdit, CategoryView,
        CategoryEdit, CategoryDelete, AdminView, AdminEdit,
        AdminDelete, AuditView, AuditResend,
    };
}

/// <summary>角色代碼（db/seed/100_role.sql，三個皆為 IsSystem）。</summary>
public static class RoleCodes
{
    public const string SuperAdmin = "SuperAdmin";   // 超級管理員
    public const string Editor     = "Editor";       // 內容編輯
    public const string Viewer     = "Viewer";       // 檢視者
}

/// <summary>九種 CategoryType（docs/08 §4.1 ＝ db/seed/120_category.sql，共 44 筆分類）。</summary>
public static class CategoryTypes
{
    public const string Certification  = "Certification";
    public const string Facility       = "Facility";
    public const string Faq            = "Faq";
    public const string Industry       = "Industry";
    public const string News           = "News";
    public const string Project        = "Project";
    public const string QuoteMaterial  = "QuoteMaterial";
    public const string SupplierNotice = "SupplierNotice";
    public const string Vlog           = "Vlog";

    public static readonly IReadOnlySet<string> All = new HashSet<string>(StringComparer.Ordinal)
    {
        Certification, Facility, Faq, Industry, News,
        Project, QuoteMaterial, SupplierNotice, Vlog,
    };
}

/// <summary>
/// 29 個固定頁 key（docs/08 §6.4 ＝ db/seed/140_page.sql）。
/// 固定頁不可增刪，Id 亦固定，供 <c>GET /pages/{pageKey}</c> 使用。
/// </summary>
public static class PageKeys
{
    public const string Home                 = "home";
    public const string AboutHub             = "about-hub";
    public const string AboutDifference      = "about-difference";
    public const string AboutBenefits        = "about-benefits";
    public const string AboutCertifications  = "about-certifications";
    public const string Facility             = "facility";
    public const string FacilityPrePress     = "facility-pre-press";
    public const string FacilityEcoPrinting  = "facility-eco-printing";
    public const string FacilityPostPress    = "facility-post-press";
    public const string FacilityQuality      = "facility-quality";
    public const string FacilityTour         = "facility-tour";
    public const string Solutions            = "solutions";
    public const string Projects             = "projects";
    public const string SustainabilityHub    = "sustainability-hub";
    public const string GreenOurAdvantage    = "green-our-advantage";
    public const string GreenCarbon          = "green-carbon";
    public const string GreenMaterials       = "green-materials";
    public const string GreenEsg             = "green-esg";
    public const string GreenCsr             = "green-csr";          // 預留，待客戶確認（IsIndexable = 0）
    public const string Insights             = "insights";
    public const string NewsList             = "news-list";
    public const string GreenVlog            = "green-vlog";
    public const string Faq                  = "faq";
    public const string IndustryTrends       = "industry-trends";
    public const string Careers              = "careers";
    public const string SupplierArea         = "supplier-area";
    public const string Contact              = "contact";
    public const string GetAQuote            = "get-a-quote";
    public const string PrivacyLegal         = "privacy-legal";

    public static readonly IReadOnlySet<string> All = new HashSet<string>(StringComparer.Ordinal)
    {
        Home, AboutHub, AboutDifference, AboutBenefits, AboutCertifications,
        Facility, FacilityPrePress, FacilityEcoPrinting, FacilityPostPress, FacilityQuality,
        FacilityTour, Solutions, Projects, SustainabilityHub, GreenOurAdvantage,
        GreenCarbon, GreenMaterials, GreenEsg, GreenCsr, Insights,
        NewsList, GreenVlog, Faq, IndustryTrends, Careers,
        SupplierArea, Contact, GetAQuote, PrivacyLegal,
    };
}

/// <summary>報價單狀態（docs/03 §3）。</summary>
public static class QuoteStatuses
{
    public const string New        = "New";
    public const string InProgress = "InProgress";
    public const string Quoted     = "Quoted";
    public const string Closed     = "Closed";
    public const string Spam       = "Spam";
}

/// <summary>聯絡訊息狀態（docs/03 §3）。</summary>
public static class ContactStatuses
{
    public const string New     = "New";
    public const string Replied = "Replied";
    public const string Closed  = "Closed";
    public const string Spam    = "Spam";
}

/// <summary>語系值域（docs/08 §2.5）。缺語系不 fallback。</summary>
public static class Langs
{
    public const string Zh = "zh";
    public const string En = "en";

    public static readonly IReadOnlySet<string> All = new HashSet<string>(StringComparer.Ordinal) { Zh, En };
}

/// <summary>JWT audience（docs/10 §7.2）：後台與前台會員的身分完全分離。</summary>
public static class TokenAudiences
{
    public const string Admin = "nti-admin";
    public const string Web   = "nti-web";
}
