using Nti.Api.Models.Entities;

namespace Nti.Api.Data.Seed;

/// <summary>
/// 種子資料（docs/08 §6），由 <c>HasData</c> 寫進 Migration，各環境 Id 一致。
/// <para>
/// 內容逐列取自 <c>db/seed/</c> 的六支腳本（該處為原始出處，本檔為 EF 表達）。
/// 筆數與 <c>db/verify/verify.sql</c> 的斷言一致：角色 3／權限 171／分類 44(+88)／
/// 設定 15／固定頁 29(+58)／方案 4(+8)。
/// </para>
/// <para>
/// ⚠ <b>Id 一律硬編</b>：HasData 需要明確主鍵，且跨環境一致才能讓內容遷移對照表與
/// hotfix SQL 直接引用（docs/10 §8.5）。改動這裡等同 schema 變更，要產新的 Migration。
/// </para>
/// </summary>
internal static class SeedData
{
    /// <summary>
    /// 種子列的稽核時間。HasData 只接受常數（Migration 要能重播），
    /// 故不能用 <c>Clock.UtcNow</c>；此值為建立本批種子的日期（UTC）。
    /// </summary>
    private static readonly DateTime SeedAt = new(2026, 9, 4, 0, 0, 0, DateTimeKind.Utc);

    /// <summary>三個系統角色，不可刪（db/seed/100_role.sql）。</summary>
    public static readonly Role[] Roles =
    [
        new() { Id = 1, Code = "SuperAdmin", Name = "超級管理員", IsSystem = true },
        new() { Id = 2, Code = "Editor", Name = "內容編輯", IsSystem = true },
        new() { Id = 3, Code = "Viewer", Name = "檢視者", IsSystem = true },
    ];

    /// <summary>
    /// 權限矩陣 171 列（docs/09 §6 ＝ db/seed/110_role_permission.sql
    /// ＝ apps/admin/src/lib/permissions.ts）。
    /// <para>
    /// 用規則展開而非逐列硬寫：內容單元 01–14 的四個動作規則一致，逐列寫遲早會與
    /// <see cref="Common.PermissionCodes"/> 岔開。展開後的列數在下方自我檢查，
    /// 對不上就在建模時直接炸掉——與後台 dev 模式 console 報錯是同一個把關。
    /// SuperAdmin 亦逐列展開、不用萬用碼，RBAC 檢查邏輯才能保持單一。
    /// </para>
    /// </summary>
    /// <summary>docs/09 §2 的內容單元 01–14：三個角色的動作規則一致。</summary>
    private static readonly string[] ContentUnits =
    [
        "home-banner", "solution", "project", "news", "vlog", "faq", "trend",
        "certification", "client", "facility", "job",
        "supplier-notice", "supplier-spec", "supplier-download",
    ];

    /// <summary>非內容單元的逐列授權，順序與 db/seed/110_role_permission.sql 的註解對齊。</summary>
    private static readonly Dictionary<int, string[]> ExplicitGrants = new()
    {
        [1] =   // SuperAdmin
        [
            "dashboard.view", "page.view", "page.edit", "redirect.view", "redirect.edit", "redirect.delete",
            "redirect.export", "quote.view", "quote.edit", "quote.download", "quote.export", "contact.view",
            "contact.edit", "member.view", "member.edit", "order.view", "order.edit", "setting.view",
            "setting.edit", "category.view", "category.edit", "category.delete", "admin.view", "admin.edit",
            "admin.delete", "audit.view", "audit.resend",
        ],
        [2] =   // Editor
        [
            "dashboard.view", "page.view", "page.edit", "redirect.view", "redirect.edit", "redirect.delete",
            "redirect.export", "quote.view", "quote.edit", "contact.view", "contact.edit",
        ],
        [3] =   // Viewer
        [
            "dashboard.view", "page.view", "redirect.view", "quote.view", "contact.view", "setting.view",
            "category.view",
        ],
    };

    /// <summary>內容單元的動作：Viewer 只有檢視。</summary>
    private static readonly Dictionary<int, string[]> ContentActions = new()
    {
        [1] = ["view", "edit", "publish", "delete"],
        [2] = ["view", "edit", "publish", "delete"],
        [3] = ["view"],
    };

    private const int ExpectedRolePermissionRows = 171;   // db/verify/verify.sql 的斷言

