# 08 · 資料庫設計 Database — 規格書

| 欄位 | 內容 |
|------|------|
| **主責 Agent** | `system-analyst`（schema 定義）+ `backend-engineer`（建置／遷移） |
| **對應階段** | P1（ER Model 藍圖）／P4（建表與實作） |
| **技術基線** | Azure SQL Database — Basic ／ Dapper（手寫 SQL）／ Azure Functions .NET 10 |
| **配套文件** | [09-cms-admin.md](09-cms-admin.md)（後台單元 → 本文件資料表對照）、[04-api.md](04-api.md)（契約）、[05-seo.md](05-seo.md)（SEO 欄位） |
| **資料來源** | `mockup/` 44 頁實際結構（2026-09-01 定案版）、[官網資訊架構 IA](../reference/官網資訊架構_IA.md) |

---

## 1. 設計原則

本 schema 依 [`09-cms-admin.md` §1](09-cms-admin.md) 的三條專案決議設計，對應的落地做法：

1. **單元式後台** → 一個後台單元 = 1 主表（＋1 張 `*I18n` 子表），無通用區塊表。
2. **不做 Media Library** → 無 `Media` 資產表；檔案是所屬資料列上的 `*Path` 欄位，刪列即解除引用。
3. **固定文字不進後台** → About／Sustainability／Facility 內頁長文寫死在前端，DB 只留其 SEO 欄位（`Page`／`PageI18n`）。唯一例外 `privacy-legal`（`HasRichBody = 1`）。

---

## 2. 共用慣例

### 2.1 命名
- 資料表 **PascalCase 單數**（`News`、`QuoteRequest`）；多語子表固定後綴 **`I18n`**（`NewsI18n`）。
- 主鍵一律 `Id INT IDENTITY(1,1)`（log 類用 `BIGINT`）；外鍵 `{Table}Id`。
- 布林 `Is*` / `Has*`；時間點 `*At`；排序 `SortOrder`。
- 狀態欄位用**可讀字串碼**（`VARCHAR(20)` + `CHECK`），不用數字 enum — 手寫 SQL 除錯時直接看得懂。

### 2.2 時間與時區
- 一律 `DATETIME2(0)`，**存 UTC**（`SYSUTCDATETIME()`）；顯示時由前端／後台轉 `Asia/Taipei`。
- 純日期性質（新聞發佈日、公告日）用 `DATE`，不帶時區問題。

### 2.3 稽核與軟刪（所有內容表皆含）

```sql
CreatedAt DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
CreatedBy INT NULL, UpdatedAt DATETIME2(0) NULL, UpdatedBy INT NULL,
IsDeleted BIT NOT NULL DEFAULT 0
```

下方 DDL 中以單行 `/* audit */` 代表這五個欄位（實作時展開）。`CreatedBy/UpdatedBy` 指向 `AdminUser.Id`，不建 FK（避免管理員刪除時的連鎖限制）。

> 實際展開版本見 [`db/migrations/0002_init_schema.sql`](../db/migrations/0002_init_schema.sql)。該腳本另將所有 PK／FK／UNIQUE／CHECK／DEFAULT **一律具名**（`PK_`／`FK_`／`UQ_`／`CK_`／`DF_`）——匿名 inline 約束會產生帶隨機 hash 的名稱（`DF__HomeBanner__Sort__1B0907CE`），**每個環境都不同**，導致「改預設值」的遷移在 dev 跑得過、在 prod 炸掉。

### 2.4 上下架
內容表統一四欄：`IsPublished BIT`、`PublishAt DATETIME2(0) NULL`、`UnpublishAt DATETIME2(0) NULL`、`SortOrder INT`。
前台查詢一律套用：

```sql
WHERE IsDeleted = 0 AND IsPublished = 1
  AND (PublishAt   IS NULL OR PublishAt   <= SYSUTCDATETIME())
  AND (UnpublishAt IS NULL OR UnpublishAt >  SYSUTCDATETIME())
```

### 2.5 多語（中／英）
- 語系中性欄位（圖片路徑、日期、排序、狀態、外部連結）留在**主表**。
- 可翻譯文字（標題、內文、slug、圖片 `alt`、SEO）放 **`{Entity}I18n`**，PK = (`{Entity}Id`, `Lang`)。
- `Lang VARCHAR(5)`，本期值域 `'zh'` / `'en'`（保留擴充為 `zh-TW`／`ja` 的空間）。
- **缺語系不 fallback**：某語系沒有 i18n 列 → 該語系前台不列出這筆。後台清單以「中/英完成度」badge 提示（對應規劃書「語系管理：中英內容對照維護」）。
- slug 放 i18n，允許中英不同網址；唯一索引為 (`Lang`, `Slug`)。

### 2.6 圖片／檔案欄位（呼應決議 2）
每個上傳欄位是一組三件：

| 欄位 | 位置 | 說明 |
|------|------|------|
| `XxxPath` | 主表 `NVARCHAR(260)` | Blob 相對路徑，如 `news/2026/03/taicca-partnership.webp` |
| `XxxAlt` | i18n 表 `NVARCHAR(200)` | 圖片替代文字，**中英各一**（05-seo 硬性要求） |
| 建議尺寸 note | 後台 UI 常數 | 不入庫，寫在後台欄位定義；總表見 [09-cms-admin.md §3](09-cms-admin.md) |

上傳處理（後端）：驗副檔名白名單 → 驗實際 magic number → 寫入 Blob → 影像另存 WebP 衍生檔（原檔保留）→ 回寫 `XxxPath`。**不建立資產表**；孤兒檔由每月排程比對欄位引用後清除。

### 2.7 SEO 欄位組
凡是**有自己網址**的實體（`Page`、`News`、`Solution`），其 i18n 表都含這組：

```sql
Slug NVARCHAR(160) NOT NULL, SeoTitle NVARCHAR(70) NULL, SeoDescription NVARCHAR(180) NULL,
CanonicalUrl NVARCHAR(300) NULL, OgTitle NVARCHAR(90) NULL, OgDescription NVARCHAR(200) NULL
```

`OgImagePath` 為語系中性，放主表。`hreflang` 不落欄位，由同一 `Id` 的兩筆 i18n 推導。

---

## 3. 資料表一覽

分區一覽（**32 張主表 + 16 張 `*I18n` 多語子表 + 1 張系統表 = 49 張**）：

| 區 | 資料表 |
|----|--------|
| 共用主檔 | `Category`、`CategoryI18n`、`SiteSetting` |
| 首頁 | `HomeBanner`、`HomeBannerI18n` |
| 內容 | `Solution`(+I18n)、`SolutionItem`(+I18n)、`Project`(+I18n)、`News`(+I18n)、`Vlog`(+I18n)、`Faq`(+I18n)、`IndustryTrend`(+I18n)、`Certification`(+I18n)、`ClientLogo`、`FacilityItem`(+I18n)、`JobPosting`(+I18n) |
| 供應商 | `SupplierNotice`(+I18n)、`SupplierSpec`(+I18n)、`SupplierDownload`(+I18n) |
| 頁面／SEO | `Page`、`PageI18n`、`Redirect` |
| 表單 | `QuoteRequest`、`QuoteAttachment`、`ContactMessage` |
| 會員（P6） | `Member`、`MemberToken`、`Orders`、`OrderProgress` |
| 系統 | `AdminUser`、`Role`、`RolePermission`、`AuditLog`、`EmailLog`、`SchemaVersion` |
| 預留（待客戶確認） | `NewsletterSubscriber` — 見 §4.15 |

