/* =============================================================================
   0003_init_indexes.sql  —  索引
   =============================================================================
   來源：docs/08-database.md §5。

   Azure SQL Basic（5 DTU / 2 GB），索引寧缺勿濫。相對 08 §5 的四點調整：

   1. 移除 IX_Redirect_From —— 與 Redirect.FromPath 的 UNIQUE 完全重複。改由
      UX_Redirect_FromPath 一個索引同時提供唯一性與覆蓋（0002 已不宣告 inline UNIQUE）。
   2. 新增 UX_Vlog_MainFeature —— filtered unique index，由 DB 層保證「全站僅一支
      主打影片」（09 §05 原本只靠應用層）。
   3. 新增 4 條 FK 支撐索引：外鍵欄位若無索引，父表刪除／更新時會全表掃描子表。
   4. 新增 IX_NewsletterSubscriber_Status（預留表的後台清單）。

   ⚠ filtered index（WHERE 子句）要求建立時 QUOTED_IDENTIFIER 為 ON。
     除了檔頭的 SET，執行時也務必帶 sqlcmd -I。
   ============================================================================= */
SET NOCOUNT ON;
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET XACT_ABORT ON;
GO

/* --- slug 路由（前台每次詳細頁都會打）------------------------------------------
   刻意不含 IsDeleted：軟刪的內容仍永久佔用 slug。SEO 上舊網址不該被回收後
   指向不同內容，這是設計而非疏漏。 */
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'UX_NewsI18n_Lang_Slug' AND object_id = OBJECT_ID(N'dbo.NewsI18n'))
    CREATE UNIQUE INDEX UX_NewsI18n_Lang_Slug ON dbo.NewsI18n(Lang, Slug);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'UX_SolutionI18n_Lang_Slug' AND object_id = OBJECT_ID(N'dbo.SolutionI18n'))
    CREATE UNIQUE INDEX UX_SolutionI18n_Lang_Slug ON dbo.SolutionI18n(Lang, Slug);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'UX_PageI18n_Lang_Slug' AND object_id = OBJECT_ID(N'dbo.PageI18n'))
    CREATE UNIQUE INDEX UX_PageI18n_Lang_Slug ON dbo.PageI18n(Lang, Slug);
GO

/* --- 列表：上架 + 日期排序 --------------------------------------------------- */
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_News_List' AND object_id = OBJECT_ID(N'dbo.News'))
    CREATE INDEX IX_News_List ON dbo.News(IsDeleted, IsPublished, PublishDate DESC) INCLUDE (CategoryId, CoverImagePath);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_SupplierNotice_List' AND object_id = OBJECT_ID(N'dbo.SupplierNotice'))
    CREATE INDEX IX_SupplierNotice_List ON dbo.SupplierNotice(IsDeleted, IsPublished, NoticeDate DESC);
GO

/* --- 列表：上架 + 手動排序 --------------------------------------------------- */
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_Project_List' AND object_id = OBJECT_ID(N'dbo.Project'))
    CREATE INDEX IX_Project_List ON dbo.Project(IsDeleted, IsPublished, SortOrder);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_Certification_Home' AND object_id = OBJECT_ID(N'dbo.Certification'))
    CREATE INDEX IX_Certification_Home ON dbo.Certification(IsDeleted, IsPublished, ShowOnHome, SortOrder);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_HomeBanner_List' AND object_id = OBJECT_ID(N'dbo.HomeBanner'))
    CREATE INDEX IX_HomeBanner_List ON dbo.HomeBanner(IsDeleted, IsPublished, SortOrder);
GO

/* --- 分類主檔 ---------------------------------------------------------------- */
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_Category_Type' AND object_id = OBJECT_ID(N'dbo.Category'))
    CREATE INDEX IX_Category_Type ON dbo.Category(CategoryType, IsActive, SortOrder);
GO

/* --- 後台表單管理 ------------------------------------------------------------ */
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_Quote_Status' AND object_id = OBJECT_ID(N'dbo.QuoteRequest'))
    CREATE INDEX IX_Quote_Status ON dbo.QuoteRequest(Status, SubmittedAt DESC);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_Contact_Status' AND object_id = OBJECT_ID(N'dbo.ContactMessage'))
    CREATE INDEX IX_Contact_Status ON dbo.ContactMessage(Status, SubmittedAt DESC);
GO

/* --- 會員／轉址／稽核 -------------------------------------------------------- */
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_MemberToken_Lookup' AND object_id = OBJECT_ID(N'dbo.MemberToken'))
    CREATE INDEX IX_MemberToken_Lookup ON dbo.MemberToken(TokenHash) INCLUDE (MemberId, ExpiresAt, UsedAt);
GO
-- 取代 08 §5 的 IX_Redirect_From：同時做唯一性與覆蓋，middleware 查轉址只打這一個索引
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'UX_Redirect_FromPath' AND object_id = OBJECT_ID(N'dbo.Redirect'))
    CREATE UNIQUE INDEX UX_Redirect_FromPath ON dbo.Redirect(FromPath) INCLUDE (ToPath, StatusCode, IsActive);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_AuditLog_Entity' AND object_id = OBJECT_ID(N'dbo.AuditLog'))
    CREATE INDEX IX_AuditLog_Entity ON dbo.AuditLog(EntityName, EntityId, CreatedAt DESC);
GO

/* --- 新增：全站唯一的主打影片（08 §5 未涵蓋，09 §05 的業務規則）------------- */
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'UX_Vlog_MainFeature' AND object_id = OBJECT_ID(N'dbo.Vlog'))
    CREATE UNIQUE INDEX UX_Vlog_MainFeature ON dbo.Vlog(IsMainFeature)
        WHERE IsMainFeature = 1 AND IsDeleted = 0;
GO

/* --- 新增：外鍵支撐索引（避免父表刪改時全表掃描子表）------------------------ */
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_SolutionItem_Solution' AND object_id = OBJECT_ID(N'dbo.SolutionItem'))
    CREATE INDEX IX_SolutionItem_Solution ON dbo.SolutionItem(SolutionId, SortOrder);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_QuoteAttachment_Quote' AND object_id = OBJECT_ID(N'dbo.QuoteAttachment'))
    CREATE INDEX IX_QuoteAttachment_Quote ON dbo.QuoteAttachment(QuoteRequestId);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_Orders_Member' AND object_id = OBJECT_ID(N'dbo.Orders'))
    CREATE INDEX IX_Orders_Member ON dbo.Orders(MemberId, CreatedAt DESC);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_OrderProgress_Order' AND object_id = OBJECT_ID(N'dbo.OrderProgress'))
    CREATE INDEX IX_OrderProgress_Order ON dbo.OrderProgress(OrderId, HappenedAt);
GO

/* --- 新增：預留的電子報後台清單 ---------------------------------------------- */
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_NewsletterSubscriber_Status' AND object_id = OBJECT_ID(N'dbo.NewsletterSubscriber'))
    CREATE INDEX IX_NewsletterSubscriber_Status ON dbo.NewsletterSubscriber(Status, SubscribedAt DESC)
        INCLUDE (Email, PreferredLang);
GO

IF NOT EXISTS (SELECT 1 FROM dbo.SchemaVersion WHERE ScriptName = N'0003_init_indexes.sql')
    INSERT dbo.SchemaVersion (ScriptName) VALUES (N'0003_init_indexes.sql');
GO