    // ⚠ 這個宣告必須排在上面三個 static 欄位之後：static 欄位是照「文字順序」初始化的，
    //   放前面的話 BuildRolePermissions() 會拿到 null 的 ContentUnits／ExplicitGrants。
    public static readonly RolePermission[] RolePermissions = BuildRolePermissions();

    private static RolePermission[] BuildRolePermissions()
    {
        var rows = new List<RolePermission>();

        foreach (var (roleId, actions) in ContentActions)
            foreach (var unit in ContentUnits)
                foreach (var action in actions)
                    rows.Add(new RolePermission { RoleId = roleId, PermissionCode = $"{unit}.{action}" });

        foreach (var (roleId, codes) in ExplicitGrants)
            foreach (var code in codes)
                rows.Add(new RolePermission { RoleId = roleId, PermissionCode = code });

        if (rows.Count != ExpectedRolePermissionRows)
            throw new InvalidOperationException(
                $"權限矩陣展開為 {rows.Count} 列，應為 {ExpectedRolePermissionRows} 列。" +
                "請對照 docs/09 §6、db/seed/110_role_permission.sql 與 apps/admin/src/lib/permissions.ts。");

        // 值域自我檢查：所有展開的碼都必須在 PermissionCodes.All（83 個）之內
        var unknown = rows.Select(r => r.PermissionCode).Distinct()
                          .Where(c => !Common.PermissionCodes.All.Contains(c)).ToArray();
        if (unknown.Length > 0)
            throw new InvalidOperationException($"權限碼不在 PermissionCodes 值域內：{string.Join(", ", unknown)}");

        return [.. rows];
    }