---

## 4. DDL

> `*Path` 欄位一律存 Blob 相對路徑；**建議尺寸與檔案限制不在此重複**，唯一來源為 [`09-cms-admin.md` §3](09-cms-admin.md)。

### 4.1 共用主檔

```sql
-- 統一分類主檔：以 CategoryType 分流，後台為單一「分類管理」單元
CREATE TABLE dbo.Category (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  CategoryType VARCHAR(30) NOT NULL,   -- News|Project|Vlog|Faq|Certification|Facility|SupplierNotice|Industry|QuoteMaterial
  Code VARCHAR(40) NOT NULL,           -- 程式用固定碼，建立後不可改
  SortOrder INT NOT NULL DEFAULT 0,
  IsActive BIT NOT NULL DEFAULT 1,
  /* audit */
  CONSTRAINT UQ_Category_Type_Code UNIQUE (CategoryType, Code),
  CONSTRAINT CK_Category_Type CHECK (CategoryType IN
    ('News','Project','Vlog','Faq','Certification','Facility','SupplierNotice','Industry','QuoteMaterial'))
);

CREATE TABLE dbo.CategoryI18n (
  CategoryId INT NOT NULL REFERENCES dbo.Category(Id),
  Lang VARCHAR(5) NOT NULL,
  Name NVARCHAR(80) NOT NULL,
  CONSTRAINT PK_CategoryI18n PRIMARY KEY (CategoryId, Lang)
);

-- 全站設定：key-value，後台以固定 key 清單渲染表單（見 §6.3 種子）
CREATE TABLE dbo.SiteSetting (
  SettingKey VARCHAR(60) NOT NULL PRIMARY KEY,
  GroupName VARCHAR(30) NOT NULL,      -- Company|Social|Home|Mail
  ValueType VARCHAR(10) NOT NULL,      -- text|multiline|image|url|email|html
  IsLocalized BIT NOT NULL DEFAULT 0,
  ValueZh NVARCHAR(MAX) NULL,
  ValueEn NVARCHAR(MAX) NULL,
  SortOrder INT NOT NULL DEFAULT 0,
  UpdatedAt DATETIME2(0) NULL, UpdatedBy INT NULL
);
```

### 4.2 首頁

```sql
-- 首頁 Banner 輪播（mockup index.html #hero，目前 3 張）
CREATE TABLE dbo.HomeBanner (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  ImagePath NVARCHAR(260) NOT NULL,        -- 桌機圖；MediaType='video' 時兼作 poster 與行動裝置 fallback
  ImagePathMobile NVARCHAR(260) NULL,      -- 手機圖，未填則用桌機圖
  -- 預留（待客戶確認）：影片型 Banner，對應 09-cms-admin.md §2.1 缺口三
  MediaType VARCHAR(10) NOT NULL DEFAULT 'image',   -- image|video
  VideoPath NVARCHAR(260) NULL,            -- Blob 相對路徑，MP4(H.264) / WebM
  LinkUrl NVARCHAR(300) NULL,              -- 站內相對路徑或外部 URL
  OpenInNewTab BIT NOT NULL DEFAULT 0,
  SortOrder INT NOT NULL DEFAULT 0,
  IsPublished BIT NOT NULL DEFAULT 1, PublishAt DATETIME2(0) NULL, UnpublishAt DATETIME2(0) NULL,
  /* audit */
  CONSTRAINT CK_HomeBanner_MediaType CHECK (MediaType IN ('image','video')),
  CONSTRAINT CK_HomeBanner_Video     CHECK (MediaType = 'image' OR VideoPath IS NOT NULL)
);

CREATE TABLE dbo.HomeBannerI18n (
  HomeBannerId INT NOT NULL REFERENCES dbo.HomeBanner(Id),
  Lang VARCHAR(5) NOT NULL,
  ImageAlt NVARCHAR(200) NOT NULL,       -- MediaType='video' 時作為 <video> 的 aria-label
  CONSTRAINT PK_HomeBannerI18n PRIMARY KEY (HomeBannerId, Lang)
);
```

> 首頁 **What We Do**（4 格）、**Why global brands choose NTI?**（6 格）、形象圖帶標語皆為品牌簡報照抄的固定文案 → **不入庫**（決議 3）。形象圖帶的圖片本身走 `SiteSetting['home.gallery_image']`。

### 4.3 Solutions（客製化解決方案）

```sql
-- 4 個方案 = products-boxes / cardboard / uv / other，同時驅動首頁 Printing Solutions 四張卡
CREATE TABLE dbo.Solution (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  Code VARCHAR(30) NOT NULL UNIQUE,        -- boxes|cardboard|uv|other
  CoverImagePath NVARCHAR(260) NOT NULL,
  OgImagePath NVARCHAR(260) NULL,          -- 未填沿用封面
  SortOrder INT NOT NULL DEFAULT 0,
  IsPublished BIT NOT NULL DEFAULT 1, PublishAt DATETIME2(0) NULL, UnpublishAt DATETIME2(0) NULL,
  /* audit */
);

CREATE TABLE dbo.SolutionI18n (
  SolutionId INT NOT NULL REFERENCES dbo.Solution(Id),
  Lang VARCHAR(5) NOT NULL,
  Name NVARCHAR(80) NOT NULL,              -- Color Box Packaging
  H1 NVARCHAR(160) NOT NULL,               -- Custom Color Box Packaging
  Summary NVARCHAR(300) NULL,              -- 首頁卡片／列表用短述
  IntroHtml NVARCHAR(MAX) NULL,            -- 方案頁導言（富文本）
  CoverAlt NVARCHAR(200) NOT NULL,
  Slug NVARCHAR(160) NOT NULL, SeoTitle NVARCHAR(70) NULL, SeoDescription NVARCHAR(180) NULL,
  CanonicalUrl NVARCHAR(300) NULL, OgTitle NVARCHAR(90) NULL, OgDescription NVARCHAR(200) NULL,
  CONSTRAINT PK_SolutionI18n PRIMARY KEY (SolutionId, Lang)
);

-- 方案頁內的品項卡（Gluing Box / Bottom Gluing Box / ... 共 6+ 張）
CREATE TABLE dbo.SolutionItem (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  SolutionId INT NOT NULL REFERENCES dbo.Solution(Id),
  ImagePath NVARCHAR(260) NOT NULL,
  SortOrder INT NOT NULL DEFAULT 0,
  IsPublished BIT NOT NULL DEFAULT 1,
  /* audit */
);

CREATE TABLE dbo.SolutionItemI18n (
  SolutionItemId INT NOT NULL REFERENCES dbo.SolutionItem(Id),
  Lang VARCHAR(5) NOT NULL,
  Name NVARCHAR(120) NOT NULL,
  Description NVARCHAR(400) NULL,
  ImageAlt NVARCHAR(200) NOT NULL,
  CONSTRAINT PK_SolutionItemI18n PRIMARY KEY (SolutionItemId, Lang)
);
```

