/* =============================================================================
   260_slug_rename.sql  —  新站 8 個網址更名後，把資料庫裡指向舊網址的值改到新網址
   -----------------------------------------------------------------------------
   客戶 2026-10-06《SEO 驗收檢核表》「網頁優化」分頁：

     /solutions          → /printing-solutions
     /products-boxes     → /colorbox
     /products-cardboard → /cardboard
     /products-uv        → /uv-printing
     /products-other     → /other-printing
     /projects           → /printing-projects
     /green-vlog         → /blog
     /industry-trends    → /printing-trends

   為什麼需要這支：210 對「已存在的 FromPath」一律跳過（客戶可編輯，不覆蓋），
   所以已經匯入過 210 的庫不會因為重跑 210 而換成新落點。

   只改**還是舊值**的列（WHERE 舊值 = 系統寫入的值），客戶在後台改過的不動。
   冪等，可直接在正式庫執行。舊網址本身由前台 middleware 301 到新網址
   （apps/web/src/lib/renamed-slugs.ts），所以沒跑這支也不會 404，只是多轉一次。
   ============================================================================= */
SET NOCOUNT ON;
SET XACT_ABORT ON;
GO

BEGIN TRAN;

DECLARE @map TABLE (OldSlug NVARCHAR(50) NOT NULL, NewSlug NVARCHAR(50) NOT NULL);
INSERT @map VALUES
    (N'/solutions',          N'/printing-solutions'),
    (N'/products-boxes',     N'/colorbox'),
    (N'/products-cardboard', N'/cardboard'),
    (N'/products-uv',        N'/uv-printing'),
    (N'/products-other',     N'/other-printing'),
    (N'/projects',           N'/printing-projects'),
    (N'/green-vlog',         N'/blog'),
    (N'/industry-trends',    N'/printing-trends');

/* 舊站 301（後台單元 16）：落點是帶語系前綴的 /zh/… 或 /en/… */
UPDATE r SET r.ToPath = l.Lang + m.NewSlug, r.UpdatedAt = SYSUTCDATETIME()
FROM dbo.Redirect r
CROSS JOIN @map m
CROSS JOIN (VALUES (N'/zh'), (N'/en')) l(Lang)
WHERE r.ToPath = l.Lang + m.OldSlug;
PRINT CONCAT(N'Redirect 落點更新 ', @@ROWCOUNT, N' 筆');

/* 首頁 Banner 連結（200 寫入的是不帶語系的站內路徑） */
UPDATE b SET b.LinkUrl = m.NewSlug
FROM dbo.HomeBanner b
JOIN @map m ON b.LinkUrl = m.OldSlug;
PRINT CONCAT(N'HomeBanner 連結更新 ', @@ROWCOUNT, N' 筆');

COMMIT;
GO
