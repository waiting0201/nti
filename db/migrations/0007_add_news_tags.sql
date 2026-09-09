/* =============================================================================
   0007_add_news_tags.sql  —  消息標籤（2026-09-09）
   -----------------------------------------------------------------------------
   後台單元 25。客戶 2026-09-08 的《網站建置 SEO 注意事項》把「標籤（tag）」列為
   CMS 應有的欄位；而 reference/現有網站盤點與內容遷移.md 的決策 D4 是
   「全部保留標籤體系並逐一 301 對應」——舊站有 100 個 /tag/* 封存頁。
   所以標籤在新站是有前台封存頁（/{語系}/news/tag/{slug}）的正式體系，
   不只是後台的一個欄位。

   ⚠ Tag.Slug 不分語系，與 News 不同（新聞的 slug 在 NewsI18n）。兩個理由：
     一是簡報明訂網址「避免使用中文」，中文標籤名沒辦法直接當網址；
     二是同一個 slug 兩語系共用，hreflang 是恆等式，不必查表配對。
     顯示名稱才分語系（TagI18n）。

   與 EF 那條路徑的 Api/Data/Migrations/*_AddNewsTags 一對一（schema 權威在那邊，
   見 db/README 與 docs/10 §8）。0002／0003 已套用於共享環境不得回頭修改，
   故本檔以 append-only 新增。

   套用後：表數 44 → 47、*I18n 16 → 17、外鍵 30 → 33、
           RolePermission 167 → 173 列（種子在 db/seed/110_role_permission.sql）。
   ============================================================================= */
SET NOCOUNT ON;
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET XACT_ABORT ON;
GO

BEGIN TRAN;

/* =============================================================================
   單元 25 tag — 標籤主檔
   ============================================================================= */
CREATE TABLE dbo.Tag (
    Id        INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Tag PRIMARY KEY,
    Slug      VARCHAR(160) NOT NULL,                                          -- 進網址：ASCII 小寫與連字號，不分語系
    SortOrder INT NOT NULL CONSTRAINT DF_Tag_SortOrder DEFAULT 0,
    IsActive  BIT NOT NULL CONSTRAINT DF_Tag_IsActive  DEFAULT 1,
    CreatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_Tag_CreatedAt DEFAULT SYSUTCDATETIME(),
    CreatedBy INT NULL,
    UpdatedAt DATETIME2(0) NULL,
    UpdatedBy INT NULL,
    IsDeleted BIT NOT NULL CONSTRAINT DF_Tag_IsDeleted DEFAULT 0
);
GO

/* Slug 是前台網址的唯一鍵。篩掉軟刪的列，否則刪掉再建同名標籤會撞唯一鍵。 */
CREATE UNIQUE INDEX UX_Tag_Slug ON dbo.Tag (Slug) WHERE IsDeleted = 0;
GO

CREATE INDEX IX_Tag_List ON dbo.Tag (IsDeleted, IsActive, SortOrder);
GO

CREATE TABLE dbo.TagI18n (
    TagId INT NOT NULL,
    Lang  VARCHAR(5) NOT NULL,
    Name  NVARCHAR(80) NOT NULL,
    CONSTRAINT PK_TagI18n PRIMARY KEY (TagId, Lang),
    CONSTRAINT FK_TagI18n_Tag FOREIGN KEY (TagId) REFERENCES dbo.Tag(Id),
    CONSTRAINT CK_TagI18n_Lang CHECK (Lang IN ('zh','en'))
);
GO

/* =============================================================================
   消息 × 標籤（多對多）
   -----------------------------------------------------------------------------
   News 端 CASCADE：消息硬刪時關聯跟著走。
   Tag  端 NO ACTION：標籤是軟刪的，硬砍會把別人的關聯一起帶走；後台刪標籤前
        會先擋下「仍有消息使用」（AdminTagHandler），這條 FK 是最後一道防線。
   ============================================================================= */
CREATE TABLE dbo.NewsTag (
    NewsId INT NOT NULL,
    TagId  INT NOT NULL,
    CONSTRAINT PK_NewsTag PRIMARY KEY (NewsId, TagId),
    CONSTRAINT FK_NewsTag_News FOREIGN KEY (NewsId) REFERENCES dbo.News(Id) ON DELETE CASCADE,
    CONSTRAINT FK_NewsTag_Tag  FOREIGN KEY (TagId)  REFERENCES dbo.Tag(Id)
);
GO

/* 封存頁的查詢是「給 TagId 找 News」，PK 的前導欄是 NewsId，那條吃不到。 */
CREATE INDEX IX_NewsTag_Tag ON dbo.NewsTag (TagId);
GO

COMMIT;
GO

IF NOT EXISTS (SELECT 1 FROM dbo.SchemaVersion WHERE ScriptName = N'0007_add_news_tags.sql')
    INSERT dbo.SchemaVersion (ScriptName) VALUES (N'0007_add_news_tags.sql');
GO