### 4.4 Projects（案例實績）

```sql
CREATE TABLE dbo.Project (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  CategoryId INT NOT NULL REFERENCES dbo.Category(Id),   -- CategoryType='Project'（Food/Pharma/...）
  ImagePath NVARCHAR(260) NOT NULL,
  VideoUrl NVARCHAR(300) NULL,             -- 有值才顯示播放圖示
  StatValue NVARCHAR(20) NULL,             -- 卡片大數字，如 -32%
  SortOrder INT NOT NULL DEFAULT 0,
  IsPublished BIT NOT NULL DEFAULT 1, PublishAt DATETIME2(0) NULL, UnpublishAt DATETIME2(0) NULL,
  /* audit */
);

CREATE TABLE dbo.ProjectI18n (
  ProjectId INT NOT NULL REFERENCES dbo.Project(Id),
  Lang VARCHAR(5) NOT NULL,
  Title NVARCHAR(200) NOT NULL,
  Summary NVARCHAR(400) NULL,
  StatLabel NVARCHAR(60) NULL,             -- carbon / unit
  ImageAlt NVARCHAR(200) NOT NULL,
  CONSTRAINT PK_ProjectI18n PRIMARY KEY (ProjectId, Lang)
);
```

> `projects.html` 的 **Industries / Applications** 十項清單由 `Category(CategoryType='Industry')` 提供，與報價表單的產業下拉共用同一份主檔。

### 4.5 News（最新消息）

```sql
CREATE TABLE dbo.News (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  CategoryId INT NOT NULL REFERENCES dbo.Category(Id),   -- CategoryType='News'
  PublishDate DATE NOT NULL,               -- 顯示用日期（2026.03.13）
  CoverImagePath NVARCHAR(260) NOT NULL,
  OgImagePath NVARCHAR(260) NULL,          -- 未填沿用封面
  IsFeaturedHome BIT NOT NULL DEFAULT 0,   -- 是否上首頁／Insights 精選
  IsPublished BIT NOT NULL DEFAULT 0, PublishAt DATETIME2(0) NULL, UnpublishAt DATETIME2(0) NULL,
  /* audit */
);

CREATE TABLE dbo.NewsI18n (
  NewsId INT NOT NULL REFERENCES dbo.News(Id),
  Lang VARCHAR(5) NOT NULL,
  Title NVARCHAR(250) NOT NULL,            -- 同時作為 H1
  Summary NVARCHAR(500) NULL,              -- 列表摘要 + 詳細頁導言
  BodyHtml NVARCHAR(MAX) NOT NULL,         -- 富文本（含小標、段落、內文圖）
  CoverAlt NVARCHAR(200) NOT NULL,
  Slug NVARCHAR(160) NOT NULL, SeoTitle NVARCHAR(70) NULL, SeoDescription NVARCHAR(180) NULL,
  CanonicalUrl NVARCHAR(300) NULL, OgTitle NVARCHAR(90) NULL, OgDescription NVARCHAR(200) NULL,
  CONSTRAINT PK_NewsI18n PRIMARY KEY (NewsId, Lang)
);
```

### 4.6 Green Vlog

```sql
CREATE TABLE dbo.Vlog (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  CategoryId INT NOT NULL REFERENCES dbo.Category(Id),   -- CategoryType='Vlog'
  YoutubeId VARCHAR(20) NOT NULL,          -- 只存 ID，前端組 embed / thumb URL
  ThumbOverridePath NVARCHAR(260) NULL,    -- 未填自動取 YouTube hqdefault
  IsMainFeature BIT NOT NULL DEFAULT 0,    -- 頁面頂部大播放器（僅一支）
  SortOrder INT NOT NULL DEFAULT 0,
  IsPublished BIT NOT NULL DEFAULT 1, PublishAt DATETIME2(0) NULL, UnpublishAt DATETIME2(0) NULL,
  /* audit */
);

CREATE TABLE dbo.VlogI18n (
  VlogId INT NOT NULL REFERENCES dbo.Vlog(Id),
  Lang VARCHAR(5) NOT NULL,
  Title NVARCHAR(200) NOT NULL,
  Description NVARCHAR(400) NULL,
  CONSTRAINT PK_VlogI18n PRIMARY KEY (VlogId, Lang)
);
```

### 4.7 FAQ ／ Industry Trends

```sql
CREATE TABLE dbo.Faq (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  CategoryId INT NULL REFERENCES dbo.Category(Id),       -- CategoryType='Faq'，可不分組
  SortOrder INT NOT NULL DEFAULT 0,
  IsPublished BIT NOT NULL DEFAULT 1,
  /* audit */
);

CREATE TABLE dbo.FaqI18n (
  FaqId INT NOT NULL REFERENCES dbo.Faq(Id),
  Lang VARCHAR(5) NOT NULL,
  Question NVARCHAR(300) NOT NULL,
  AnswerHtml NVARCHAR(MAX) NOT NULL,
  CONSTRAINT PK_FaqI18n PRIMARY KEY (FaqId, Lang)
);

CREATE TABLE dbo.IndustryTrend (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  SortOrder INT NOT NULL DEFAULT 0,
  IsPublished BIT NOT NULL DEFAULT 1, PublishAt DATETIME2(0) NULL, UnpublishAt DATETIME2(0) NULL,
  /* audit */
);

CREATE TABLE dbo.IndustryTrendI18n (
  IndustryTrendId INT NOT NULL REFERENCES dbo.IndustryTrend(Id),
  Lang VARCHAR(5) NOT NULL,
  Title NVARCHAR(200) NOT NULL,
  BodyHtml NVARCHAR(MAX) NOT NULL,
  CONSTRAINT PK_IndustryTrendI18n PRIMARY KEY (IndustryTrendId, Lang)
);
```

### 4.8 認證 ／ 客戶 ／ 設備

```sql
-- 首頁 Proof 認證牆（14 枚）＋ about-certifications 頁共用
CREATE TABLE dbo.Certification (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  CategoryId INT NULL REFERENCES dbo.Category(Id),       -- CategoryType='Certification'（認證/夥伴/獎項）
  LogoPath NVARCHAR(260) NOT NULL,         -- 去背 PNG／SVG
  LinkUrl NVARCHAR(300) NULL,
  ShowOnHome BIT NOT NULL DEFAULT 1,       -- 是否列入首頁 Proof 牆
  SortOrder INT NOT NULL DEFAULT 0,
  IsPublished BIT NOT NULL DEFAULT 1,
  /* audit */
);

CREATE TABLE dbo.CertificationI18n (
  CertificationId INT NOT NULL REFERENCES dbo.Certification(Id),
  Lang VARCHAR(5) NOT NULL,
  Name NVARCHAR(120) NOT NULL,
  Description NVARCHAR(400) NULL,
  LogoAlt NVARCHAR(200) NOT NULL,
  CONSTRAINT PK_CertificationI18n PRIMARY KEY (CertificationId, Lang)
);

-- 客戶 logo 輪播（品牌名不翻譯，無 i18n 表）
CREATE TABLE dbo.ClientLogo (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  Name NVARCHAR(120) NOT NULL,             -- 同時作為 alt
  LogoPath NVARCHAR(260) NOT NULL,         -- 去背 PNG／SVG
  LinkUrl NVARCHAR(300) NULL,
  SortOrder INT NOT NULL DEFAULT 0,
  IsPublished BIT NOT NULL DEFAULT 1,
  /* audit */
);

-- Facility & Equipment 五個子頁的設備卡（印前／環保印刷／印後／品檢／導覽）
CREATE TABLE dbo.FacilityItem (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  CategoryId INT NOT NULL REFERENCES dbo.Category(Id),   -- CategoryType='Facility'
  ImagePath NVARCHAR(260) NOT NULL,
  SortOrder INT NOT NULL DEFAULT 0,
  IsPublished BIT NOT NULL DEFAULT 1,
  /* audit */
);

CREATE TABLE dbo.FacilityItemI18n (
  FacilityItemId INT NOT NULL REFERENCES dbo.FacilityItem(Id),
  Lang VARCHAR(5) NOT NULL,
  Name NVARCHAR(160) NOT NULL,
  Description NVARCHAR(600) NULL,
  ImageAlt NVARCHAR(200) NOT NULL,
  CONSTRAINT PK_FacilityItemI18n PRIMARY KEY (FacilityItemId, Lang)
);
```