    /// <summary>九種 CategoryType 共 44 筆（db/seed/120_category.sql）。</summary>
    public static readonly Category[] Categories =
    [
        new() { Id = 1, CategoryType = "News", Code = "esg", SortOrder = 10, IsActive = true, CreatedAt = SeedAt },
        new() { Id = 2, CategoryType = "News", Code = "awards", SortOrder = 20, IsActive = true, CreatedAt = SeedAt },
        new() { Id = 3, CategoryType = "News", Code = "partnership", SortOrder = 30, IsActive = true, CreatedAt = SeedAt },
        new() { Id = 4, CategoryType = "News", Code = "sustainability", SortOrder = 40, IsActive = true, CreatedAt = SeedAt },
        new() { Id = 5, CategoryType = "News", Code = "event", SortOrder = 50, IsActive = true, CreatedAt = SeedAt },
        new() { Id = 6, CategoryType = "Project", Code = "food", SortOrder = 10, IsActive = true, CreatedAt = SeedAt },
        new() { Id = 7, CategoryType = "Project", Code = "pharma", SortOrder = 20, IsActive = true, CreatedAt = SeedAt },
        new() { Id = 8, CategoryType = "Project", Code = "cosmetics", SortOrder = 30, IsActive = true, CreatedAt = SeedAt },
        new() { Id = 9, CategoryType = "Project", Code = "electronics", SortOrder = 40, IsActive = true, CreatedAt = SeedAt },
        new() { Id = 10, CategoryType = "Project", Code = "gift", SortOrder = 50, IsActive = true, CreatedAt = SeedAt },
        new() { Id = 11, CategoryType = "Project", Code = "other", SortOrder = 60, IsActive = true, CreatedAt = SeedAt },
        new() { Id = 12, CategoryType = "Vlog", Code = "sustainability", SortOrder = 10, IsActive = true, CreatedAt = SeedAt },
        new() { Id = 13, CategoryType = "Vlog", Code = "low-carbon", SortOrder = 20, IsActive = true, CreatedAt = SeedAt },
        new() { Id = 14, CategoryType = "Vlog", Code = "awards", SortOrder = 30, IsActive = true, CreatedAt = SeedAt },
        new() { Id = 15, CategoryType = "Faq", Code = "general", SortOrder = 10, IsActive = true, CreatedAt = SeedAt },
        new() { Id = 16, CategoryType = "Faq", Code = "ordering", SortOrder = 20, IsActive = true, CreatedAt = SeedAt },
        new() { Id = 17, CategoryType = "Faq", Code = "materials", SortOrder = 30, IsActive = true, CreatedAt = SeedAt },
        new() { Id = 18, CategoryType = "Faq", Code = "sustainability", SortOrder = 40, IsActive = true, CreatedAt = SeedAt },
        new() { Id = 19, CategoryType = "Certification", Code = "certification", SortOrder = 10, IsActive = true, CreatedAt = SeedAt },
        new() { Id = 20, CategoryType = "Certification", Code = "partnership", SortOrder = 20, IsActive = true, CreatedAt = SeedAt },
        new() { Id = 21, CategoryType = "Certification", Code = "award", SortOrder = 30, IsActive = true, CreatedAt = SeedAt },
        new() { Id = 22, CategoryType = "Facility", Code = "pre-press", SortOrder = 10, IsActive = true, CreatedAt = SeedAt },
        new() { Id = 23, CategoryType = "Facility", Code = "eco-printing", SortOrder = 20, IsActive = true, CreatedAt = SeedAt },
        new() { Id = 24, CategoryType = "Facility", Code = "post-press", SortOrder = 30, IsActive = true, CreatedAt = SeedAt },
        new() { Id = 25, CategoryType = "Facility", Code = "quality", SortOrder = 40, IsActive = true, CreatedAt = SeedAt },
        new() { Id = 26, CategoryType = "Facility", Code = "tour", SortOrder = 50, IsActive = true, CreatedAt = SeedAt },
        new() { Id = 27, CategoryType = "SupplierNotice", Code = "policy", SortOrder = 10, IsActive = true, CreatedAt = SeedAt },
        new() { Id = 28, CategoryType = "SupplierNotice", Code = "esg", SortOrder = 20, IsActive = true, CreatedAt = SeedAt },
        new() { Id = 29, CategoryType = "SupplierNotice", Code = "quality", SortOrder = 30, IsActive = true, CreatedAt = SeedAt },
        new() { Id = 30, CategoryType = "SupplierNotice", Code = "logistics", SortOrder = 40, IsActive = true, CreatedAt = SeedAt },
        new() { Id = 31, CategoryType = "Industry", Code = "food-beverage", SortOrder = 10, IsActive = true, CreatedAt = SeedAt },
        new() { Id = 32, CategoryType = "Industry", Code = "electronics", SortOrder = 20, IsActive = true, CreatedAt = SeedAt },
        new() { Id = 33, CategoryType = "Industry", Code = "beauty", SortOrder = 30, IsActive = true, CreatedAt = SeedAt },
        new() { Id = 34, CategoryType = "Industry", Code = "medical", SortOrder = 40, IsActive = true, CreatedAt = SeedAt },
        new() { Id = 35, CategoryType = "Industry", Code = "luxury-gift", SortOrder = 50, IsActive = true, CreatedAt = SeedAt },
        new() { Id = 36, CategoryType = "Industry", Code = "hardware", SortOrder = 60, IsActive = true, CreatedAt = SeedAt },
        new() { Id = 37, CategoryType = "Industry", Code = "automotive", SortOrder = 70, IsActive = true, CreatedAt = SeedAt },
        new() { Id = 38, CategoryType = "Industry", Code = "publishing", SortOrder = 80, IsActive = true, CreatedAt = SeedAt },
        new() { Id = 39, CategoryType = "Industry", Code = "home-lifestyle", SortOrder = 90, IsActive = true, CreatedAt = SeedAt },
        new() { Id = 40, CategoryType = "Industry", Code = "industrial", SortOrder = 100, IsActive = true, CreatedAt = SeedAt },
        new() { Id = 41, CategoryType = "QuoteMaterial", Code = "fsc", SortOrder = 10, IsActive = true, CreatedAt = SeedAt },
        new() { Id = 42, CategoryType = "QuoteMaterial", Code = "recycled", SortOrder = 20, IsActive = true, CreatedAt = SeedAt },
        new() { Id = 43, CategoryType = "QuoteMaterial", Code = "kraft", SortOrder = 30, IsActive = true, CreatedAt = SeedAt },
        new() { Id = 44, CategoryType = "QuoteMaterial", Code = "specialty", SortOrder = 40, IsActive = true, CreatedAt = SeedAt },
    ];

