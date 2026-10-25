/* =============================================================================
   320_projects_hide_cases.sql  —  Projects 頁隱藏「案例分享」後，導言的中文跟著換 key（2026-10-25）
   -----------------------------------------------------------------------------
   客戶目前沒有案例資料，前台把 /printing-projects 的「案例分享」區塊與選單拿掉，
   導言也刪掉「— explore our custom box portfolio and packaging case study highlights below」。
   頁面文字的覆寫以英文原文的 hash 為 key，英文一改，250 寫入的那筆中文就對不到了，
   頁面會落回 apps/web/src/lib/zh.ts。這支以新原文的 hash 補一筆中文（客戶 09-30 稿去掉「探索…案例精選」）。

   只動 projects 頁；printing-solutions 頁同一段原文沒改，250 的那筆照用。
   舊 hash 的中文列（含「案例分享」標題那筆）不刪：對不到任何原文，前台不會用到，
   還原隱藏時也接得回來。
   冪等：新 hash 已有中文（含後台改過的）就不動。
   ============================================================================= */
SET NOCOUNT ON;
SET XACT_ABORT ON;
GO

BEGIN TRAN;

INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', 'ee1c1c51785eb300dd3ee8131d96a25dbb562a2b1551e2f82fb48cf50ec0729b',
       N'From packaging to promotional materials, NTI collaborates with brands across industries to deliver sustainable, high-quality results. Each project reflects our commitment to innovation, precision, and environmental responsibility.',
       N'從包裝到促銷材料，南台彩藝與各產業品牌合作，交付永續且高品質的成果，見證每個專案背後的創新、精準與環境責任。'
FROM dbo.Page p
WHERE p.PageKey = N'projects'
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = 'ee1c1c51785eb300dd3ee8131d96a25dbb562a2b1551e2f82fb48cf50ec0729b');

COMMIT;
GO