### 4.9 Careers（職缺）

```sql
CREATE TABLE dbo.JobPosting (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  SortOrder INT NOT NULL DEFAULT 0,
  IsPublished BIT NOT NULL DEFAULT 1, PublishAt DATETIME2(0) NULL, UnpublishAt DATETIME2(0) NULL,
  /* audit */
);

CREATE TABLE dbo.JobPostingI18n (
  JobPostingId INT NOT NULL REFERENCES dbo.JobPosting(Id),
  Lang VARCHAR(5) NOT NULL,
  Title NVARCHAR(160) NOT NULL,            -- Offset Press Operator
  Location NVARCHAR(80) NULL,              -- Tainan plant
  DescriptionHtml NVARCHAR(MAX) NOT NULL,
  CONSTRAINT PK_JobPostingI18n PRIMARY KEY (JobPostingId, Lang)
);
```

### 4.10 供應商專區

```sql
CREATE TABLE dbo.SupplierNotice (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  CategoryId INT NOT NULL REFERENCES dbo.Category(Id),   -- CategoryType='SupplierNotice'（Policy/ESG/Quality/Logistics）
  NoticeDate DATE NOT NULL,
  AttachmentPath NVARCHAR(260) NULL,       -- 選填
  IsPublished BIT NOT NULL DEFAULT 1, PublishAt DATETIME2(0) NULL, UnpublishAt DATETIME2(0) NULL,
  /* audit */
);

CREATE TABLE dbo.SupplierNoticeI18n (
  SupplierNoticeId INT NOT NULL REFERENCES dbo.SupplierNotice(Id),
  Lang VARCHAR(5) NOT NULL,
  Title NVARCHAR(250) NOT NULL,
  BodyHtml NVARCHAR(MAX) NULL,
  CONSTRAINT PK_SupplierNoticeI18n PRIMARY KEY (SupplierNoticeId, Lang)
);

CREATE TABLE dbo.SupplierSpec (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  SortOrder INT NOT NULL DEFAULT 0,
  IsPublished BIT NOT NULL DEFAULT 1,
  /* audit */
);

CREATE TABLE dbo.SupplierSpecI18n (
  SupplierSpecId INT NOT NULL REFERENCES dbo.SupplierSpec(Id),
  Lang VARCHAR(5) NOT NULL,
  Title NVARCHAR(160) NOT NULL,
  Description NVARCHAR(600) NOT NULL,
  CONSTRAINT PK_SupplierSpecI18n PRIMARY KEY (SupplierSpecId, Lang)
);

CREATE TABLE dbo.SupplierDownload (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  FilePath NVARCHAR(260) NOT NULL,
  FileExt VARCHAR(10) NOT NULL,            -- 自動帶入，前台顯示 PDF/XLSX 標籤
  FileSizeBytes BIGINT NOT NULL,           -- 自動帶入，前台格式化為 2.4 MB
  RequireLogin BIT NOT NULL DEFAULT 0,     -- 受控文件：會員系統上線後才生效（P6）
  DownloadCount INT NOT NULL DEFAULT 0,
  SortOrder INT NOT NULL DEFAULT 0,
  IsPublished BIT NOT NULL DEFAULT 1,
  /* audit */
);

CREATE TABLE dbo.SupplierDownloadI18n (
  SupplierDownloadId INT NOT NULL REFERENCES dbo.SupplierDownload(Id),
  Lang VARCHAR(5) NOT NULL,
  Name NVARCHAR(200) NOT NULL,
  CONSTRAINT PK_SupplierDownloadI18n PRIMARY KEY (SupplierDownloadId, Lang)
);
```

### 4.11 頁面 SEO 與轉址

```sql
-- 固定頁註冊表：內容寫死在前端，這裡只管 SEO（決議 3）
CREATE TABLE dbo.Page (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  PageKey VARCHAR(60) NOT NULL UNIQUE,     -- home|about-difference|green-carbon|...
  RouteTemplate NVARCHAR(200) NOT NULL,    -- /{lang}/about/difference
  HasRichBody BIT NOT NULL DEFAULT 0,      -- 只有 privacy-legal = 1
  OgImagePath NVARCHAR(260) NULL,          -- OG 分享圖
  IsIndexable BIT NOT NULL DEFAULT 1,      -- 0 → noindex
  /* audit */
);

CREATE TABLE dbo.PageI18n (
  PageId INT NOT NULL REFERENCES dbo.Page(Id),
  Lang VARCHAR(5) NOT NULL,
  BodyHtml NVARCHAR(MAX) NULL,             -- 僅 HasRichBody=1 時使用
  Slug NVARCHAR(160) NOT NULL, SeoTitle NVARCHAR(70) NULL, SeoDescription NVARCHAR(180) NULL,
  CanonicalUrl NVARCHAR(300) NULL, OgTitle NVARCHAR(90) NULL, OgDescription NVARCHAR(200) NULL,
  CONSTRAINT PK_PageI18n PRIMARY KEY (PageId, Lang)
);

-- 舊站 301 對照（05-seo 要求，內容遷移 P8 用）
CREATE TABLE dbo.Redirect (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  FromPath NVARCHAR(400) NOT NULL UNIQUE,  -- 一律小寫、含前導 /
  ToPath NVARCHAR(400) NOT NULL,
  StatusCode SMALLINT NOT NULL DEFAULT 301,
  HitCount INT NOT NULL DEFAULT 0,
  IsActive BIT NOT NULL DEFAULT 1,
  /* audit */
  CONSTRAINT CK_Redirect_Status CHECK (StatusCode IN (301,302,308))
);
```

### 4.12 表單

> 建表順序：`QuoteRequest` 參照 `Member`。實際腳本 [`db/migrations/0002_init_schema.sql`](../db/migrations/0002_init_schema.sql) 已將 `Member`／`MemberToken` 上移至 `QuoteRequest` 之前；本節維持依功能分區敘述。

