/* =============================================================================
   0017_page_mid_banner.sql  —  頁面中段橫幅圖改由後台維護：Page.MidBanner1～4ImagePath（2026-10-25）
   -----------------------------------------------------------------------------
   9 個固定頁中段的大圖（不緊接 header 的 .fac-banner，共 15 張）原本寫死在前台，
   改放進後台單元 15「頁面設定與 SEO」該頁的編輯畫面（與 0014 的頂部橫幅同一個做法）。
   哪幾頁、各幾張由 Api/Common/Constants.cs 的 PageMidBannerPages 決定，最多 4 張。

   一次性補上 mockup 目前那幾張圖（只補 NULL，不蓋後台改過的值）。

   與 EF 那條路徑的 Api/Data/Migrations/*_PageMidBanner 一對一（schema 權威在那邊，
   見 db/README 與 docs/10 §8）。

   套用後：表數、外鍵、索引不變；Page 欄位 +4。
   ============================================================================= */
SET NOCOUNT ON;
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET XACT_ABORT ON;
GO

IF COL_LENGTH('dbo.Page', 'MidBanner1ImagePath') IS NULL
    ALTER TABLE dbo.Page ADD
        MidBanner1ImagePath NVARCHAR(260) NULL,                       -- 中段橫幅圖，依頁面由上而下
        MidBanner2ImagePath NVARCHAR(260) NULL,
        MidBanner3ImagePath NVARCHAR(260) NULL,
        MidBanner4ImagePath NVARCHAR(260) NULL;
GO

BEGIN TRAN;

UPDATE p SET
    p.MidBanner1ImagePath = COALESCE(p.MidBanner1ImagePath, v.P1),
    p.MidBanner2ImagePath = COALESCE(p.MidBanner2ImagePath, v.P2),
    p.MidBanner3ImagePath = COALESCE(p.MidBanner3ImagePath, v.P3),
    p.MidBanner4ImagePath = COALESCE(p.MidBanner4ImagePath, v.P4)
FROM dbo.Page p
INNER JOIN (VALUES
    ('about-hub',            N'assets/ref-about-mid1.webp',   N'assets/ref-about-mid2.webp', N'assets/ref-about-mid3.webp', NULL),
    ('about-difference',     N'assets/ref-about-mid2.webp',   NULL, NULL, NULL),
    ('about-benefits',       N'assets/ref-about-banner.webp', NULL, NULL, NULL),
    ('about-certifications', N'assets/ref-about-mid1.webp',   NULL, NULL, NULL),
    ('facility-tour',        N'assets/fac-tour1.webp',        N'assets/fac-tour2.webp', NULL, NULL),
    ('sustainability-hub',   N'assets/ref-green-mid2.webp',   N'assets/ref-green-mid3.webp', N'assets/ref-green-mid1.webp', N'assets/ref-green-mid4.webp'),
    ('green-our-advantage',  N'assets/ref-green-mid4.webp',   NULL, NULL, NULL),
    ('green-carbon',         N'assets/ref-green-mid4.webp',   NULL, NULL, NULL),
    ('green-esg',            N'assets/ref-green-mid3.webp',   NULL, NULL, NULL)
) v(PageKey, P1, P2, P3, P4) ON v.PageKey = p.PageKey;

IF NOT EXISTS (SELECT 1 FROM dbo.SchemaVersion WHERE ScriptName = N'0017_page_mid_banner.sql')
    INSERT dbo.SchemaVersion (ScriptName) VALUES (N'0017_page_mid_banner.sql');

COMMIT;
GO