    /// <summary>分類名稱中英各一，共 88 列。</summary>
    public static readonly CategoryI18n[] CategoryI18ns =
    [
        new() { CategoryId = 1, Lang = "en", Name = "ESG" },
        new() { CategoryId = 1, Lang = "zh", Name = "ESG 永續" },
        new() { CategoryId = 2, Lang = "en", Name = "Awards" },
        new() { CategoryId = 2, Lang = "zh", Name = "獲獎肯定" },
        new() { CategoryId = 3, Lang = "en", Name = "Partnership" },
        new() { CategoryId = 3, Lang = "zh", Name = "合作夥伴" },
        new() { CategoryId = 4, Lang = "en", Name = "Sustainability" },
        new() { CategoryId = 4, Lang = "zh", Name = "永續發展" },
        new() { CategoryId = 5, Lang = "en", Name = "Events" },
        new() { CategoryId = 5, Lang = "zh", Name = "活動訊息" },
        new() { CategoryId = 6, Lang = "en", Name = "Food" },
        new() { CategoryId = 6, Lang = "zh", Name = "食品" },
        new() { CategoryId = 7, Lang = "en", Name = "Pharmaceutical" },
        new() { CategoryId = 7, Lang = "zh", Name = "醫藥" },
        new() { CategoryId = 8, Lang = "en", Name = "Cosmetics" },
        new() { CategoryId = 8, Lang = "zh", Name = "美妝" },
        new() { CategoryId = 9, Lang = "en", Name = "Electronics" },
        new() { CategoryId = 9, Lang = "zh", Name = "電子" },
        new() { CategoryId = 10, Lang = "en", Name = "Gift" },
        new() { CategoryId = 10, Lang = "zh", Name = "禮品" },
        new() { CategoryId = 11, Lang = "en", Name = "Other" },
        new() { CategoryId = 11, Lang = "zh", Name = "其他" },
        new() { CategoryId = 12, Lang = "en", Name = "Sustainability" },
        new() { CategoryId = 12, Lang = "zh", Name = "永續" },
        new() { CategoryId = 13, Lang = "en", Name = "Low Carbon" },
        new() { CategoryId = 13, Lang = "zh", Name = "低碳" },
        new() { CategoryId = 14, Lang = "en", Name = "Awards" },
        new() { CategoryId = 14, Lang = "zh", Name = "獲獎" },
        new() { CategoryId = 15, Lang = "en", Name = "General" },
        new() { CategoryId = 15, Lang = "zh", Name = "一般問題" },
        new() { CategoryId = 16, Lang = "en", Name = "Ordering" },
        new() { CategoryId = 16, Lang = "zh", Name = "訂購流程" },
        new() { CategoryId = 17, Lang = "en", Name = "Materials" },
        new() { CategoryId = 17, Lang = "zh", Name = "材質相關" },
        new() { CategoryId = 18, Lang = "en", Name = "Sustainability" },
        new() { CategoryId = 18, Lang = "zh", Name = "永續相關" },
        new() { CategoryId = 19, Lang = "en", Name = "Certifications" },
        new() { CategoryId = 19, Lang = "zh", Name = "認證" },
        new() { CategoryId = 20, Lang = "en", Name = "Partnerships" },
        new() { CategoryId = 20, Lang = "zh", Name = "夥伴" },
        new() { CategoryId = 21, Lang = "en", Name = "Awards" },
        new() { CategoryId = 21, Lang = "zh", Name = "獎項" },
        new() { CategoryId = 22, Lang = "en", Name = "Pre-Press" },
        new() { CategoryId = 22, Lang = "zh", Name = "印前作業" },
        new() { CategoryId = 23, Lang = "en", Name = "Eco Printing" },
        new() { CategoryId = 23, Lang = "zh", Name = "環保印刷" },
        new() { CategoryId = 24, Lang = "en", Name = "Post-Press" },
        new() { CategoryId = 24, Lang = "zh", Name = "印後加工" },
        new() { CategoryId = 25, Lang = "en", Name = "Quality Control" },
        new() { CategoryId = 25, Lang = "zh", Name = "品質檢驗" },
        new() { CategoryId = 26, Lang = "en", Name = "Plant Tour" },
        new() { CategoryId = 26, Lang = "zh", Name = "廠區導覽" },
        new() { CategoryId = 27, Lang = "en", Name = "Policy" },
        new() { CategoryId = 27, Lang = "zh", Name = "政策公告" },
        new() { CategoryId = 28, Lang = "en", Name = "ESG" },
        new() { CategoryId = 28, Lang = "zh", Name = "ESG 規範" },
        new() { CategoryId = 29, Lang = "en", Name = "Quality" },
        new() { CategoryId = 29, Lang = "zh", Name = "品質要求" },
        new() { CategoryId = 30, Lang = "en", Name = "Logistics" },
        new() { CategoryId = 30, Lang = "zh", Name = "物流配送" },
        new() { CategoryId = 31, Lang = "en", Name = "Food & Beverage" },
        new() { CategoryId = 31, Lang = "zh", Name = "食品飲料" },
        new() { CategoryId = 32, Lang = "en", Name = "Electronics" },
        new() { CategoryId = 32, Lang = "zh", Name = "電子產品" },
        new() { CategoryId = 33, Lang = "en", Name = "Beauty & Skincare" },
        new() { CategoryId = 33, Lang = "zh", Name = "美妝保養" },
        new() { CategoryId = 34, Lang = "en", Name = "Medical & Healthcare" },
        new() { CategoryId = 34, Lang = "zh", Name = "醫療保健" },
        new() { CategoryId = 35, Lang = "en", Name = "Luxury & Gift Packaging" },
        new() { CategoryId = 35, Lang = "zh", Name = "精品禮盒" },
        new() { CategoryId = 36, Lang = "en", Name = "Hardware & Hand Tools" },
        new() { CategoryId = 36, Lang = "zh", Name = "五金手工具" },
        new() { CategoryId = 37, Lang = "en", Name = "Automotive" },
        new() { CategoryId = 37, Lang = "zh", Name = "汽車產業" },
        new() { CategoryId = 38, Lang = "en", Name = "Publishing & Stationery" },
        new() { CategoryId = 38, Lang = "zh", Name = "出版文具" },
        new() { CategoryId = 39, Lang = "en", Name = "Home & Lifestyle" },
        new() { CategoryId = 39, Lang = "zh", Name = "居家生活" },
        new() { CategoryId = 40, Lang = "en", Name = "Industrial & Consumer Goods" },
        new() { CategoryId = 40, Lang = "zh", Name = "工業與消費品" },
        new() { CategoryId = 41, Lang = "en", Name = "FSC™-certified board" },
        new() { CategoryId = 41, Lang = "zh", Name = "FSC™ 認證紙板" },
        new() { CategoryId = 42, Lang = "en", Name = "Recycled board" },
        new() { CategoryId = 42, Lang = "zh", Name = "再生紙板" },
        new() { CategoryId = 43, Lang = "en", Name = "Kraft" },
        new() { CategoryId = 43, Lang = "zh", Name = "牛皮紙" },
        new() { CategoryId = 44, Lang = "en", Name = "Specialty / metallized" },
        new() { CategoryId = 44, Lang = "zh", Name = "特殊／金屬鍍膜紙材" },
    ];