```sql
CREATE TABLE dbo.QuoteRequest (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  QuoteNo VARCHAR(20) NOT NULL UNIQUE,     -- Q20260901-0001，後端產生
  MemberId INT NULL REFERENCES dbo.Member(Id),   -- 未登入送出則為 NULL
  FullName NVARCHAR(80) NOT NULL,
  Company NVARCHAR(120) NOT NULL,
  Email NVARCHAR(160) NOT NULL,
  Phone NVARCHAR(40) NULL,
  SolutionId INT NULL REFERENCES dbo.Solution(Id),      -- 產品類型下拉
  IndustryCategoryId INT NULL REFERENCES dbo.Category(Id),   -- CategoryType='Industry'
  Quantity NVARCHAR(60) NOT NULL,
  SizeText NVARCHAR(100) NULL,             -- L×W×H mm
  MaterialCategoryId INT NULL REFERENCES dbo.Category(Id),   -- CategoryType='QuoteMaterial'
  TargetDate DATE NULL,
  NeedsSustainableAdvice BIT NOT NULL DEFAULT 0,       -- 表單上的勾選項
  Requirement NVARCHAR(MAX) NOT NULL,
  ConsentAt DATETIME2(0) NOT NULL,         -- 隱私權同意時間（個資法留存）
  Status VARCHAR(20) NOT NULL DEFAULT 'New',
  AssigneeId INT NULL,                     -- AdminUser.Id
  InternalNote NVARCHAR(MAX) NULL,
  RepliedAt DATETIME2(0) NULL,
  SourceIp VARCHAR(45) NULL, UserAgent NVARCHAR(400) NULL, SourceLang VARCHAR(5) NULL,
  SubmittedAt DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
  /* audit */
  CONSTRAINT CK_Quote_Status CHECK (Status IN ('New','InProgress','Quoted','Closed','Spam'))
);

CREATE TABLE dbo.QuoteAttachment (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  QuoteRequestId INT NOT NULL REFERENCES dbo.QuoteRequest(Id),
  FilePath NVARCHAR(260) NOT NULL,
  OriginalName NVARCHAR(200) NOT NULL,
  ContentType VARCHAR(100) NOT NULL,
  SizeBytes BIGINT NOT NULL,
  ScanStatus VARCHAR(10) NOT NULL DEFAULT 'Pending',
  CreatedAt DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
  CONSTRAINT CK_QuoteAtt_Scan CHECK (ScanStatus IN ('Pending','Clean','Infected'))
);

CREATE TABLE dbo.ContactMessage (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  Name NVARCHAR(80) NOT NULL,
  Email NVARCHAR(160) NOT NULL,
  Company NVARCHAR(120) NULL,
  Phone NVARCHAR(40) NULL,
  Message NVARCHAR(MAX) NOT NULL,
  ConsentAt DATETIME2(0) NOT NULL,
  Status VARCHAR(20) NOT NULL DEFAULT 'New',
  InternalNote NVARCHAR(MAX) NULL,
  RepliedAt DATETIME2(0) NULL,
  SourceIp VARCHAR(45) NULL, UserAgent NVARCHAR(400) NULL, SourceLang VARCHAR(5) NULL,
  SubmittedAt DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
  /* audit */
  CONSTRAINT CK_Contact_Status CHECK (Status IN ('New','Replied','Closed','Spam'))
);
```

### 4.13 會員與訂單（P6）

```sql
CREATE TABLE dbo.Member (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  Email NVARCHAR(160) NOT NULL UNIQUE,
  PasswordHash NVARCHAR(200) NOT NULL,     -- ASP.NET Core Identity V3 (PBKDF2)，salt 內含
  DisplayName NVARCHAR(80) NOT NULL,
  Company NVARCHAR(120) NULL,
  Phone NVARCHAR(40) NULL,
  PreferredLang VARCHAR(5) NOT NULL DEFAULT 'zh',
  Status VARCHAR(20) NOT NULL DEFAULT 'Pending',
  EmailConfirmedAt DATETIME2(0) NULL,
  LastLoginAt DATETIME2(0) NULL,
  FailedLoginCount TINYINT NOT NULL DEFAULT 0,
  LockoutEndAt DATETIME2(0) NULL,
  /* audit */
  CONSTRAINT CK_Member_Status CHECK (Status IN ('Pending','Active','Suspended'))
);

CREATE TABLE dbo.MemberToken (
  Id BIGINT IDENTITY(1,1) PRIMARY KEY,
  MemberId INT NOT NULL REFERENCES dbo.Member(Id),
  TokenType VARCHAR(20) NOT NULL,          -- EmailVerify|PasswordReset
  TokenHash VARBINARY(32) NOT NULL,        -- 只存 SHA-256，明碼僅寄出
  ExpiresAt DATETIME2(0) NOT NULL,
  UsedAt DATETIME2(0) NULL,
  CreatedAt DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
  CONSTRAINT CK_MemberToken_Type CHECK (TokenType IN ('EmailVerify','PasswordReset'))
);

CREATE TABLE dbo.Orders (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  OrderNo VARCHAR(20) NOT NULL UNIQUE,
  MemberId INT NOT NULL REFERENCES dbo.Member(Id),
  QuoteRequestId INT NULL REFERENCES dbo.QuoteRequest(Id),
  Title NVARCHAR(200) NOT NULL,
  Status VARCHAR(20) NOT NULL DEFAULT 'Confirmed',
  ExpectedShipDate DATE NULL,
  /* audit */
  CONSTRAINT CK_Order_Status CHECK (Status IN ('Confirmed','InProduction','Shipped','Completed','Cancelled'))
);

CREATE TABLE dbo.OrderProgress (
  Id BIGINT IDENTITY(1,1) PRIMARY KEY,
  OrderId INT NOT NULL REFERENCES dbo.Orders(Id),
  Stage VARCHAR(20) NOT NULL,              -- Design|PrePress|Printing|PostPress|QC|Shipping
  StageStatus VARCHAR(20) NOT NULL,        -- Pending|Doing|Done
  HappenedAt DATETIME2(0) NOT NULL,
  Note NVARCHAR(400) NULL,
  CreatedAt DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(), CreatedBy INT NULL
);
```

> `Order` 為 T-SQL 保留字，資料表命名為 **`Orders`**。

### 4.14 系統

