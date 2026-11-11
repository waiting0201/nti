/* =============================================================================
   0027_client_revisions_nov11.sql  —  客戶 2026-11-11《NTI 官網修改清單》的資料面變更
   -----------------------------------------------------------------------------
   1. 首頁方案卡英文改短名：Color Box／Paperboard／UV Printing（不變）／Other。
      只動英文 Name（首頁方案卡、報價表單品項）；H1、SEO 與中文都不變。
      只改還是原值的列，後台改過的不蓋。
   2. Projects 頁加頂部橫幅與圖示下方的圖：Api/Common/Constants.cs 的
      PageBannerPages（20 → 21 頁）與 PageMidBannerPages（11 → 12 頁）加 projects。
      一次性補上 mockup 那兩張（只補 NULL）。
   3. 頁尾社群加回 LinkedIn：social.linkedin 由 db/seed/130_site_setting.sql（run-always）補上，這裡不重複。

   與 EF 那條路徑的 Api/Data/Migrations/*_ClientRevisionsNov11 一對一（schema 權威在那邊，
   見 db/README 與 docs/10 §8）。

   套用後：schema 不變。
   ============================================================================= */
SET NOCOUNT ON;
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET XACT_ABORT ON;
GO

BEGIN TRAN;

UPDATE t SET t.Name = v.NewName
FROM dbo.SolutionI18n t
INNER JOIN dbo.Solution s ON s.Id = t.SolutionId
INNER JOIN (VALUES
    ('boxes',     N'Color Box Packaging',  N'Color Box'),
    ('cardboard', N'Packaging Paperboard', N'Paperboard'),
    ('other',     N'Other Printing',       N'Other')
) v(Code, OldName, NewName) ON v.Code = s.Code
WHERE t.Lang = 'en' AND t.Name = v.OldName;

UPDATE dbo.Page
SET BannerImagePath     = COALESCE(BannerImagePath, N'assets/ref-sol-projects.webp'),
    MidBanner1ImagePath = COALESCE(MidBanner1ImagePath, N'assets/ref-home-mid1.webp')
WHERE PageKey = 'projects';

IF NOT EXISTS (SELECT 1 FROM dbo.SchemaVersion WHERE ScriptName = N'0027_client_revisions_nov11.sql')
    INSERT dbo.SchemaVersion (ScriptName) VALUES (N'0027_client_revisions_nov11.sql');

COMMIT;
GO