    /// <summary>
    /// 固定 15 個設定 key（db/seed/130_site_setting.sql）。值留白由客戶在後台填。
    /// </summary>
    public static readonly SiteSetting[] SiteSettings =
    [
        new() { SettingKey = "company.name", GroupName = "Company", ValueType = "text", IsLocalized = true, SortOrder = 10 },
        new() { SettingKey = "home.gallery_image", GroupName = "Home", ValueType = "image", IsLocalized = false, SortOrder = 10 },
        new() { SettingKey = "mail.quote_notify_to", GroupName = "Mail", ValueType = "email", IsLocalized = false, SortOrder = 10 },
        new() { SettingKey = "social.facebook", GroupName = "Social", ValueType = "url", IsLocalized = false, SortOrder = 10 },
        new() { SettingKey = "company.address", GroupName = "Company", ValueType = "multiline", IsLocalized = true, SortOrder = 20 },
        new() { SettingKey = "home.gallery_alt", GroupName = "Home", ValueType = "text", IsLocalized = true, SortOrder = 20 },
        new() { SettingKey = "mail.contact_notify_to", GroupName = "Mail", ValueType = "email", IsLocalized = false, SortOrder = 20 },
        new() { SettingKey = "social.linkedin", GroupName = "Social", ValueType = "url", IsLocalized = false, SortOrder = 20 },
        new() { SettingKey = "company.hours", GroupName = "Company", ValueType = "multiline", IsLocalized = true, SortOrder = 30 },
        new() { SettingKey = "mail.bcc", GroupName = "Mail", ValueType = "email", IsLocalized = false, SortOrder = 30 },
        new() { SettingKey = "social.youtube", GroupName = "Social", ValueType = "url", IsLocalized = false, SortOrder = 30 },
        new() { SettingKey = "company.phone", GroupName = "Company", ValueType = "text", IsLocalized = false, SortOrder = 40 },
        new() { SettingKey = "company.fax", GroupName = "Company", ValueType = "text", IsLocalized = false, SortOrder = 50 },
        new() { SettingKey = "company.email", GroupName = "Company", ValueType = "email", IsLocalized = false, SortOrder = 60 },
        new() { SettingKey = "company.map_embed", GroupName = "Company", ValueType = "url", IsLocalized = false, SortOrder = 70 },
    ];