```sql
CREATE TABLE dbo.Role (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  Code VARCHAR(30) NOT NULL UNIQUE,        -- SuperAdmin|Editor|Viewer
  Name NVARCHAR(60) NOT NULL,
  IsSystem BIT NOT NULL DEFAULT 0          -- 系統角色不可刪
);

CREATE TABLE dbo.RolePermission (
  RoleId INT NOT NULL REFERENCES dbo.Role(Id),
  PermissionCode VARCHAR(60) NOT NULL,     -- {unit}.{view|edit|publish|delete|export}
  CONSTRAINT PK_RolePermission PRIMARY KEY (RoleId, PermissionCode)
);

CREATE TABLE dbo.AdminUser (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  Email NVARCHAR(160) NOT NULL UNIQUE,
  PasswordHash NVARCHAR(200) NOT NULL,
  DisplayName NVARCHAR(80) NOT NULL,
  RoleId INT NOT NULL REFERENCES dbo.Role(Id),
  IsActive BIT NOT NULL DEFAULT 1,
  LastLoginAt DATETIME2(0) NULL,
  FailedLoginCount TINYINT NOT NULL DEFAULT 0,
  LockoutEndAt DATETIME2(0) NULL,
  MustChangePassword BIT NOT NULL DEFAULT 1,
  /* audit */
);

CREATE TABLE dbo.AuditLog (
  Id BIGINT IDENTITY(1,1) PRIMARY KEY,
  AdminUserId INT NULL,
  Action VARCHAR(20) NOT NULL,             -- Create|Update|Delete|Publish|Login|Export
  EntityName VARCHAR(60) NOT NULL,
  EntityId INT NULL,
  ChangesJson NVARCHAR(MAX) NULL,          -- { field: [before, after] }
  SourceIp VARCHAR(45) NULL,
  CreatedAt DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE TABLE dbo.EmailLog (
  Id BIGINT IDENTITY(1,1) PRIMARY KEY,
  MailType VARCHAR(30) NOT NULL,           -- QuoteNotify|QuoteConfirm|ContactNotify|MemberVerify|PasswordReset
  ToAddress NVARCHAR(300) NOT NULL,
  Subject NVARCHAR(250) NOT NULL,
  RelatedEntity VARCHAR(60) NULL, RelatedId INT NULL,
  Status VARCHAR(10) NOT NULL,             -- Sent|Failed
  ErrorMessage NVARCHAR(1000) NULL,
  SentAt DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME()
);
```

---

### 4.15 預留與系統表

```sql
-- 預留（待客戶確認）：電子報訂閱｜09-cms-admin.md §2.1 缺口一
-- double opt-in 的 token 只存 SHA-256（比照 MemberToken）；Source='Import' 支援舊站名單遷移。
-- 訂閱者無可翻譯欄位，故不設 *I18n 側表。EmailLog.MailType 無 CHECK，未來加 NewsletterConfirm 不需改 schema。
CREATE TABLE dbo.NewsletterSubscriber (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  Email NVARCHAR(160) NOT NULL UNIQUE,
  DisplayName NVARCHAR(80) NULL, Company NVARCHAR(120) NULL,
  PreferredLang VARCHAR(5) NOT NULL DEFAULT 'en',
  Status VARCHAR(20) NOT NULL DEFAULT 'Pending',   -- Pending|Subscribed|Unsubscribed|Bounced
  Source VARCHAR(20) NOT NULL DEFAULT 'Website',   -- Website|Import|Admin
  ConsentAt DATETIME2(0) NULL,                     -- 訂閱同意時間（個資法留存）
  ConfirmToken VARBINARY(32) NULL, ConfirmTokenExpiresAt DATETIME2(0) NULL, ConfirmedAt DATETIME2(0) NULL,
  UnsubscribeToken VARBINARY(32) NULL,             -- 退訂連結用，長期有效
  UnsubscribedAt DATETIME2(0) NULL, UnsubscribeReason NVARCHAR(200) NULL,
  LastSentAt DATETIME2(0) NULL, BounceCount TINYINT NOT NULL DEFAULT 0,
  SourceIp VARCHAR(45) NULL, UserAgent NVARCHAR(400) NULL, SourceLang VARCHAR(5) NULL,
  SubscribedAt DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
  /* audit */
  CONSTRAINT CK_NewsletterSubscriber_Status CHECK (Status IN ('Pending','Subscribed','Unsubscribed','Bounced')),
  CONSTRAINT CK_NewsletterSubscriber_Source CHECK (Source IN ('Website','Import','Admin'))
);

-- 遷移記錄表（§8 的機制核心）。ScriptName / Applied 兩欄刻意與 DbUp 預設 journal 相容，
-- 名稱與型別不可更動；其餘欄位皆可 NULL 或帶 DEFAULT，故不影響 DbUp 寫入。
CREATE TABLE dbo.SchemaVersion (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  ScriptName NVARCHAR(255) NOT NULL UNIQUE,
  Applied DATETIME NOT NULL DEFAULT GETDATE(),     -- DbUp 相容欄
  AppliedUtc DATETIME2(0) NULL DEFAULT SYSUTCDATETIME(),
  AppliedBy NVARCHAR(128) NULL DEFAULT SUSER_SNAME(),
  Checksum CHAR(64) NULL                           -- 腳本 SHA-256；供 runner 偵測「已套用的檔被事後編輯」
);
```

### 4.16 Category 型別安全（實作補充）

`Category` 是全 schema 唯一的橫向共用主檔（九種 `CategoryType` 服務八個內容單元與報價表單）。
單純的外鍵只保證「分類存在」、**不保證「型別正確」**——`News.CategoryId` 可以指到
`CategoryType='Facility'` 的列而不被擋下。

[`db/migrations/0002_init_schema.sql`](../db/migrations/0002_init_schema.sql) 因此在每個引用端加一個
PERSISTED 常數計算欄，與 `CategoryId` 組成複合外鍵：

```sql
-- Category 端：供下游複合 FK 參照
CONSTRAINT UQ_Category_Id_Type UNIQUE (Id, CategoryType)

-- 各引用端（News 為例，其餘 Project／Vlog／Faq／Certification／FacilityItem／
-- SupplierNotice／QuoteRequest 的兩個分類欄同理，共 9 條）
CategoryTypeGuard AS CAST('News' AS VARCHAR(30)) PERSISTED,
CONSTRAINT FK_News_Category FOREIGN KEY (CategoryId, CategoryTypeGuard)
    REFERENCES dbo.Category(Id, CategoryType)
```

計算欄為常數、零維護成本；`CategoryId` 可為 NULL 時複合 FK 自動不檢查（MATCH SIMPLE 語意），
故不影響 `Faq`／`Certification` 這類選填分類的單元。


---

## 5. 索引

Azure SQL **Basic（5 DTU / 2 GB）**，索引寧缺勿濫；下列為必要清單。

