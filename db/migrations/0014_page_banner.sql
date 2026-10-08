/* =============================================================================
   0014_page_banner.sql  —  頂部橫幅圖改由後台維護：Page.BannerImagePath（2026-10-08）
   -----------------------------------------------------------------------------
   20 個固定頁的頂部大圖（.fac-banner）原本寫死在前台，改放進後台單元 15
   「頁面設定與 SEO」該頁的編輯畫面（與 0013 的頁面影片同一個做法）。
   哪幾頁有橫幅由 Api/Common/Constants.cs 的 PageBannerPages 決定。

   一次性補上 mockup 目前那張圖（只補 NULL，不蓋後台改過的值）。

   與 EF 那條路徑的 Api/Data/Migrations/*_PageBanner 一對一（schema 權威在那邊，
   見 db/README 與 docs/10 §8）。

   套用後：表數、外鍵、索引不變；Page 欄位 +1。
   ============================================================================= */
SET NOCOUNT ON;
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET XACT_ABORT ON;
GO

IF COL_LENGTH('dbo.Page', 'BannerImagePath') IS NULL
    ALTER TABLE dbo.Page ADD BannerImagePath NVARCHAR(260) NULL;      -- 頂部橫幅圖
GO

BEGIN TRAN;

UPDATE p SET p.BannerImagePath = v.Path
FROM dbo.Page p
INNER JOIN (VALUES
    ('about-hub',             N'assets/ref-about-banner.webp'),
    ('about-difference',      N'assets/ref-about-mid1.webp'),
    ('about-benefits',        N'assets/ref-about-mid3.webp'),
    ('about-certifications',  N'assets/ref-about-mid2.webp'),
    ('facility',              N'assets/fac-banner.webp'),
    ('facility-pre-press',    N'assets/fac-pre-ctp.jpg'),
    ('facility-eco-printing', N'assets/fac-eco-pressroom.jpg'),
    ('facility-post-press',   N'assets/fac-post-diecut.jpg'),
    ('facility-quality',      N'assets/fac-banner.webp'),
    ('facility-tour',         N'assets/fac-tour-main.webp'),
    ('solutions',             N'assets/ref-sol-banner.webp'),
    ('sustainability-hub',    N'assets/ref-green-banner.webp'),
    ('green-our-advantage',   N'assets/ref-green-mid2.webp'),
    ('green-carbon',          N'assets/ref-green-mid3.webp'),
    ('green-materials',       N'assets/ref-green-mid1.webp'),
    ('green-esg',             N'assets/ref-green-mid4.webp'),
    ('insights',              N'assets/green-tree.webp'),
    ('news-list',             N'assets/diff-grid.webp'),
    ('industry-trends',       N'assets/sol-patterns.webp'),
    ('careers',               N'assets/fac-tour-main.webp')
) v(PageKey, Path) ON v.PageKey = p.PageKey
WHERE p.BannerImagePath IS NULL;

IF NOT EXISTS (SELECT 1 FROM dbo.SchemaVersion WHERE ScriptName = N'0014_page_banner.sql')
    INSERT dbo.SchemaVersion (ScriptName) VALUES (N'0014_page_banner.sql');

COMMIT;
GO
