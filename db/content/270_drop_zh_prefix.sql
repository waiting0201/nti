/* =============================================================================
   270_drop_zh_prefix.sql  —  中文網址拿掉 /zh 前綴後，把轉址表改到新網址
   -----------------------------------------------------------------------------
   2026-10-06 客戶決定：中文放根目錄（/contact），英文維持 /en/contact，
   與舊站 WordPress 的結構一致。前台規則在 apps/web/src/lib/i18n.ts 的 localePath()，
   API 的同一條規則在 Api/Common/SitePaths.cs。

   Redirect 表（後台單元 16）裡有兩種帶 /zh 的值：
     1. 舊站 301 的落點（210 匯入）：ToPath = /zh、/zh/xxx
     2. 消息改 slug 時 API 自動建的轉址：FromPath／ToPath = /zh/news/xxx

   為什麼需要這支：210 對「已存在的 FromPath」一律跳過，重跑 210 不會換成新落點。

   只改**還是 /zh 開頭**的列，冪等，可直接在正式庫執行。
   沒跑這支也不會 404——前台 middleware 會把 /zh/… 301 到無前綴的網址——只是多轉一次。

   ⚠ 前台目前讀的是編譯進去的 legacy-redirects.ts，不讀這張表（STATUS 後台單元 16），
   所以這支影響的是後台顯示與日後 middleware 改讀 API 之後的行為。
   ============================================================================= */
SET NOCOUNT ON;
SET XACT_ABORT ON;
GO

BEGIN TRAN;

/* 1. 落點：/zh → /，/zh/xxx → /xxx */
UPDATE dbo.Redirect
SET ToPath = CASE WHEN ToPath = N'/zh' THEN N'/' ELSE STUFF(ToPath, 1, 3, N'') END,
    UpdatedAt = SYSUTCDATETIME()
WHERE ToPath = N'/zh' OR ToPath LIKE N'/zh/%';
PRINT CONCAT(N'Redirect 落點更新 ', @@ROWCOUNT, N' 筆');

/* 2. 來源：/zh/news/xxx → /news/xxx（UX_Redirect_FromPath 是唯一索引，已有同名的就不動） */
UPDATE r
SET r.FromPath = STUFF(r.FromPath, 1, 3, N''), r.UpdatedAt = SYSUTCDATETIME()
FROM dbo.Redirect r
WHERE r.FromPath LIKE N'/zh/%'
  AND NOT EXISTS (SELECT 1 FROM dbo.Redirect x WHERE x.FromPath = STUFF(r.FromPath, 1, 3, N''));
PRINT CONCAT(N'Redirect 來源更新 ', @@ROWCOUNT, N' 筆');

/* 3. 改完變成自己轉自己的（舊站 /contact → 新站 /contact）停用 */
UPDATE dbo.Redirect
SET IsActive = 0, UpdatedAt = SYSUTCDATETIME()
WHERE FromPath = ToPath AND IsActive = 1;
PRINT CONCAT(N'自轉停用 ', @@ROWCOUNT, N' 筆');

COMMIT;
GO