    /// <summary>
    /// 29 筆固定頁（db/seed/140_page.sql）：28 筆既有 + 1 筆預留的 green-csr。
    /// 不可增刪，故 Id 固定；RouteTemplate 為提案值，前端路由定案後改這裡。
    /// </summary>
    public static readonly Page[] Pages =
    [
        new() { Id = 1, PageKey = "home", RouteTemplate = "/{lang}", HasRichBody = false, IsIndexable = true, CreatedAt = SeedAt },
        new() { Id = 2, PageKey = "about-hub", RouteTemplate = "/{lang}/about", HasRichBody = false, IsIndexable = true, CreatedAt = SeedAt },
        new() { Id = 3, PageKey = "about-difference", RouteTemplate = "/{lang}/about/difference", HasRichBody = false, IsIndexable = true, CreatedAt = SeedAt },
        new() { Id = 4, PageKey = "about-benefits", RouteTemplate = "/{lang}/about/benefits", HasRichBody = false, IsIndexable = true, CreatedAt = SeedAt },
        new() { Id = 5, PageKey = "about-certifications", RouteTemplate = "/{lang}/about/certifications", HasRichBody = false, IsIndexable = true, CreatedAt = SeedAt },
        new() { Id = 6, PageKey = "facility", RouteTemplate = "/{lang}/about/facility", HasRichBody = false, IsIndexable = true, CreatedAt = SeedAt },
        new() { Id = 7, PageKey = "facility-pre-press", RouteTemplate = "/{lang}/about/facility/pre-press", HasRichBody = false, IsIndexable = true, CreatedAt = SeedAt },
        new() { Id = 8, PageKey = "facility-eco-printing", RouteTemplate = "/{lang}/about/facility/eco-printing", HasRichBody = false, IsIndexable = true, CreatedAt = SeedAt },
        new() { Id = 9, PageKey = "facility-post-press", RouteTemplate = "/{lang}/about/facility/post-press", HasRichBody = false, IsIndexable = true, CreatedAt = SeedAt },
        new() { Id = 10, PageKey = "facility-quality", RouteTemplate = "/{lang}/about/facility/quality", HasRichBody = false, IsIndexable = true, CreatedAt = SeedAt },
        new() { Id = 11, PageKey = "facility-tour", RouteTemplate = "/{lang}/about/facility/tour", HasRichBody = false, IsIndexable = true, CreatedAt = SeedAt },
        new() { Id = 12, PageKey = "solutions", RouteTemplate = "/{lang}/solutions", HasRichBody = false, IsIndexable = true, CreatedAt = SeedAt },
        new() { Id = 13, PageKey = "projects", RouteTemplate = "/{lang}/projects", HasRichBody = false, IsIndexable = true, CreatedAt = SeedAt },
        new() { Id = 14, PageKey = "sustainability-hub", RouteTemplate = "/{lang}/sustainability", HasRichBody = false, IsIndexable = true, CreatedAt = SeedAt },
        new() { Id = 15, PageKey = "green-our-advantage", RouteTemplate = "/{lang}/sustainability/our-advantage", HasRichBody = false, IsIndexable = true, CreatedAt = SeedAt },
        new() { Id = 16, PageKey = "green-carbon", RouteTemplate = "/{lang}/sustainability/carbon-efficiency", HasRichBody = false, IsIndexable = true, CreatedAt = SeedAt },
        new() { Id = 17, PageKey = "green-materials", RouteTemplate = "/{lang}/sustainability/eco-materials", HasRichBody = false, IsIndexable = true, CreatedAt = SeedAt },
        new() { Id = 18, PageKey = "green-esg", RouteTemplate = "/{lang}/sustainability/esg", HasRichBody = false, IsIndexable = true, CreatedAt = SeedAt },
        new() { Id = 19, PageKey = "green-csr", RouteTemplate = "/{lang}/sustainability/csr", HasRichBody = true, IsIndexable = false, CreatedAt = SeedAt },
        new() { Id = 20, PageKey = "insights", RouteTemplate = "/{lang}/insights", HasRichBody = false, IsIndexable = true, CreatedAt = SeedAt },
        new() { Id = 21, PageKey = "news-list", RouteTemplate = "/{lang}/insights/news", HasRichBody = false, IsIndexable = true, CreatedAt = SeedAt },
        new() { Id = 22, PageKey = "green-vlog", RouteTemplate = "/{lang}/insights/green-vlog", HasRichBody = false, IsIndexable = true, CreatedAt = SeedAt },
        new() { Id = 23, PageKey = "faq", RouteTemplate = "/{lang}/insights/faq", HasRichBody = false, IsIndexable = true, CreatedAt = SeedAt },
        new() { Id = 24, PageKey = "industry-trends", RouteTemplate = "/{lang}/insights/industry-trends", HasRichBody = false, IsIndexable = true, CreatedAt = SeedAt },
        new() { Id = 25, PageKey = "careers", RouteTemplate = "/{lang}/careers", HasRichBody = false, IsIndexable = true, CreatedAt = SeedAt },
        new() { Id = 26, PageKey = "supplier-area", RouteTemplate = "/{lang}/supplier-area", HasRichBody = false, IsIndexable = true, CreatedAt = SeedAt },
        new() { Id = 27, PageKey = "contact", RouteTemplate = "/{lang}/contact", HasRichBody = false, IsIndexable = true, CreatedAt = SeedAt },
        new() { Id = 28, PageKey = "get-a-quote", RouteTemplate = "/{lang}/get-a-quote", HasRichBody = false, IsIndexable = true, CreatedAt = SeedAt },
        new() { Id = 29, PageKey = "privacy-legal", RouteTemplate = "/{lang}/privacy-legal", HasRichBody = true, IsIndexable = true, CreatedAt = SeedAt },
    ];

