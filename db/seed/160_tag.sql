/* =============================================================================
   160_tag.sql  —  消息標籤主檔 + 中英名稱（後台單元 25）
   =============================================================================
   17 筆標籤；TagI18n 中英各一 → 34 列。自然鍵 Slug 冪等。

   為什麼只有 17 個：舊站 nti-printing.com 有 100 個 /tag/* 封存頁，但其中大量是
   同義詞（綠色印刷／環保印刷／永續印刷／綠色印刷工廠指同一件事）或單篇專用的
   長尾詞（2024龍年桌曆）。100 個標籤攤在 12 篇消息上，多數封存頁只會有一兩篇文章
   —— 那是 Google 眼中的 thin content，做出來反而扣分。這裡收斂成 17 個真的有內容
   支撐的主題，舊網址則逐條 301 過來（apps/web/src/lib/legacy-redirects.ts 的 TAGS，
   100 條裡 99 條有 1:1 落點）。

   Slug 一律 ASCII 小寫、連字號分隔，且**不分語系**（客戶 2026-09-08 SEO 簡報：
   網址避免使用中文、字詞之間用 "-" 非 "_"）。中文只在名稱。

   ⚠ 與 EF 的 Api/Data/Seed/SeedData.cs 的 Tags／TagI18ns 一對一。
     schema 與種子的權威在 EF（見 db/README 與 docs/10 §8），本檔為參考實作。
     差別：EF 那邊 Id 硬編 1–17（HasData 需要明確主鍵），這裡由 IDENTITY 產生
     —— 標籤與分類一樣，客戶可自行增刪，沒有跨環境固定 Id 的需求。
   ============================================================================= */
SET NOCOUNT ON;
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET XACT_ABORT ON;
GO

DECLARE @src TABLE (Slug VARCHAR(160), SortOrder INT, NameZh NVARCHAR(80), NameEn NVARCHAR(80));

INSERT @src (Slug, SortOrder, NameZh, NameEn) VALUES
 ('green-printing',         10, N'綠色印刷',       N'Green Printing'),
 ('low-carbon',             20, N'低碳製程',       N'Low Carbon'),
 ('carbon-footprint',       30, N'碳足跡',         N'Carbon Footprint'),
 ('esg',                    40, N'ESG',            N'ESG'),
 ('csr',                    50, N'企業社會責任',   N'Corporate Social Responsibility'),
 ('green-building',         60, N'綠建築',         N'Green Building'),
 ('green-supply-chain',     70, N'綠色供應鏈',     N'Green Supply Chain'),
 ('sustainable-packaging',  80, N'永續包裝',       N'Sustainable Packaging'),
 ('packaging-design',       90, N'包裝設計',       N'Packaging Design'),
 ('digital-printing',      100, N'數位印刷',       N'Digital Printing'),
 ('variable-data-printing',110, N'可變資料印刷',   N'Variable Data Printing'),
 ('paper-craft',           120, N'紙藝與紙模型',   N'Paper Craft'),
 ('conservation',          130, N'生態保育',       N'Conservation'),
 ('disaster-education',    140, N'防災教育',       N'Disaster-Prevention Education'),
 ('awards',                150, N'獲獎與認證',     N'Awards & Recognition'),
 ('media-coverage',        160, N'媒體報導',       N'Media Coverage'),
 ('partnership',           170, N'產業合作',       N'Partnership');

INSERT dbo.Tag (Slug, SortOrder, IsActive)
SELECT s.Slug, s.SortOrder, 1
FROM @src s
WHERE NOT EXISTS (SELECT 1 FROM dbo.Tag t WHERE t.Slug = s.Slug AND t.IsDeleted = 0);

/* i18n 以自然鍵 JOIN 回主表取 Id，不硬寫 identity 值 */
INSERT dbo.TagI18n (TagId, Lang, Name)
SELECT t.Id, x.Lang, x.Name
FROM @src s
JOIN dbo.Tag t ON t.Slug = s.Slug AND t.IsDeleted = 0
CROSS APPLY (VALUES ('zh', s.NameZh), ('en', s.NameEn)) x (Lang, Name)
WHERE NOT EXISTS (
    SELECT 1 FROM dbo.TagI18n i
    WHERE i.TagId = t.Id AND i.Lang = x.Lang
);
GO
