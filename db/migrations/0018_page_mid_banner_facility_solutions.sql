/* =============================================================================
   0018_page_mid_banner_facility_solutions.sql  —  中段橫幅補上漏掉的兩頁（2026-10-25）
   -----------------------------------------------------------------------------
   0017 只認 <section class="fac-banner reveal">，漏了兩張頁面中段的大圖：
     - solutions（Printing Solutions）Projects 區塊那張：<div class="fac-banner reveal mt-m">
     - facility（Facilities & Equipment）Factory Tour 全幅照：<div class="fullbleed tour-photo reveal mt-m">
   Api/Common/Constants.cs 的 PageMidBannerPages 補這兩頁各 1 張（9 → 11 頁、15 → 17 張）。

   一次性補上 mockup 目前那張（只補 NULL，不蓋後台改過的值）。

   與 EF 那條路徑的 Api/Data/Migrations/*_PageMidBannerFacilitySolutions 一對一（schema 權威在那邊，
   見 db/README 與 docs/10 §8）。

   套用後：schema 不變。
   ============================================================================= */
SET NOCOUNT ON;
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET XACT_ABORT ON;
GO

BEGIN TRAN;

UPDATE p SET p.MidBanner1ImagePath = COALESCE(p.MidBanner1ImagePath, v.P1)
FROM dbo.Page p
INNER JOIN (VALUES
    ('facility',  N'assets/fac-tour-main.webp'),
    ('solutions', N'assets/ref-sol-projects.webp')
) v(PageKey, P1) ON v.PageKey = p.PageKey;

IF NOT EXISTS (SELECT 1 FROM dbo.SchemaVersion WHERE ScriptName = N'0018_page_mid_banner_facility_solutions.sql')
    INSERT dbo.SchemaVersion (ScriptName) VALUES (N'0018_page_mid_banner_facility_solutions.sql');

COMMIT;
GO
