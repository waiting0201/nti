/* =============================================================================
   0002_init_schema.sql  —  NTI 官網 schema（48 張表）
   =============================================================================
   來源：docs/08-database.md §4（設計）+ docs/09-cms-admin.md §2（後台單元對照）

   本檔的區段順序 = 建表依賴順序（拓撲序），區段標題同時標出 docs/09 的
   「後台單元代號」與 docs/08 的節次，方便雙向追溯。

   與 docs/08 §4 的四點差異（皆為「讓腳本可執行」與「跨環境安全」的必要調整）：

   1. 稽核五欄：08 §4 以單行 `/* audit */` 佔位，此處全部展開。
   2. 約束一律具名（PK_ / FK_ / UQ_ / CK_ / DF_）。08 §4 的 PK、FK、DEFAULT 多為
      匿名 inline，SQL Server 會產生帶隨機 hash 的名稱（DF__HomeBanner__Sort__1B0907CE），
      **每個環境都不同** → 未來要 DROP CONSTRAINT 改預設值時，dev 能跑的 migration
      會在 prod 炸掉。
   3. Member / MemberToken 上移至 QuoteRequest 之前（08 §4.12 的建表順序警語）。
   4. Category 型別安全：Category 是唯一的橫向共用主檔（九種 CategoryType 服務
      八個內容單元 + 報價表單）。單純的 FK 只保證「分類存在」，不保證「型別正確」
      —— News.CategoryId 可以指到 CategoryType='Facility' 的列而不被擋下。
      此處在每個引用端加一個 PERSISTED 常數計算欄（*TypeGuard），與 CategoryId
      組成複合 FK 指向 Category(Id, CategoryType)，由 DB 層保證型別正確。
      計算欄為常數、不佔維護成本；CategoryId 可為 NULL 時複合 FK 自動不檢查
      （SQL Server 的 MATCH SIMPLE 語意），故不影響選填分類的單元。

   三個「待客戶確認」缺口（docs/09 §2.1）已預留 schema，各處以
   `-- 預留（待客戶確認）` 標記：電子報 NewsletterSubscriber、
   首頁 Banner 影片 HomeBanner.MediaType/VideoPath、CSR 頁（見 db/seed/140_page.sql）。
   ============================================================================= */
SET NOCOUNT ON;
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET XACT_ABORT ON;
GO

/* =============================================================================
   單元 23 admin ／ 24 audit — 系統（08 §4.14）
   ============================================================================= */

IF OBJECT_ID(N'dbo.Role', N'U') IS NULL
CREATE TABLE dbo.Role (
    Id       INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Role PRIMARY KEY,
    Code     VARCHAR(30)  NOT NULL,                                              -- SuperAdmin|Editor|Viewer
    Name     NVARCHAR(60) NOT NULL,
    IsSystem BIT NOT NULL CONSTRAINT DF_Role_IsSystem DEFAULT 0,                 -- 系統角色不可刪
    CONSTRAINT UQ_Role_Code UNIQUE (Code)
);
GO

IF OBJECT_ID(N'dbo.RolePermission', N'U') IS NULL
CREATE TABLE dbo.RolePermission (
    RoleId         INT NOT NULL,
    PermissionCode VARCHAR(60) NOT NULL,                                         -- {單元代號}.{view|edit|publish|delete|export|download|resend}
    CONSTRAINT PK_RolePermission PRIMARY KEY (RoleId, PermissionCode),
    CONSTRAINT FK_RolePermission_Role FOREIGN KEY (RoleId) REFERENCES dbo.Role(Id)
);
GO

IF OBJECT_ID(N'dbo.AdminUser', N'U') IS NULL
CREATE TABLE dbo.AdminUser (
    Id                 INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_AdminUser PRIMARY KEY,
    Email              NVARCHAR(160) NOT NULL,
    PasswordHash       NVARCHAR(200) NOT NULL,                                   -- ASP.NET Core Identity V3 (PBKDF2)，salt 內含
    DisplayName        NVARCHAR(80)  NOT NULL,
    RoleId             INT NOT NULL,
    IsActive           BIT     NOT NULL CONSTRAINT DF_AdminUser_IsActive DEFAULT 1,
    LastLoginAt        DATETIME2(0) NULL,
    FailedLoginCount   TINYINT NOT NULL CONSTRAINT DF_AdminUser_FailedLoginCount DEFAULT 0,  -- 連續 5 次鎖 15 分鐘（09 §23）
    LockoutEndAt       DATETIME2(0) NULL,
    MustChangePassword BIT     NOT NULL CONSTRAINT DF_AdminUser_MustChangePassword DEFAULT 1,
    CreatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_AdminUser_CreatedAt DEFAULT SYSUTCDATETIME(),
    CreatedBy INT NULL,
    UpdatedAt DATETIME2(0) NULL,
    UpdatedBy INT NULL,
    IsDeleted BIT NOT NULL CONSTRAINT DF_AdminUser_IsDeleted DEFAULT 0,
    CONSTRAINT UQ_AdminUser_Email UNIQUE (Email),
    CONSTRAINT FK_AdminUser_Role  FOREIGN KEY (RoleId) REFERENCES dbo.Role(Id)
);
GO

IF OBJECT_ID(N'dbo.AuditLog', N'U') IS NULL
CREATE TABLE dbo.AuditLog (
    Id          BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_AuditLog PRIMARY KEY,
    AdminUserId INT NULL,                                                        -- 刻意不建 FK（08 §2.3）
    Action      VARCHAR(20) NOT NULL,                                            -- Create|Update|Delete|Publish|Login|Export
    EntityName  VARCHAR(60) NOT NULL,
    EntityId    INT NULL,
    ChangesJson NVARCHAR(MAX) NULL,                                              -- { field: [before, after] }
    SourceIp    VARCHAR(45) NULL,
    CreatedAt   DATETIME2(0) NOT NULL CONSTRAINT DF_AuditLog_CreatedAt DEFAULT SYSUTCDATETIME()
);
GO

IF OBJECT_ID(N'dbo.EmailLog', N'U') IS NULL
CREATE TABLE dbo.EmailLog (
    Id            BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_EmailLog PRIMARY KEY,
    MailType      VARCHAR(30)  NOT NULL,                                         -- QuoteNotify|QuoteConfirm|ContactNotify|MemberVerify|PasswordReset
    ToAddress     NVARCHAR(300) NOT NULL,
    Subject       NVARCHAR(250) NOT NULL,
    RelatedEntity VARCHAR(60) NULL,
    RelatedId     INT NULL,
    Status        VARCHAR(10) NOT NULL,                                          -- Sent|Failed
    ErrorMessage  NVARCHAR(1000) NULL,
    SentAt        DATETIME2(0) NOT NULL CONSTRAINT DF_EmailLog_SentAt DEFAULT SYSUTCDATETIME()
);
GO

/* =============================================================================
   單元 22 category — 分類主檔（08 §4.1）
   -----------------------------------------------------------------------------
   全 schema 唯一的橫向共用主檔：一表九用。UQ_Category_Id_Type 是給下游各表的
   複合 FK 用的（見本檔頂端說明第 4 點），不是業務唯一鍵。
   ============================================================================= */

IF OBJECT_ID(N'dbo.Category', N'U') IS NULL
CREATE TABLE dbo.Category (
    Id           INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Category PRIMARY KEY,
    CategoryType VARCHAR(30) NOT NULL,                                           -- News|Project|Vlog|Faq|Certification|Facility|SupplierNotice|Industry|QuoteMaterial
    Code         VARCHAR(40) NOT NULL,                                           -- 程式用固定碼，建立後不可改
    SortOrder    INT NOT NULL CONSTRAINT DF_Category_SortOrder DEFAULT 0,
    IsActive     BIT NOT NULL CONSTRAINT DF_Category_IsActive  DEFAULT 1,
    CreatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_Category_CreatedAt DEFAULT SYSUTCDATETIME(),
    CreatedBy INT NULL,
    UpdatedAt DATETIME2(0) NULL,
    UpdatedBy INT NULL,
    IsDeleted BIT NOT NULL CONSTRAINT DF_Category_IsDeleted DEFAULT 0,
    CONSTRAINT UQ_Category_Type_Code UNIQUE (CategoryType, Code),
    CONSTRAINT UQ_Category_Id_Type   UNIQUE (Id, CategoryType),                  -- 供下游複合 FK 參照
    CONSTRAINT CK_Category_Type CHECK (CategoryType IN
        ('News','Project','Vlog','Faq','Certification','Facility','SupplierNotice','Industry','QuoteMaterial'))
);
GO

IF OBJECT_ID(N'dbo.CategoryI18n', N'U') IS NULL
CREATE TABLE dbo.CategoryI18n (
    CategoryId INT NOT NULL,
    Lang       VARCHAR(5) NOT NULL,
    Name       NVARCHAR(80) NOT NULL,
    CONSTRAINT PK_CategoryI18n PRIMARY KEY (CategoryId, Lang),
    CONSTRAINT FK_CategoryI18n_Category FOREIGN KEY (CategoryId) REFERENCES dbo.Category(Id),
    CONSTRAINT CK_CategoryI18n_Lang CHECK (Lang IN ('zh','en'))
);
GO

/* =============================================================================
   單元 21 setting — 全站設定（08 §4.1）
   -----------------------------------------------------------------------------
   key-value 表，是全 schema 唯一不用 *I18n 側表、改用橫向 ValueZh/ValueEn 的例外。
   固定 key 清單見 db/seed/130_site_setting.sql。
   ============================================================================= */

IF OBJECT_ID(N'dbo.SiteSetting', N'U') IS NULL
CREATE TABLE dbo.SiteSetting (
    SettingKey  VARCHAR(60) NOT NULL CONSTRAINT PK_SiteSetting PRIMARY KEY,
    GroupName   VARCHAR(30) NOT NULL,                                            -- Company|Social|Home|Mail
    ValueType   VARCHAR(10) NOT NULL,                                            -- text|multiline|image|url|email|html
    IsLocalized BIT NOT NULL CONSTRAINT DF_SiteSetting_IsLocalized DEFAULT 0,
    ValueZh     NVARCHAR(MAX) NULL,
    ValueEn     NVARCHAR(MAX) NULL,
    SortOrder   INT NOT NULL CONSTRAINT DF_SiteSetting_SortOrder DEFAULT 0,
    UpdatedAt   DATETIME2(0) NULL,
    UpdatedBy   INT NULL,
    CONSTRAINT CK_SiteSetting_Group CHECK (GroupName IN ('Company','Social','Home','Mail'))
);
GO

/* =============================================================================
   單元 01 home-banner — 首頁 Banner（08 §4.2）
   -----------------------------------------------------------------------------
   首頁 What We Do（4 格）、Why global brands choose NTI?（6 格）、形象圖帶標語
   皆為品牌簡報定案的固定文案 → 不入庫（決議 3）。形象圖走 SiteSetting['home.gallery_image']。
   ============================================================================= */

IF OBJECT_ID(N'dbo.HomeBanner', N'U') IS NULL
CREATE TABLE dbo.HomeBanner (
    Id              INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_HomeBanner PRIMARY KEY,
    ImagePath       NVARCHAR(260) NOT NULL,                                      -- 桌機圖；MediaType='video' 時兼作 poster 與行動裝置 fallback
    ImagePathMobile NVARCHAR(260) NULL,                                          -- 未填則用桌機圖
    -- 預留（待客戶確認）：影片型 Banner，docs/09 §2.1 缺口三
    MediaType       VARCHAR(10)   NOT NULL CONSTRAINT DF_HomeBanner_MediaType DEFAULT 'image',
    VideoPath       NVARCHAR(260) NULL,                                          -- Blob 相對路徑，MP4(H.264) / WebM
    LinkUrl         NVARCHAR(300) NULL,                                          -- 站內相對路徑或外部 URL
    OpenInNewTab    BIT NOT NULL CONSTRAINT DF_HomeBanner_OpenInNewTab DEFAULT 0,
    SortOrder       INT NOT NULL CONSTRAINT DF_HomeBanner_SortOrder DEFAULT 0,
    IsPublished     BIT NOT NULL CONSTRAINT DF_HomeBanner_IsPublished DEFAULT 1,
    PublishAt       DATETIME2(0) NULL,
    UnpublishAt     DATETIME2(0) NULL,
    CreatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_HomeBanner_CreatedAt DEFAULT SYSUTCDATETIME(),
    CreatedBy INT NULL,
    UpdatedAt DATETIME2(0) NULL,
    UpdatedBy INT NULL,
    IsDeleted BIT NOT NULL CONSTRAINT DF_HomeBanner_IsDeleted DEFAULT 0,
    CONSTRAINT CK_HomeBanner_MediaType CHECK (MediaType IN ('image','video')),
    CONSTRAINT CK_HomeBanner_Video     CHECK (MediaType = 'image' OR VideoPath IS NOT NULL)
);
GO

IF OBJECT_ID(N'dbo.HomeBannerI18n', N'U') IS NULL
CREATE TABLE dbo.HomeBannerI18n (
    HomeBannerId INT NOT NULL,
    Lang         VARCHAR(5) NOT NULL,
    ImageAlt     NVARCHAR(200) NOT NULL,                                         -- MediaType='video' 時作為 <video> 的 aria-label
    CONSTRAINT PK_HomeBannerI18n PRIMARY KEY (HomeBannerId, Lang),
    CONSTRAINT FK_HomeBannerI18n_HomeBanner FOREIGN KEY (HomeBannerId) REFERENCES dbo.HomeBanner(Id),
    CONSTRAINT CK_HomeBannerI18n_Lang CHECK (Lang IN ('zh','en'))
);
GO

/* =============================================================================
   單元 02 solution — 客製化解決方案（08 §4.3）
   -----------------------------------------------------------------------------
   固定 4 筆（boxes/cardboard/uv/other），後台不提供新增／刪除。同時驅動首頁
   Printing Solutions 四張卡。筆數由 db/verify/verify.sql 斷言，不用 trigger 擋。
   ============================================================================= */

IF OBJECT_ID(N'dbo.Solution', N'U') IS NULL
CREATE TABLE dbo.Solution (
    Id             INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Solution PRIMARY KEY,
    Code           VARCHAR(30) NOT NULL,                                         -- boxes|cardboard|uv|other
    CoverImagePath NVARCHAR(260) NOT NULL,
    OgImagePath    NVARCHAR(260) NULL,                                           -- 未填沿用封面
    SortOrder      INT NOT NULL CONSTRAINT DF_Solution_SortOrder DEFAULT 0,
    IsPublished    BIT NOT NULL CONSTRAINT DF_Solution_IsPublished DEFAULT 1,
    PublishAt      DATETIME2(0) NULL,
    UnpublishAt    DATETIME2(0) NULL,
    CreatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_Solution_CreatedAt DEFAULT SYSUTCDATETIME(),
    CreatedBy INT NULL,
    UpdatedAt DATETIME2(0) NULL,
    UpdatedBy INT NULL,
    IsDeleted BIT NOT NULL CONSTRAINT DF_Solution_IsDeleted DEFAULT 0,
    CONSTRAINT UQ_Solution_Code UNIQUE (Code)
);
GO

IF OBJECT_ID(N'dbo.SolutionI18n', N'U') IS NULL
CREATE TABLE dbo.SolutionI18n (
    SolutionId     INT NOT NULL,
    Lang           VARCHAR(5) NOT NULL,
    Name           NVARCHAR(80)  NOT NULL,                                       -- Color Box Packaging
    H1             NVARCHAR(160) NOT NULL,                                       -- Custom Color Box Packaging
    Summary        NVARCHAR(300) NULL,                                           -- 首頁卡片／列表用短述
    IntroHtml      NVARCHAR(MAX) NULL,                                           -- 方案頁導言（富文本）
    CoverAlt       NVARCHAR(200) NOT NULL,
    Slug           NVARCHAR(160) NOT NULL,
    SeoTitle       NVARCHAR(70)  NULL,
    SeoDescription NVARCHAR(180) NULL,
    CanonicalUrl   NVARCHAR(300) NULL,
    OgTitle        NVARCHAR(90)  NULL,
    OgDescription  NVARCHAR(200) NULL,
    CONSTRAINT PK_SolutionI18n PRIMARY KEY (SolutionId, Lang),
    CONSTRAINT FK_SolutionI18n_Solution FOREIGN KEY (SolutionId) REFERENCES dbo.Solution(Id),
    CONSTRAINT CK_SolutionI18n_Lang CHECK (Lang IN ('zh','en'))
);
GO

IF OBJECT_ID(N'dbo.SolutionItem', N'U') IS NULL
CREATE TABLE dbo.SolutionItem (
    Id          INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_SolutionItem PRIMARY KEY,
    SolutionId  INT NOT NULL,
    ImagePath   NVARCHAR(260) NOT NULL,
    SortOrder   INT NOT NULL CONSTRAINT DF_SolutionItem_SortOrder DEFAULT 0,
    IsPublished BIT NOT NULL CONSTRAINT DF_SolutionItem_IsPublished DEFAULT 1,
    CreatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_SolutionItem_CreatedAt DEFAULT SYSUTCDATETIME(),
    CreatedBy INT NULL,
    UpdatedAt DATETIME2(0) NULL,
    UpdatedBy INT NULL,
    IsDeleted BIT NOT NULL CONSTRAINT DF_SolutionItem_IsDeleted DEFAULT 0,
    CONSTRAINT FK_SolutionItem_Solution FOREIGN KEY (SolutionId) REFERENCES dbo.Solution(Id)
);
GO

IF OBJECT_ID(N'dbo.SolutionItemI18n', N'U') IS NULL
CREATE TABLE dbo.SolutionItemI18n (
    SolutionItemId INT NOT NULL,
    Lang           VARCHAR(5) NOT NULL,
    Name           NVARCHAR(120) NOT NULL,
    Description    NVARCHAR(400) NULL,
    ImageAlt       NVARCHAR(200) NOT NULL,
    CONSTRAINT PK_SolutionItemI18n PRIMARY KEY (SolutionItemId, Lang),
    CONSTRAINT FK_SolutionItemI18n_SolutionItem FOREIGN KEY (SolutionItemId) REFERENCES dbo.SolutionItem(Id),
    CONSTRAINT CK_SolutionItemI18n_Lang CHECK (Lang IN ('zh','en'))
);
GO

/* =============================================================================
   單元 03 project — 案例實績（08 §4.4）
   -----------------------------------------------------------------------------
   無詳細頁（04-api.md 已移除 /projects/{slug}），故無 slug／SEO 欄位組。
   projects.html 的 Industries / Applications 十項清單由 Category(Industry) 提供，
   與報價表單的產業下拉共用同一份主檔。
   ============================================================================= */

IF OBJECT_ID(N'dbo.Project', N'U') IS NULL
CREATE TABLE dbo.Project (
    Id          INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Project PRIMARY KEY,
    CategoryId  INT NOT NULL,
    CategoryTypeGuard AS CAST('Project' AS VARCHAR(30)) PERSISTED,               -- 型別安全用常數欄，見檔頭說明 4
    ImagePath   NVARCHAR(260) NOT NULL,
    VideoUrl    NVARCHAR(300) NULL,                                              -- 有值才顯示播放圖示
    StatValue   NVARCHAR(20)  NULL,                                              -- 卡片大數字，如 -32%
    SortOrder   INT NOT NULL CONSTRAINT DF_Project_SortOrder DEFAULT 0,
    IsPublished BIT NOT NULL CONSTRAINT DF_Project_IsPublished DEFAULT 1,
    PublishAt   DATETIME2(0) NULL,
    UnpublishAt DATETIME2(0) NULL,
    CreatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_Project_CreatedAt DEFAULT SYSUTCDATETIME(),
    CreatedBy INT NULL,
    UpdatedAt DATETIME2(0) NULL,
    UpdatedBy INT NULL,
    IsDeleted BIT NOT NULL CONSTRAINT DF_Project_IsDeleted DEFAULT 0,
    CONSTRAINT FK_Project_Category FOREIGN KEY (CategoryId, CategoryTypeGuard)
        REFERENCES dbo.Category(Id, CategoryType)
);
GO

IF OBJECT_ID(N'dbo.ProjectI18n', N'U') IS NULL
CREATE TABLE dbo.ProjectI18n (
    ProjectId INT NOT NULL,
    Lang      VARCHAR(5) NOT NULL,
    Title     NVARCHAR(200) NOT NULL,
    Summary   NVARCHAR(400) NULL,
    StatLabel NVARCHAR(60)  NULL,                                                -- carbon / unit
    ImageAlt  NVARCHAR(200) NOT NULL,
    CONSTRAINT PK_ProjectI18n PRIMARY KEY (ProjectId, Lang),
    CONSTRAINT FK_ProjectI18n_Project FOREIGN KEY (ProjectId) REFERENCES dbo.Project(Id),
    CONSTRAINT CK_ProjectI18n_Lang CHECK (Lang IN ('zh','en'))
);
GO

/* =============================================================================
   單元 04 news — 最新消息（08 §4.5）
   ============================================================================= */

IF OBJECT_ID(N'dbo.News', N'U') IS NULL
CREATE TABLE dbo.News (
    Id             INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_News PRIMARY KEY,
    CategoryId     INT NOT NULL,
    CategoryTypeGuard AS CAST('News' AS VARCHAR(30)) PERSISTED,
    PublishDate    DATE NOT NULL,                                                -- 顯示用日期（2026.03.13）
    CoverImagePath NVARCHAR(260) NOT NULL,
    OgImagePath    NVARCHAR(260) NULL,                                           -- 未填沿用封面
    IsFeaturedHome BIT NOT NULL CONSTRAINT DF_News_IsFeaturedHome DEFAULT 0,     -- 是否上首頁／Insights 精選
    IsPublished    BIT NOT NULL CONSTRAINT DF_News_IsPublished DEFAULT 0,
    PublishAt      DATETIME2(0) NULL,
    UnpublishAt    DATETIME2(0) NULL,
    CreatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_News_CreatedAt DEFAULT SYSUTCDATETIME(),
    CreatedBy INT NULL,
    UpdatedAt DATETIME2(0) NULL,
    UpdatedBy INT NULL,
    IsDeleted BIT NOT NULL CONSTRAINT DF_News_IsDeleted DEFAULT 0,
    CONSTRAINT FK_News_Category FOREIGN KEY (CategoryId, CategoryTypeGuard)
        REFERENCES dbo.Category(Id, CategoryType)
);
GO

IF OBJECT_ID(N'dbo.NewsI18n', N'U') IS NULL
CREATE TABLE dbo.NewsI18n (
    NewsId         INT NOT NULL,
    Lang           VARCHAR(5) NOT NULL,
    Title          NVARCHAR(250) NOT NULL,                                       -- 同時作為 H1
    Summary        NVARCHAR(500) NULL,                                           -- 列表摘要 + 詳細頁導言
    BodyHtml       NVARCHAR(MAX) NOT NULL,                                       -- 富文本（含小標、段落、內文圖）
    CoverAlt       NVARCHAR(200) NOT NULL,
    Slug           NVARCHAR(160) NOT NULL,
    SeoTitle       NVARCHAR(70)  NULL,
    SeoDescription NVARCHAR(180) NULL,
    CanonicalUrl   NVARCHAR(300) NULL,
    OgTitle        NVARCHAR(90)  NULL,
    OgDescription  NVARCHAR(200) NULL,
    CONSTRAINT PK_NewsI18n PRIMARY KEY (NewsId, Lang),
    CONSTRAINT FK_NewsI18n_News FOREIGN KEY (NewsId) REFERENCES dbo.News(Id),
    CONSTRAINT CK_NewsI18n_Lang CHECK (Lang IN ('zh','en'))
);
GO

/* =============================================================================
   單元 05 vlog — Green Vlog（08 §4.6）
   -----------------------------------------------------------------------------
   無詳細頁，外連 YouTube。IsMainFeature 全站僅一支，由 0003 的
   filtered unique index UX_Vlog_MainFeature 在 DB 層保證。
   ============================================================================= */

IF OBJECT_ID(N'dbo.Vlog', N'U') IS NULL
CREATE TABLE dbo.Vlog (
    Id                INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Vlog PRIMARY KEY,
    CategoryId        INT NOT NULL,
    CategoryTypeGuard AS CAST('Vlog' AS VARCHAR(30)) PERSISTED,
    YoutubeId         VARCHAR(20) NOT NULL,                                      -- 只存 ID，前端組 embed / thumb URL
    ThumbOverridePath NVARCHAR(260) NULL,                                        -- 未填自動取 YouTube hqdefault
    IsMainFeature     BIT NOT NULL CONSTRAINT DF_Vlog_IsMainFeature DEFAULT 0,   -- 頁面頂部大播放器（僅一支）
    SortOrder         INT NOT NULL CONSTRAINT DF_Vlog_SortOrder DEFAULT 0,
    IsPublished       BIT NOT NULL CONSTRAINT DF_Vlog_IsPublished DEFAULT 1,
    PublishAt         DATETIME2(0) NULL,
    UnpublishAt       DATETIME2(0) NULL,
    CreatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_Vlog_CreatedAt DEFAULT SYSUTCDATETIME(),
    CreatedBy INT NULL,
    UpdatedAt DATETIME2(0) NULL,
    UpdatedBy INT NULL,
    IsDeleted BIT NOT NULL CONSTRAINT DF_Vlog_IsDeleted DEFAULT 0,
    CONSTRAINT FK_Vlog_Category FOREIGN KEY (CategoryId, CategoryTypeGuard)
        REFERENCES dbo.Category(Id, CategoryType)
);
GO

IF OBJECT_ID(N'dbo.VlogI18n', N'U') IS NULL
CREATE TABLE dbo.VlogI18n (
    VlogId      INT NOT NULL,
    Lang        VARCHAR(5) NOT NULL,
    Title       NVARCHAR(200) NOT NULL,
    Description NVARCHAR(400) NULL,
    CONSTRAINT PK_VlogI18n PRIMARY KEY (VlogId, Lang),
    CONSTRAINT FK_VlogI18n_Vlog FOREIGN KEY (VlogId) REFERENCES dbo.Vlog(Id),
    CONSTRAINT CK_VlogI18n_Lang CHECK (Lang IN ('zh','en'))
);
GO

/* =============================================================================
   單元 06 faq ／ 07 trend（08 §4.7）
   ============================================================================= */

IF OBJECT_ID(N'dbo.Faq', N'U') IS NULL
CREATE TABLE dbo.Faq (
    Id                INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Faq PRIMARY KEY,
    CategoryId        INT NULL,                                                  -- 可不分組；NULL 時複合 FK 自動不檢查
    CategoryTypeGuard AS CAST('Faq' AS VARCHAR(30)) PERSISTED,
    SortOrder         INT NOT NULL CONSTRAINT DF_Faq_SortOrder DEFAULT 0,
    IsPublished       BIT NOT NULL CONSTRAINT DF_Faq_IsPublished DEFAULT 1,
    CreatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_Faq_CreatedAt DEFAULT SYSUTCDATETIME(),
    CreatedBy INT NULL,
    UpdatedAt DATETIME2(0) NULL,
    UpdatedBy INT NULL,
    IsDeleted BIT NOT NULL CONSTRAINT DF_Faq_IsDeleted DEFAULT 0,
    CONSTRAINT FK_Faq_Category FOREIGN KEY (CategoryId, CategoryTypeGuard)
        REFERENCES dbo.Category(Id, CategoryType)
);
GO

IF OBJECT_ID(N'dbo.FaqI18n', N'U') IS NULL
CREATE TABLE dbo.FaqI18n (
    FaqId      INT NOT NULL,
    Lang       VARCHAR(5) NOT NULL,
    Question   NVARCHAR(300) NOT NULL,
    AnswerHtml NVARCHAR(MAX) NOT NULL,
    CONSTRAINT PK_FaqI18n PRIMARY KEY (FaqId, Lang),
    CONSTRAINT FK_FaqI18n_Faq FOREIGN KEY (FaqId) REFERENCES dbo.Faq(Id),
    CONSTRAINT CK_FaqI18n_Lang CHECK (Lang IN ('zh','en'))
);
GO

IF OBJECT_ID(N'dbo.IndustryTrend', N'U') IS NULL
CREATE TABLE dbo.IndustryTrend (
    Id          INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_IndustryTrend PRIMARY KEY,
    SortOrder   INT NOT NULL CONSTRAINT DF_IndustryTrend_SortOrder DEFAULT 0,
    IsPublished BIT NOT NULL CONSTRAINT DF_IndustryTrend_IsPublished DEFAULT 1,
    PublishAt   DATETIME2(0) NULL,
    UnpublishAt DATETIME2(0) NULL,
    CreatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_IndustryTrend_CreatedAt DEFAULT SYSUTCDATETIME(),
    CreatedBy INT NULL,
    UpdatedAt DATETIME2(0) NULL,
    UpdatedBy INT NULL,
    IsDeleted BIT NOT NULL CONSTRAINT DF_IndustryTrend_IsDeleted DEFAULT 0
);
GO

IF OBJECT_ID(N'dbo.IndustryTrendI18n', N'U') IS NULL
CREATE TABLE dbo.IndustryTrendI18n (
    IndustryTrendId INT NOT NULL,
    Lang            VARCHAR(5) NOT NULL,
    Title           NVARCHAR(200) NOT NULL,
    BodyHtml        NVARCHAR(MAX) NOT NULL,
    CONSTRAINT PK_IndustryTrendI18n PRIMARY KEY (IndustryTrendId, Lang),
    CONSTRAINT FK_IndustryTrendI18n_IndustryTrend FOREIGN KEY (IndustryTrendId) REFERENCES dbo.IndustryTrend(Id),
    CONSTRAINT CK_IndustryTrendI18n_Lang CHECK (Lang IN ('zh','en'))
);
GO

/* =============================================================================
   單元 08 certification ／ 09 client ／ 10 facility（08 §4.8）
   ============================================================================= */

IF OBJECT_ID(N'dbo.Certification', N'U') IS NULL
CREATE TABLE dbo.Certification (
    Id                INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Certification PRIMARY KEY,
    CategoryId        INT NULL,                                                  -- 認證／夥伴／獎項
    CategoryTypeGuard AS CAST('Certification' AS VARCHAR(30)) PERSISTED,
    LogoPath          NVARCHAR(260) NOT NULL,                                    -- 去背 PNG／SVG（向量原檔待客戶提供，09 §3）
    LinkUrl           NVARCHAR(300) NULL,
    ShowOnHome        BIT NOT NULL CONSTRAINT DF_Certification_ShowOnHome DEFAULT 1,  -- 是否列入首頁 Proof 牆
    SortOrder         INT NOT NULL CONSTRAINT DF_Certification_SortOrder DEFAULT 0,
    IsPublished       BIT NOT NULL CONSTRAINT DF_Certification_IsPublished DEFAULT 1,
    CreatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_Certification_CreatedAt DEFAULT SYSUTCDATETIME(),
    CreatedBy INT NULL,
    UpdatedAt DATETIME2(0) NULL,
    UpdatedBy INT NULL,
    IsDeleted BIT NOT NULL CONSTRAINT DF_Certification_IsDeleted DEFAULT 0,
    CONSTRAINT FK_Certification_Category FOREIGN KEY (CategoryId, CategoryTypeGuard)
        REFERENCES dbo.Category(Id, CategoryType)
);
GO

IF OBJECT_ID(N'dbo.CertificationI18n', N'U') IS NULL
CREATE TABLE dbo.CertificationI18n (
    CertificationId INT NOT NULL,
    Lang            VARCHAR(5) NOT NULL,
    Name            NVARCHAR(120) NOT NULL,
    Description     NVARCHAR(400) NULL,
    LogoAlt         NVARCHAR(200) NOT NULL,
    CONSTRAINT PK_CertificationI18n PRIMARY KEY (CertificationId, Lang),
    CONSTRAINT FK_CertificationI18n_Certification FOREIGN KEY (CertificationId) REFERENCES dbo.Certification(Id),
    CONSTRAINT CK_CertificationI18n_Lang CHECK (Lang IN ('zh','en'))
);
GO

-- 客戶 logo 輪播：品牌名不翻譯，刻意無 i18n 側表（Name 兼作 alt）
IF OBJECT_ID(N'dbo.ClientLogo', N'U') IS NULL
CREATE TABLE dbo.ClientLogo (
    Id          INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_ClientLogo PRIMARY KEY,
    Name        NVARCHAR(120) NOT NULL,                                          -- 同時作為 alt
    LogoPath    NVARCHAR(260) NOT NULL,                                          -- 去背 PNG／SVG
    LinkUrl     NVARCHAR(300) NULL,
    SortOrder   INT NOT NULL CONSTRAINT DF_ClientLogo_SortOrder DEFAULT 0,
    IsPublished BIT NOT NULL CONSTRAINT DF_ClientLogo_IsPublished DEFAULT 1,
    CreatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_ClientLogo_CreatedAt DEFAULT SYSUTCDATETIME(),
    CreatedBy INT NULL,
    UpdatedAt DATETIME2(0) NULL,
    UpdatedBy INT NULL,
    IsDeleted BIT NOT NULL CONSTRAINT DF_ClientLogo_IsDeleted DEFAULT 0
);
GO

-- Facility & Equipment 五個子頁的設備卡（印前／環保印刷／印後／品檢／導覽）
IF OBJECT_ID(N'dbo.FacilityItem', N'U') IS NULL
CREATE TABLE dbo.FacilityItem (
    Id                INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_FacilityItem PRIMARY KEY,
    CategoryId        INT NOT NULL,
    CategoryTypeGuard AS CAST('Facility' AS VARCHAR(30)) PERSISTED,
    ImagePath         NVARCHAR(260) NOT NULL,
    SortOrder         INT NOT NULL CONSTRAINT DF_FacilityItem_SortOrder DEFAULT 0,
    IsPublished       BIT NOT NULL CONSTRAINT DF_FacilityItem_IsPublished DEFAULT 1,
    CreatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_FacilityItem_CreatedAt DEFAULT SYSUTCDATETIME(),
    CreatedBy INT NULL,
    UpdatedAt DATETIME2(0) NULL,
    UpdatedBy INT NULL,
    IsDeleted BIT NOT NULL CONSTRAINT DF_FacilityItem_IsDeleted DEFAULT 0,
    CONSTRAINT FK_FacilityItem_Category FOREIGN KEY (CategoryId, CategoryTypeGuard)
        REFERENCES dbo.Category(Id, CategoryType)
);
GO

IF OBJECT_ID(N'dbo.FacilityItemI18n', N'U') IS NULL
CREATE TABLE dbo.FacilityItemI18n (
    FacilityItemId INT NOT NULL,
    Lang           VARCHAR(5) NOT NULL,
    Name           NVARCHAR(160) NOT NULL,
    Description    NVARCHAR(600) NULL,
    ImageAlt       NVARCHAR(200) NOT NULL,
    CONSTRAINT PK_FacilityItemI18n PRIMARY KEY (FacilityItemId, Lang),
    CONSTRAINT FK_FacilityItemI18n_FacilityItem FOREIGN KEY (FacilityItemId) REFERENCES dbo.FacilityItem(Id),
    CONSTRAINT CK_FacilityItemI18n_Lang CHECK (Lang IN ('zh','en'))
);
GO

/* =============================================================================
   單元 11 job — 職缺（08 §4.9）
   -----------------------------------------------------------------------------
   careers.html 的 Why NTI 六條為固定文案，不入庫。應徵行為走 Email，
   刻意不設 JobApplication 表（無履歷收件與個資保管需求）。
   ============================================================================= */

IF OBJECT_ID(N'dbo.JobPosting', N'U') IS NULL
CREATE TABLE dbo.JobPosting (
    Id          INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_JobPosting PRIMARY KEY,
    SortOrder   INT NOT NULL CONSTRAINT DF_JobPosting_SortOrder DEFAULT 0,
    IsPublished BIT NOT NULL CONSTRAINT DF_JobPosting_IsPublished DEFAULT 1,
    PublishAt   DATETIME2(0) NULL,
    UnpublishAt DATETIME2(0) NULL,
    CreatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_JobPosting_CreatedAt DEFAULT SYSUTCDATETIME(),
    CreatedBy INT NULL,
    UpdatedAt DATETIME2(0) NULL,
    UpdatedBy INT NULL,
    IsDeleted BIT NOT NULL CONSTRAINT DF_JobPosting_IsDeleted DEFAULT 0
);
GO

IF OBJECT_ID(N'dbo.JobPostingI18n', N'U') IS NULL
CREATE TABLE dbo.JobPostingI18n (
    JobPostingId    INT NOT NULL,
    Lang            VARCHAR(5) NOT NULL,
    Title           NVARCHAR(160) NOT NULL,                                      -- Offset Press Operator
    Location        NVARCHAR(80)  NULL,                                          -- Tainan plant
    DescriptionHtml NVARCHAR(MAX) NOT NULL,
    CONSTRAINT PK_JobPostingI18n PRIMARY KEY (JobPostingId, Lang),
    CONSTRAINT FK_JobPostingI18n_JobPosting FOREIGN KEY (JobPostingId) REFERENCES dbo.JobPosting(Id),
    CONSTRAINT CK_JobPostingI18n_Lang CHECK (Lang IN ('zh','en'))
);
GO

/* =============================================================================
   單元 12 supplier-notice ／ 13 supplier-spec ／ 14 supplier-download（08 §4.10）
   ============================================================================= */

IF OBJECT_ID(N'dbo.SupplierNotice', N'U') IS NULL
CREATE TABLE dbo.SupplierNotice (
    Id                INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_SupplierNotice PRIMARY KEY,
    CategoryId        INT NOT NULL,                                              -- Policy/ESG/Quality/Logistics
    CategoryTypeGuard AS CAST('SupplierNotice' AS VARCHAR(30)) PERSISTED,
    NoticeDate        DATE NOT NULL,
    AttachmentPath    NVARCHAR(260) NULL,                                        -- 選填
    IsPublished       BIT NOT NULL CONSTRAINT DF_SupplierNotice_IsPublished DEFAULT 1,
    PublishAt         DATETIME2(0) NULL,
    UnpublishAt       DATETIME2(0) NULL,
    CreatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_SupplierNotice_CreatedAt DEFAULT SYSUTCDATETIME(),
    CreatedBy INT NULL,
    UpdatedAt DATETIME2(0) NULL,
    UpdatedBy INT NULL,
    IsDeleted BIT NOT NULL CONSTRAINT DF_SupplierNotice_IsDeleted DEFAULT 0,
    CONSTRAINT FK_SupplierNotice_Category FOREIGN KEY (CategoryId, CategoryTypeGuard)
        REFERENCES dbo.Category(Id, CategoryType)
);
GO

IF OBJECT_ID(N'dbo.SupplierNoticeI18n', N'U') IS NULL
CREATE TABLE dbo.SupplierNoticeI18n (
    SupplierNoticeId INT NOT NULL,
    Lang             VARCHAR(5) NOT NULL,
    Title            NVARCHAR(250) NOT NULL,
    BodyHtml         NVARCHAR(MAX) NULL,
    CONSTRAINT PK_SupplierNoticeI18n PRIMARY KEY (SupplierNoticeId, Lang),
    CONSTRAINT FK_SupplierNoticeI18n_SupplierNotice FOREIGN KEY (SupplierNoticeId) REFERENCES dbo.SupplierNotice(Id),
    CONSTRAINT CK_SupplierNoticeI18n_Lang CHECK (Lang IN ('zh','en'))
);
GO

IF OBJECT_ID(N'dbo.SupplierSpec', N'U') IS NULL
CREATE TABLE dbo.SupplierSpec (
    Id          INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_SupplierSpec PRIMARY KEY,
    SortOrder   INT NOT NULL CONSTRAINT DF_SupplierSpec_SortOrder DEFAULT 0,
    IsPublished BIT NOT NULL CONSTRAINT DF_SupplierSpec_IsPublished DEFAULT 1,
    CreatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_SupplierSpec_CreatedAt DEFAULT SYSUTCDATETIME(),
    CreatedBy INT NULL,
    UpdatedAt DATETIME2(0) NULL,
    UpdatedBy INT NULL,
    IsDeleted BIT NOT NULL CONSTRAINT DF_SupplierSpec_IsDeleted DEFAULT 0
);
GO

IF OBJECT_ID(N'dbo.SupplierSpecI18n', N'U') IS NULL
CREATE TABLE dbo.SupplierSpecI18n (
    SupplierSpecId INT NOT NULL,
    Lang           VARCHAR(5) NOT NULL,
    Title          NVARCHAR(160) NOT NULL,
    Description    NVARCHAR(600) NOT NULL,
    CONSTRAINT PK_SupplierSpecI18n PRIMARY KEY (SupplierSpecId, Lang),
    CONSTRAINT FK_SupplierSpecI18n_SupplierSpec FOREIGN KEY (SupplierSpecId) REFERENCES dbo.SupplierSpec(Id),
    CONSTRAINT CK_SupplierSpecI18n_Lang CHECK (Lang IN ('zh','en'))
);
GO

IF OBJECT_ID(N'dbo.SupplierDownload', N'U') IS NULL
CREATE TABLE dbo.SupplierDownload (
    Id            INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_SupplierDownload PRIMARY KEY,
    FilePath      NVARCHAR(260) NOT NULL,
    FileExt       VARCHAR(10) NOT NULL,                                          -- 自動帶入，前台顯示 PDF/XLSX 標籤
    FileSizeBytes BIGINT NOT NULL,                                               -- 自動帶入，前台格式化為 2.4 MB
    RequireLogin  BIT NOT NULL CONSTRAINT DF_SupplierDownload_RequireLogin DEFAULT 0,  -- 受控文件：會員系統上線後才生效（P6）
    DownloadCount INT NOT NULL CONSTRAINT DF_SupplierDownload_DownloadCount DEFAULT 0,
    SortOrder     INT NOT NULL CONSTRAINT DF_SupplierDownload_SortOrder DEFAULT 0,
    IsPublished   BIT NOT NULL CONSTRAINT DF_SupplierDownload_IsPublished DEFAULT 1,
    CreatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_SupplierDownload_CreatedAt DEFAULT SYSUTCDATETIME(),
    CreatedBy INT NULL,
    UpdatedAt DATETIME2(0) NULL,
    UpdatedBy INT NULL,
    IsDeleted BIT NOT NULL CONSTRAINT DF_SupplierDownload_IsDeleted DEFAULT 0
);
GO

IF OBJECT_ID(N'dbo.SupplierDownloadI18n', N'U') IS NULL
CREATE TABLE dbo.SupplierDownloadI18n (
    SupplierDownloadId INT NOT NULL,
    Lang               VARCHAR(5) NOT NULL,
    Name               NVARCHAR(200) NOT NULL,
    CONSTRAINT PK_SupplierDownloadI18n PRIMARY KEY (SupplierDownloadId, Lang),
    CONSTRAINT FK_SupplierDownloadI18n_SupplierDownload FOREIGN KEY (SupplierDownloadId) REFERENCES dbo.SupplierDownload(Id),
    CONSTRAINT CK_SupplierDownloadI18n_Lang CHECK (Lang IN ('zh','en'))
);
GO

/* =============================================================================
   單元 15 page ／ 16 redirect — 頁面 SEO 與轉址（08 §4.11）
   -----------------------------------------------------------------------------
   固定頁註冊表：內容寫死在前端，這裡只管 SEO（決議 3）。29 筆固定頁見
   db/seed/140_page.sql；HasRichBody=1 僅 privacy-legal 與預留的 green-csr。
   ============================================================================= */

IF OBJECT_ID(N'dbo.Page', N'U') IS NULL
CREATE TABLE dbo.Page (
    Id            INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Page PRIMARY KEY,
    PageKey       VARCHAR(60)   NOT NULL,                                        -- home|about-difference|green-carbon|...
    RouteTemplate NVARCHAR(200) NOT NULL,                                        -- /{lang}/about/difference
    HasRichBody   BIT NOT NULL CONSTRAINT DF_Page_HasRichBody DEFAULT 0,
    OgImagePath   NVARCHAR(260) NULL,
    IsIndexable   BIT NOT NULL CONSTRAINT DF_Page_IsIndexable DEFAULT 1,         -- 0 → noindex
    CreatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_Page_CreatedAt DEFAULT SYSUTCDATETIME(),
    CreatedBy INT NULL,
    UpdatedAt DATETIME2(0) NULL,
    UpdatedBy INT NULL,
    IsDeleted BIT NOT NULL CONSTRAINT DF_Page_IsDeleted DEFAULT 0,
    CONSTRAINT UQ_Page_PageKey UNIQUE (PageKey)
);
GO

IF OBJECT_ID(N'dbo.PageI18n', N'U') IS NULL
CREATE TABLE dbo.PageI18n (
    PageId         INT NOT NULL,
    Lang           VARCHAR(5) NOT NULL,
    BodyHtml       NVARCHAR(MAX) NULL,                                           -- 僅 HasRichBody=1 時使用
    Slug           NVARCHAR(160) NOT NULL,
    SeoTitle       NVARCHAR(70)  NULL,
    SeoDescription NVARCHAR(180) NULL,
    CanonicalUrl   NVARCHAR(300) NULL,
    OgTitle        NVARCHAR(90)  NULL,
    OgDescription  NVARCHAR(200) NULL,
    CONSTRAINT PK_PageI18n PRIMARY KEY (PageId, Lang),
    CONSTRAINT FK_PageI18n_Page FOREIGN KEY (PageId) REFERENCES dbo.Page(Id),
    CONSTRAINT CK_PageI18n_Lang CHECK (Lang IN ('zh','en'))
);
GO

-- 舊站 301 對照（05-seo 要求，內容遷移 P8 用）
-- FromPath 的唯一性由 0003 的 UX_Redirect_FromPath 提供（同時覆蓋 ToPath/StatusCode），
-- 故此處不再宣告 inline UNIQUE，避免同欄位兩個重複索引。
IF OBJECT_ID(N'dbo.Redirect', N'U') IS NULL
CREATE TABLE dbo.Redirect (
    Id         INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Redirect PRIMARY KEY,
    FromPath   NVARCHAR(400) NOT NULL,                                           -- 一律小寫、含前導 /
    ToPath     NVARCHAR(400) NOT NULL,
    StatusCode SMALLINT NOT NULL CONSTRAINT DF_Redirect_StatusCode DEFAULT 301,
    HitCount   INT NOT NULL CONSTRAINT DF_Redirect_HitCount DEFAULT 0,
    IsActive   BIT NOT NULL CONSTRAINT DF_Redirect_IsActive DEFAULT 1,
    CreatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_Redirect_CreatedAt DEFAULT SYSUTCDATETIME(),
    CreatedBy INT NULL,
    UpdatedAt DATETIME2(0) NULL,
    UpdatedBy INT NULL,
    IsDeleted BIT NOT NULL CONSTRAINT DF_Redirect_IsDeleted DEFAULT 0,
    CONSTRAINT CK_Redirect_Status CHECK (StatusCode IN (301,302,308))
);
GO

/* =============================================================================
   單元 19 member — 會員（08 §4.13，P6）
   -----------------------------------------------------------------------------
   ⚠ 位置刻意上移：08 §4.13 原本排在 §4.12 表單之後，但 QuoteRequest.MemberId
     參照 Member，故必須先建（08 §4.12 的建表順序警語）。
     Member 與 AdminUser 是兩套獨立帳號體系，不共用登入。
     後台不可查看或設定會員密碼，只能重寄驗證信／觸發密碼重設／啟用停用（09 §19）。
   ============================================================================= */

IF OBJECT_ID(N'dbo.Member', N'U') IS NULL
CREATE TABLE dbo.Member (
    Id               INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Member PRIMARY KEY,
    Email            NVARCHAR(160) NOT NULL,
    PasswordHash     NVARCHAR(200) NOT NULL,                                     -- ASP.NET Core Identity V3 (PBKDF2)，salt 內含
    DisplayName      NVARCHAR(80)  NOT NULL,
    Company          NVARCHAR(120) NULL,
    Phone            NVARCHAR(40)  NULL,
    PreferredLang    VARCHAR(5) NOT NULL CONSTRAINT DF_Member_PreferredLang DEFAULT 'zh',
    Status           VARCHAR(20) NOT NULL CONSTRAINT DF_Member_Status DEFAULT 'Pending',
    EmailConfirmedAt DATETIME2(0) NULL,
    LastLoginAt      DATETIME2(0) NULL,
    FailedLoginCount TINYINT NOT NULL CONSTRAINT DF_Member_FailedLoginCount DEFAULT 0,
    LockoutEndAt     DATETIME2(0) NULL,
    CreatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_Member_CreatedAt DEFAULT SYSUTCDATETIME(),
    CreatedBy INT NULL,
    UpdatedAt DATETIME2(0) NULL,
    UpdatedBy INT NULL,
    IsDeleted BIT NOT NULL CONSTRAINT DF_Member_IsDeleted DEFAULT 0,
    CONSTRAINT UQ_Member_Email UNIQUE (Email),
    CONSTRAINT CK_Member_Status CHECK (Status IN ('Pending','Active','Suspended')),
    CONSTRAINT CK_Member_PreferredLang CHECK (PreferredLang IN ('zh','en'))
);
GO

IF OBJECT_ID(N'dbo.MemberToken', N'U') IS NULL
CREATE TABLE dbo.MemberToken (
    Id        BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_MemberToken PRIMARY KEY,
    MemberId  INT NOT NULL,
    TokenType VARCHAR(20) NOT NULL,                                              -- EmailVerify|PasswordReset
    TokenHash VARBINARY(32) NOT NULL,                                            -- 只存 SHA-256，明碼僅寄出
    ExpiresAt DATETIME2(0) NOT NULL,
    UsedAt    DATETIME2(0) NULL,
    CreatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_MemberToken_CreatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_MemberToken_Member FOREIGN KEY (MemberId) REFERENCES dbo.Member(Id),
    CONSTRAINT CK_MemberToken_Type CHECK (TokenType IN ('EmailVerify','PasswordReset'))
);
GO

/* =============================================================================
   單元 17 quote ／ 18 contact — 表單（08 §4.12）
   -----------------------------------------------------------------------------
   客戶填寫內容在後台唯讀；後台僅可改 Status / AssigneeId / InternalNote / RepliedAt。
   匯出 CSV 需 quote.export 權限且必須寫入 AuditLog（09 §17）。
   ============================================================================= */

IF OBJECT_ID(N'dbo.QuoteRequest', N'U') IS NULL
CREATE TABLE dbo.QuoteRequest (
    Id                     INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_QuoteRequest PRIMARY KEY,
    QuoteNo                VARCHAR(20) NOT NULL,                                 -- Q20260901-0001，後端產生
    MemberId               INT NULL,                                             -- 未登入送出則為 NULL
    FullName               NVARCHAR(80)  NOT NULL,
    Company                NVARCHAR(120) NOT NULL,
    Email                  NVARCHAR(160) NOT NULL,
    Phone                  NVARCHAR(40)  NULL,
    SolutionId             INT NULL,                                             -- 產品類型下拉
    IndustryCategoryId     INT NULL,                                             -- 產業別下拉
    IndustryTypeGuard      AS CAST('Industry' AS VARCHAR(30)) PERSISTED,
    Quantity               NVARCHAR(60)  NOT NULL,
    SizeText               NVARCHAR(100) NULL,                                   -- L×W×H mm
    MaterialCategoryId     INT NULL,                                             -- 材質偏好下拉
    MaterialTypeGuard      AS CAST('QuoteMaterial' AS VARCHAR(30)) PERSISTED,
    TargetDate             DATE NULL,
    NeedsSustainableAdvice BIT NOT NULL CONSTRAINT DF_QuoteRequest_NeedsAdvice DEFAULT 0,
    Requirement            NVARCHAR(MAX) NOT NULL,
    ConsentAt              DATETIME2(0) NOT NULL,                                -- 隱私權同意時間（個資法留存）
    Status                 VARCHAR(20) NOT NULL CONSTRAINT DF_QuoteRequest_Status DEFAULT 'New',
    AssigneeId             INT NULL,                                             -- AdminUser.Id，刻意不建 FK（08 §2.3）
    InternalNote           NVARCHAR(MAX) NULL,
    RepliedAt              DATETIME2(0) NULL,
    SourceIp               VARCHAR(45) NULL,
    UserAgent              NVARCHAR(400) NULL,
    SourceLang             VARCHAR(5) NULL,
    SubmittedAt            DATETIME2(0) NOT NULL CONSTRAINT DF_QuoteRequest_SubmittedAt DEFAULT SYSUTCDATETIME(),
    CreatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_QuoteRequest_CreatedAt DEFAULT SYSUTCDATETIME(),
    CreatedBy INT NULL,
    UpdatedAt DATETIME2(0) NULL,
    UpdatedBy INT NULL,
    IsDeleted BIT NOT NULL CONSTRAINT DF_QuoteRequest_IsDeleted DEFAULT 0,
    CONSTRAINT UQ_QuoteRequest_QuoteNo UNIQUE (QuoteNo),
    CONSTRAINT FK_QuoteRequest_Member   FOREIGN KEY (MemberId)   REFERENCES dbo.Member(Id),
    CONSTRAINT FK_QuoteRequest_Solution FOREIGN KEY (SolutionId) REFERENCES dbo.Solution(Id),
    CONSTRAINT FK_QuoteRequest_Industry FOREIGN KEY (IndustryCategoryId, IndustryTypeGuard)
        REFERENCES dbo.Category(Id, CategoryType),
    CONSTRAINT FK_QuoteRequest_Material FOREIGN KEY (MaterialCategoryId, MaterialTypeGuard)
        REFERENCES dbo.Category(Id, CategoryType),
    CONSTRAINT CK_Quote_Status CHECK (Status IN ('New','InProgress','Quoted','Closed','Spam'))
);
GO

IF OBJECT_ID(N'dbo.QuoteAttachment', N'U') IS NULL
CREATE TABLE dbo.QuoteAttachment (
    Id             INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_QuoteAttachment PRIMARY KEY,
    QuoteRequestId INT NOT NULL,
    FilePath       NVARCHAR(260) NOT NULL,
    OriginalName   NVARCHAR(200) NOT NULL,
    ContentType    VARCHAR(100) NOT NULL,
    SizeBytes      BIGINT NOT NULL,
    ScanStatus     VARCHAR(10) NOT NULL CONSTRAINT DF_QuoteAttachment_ScanStatus DEFAULT 'Pending',
    CreatedAt      DATETIME2(0) NOT NULL CONSTRAINT DF_QuoteAttachment_CreatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_QuoteAttachment_QuoteRequest FOREIGN KEY (QuoteRequestId) REFERENCES dbo.QuoteRequest(Id),
    CONSTRAINT CK_QuoteAtt_Scan CHECK (ScanStatus IN ('Pending','Clean','Infected'))  -- 未通過者不提供下載（09 §17）
);
GO

IF OBJECT_ID(N'dbo.ContactMessage', N'U') IS NULL
CREATE TABLE dbo.ContactMessage (
    Id           INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_ContactMessage PRIMARY KEY,
    Name         NVARCHAR(80)  NOT NULL,
    Email        NVARCHAR(160) NOT NULL,
    Company      NVARCHAR(120) NULL,
    Phone        NVARCHAR(40)  NULL,
    Message      NVARCHAR(MAX) NOT NULL,
    ConsentAt    DATETIME2(0) NOT NULL,
    Status       VARCHAR(20) NOT NULL CONSTRAINT DF_ContactMessage_Status DEFAULT 'New',
    InternalNote NVARCHAR(MAX) NULL,
    RepliedAt    DATETIME2(0) NULL,
    SourceIp     VARCHAR(45) NULL,
    UserAgent    NVARCHAR(400) NULL,
    SourceLang   VARCHAR(5) NULL,
    SubmittedAt  DATETIME2(0) NOT NULL CONSTRAINT DF_ContactMessage_SubmittedAt DEFAULT SYSUTCDATETIME(),
    CreatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_ContactMessage_CreatedAt DEFAULT SYSUTCDATETIME(),
    CreatedBy INT NULL,
    UpdatedAt DATETIME2(0) NULL,
    UpdatedBy INT NULL,
    IsDeleted BIT NOT NULL CONSTRAINT DF_ContactMessage_IsDeleted DEFAULT 0,
    CONSTRAINT CK_Contact_Status CHECK (Status IN ('New','Replied','Closed','Spam'))
);
GO

/* =============================================================================
   單元 20 order — 訂單與生產進度（08 §4.13，P6）
   -----------------------------------------------------------------------------
   'Order' 為 T-SQL 保留字，資料表命名為 Orders。
   ============================================================================= */

IF OBJECT_ID(N'dbo.Orders', N'U') IS NULL
CREATE TABLE dbo.Orders (
    Id               INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Orders PRIMARY KEY,
    OrderNo          VARCHAR(20) NOT NULL,
    MemberId         INT NOT NULL,
    QuoteRequestId   INT NULL,
    Title            NVARCHAR(200) NOT NULL,
    Status           VARCHAR(20) NOT NULL CONSTRAINT DF_Orders_Status DEFAULT 'Confirmed',
    ExpectedShipDate DATE NULL,
    CreatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_Orders_CreatedAt DEFAULT SYSUTCDATETIME(),
    CreatedBy INT NULL,
    UpdatedAt DATETIME2(0) NULL,
    UpdatedBy INT NULL,
    IsDeleted BIT NOT NULL CONSTRAINT DF_Orders_IsDeleted DEFAULT 0,
    CONSTRAINT UQ_Orders_OrderNo UNIQUE (OrderNo),
    CONSTRAINT FK_Orders_Member       FOREIGN KEY (MemberId)       REFERENCES dbo.Member(Id),
    CONSTRAINT FK_Orders_QuoteRequest FOREIGN KEY (QuoteRequestId) REFERENCES dbo.QuoteRequest(Id),
    CONSTRAINT CK_Order_Status CHECK (Status IN ('Confirmed','InProduction','Shipped','Completed','Cancelled'))
);
GO

IF OBJECT_ID(N'dbo.OrderProgress', N'U') IS NULL
CREATE TABLE dbo.OrderProgress (
    Id          BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_OrderProgress PRIMARY KEY,
    OrderId     INT NOT NULL,
    Stage       VARCHAR(20) NOT NULL,                                            -- Design|PrePress|Printing|PostPress|QC|Shipping
    StageStatus VARCHAR(20) NOT NULL,                                            -- Pending|Doing|Done
    HappenedAt  DATETIME2(0) NOT NULL,
    Note        NVARCHAR(400) NULL,
    CreatedAt   DATETIME2(0) NOT NULL CONSTRAINT DF_OrderProgress_CreatedAt DEFAULT SYSUTCDATETIME(),
    CreatedBy   INT NULL,
    CONSTRAINT FK_OrderProgress_Orders FOREIGN KEY (OrderId) REFERENCES dbo.Orders(Id),
    CONSTRAINT CK_OrderProgress_Stage       CHECK (Stage IN ('Design','PrePress','Printing','PostPress','QC','Shipping')),
    CONSTRAINT CK_OrderProgress_StageStatus CHECK (StageStatus IN ('Pending','Doing','Done'))
);
GO

/* =============================================================================
   預留（待客戶確認）— 電子報訂閱｜docs/09 §2.1 缺口一
   -----------------------------------------------------------------------------
   尚未列入本期估算，schema 先備妥，客戶確認後只需補後台單元與權限碼。
   - double opt-in：ConfirmToken 只存 SHA-256，明碼僅寄出（比照 MemberToken）
   - Source='Import' 直接支援舊站名單遷移
   - 無可翻譯欄位，故不設 *I18n 側表
   - EmailLog.MailType 無 CHECK 約束，未來加 NewsletterConfirm 不需改 schema
   ============================================================================= */

IF OBJECT_ID(N'dbo.NewsletterSubscriber', N'U') IS NULL
CREATE TABLE dbo.NewsletterSubscriber (
    Id                    INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_NewsletterSubscriber PRIMARY KEY,
    Email                 NVARCHAR(160) NOT NULL,
    DisplayName           NVARCHAR(80)  NULL,
    Company               NVARCHAR(120) NULL,
    PreferredLang         VARCHAR(5)  NOT NULL CONSTRAINT DF_NewsletterSubscriber_Lang   DEFAULT 'en',
    Status                VARCHAR(20) NOT NULL CONSTRAINT DF_NewsletterSubscriber_Status DEFAULT 'Pending',
    Source                VARCHAR(20) NOT NULL CONSTRAINT DF_NewsletterSubscriber_Source DEFAULT 'Website',
    ConsentAt             DATETIME2(0) NULL,                                     -- 訂閱同意時間（個資法留存）
    ConfirmToken          VARBINARY(32) NULL,
    ConfirmTokenExpiresAt DATETIME2(0) NULL,
    ConfirmedAt           DATETIME2(0) NULL,
    UnsubscribeToken      VARBINARY(32) NULL,                                    -- 退訂連結用，長期有效
    UnsubscribedAt        DATETIME2(0) NULL,
    UnsubscribeReason     NVARCHAR(200) NULL,
    LastSentAt            DATETIME2(0) NULL,
    BounceCount           TINYINT NOT NULL CONSTRAINT DF_NewsletterSubscriber_Bounce DEFAULT 0,
    SourceIp              VARCHAR(45) NULL,
    UserAgent             NVARCHAR(400) NULL,
    SourceLang            VARCHAR(5) NULL,
    SubscribedAt          DATETIME2(0) NOT NULL CONSTRAINT DF_NewsletterSubscriber_SubAt DEFAULT SYSUTCDATETIME(),
    CreatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_NewsletterSubscriber_CreatedAt DEFAULT SYSUTCDATETIME(),
    CreatedBy INT NULL,
    UpdatedAt DATETIME2(0) NULL,
    UpdatedBy INT NULL,
    IsDeleted BIT NOT NULL CONSTRAINT DF_NewsletterSubscriber_IsDeleted DEFAULT 0,
    CONSTRAINT UQ_NewsletterSubscriber_Email  UNIQUE (Email),
    CONSTRAINT CK_NewsletterSubscriber_Status CHECK (Status IN ('Pending','Subscribed','Unsubscribed','Bounced')),
    CONSTRAINT CK_NewsletterSubscriber_Source CHECK (Source IN ('Website','Import','Admin')),
    CONSTRAINT CK_NewsletterSubscriber_Lang   CHECK (PreferredLang IN ('zh','en'))
);
GO

IF NOT EXISTS (SELECT 1 FROM dbo.SchemaVersion WHERE ScriptName = N'0002_init_schema.sql')
    INSERT dbo.SchemaVersion (ScriptName) VALUES (N'0002_init_schema.sql');
GO