```sql
-- slug 路由（前台每次詳細頁都會打）
-- 刻意不含 IsDeleted：軟刪的內容仍永久佔用 slug。SEO 上舊網址不該被回收後指向不同內容。
CREATE UNIQUE INDEX UX_NewsI18n_Lang_Slug ON dbo.NewsI18n(Lang, Slug);
CREATE UNIQUE INDEX UX_SolutionI18n_Lang_Slug ON dbo.SolutionI18n(Lang, Slug);
CREATE UNIQUE INDEX UX_PageI18n_Lang_Slug ON dbo.PageI18n(Lang, Slug);

-- 列表：上架 + 日期排序
CREATE INDEX IX_News_List ON dbo.News(IsDeleted, IsPublished, PublishDate DESC) INCLUDE(CategoryId, CoverImagePath);
CREATE INDEX IX_SupplierNotice_List ON dbo.SupplierNotice(IsDeleted, IsPublished, NoticeDate DESC);

-- 列表：上架 + 手動排序
CREATE INDEX IX_Project_List ON dbo.Project(IsDeleted, IsPublished, SortOrder);
CREATE INDEX IX_Certification_Home ON dbo.Certification(IsDeleted, IsPublished, ShowOnHome, SortOrder);
CREATE INDEX IX_HomeBanner_List ON dbo.HomeBanner(IsDeleted, IsPublished, SortOrder);

-- 分類主檔
CREATE INDEX IX_Category_Type ON dbo.Category(CategoryType, IsActive, SortOrder);

-- 後台表單管理
CREATE INDEX IX_Quote_Status ON dbo.QuoteRequest(Status, SubmittedAt DESC);
CREATE INDEX IX_Contact_Status ON dbo.ContactMessage(Status, SubmittedAt DESC);

-- 會員／轉址／稽核
CREATE INDEX IX_MemberToken_Lookup ON dbo.MemberToken(TokenHash) INCLUDE(MemberId, ExpiresAt, UsedAt);
CREATE INDEX IX_AuditLog_Entity ON dbo.AuditLog(EntityName, EntityId, CreatedAt DESC);

-- 轉址：一個索引同時做唯一性與覆蓋，取代原本的 FromPath UNIQUE + IX_Redirect_From
-- （兩者對同一欄位重複建索引，在 Basic 層是純粹的浪費）
CREATE UNIQUE INDEX UX_Redirect_FromPath ON dbo.Redirect(FromPath) INCLUDE(ToPath, StatusCode, IsActive);

-- 全站僅一支主打影片（09-cms-admin.md §05 的業務規則，改由 DB 層保證）
CREATE UNIQUE INDEX UX_Vlog_MainFeature ON dbo.Vlog(IsMainFeature) WHERE IsMainFeature = 1 AND IsDeleted = 0;

-- 外鍵支撐索引：外鍵欄位若無索引，父表刪改時會全表掃描子表
CREATE INDEX IX_SolutionItem_Solution   ON dbo.SolutionItem(SolutionId, SortOrder);
CREATE INDEX IX_QuoteAttachment_Quote   ON dbo.QuoteAttachment(QuoteRequestId);
CREATE INDEX IX_Orders_Member           ON dbo.Orders(MemberId, CreatedAt DESC);
CREATE INDEX IX_OrderProgress_Order     ON dbo.OrderProgress(OrderId, HappenedAt);

-- 預留（待客戶確認）：電子報後台清單
CREATE INDEX IX_NewsletterSubscriber_Status ON dbo.NewsletterSubscriber(Status, SubscribedAt DESC)
    INCLUDE(Email, PreferredLang);
```

> `filtered index`（含 `WHERE` 子句者）建立時要求 `QUOTED_IDENTIFIER` 為 ON。sqlcmd 預設是 OFF，執行遷移務必帶 `-I`。

---

## 6. 種子資料

### 6.1 角色與權限

**權威來源為 [`09-cms-admin.md` §6](09-cms-admin.md) 的權限矩陣**，逐格展開為 `RolePermission` 種子列（見 [`db/seed/110_role_permission.sql`](../db/seed/110_role_permission.sql)）。

| Role.Code | 名稱 | 權限範圍 |
|-----------|------|------|
| `SuperAdmin` | 超級管理員 | 24 個單元全動作（83 列） |
| `Editor` | 內容編輯 | 內容單元 01–14 的 `view/edit/publish/delete`；15 頁面 SEO 與 16 轉址；17 報價／18 聯絡的檢視與改狀態。**不可** `quote.download`／`quote.export`，不可觸及 19 會員、20 訂單、21 設定、22 分類、23 管理員、24 操作紀錄（67 列） |
| `Viewer` | 檢視者 | 內容單元 01–14、15、16、17、18、21、22 的 `view`。**對 19 會員、20 訂單、23 管理員、24 操作紀錄無任何權限**（21 列） |

權限碼格式 `{單元代號}.{action}`，`unit` 對應 [09-cms-admin.md](09-cms-admin.md) 的單元代號（如 `news.edit`、`quote.export`）。合計 **171 列**，由 `db/verify/verify.sql` 斷言。

矩陣描述到、但原本未定代號的三項，本次補上：`quote.download`（報價附件下載）、`redirect.export`（轉址 CSV 匯入匯出）、`audit.resend`（`EmailLog` 重寄）。

`SuperAdmin` 亦逐列展開、**不使用 `system.*` 之類的萬用碼**——RBAC 檢查邏輯保持單一（一律查 `RolePermission`）且可稽核；新增後台單元時只需在種子檔加一列。

### 6.2 分類（`Category`）

| CategoryType | 初始值（Code） |
|---|---|
| `News` | esg / awards / partnership / sustainability / event |
| `Project` | food / pharma / cosmetics / electronics / gift / other |
| `Vlog` | sustainability / low-carbon / awards |
| `Faq` | general / ordering / materials / sustainability |
| `Certification` | certification / partnership / award |
| `Facility` | pre-press / eco-printing / post-press / quality / tour |
| `SupplierNotice` | policy / esg / quality / logistics |
| `Industry` | food-beverage / electronics / beauty / medical / luxury-gift / hardware / automotive / publishing / home-lifestyle / industrial |
| `QuoteMaterial` | fsc / recycled / kraft / specialty |

### 6.3 全站設定（`SiteSetting`）

| GroupName | SettingKey | 型別 | 多語 |
|---|---|---|---|
| Company | `company.name`、`company.address`、`company.hours` | text/multiline | ✓ |
| Company | `company.phone`、`company.fax`、`company.email`、`company.map_embed` | text/url | — |
| Social | `social.facebook`、`social.linkedin`、`social.youtube` | url | — |
| Home | `home.gallery_image`、`home.gallery_alt` | image/text | 圖—／alt ✓ |
| Mail | `mail.quote_notify_to`、`mail.contact_notify_to`、`mail.bcc` | email | — |

### 6.4 頁面（`Page`）
**29 筆**固定頁 = 28 筆既有（mockup 44 頁扣掉 12 支 `news-*` 與 4 支 `products-*`；後兩者的 SEO 由 `NewsI18n` / `SolutionI18n` 提供）+ 1 筆預留的 `green-csr`：

`home`、`about-hub`(differences)、`about-difference`、`about-benefits`、`about-certifications`、`facility`、`facility-pre-press`、`facility-eco-printing`、`facility-post-press`、`facility-quality`、`facility-tour`、`solutions`、`projects`、`sustainability-hub`(green-advantage)、`green-our-advantage`、`green-carbon`、`green-materials`、`green-esg`、`green-csr`、`insights`、`news-list`、`green-vlog`、`faq`、`industry-trends`、`careers`、`supplier-area`、`contact`、`get-a-quote`、`privacy-legal`。

`HasRichBody = 1` 者兩筆：`privacy-legal`（原生唯一可後台編輯全文的固定頁）與 `green-csr`。

> **預留（待客戶確認）**：`green-csr` 對應 [09-cms-admin.md §2.1](09-cms-admin.md) 缺口二。設為 `HasRichBody = 1` 是為了讓客戶點頭後能直接在後台撰稿上線、不需改前端程式（09 §7 的擴充路徑）；同時設 `IsIndexable = 0`，避免未確認前的空頁被搜尋引擎索引。

`RouteTemplate` 的實際值見 [`db/seed/140_page.sql`](../db/seed/140_page.sql)，依 [05-seo.md](05-seo.md) 的 `/zh` `/en` 子路徑策略與 IA 層級推導；02-frontend 路由定案後以該檔為準修改。

---

## 7. 查詢範例（Dapper）