    /// <summary>固定頁的中英 slug，共 58 列。SEO 標題與描述一律留 NULL 由後台填。</summary>
    public static readonly PageI18n[] PageI18ns =
    [
        new() { PageId = 1, Lang = "en", Slug = "home" },
        new() { PageId = 1, Lang = "zh", Slug = "home" },
        new() { PageId = 2, Lang = "en", Slug = "about" },
        new() { PageId = 2, Lang = "zh", Slug = "about" },
        new() { PageId = 3, Lang = "en", Slug = "difference" },
        new() { PageId = 3, Lang = "zh", Slug = "difference" },
        new() { PageId = 4, Lang = "en", Slug = "benefits" },
        new() { PageId = 4, Lang = "zh", Slug = "benefits" },
        new() { PageId = 5, Lang = "en", Slug = "certifications" },
        new() { PageId = 5, Lang = "zh", Slug = "certifications" },
        new() { PageId = 6, Lang = "en", Slug = "facility" },
        new() { PageId = 6, Lang = "zh", Slug = "facility" },
        new() { PageId = 7, Lang = "en", Slug = "pre-press" },
        new() { PageId = 7, Lang = "zh", Slug = "pre-press" },
        new() { PageId = 8, Lang = "en", Slug = "eco-printing" },
        new() { PageId = 8, Lang = "zh", Slug = "eco-printing" },
        new() { PageId = 9, Lang = "en", Slug = "post-press" },
        new() { PageId = 9, Lang = "zh", Slug = "post-press" },
        new() { PageId = 10, Lang = "en", Slug = "quality" },
        new() { PageId = 10, Lang = "zh", Slug = "quality" },
        new() { PageId = 11, Lang = "en", Slug = "tour" },
        new() { PageId = 11, Lang = "zh", Slug = "tour" },
        new() { PageId = 12, Lang = "en", Slug = "solutions" },
        new() { PageId = 12, Lang = "zh", Slug = "solutions" },
        new() { PageId = 13, Lang = "en", Slug = "projects" },
        new() { PageId = 13, Lang = "zh", Slug = "projects" },
        new() { PageId = 14, Lang = "en", Slug = "sustainability" },
        new() { PageId = 14, Lang = "zh", Slug = "sustainability" },
        new() { PageId = 15, Lang = "en", Slug = "our-advantage" },
        new() { PageId = 15, Lang = "zh", Slug = "our-advantage" },
        new() { PageId = 16, Lang = "en", Slug = "carbon-efficiency" },
        new() { PageId = 16, Lang = "zh", Slug = "carbon-efficiency" },
        new() { PageId = 17, Lang = "en", Slug = "eco-materials" },
        new() { PageId = 17, Lang = "zh", Slug = "eco-materials" },
        new() { PageId = 18, Lang = "en", Slug = "esg" },
        new() { PageId = 18, Lang = "zh", Slug = "esg" },
        new() { PageId = 19, Lang = "en", Slug = "csr" },
        new() { PageId = 19, Lang = "zh", Slug = "csr" },
        new() { PageId = 20, Lang = "en", Slug = "insights" },
        new() { PageId = 20, Lang = "zh", Slug = "insights" },
        new() { PageId = 21, Lang = "en", Slug = "news" },
        new() { PageId = 21, Lang = "zh", Slug = "news" },
        new() { PageId = 22, Lang = "en", Slug = "green-vlog" },
        new() { PageId = 22, Lang = "zh", Slug = "green-vlog" },
        new() { PageId = 23, Lang = "en", Slug = "faq" },
        new() { PageId = 23, Lang = "zh", Slug = "faq" },
        new() { PageId = 24, Lang = "en", Slug = "industry-trends" },
        new() { PageId = 24, Lang = "zh", Slug = "industry-trends" },
        new() { PageId = 25, Lang = "en", Slug = "careers" },
        new() { PageId = 25, Lang = "zh", Slug = "careers" },
        new() { PageId = 26, Lang = "en", Slug = "supplier-area" },
        new() { PageId = 26, Lang = "zh", Slug = "supplier-area" },
        new() { PageId = 27, Lang = "en", Slug = "contact" },
        new() { PageId = 27, Lang = "zh", Slug = "contact" },
        new() { PageId = 28, Lang = "en", Slug = "get-a-quote" },
        new() { PageId = 28, Lang = "zh", Slug = "get-a-quote" },
        new() { PageId = 29, Lang = "en", Slug = "privacy-legal" },
        new() { PageId = 29, Lang = "zh", Slug = "privacy-legal" },
    ];

