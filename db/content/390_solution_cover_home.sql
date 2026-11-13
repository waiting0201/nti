/* =============================================================================
   390_solution_cover_home.sql  —  方案封面改用首頁方案卡那四張圖（2026-11-13）
   -----------------------------------------------------------------------------
   後台 02「方案封面」的提示一直寫「同時用於首頁 Printing Solutions 卡片」，前台卻把
   首頁那四張圖寫死（mockup 的 hp-prod-*），封面換了也不會變（2026-11-13 稽核 A5）。
   這次前台改成真的讀封面，所以封面的預設值要換成首頁原本那四張，否則一部署首頁
   的四張圖就會變成 200_mockup_content.sql 當初隨手帶的品項照。

   只改「還是預設值」的封面：種子的佔位路徑，或 200 帶的那張品項照。
   客戶在後台上傳過的（路徑是 2026/11/{guid}.webp 這種）不動。冪等，可重跑。
   ⚠️ 正式庫請在部署新版前台之前跑；晚跑的後果是首頁四張卡暫時顯示品項照，不會壞圖。
   ============================================================================= */
SET NOCOUNT ON;
SET XACT_ABORT ON;
GO

BEGIN TRAN;

UPDATE s
SET    s.CoverImagePath = v.HomeCover
FROM   dbo.Solution s
JOIN  (VALUES
        (N'boxes',     N'assets/prod-box-gluing.jpg',   N'assets/hp-prod-boxes.png'),
        (N'cardboard', N'assets/prod-card-hangtag.jpg', N'assets/hp-prod-cardboard.webp'),
        (N'uv',        N'assets/prod-uv-print.jpg',     N'assets/hp-prod-uv.webp'),
        (N'other',     N'assets/prod-other-bag.jpg',    N'assets/hp-prod-other.webp')
      ) v (Code, OldDefault, HomeCover) ON v.Code = s.Code
WHERE  s.CoverImagePath IN (v.OldDefault, N'solutions/_placeholder.webp');

PRINT CONCAT(N'方案封面改為首頁方案卡的圖：', @@ROWCOUNT, N' 筆');

COMMIT;
GO