```sql
-- 前台：新聞列表（單一語系、分頁、含分類名）
SELECT n.Id, i.Slug, i.Title, i.Summary, n.PublishDate, n.CoverImagePath, i.CoverAlt, c.Name AS CategoryName
FROM dbo.News n
JOIN dbo.NewsI18n i ON i.NewsId = n.Id AND i.Lang = @lang
JOIN dbo.Category cat ON cat.Id = n.CategoryId
JOIN dbo.CategoryI18n c ON c.CategoryId = cat.Id AND c.Lang = @lang
WHERE n.IsDeleted = 0 AND n.IsPublished = 1
  AND (n.PublishAt IS NULL OR n.PublishAt <= SYSUTCDATETIME())
  AND (n.UnpublishAt IS NULL OR n.UnpublishAt > SYSUTCDATETIME())
  AND (@categoryId IS NULL OR n.CategoryId = @categoryId)
ORDER BY n.PublishDate DESC, n.Id DESC
OFFSET (@page - 1) * @pageSize ROWS FETCH NEXT @pageSize ROWS ONLY;
```

```sql
-- 後台：中英完成度（清單頁的 zh/en badge）
SELECT n.Id,
       MAX(CASE WHEN i.Lang = 'zh' THEN 1 ELSE 0 END) AS HasZh,
       MAX(CASE WHEN i.Lang = 'en' THEN 1 ELSE 0 END) AS HasEn
FROM dbo.News n LEFT JOIN dbo.NewsI18n i ON i.NewsId = n.Id
WHERE n.IsDeleted = 0 GROUP BY n.Id;
```

寫入規則：主表 + i18n 兩表一律包在**同一個 transaction**；排序調整用單一 `UPDATE ... FROM (VALUES ...)` 批次寫回，不逐筆。

> **定序注意**：資料庫定序為 `Latin1_General_100_CI_AS_SC`，與伺服器／tempdb 定序不同（本機與 Azure 皆然）。任何 `#temp` 表的字串欄位一律加 `COLLATE DATABASE_DEFAULT`，否則 JOIN 時會出現 `Cannot resolve the collation conflict`。

---

## 8. 遷移與環境

- **Schema 版本控管**：`.sql` 遷移檔 ＋ `SchemaVersion` 表（§4.15），由部署流程順序執行；不用 EF Migrations（本專案用 Dapper）。實作在 [`db/`](../db/)：

  | 目錄 | 性質 |
  |---|---|
  | `db/local/` | **只在本機執行**：建庫／砍庫／dev 帳號。Azure 的資料庫由 `az sql db create` 建立，且不支援 `USE` 與 user database 下的 `CREATE DATABASE`，故刻意隔離、runner 不掃。 |
  | `db/migrations/` | 一次性、依序（`NNNN_snake_case.sql`）。**套用後不可修改**，要改請新開一支；`SchemaVersion.Checksum` 供 runner 偵測竄改。 |
  | `db/seed/` | run-always 冪等（`NNN_snake_case.sql`）。用 `VALUES` + `WHERE NOT EXISTS`（自然鍵），不用 `MERGE`。`Role`／`Solution`／`Page` 以 `IDENTITY_INSERT` 固定 Id，讓各環境一致。 |
  | `db/verify/` | 建置後自我檢核，任一項 FAIL 即回傳非 0。 |

  `SchemaVersion` 的 `ScriptName`／`Applied` 兩欄與 DbUp 預設 journal 相容，未來要換成 DbUp runner 只需一行 `.JournalToSqlTable("dbo","SchemaVersion")`。

- **定序**：`Latin1_General_100_CI_AS_SC`（**建庫後不可更改**）。`_SC` 讓 `LEN()`／`SUBSTRING()` 正確處理 4-byte 字元（emoji、罕用漢字），否則後台「SEO Title 70 字」提示會算錯；`CI` 讓 slug 與 `Redirect.FromPath` 的大小寫視為相同。代價見 §7 的定序注意。
- **環境**：dev / prod 兩套資料庫；prod 只由 pipeline 執行遷移。本機容器是 **Developer Edition**（等同 Enterprise 功能集），Basic 不支援的語法會「本機過、Azure 炸」——禁用清單見 [`db/README.md`](../db/README.md) 的相容性 checklist。另 `READ_COMMITTED_SNAPSHOT` 在 Azure 預設 ON、本機預設 OFF，建庫腳本已主動對齊。
- **內容遷移（P8）**：舊站 WordPress 約 80 篇文章 → `News` + `NewsI18n`；同時產出 `Redirect` 對照。遷移腳本先跑 dev、比對筆數與媒體 checksum，再上 prod。
- **備份**：Basic 層內建 7 天 PITR，另每月匯出 `.bacpac` 至 Blob。
- **容量估算**：內容列 < 5,000 筆、富文本平均 < 20 KB → 資料庫本體 < 200 MB，Basic 2 GB 充裕；**圖檔一律在 Blob，不入庫**。

---

## 9. DoD

> 僅列 schema 獨有項；安全／效能／可維運的通則見 [`03-backend.md` §5](03-backend.md)。

- [ ] 所有內容表具備稽核五欄與 `*I18n` 子表（例外：`ClientLogo` 品牌名不翻譯故無 i18n）；需排程上下架者具備完整四欄（例外：`Faq`／`SolutionItem`／`Certification`／`ClientLogo`／`FacilityItem`／`SupplierSpec`／`SupplierDownload` 僅需 `IsPublished`）。
- [ ] 有網址的實體（`Page`／`News`／`Solution`）具備完整 SEO 欄位組。
- [ ] 每個圖片欄位都有對應的多語 `Alt` 欄位。
- [ ] 遷移腳本可從空庫一次建置到位並帶入 §6 種子。
- [ ] `db/verify/verify.sql` 全數 PASS（49 張表、35 條外鍵、0 個匿名約束、171 列權限、種子筆數相符）。
- [ ] 冪等實測：`db/tools/run-local.sh` **連續跑兩次**零錯誤且 verify 輸出相同。

---

## 變更紀錄

| 日期 | 修改者 | 摘要 |
|------|--------|------|
| 2026-09-01 | Tim（Claude Code） | 初版：依 mockup 44 頁實際結構與三條專案決議（單元式後台／無 Media Library／固定文字不進後台）定義 31 張表、索引、種子與遷移策略 |
| 2026-09-02 | Tim（Claude Code） | 產出可執行建置腳本 [`db/`](../db/)（本機 SQL Server 開發、語法相容 Azure SQL）：展開稽核五欄、約束全面具名、補 `SchemaVersion` DDL（§4.15）、重排建表順序（`Member` 前移）。新增 §4.16 Category 型別安全（複合外鍵，DB 層擋下「把 Facility 分類掛到 News」）。納入三個待客戶確認缺口的預留 schema（`NewsletterSubscriber`／`HomeBanner.MediaType`+`VideoPath`／`Page` 的 `green-csr`），表數 47 → 49。索引調整：移除與 UNIQUE 重複的 `IX_Redirect_From`、新增 `UX_Vlog_MainFeature` 與 4 條外鍵支撐索引。§6.1 權限改以 09 §6 矩陣為權威（修正 Editor 可 delete、Viewer 非「全部 view」兩處錯誤），補 `quote.download`／`redirect.export`／`audit.resend` 三個權限碼。§8 補定序決策與 Azure 相容性。 |

*最後更新：2026-09-02*