    /// <summary>
    /// 固定 4 筆方案（db/seed/150_solution.sql），後台不提供新增與刪除。
    /// 封面為佔位圖、預設未上架——素材與文案到位後由後台上架。
    /// </summary>
    public static readonly Solution[] Solutions =
    [
        new() { Id = 1, Code = "boxes", CoverImagePath = "solutions/_placeholder.webp", SortOrder = 10, IsPublished = false, CreatedAt = SeedAt },
        new() { Id = 2, Code = "cardboard", CoverImagePath = "solutions/_placeholder.webp", SortOrder = 20, IsPublished = false, CreatedAt = SeedAt },
        new() { Id = 3, Code = "uv", CoverImagePath = "solutions/_placeholder.webp", SortOrder = 30, IsPublished = false, CreatedAt = SeedAt },
        new() { Id = 4, Code = "other", CoverImagePath = "solutions/_placeholder.webp", SortOrder = 40, IsPublished = false, CreatedAt = SeedAt },
    ];

    public static readonly SolutionI18n[] SolutionI18ns =
    [
        new()
        {
            SolutionId = 1, Lang = "en",
            Name = "Color Box Packaging", H1 = "Custom Color Box Packaging",
            CoverAlt = "Custom color box packaging by NTI", Slug = "color-box-packaging",
        },
        new()
        {
            SolutionId = 1, Lang = "zh",
            Name = "彩盒包裝", H1 = "客製化彩盒包裝",
            CoverAlt = "NTI 客製化彩盒包裝成品", Slug = "color-box-packaging",
        },
        new()
        {
            SolutionId = 2, Lang = "en",
            Name = "Packaging Paperboard", H1 = "Custom Packaging Paperboard",
            CoverAlt = "Custom packaging paperboard by NTI", Slug = "packaging-paperboard",
        },
        new()
        {
            SolutionId = 2, Lang = "zh",
            Name = "包裝紙板", H1 = "客製化包裝紙板",
            CoverAlt = "NTI 客製化包裝紙板成品", Slug = "packaging-paperboard",
        },
        new()
        {
            SolutionId = 3, Lang = "en",
            Name = "UV Printing", H1 = "Eco-Friendly UV Printing",
            CoverAlt = "Eco-friendly UV printing by NTI", Slug = "uv-printing",
        },
        new()
        {
            SolutionId = 3, Lang = "zh",
            Name = "UV 印刷", H1 = "環保 UV 印刷",
            CoverAlt = "NTI 環保 UV 印刷成品", Slug = "uv-printing",
        },
        new()
        {
            SolutionId = 4, Lang = "en",
            Name = "Other Printing", H1 = "Other Printing Services",
            CoverAlt = "Other printing services by NTI", Slug = "other-printing",
        },
        new()
        {
            SolutionId = 4, Lang = "zh",
            Name = "其他印刷", H1 = "其他印刷服務",
            CoverAlt = "NTI 其他印刷服務成品", Slug = "other-printing",
        },
    ];
}
