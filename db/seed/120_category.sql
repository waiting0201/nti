/* =============================================================================
   120_category.sql  —  分類主檔 + 中英名稱（docs/08 §6.2）
   =============================================================================
   九種 CategoryType 共 44 筆；CategoryI18n 中英各一 → 88 列。
   自然鍵 (CategoryType, Code) 冪等；Id 由 IDENTITY 產生（客戶可自行增刪分類，
   不像 Role/Solution/Page 需要跨環境固定 Id）。

   命名原則：Code 是程式契約（建立後不可改），顯示名則跟隨 mockup 的客戶定案文案。
   Industry 的英文名以 mockup/projects.html #industries 的十項為準（該處是客戶定案的
   完整清單）；mockup/get-a-quote.html 原本只有 5 項且命名不同，已於 2026-09-02
   補齊為同一份十項。Material 的英文名則以 get-a-quote.html 的措辭為準。
   → 三處（DB 種子、projects.html、get-a-quote.html）現已完全一致。
   ============================================================================= */
SET NOCOUNT ON;
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET XACT_ABORT ON;
GO

DECLARE @src TABLE (CategoryType VARCHAR(30), Code VARCHAR(40), SortOrder INT,
                    NameZh NVARCHAR(80), NameEn NVARCHAR(80));

INSERT @src (CategoryType, Code, SortOrder, NameZh, NameEn) VALUES
 -- 單元 04 news
 ('News','esg',                     10, N'ESG 永續',   N'ESG'),
 ('News','awards',                  20, N'獲獎肯定',   N'Awards'),
 ('News','partnership',             30, N'合作夥伴',   N'Partnership'),
 ('News','sustainability',          40, N'永續發展',   N'Sustainability'),
 ('News','event',                   50, N'活動訊息',   N'Events'),
 -- 單元 03 project
 ('Project','food',                 10, N'食品',       N'Food'),
 ('Project','pharma',               20, N'醫藥',       N'Pharmaceutical'),
 ('Project','cosmetics',            30, N'美妝',       N'Cosmetics'),
 ('Project','electronics',          40, N'電子',       N'Electronics'),
 ('Project','gift',                 50, N'禮品',       N'Gift'),
 ('Project','other',                60, N'其他',       N'Other'),
 -- 單元 05 vlog
 ('Vlog','sustainability',          10, N'永續',       N'Sustainability'),
 ('Vlog','low-carbon',              20, N'低碳',       N'Low Carbon'),
 ('Vlog','awards',                  30, N'獲獎',       N'Awards'),
 -- 單元 06 faq
 ('Faq','general',                  10, N'一般問題',   N'General'),
 ('Faq','ordering',                 20, N'訂購流程',   N'Ordering'),
 ('Faq','materials',                30, N'材質相關',  N'Materials'),
 ('Faq','sustainability',           40, N'永續相關',   N'Sustainability'),
 -- 單元 08 certification
 ('Certification','certification',  10, N'認證',       N'Certifications'),
 ('Certification','partnership',    20, N'夥伴',       N'Partnerships'),
 ('Certification','award',          30, N'獎項',       N'Awards'),
 -- 單元 10 facility（對應 facility-* 五個子頁）
 ('Facility','pre-press',           10, N'印前作業',   N'Pre-Press'),
 ('Facility','eco-printing',        20, N'環保印刷',   N'Eco Printing'),
 ('Facility','post-press',          30, N'印後加工',   N'Post-Press'),
 ('Facility','quality',             40, N'品質檢驗',   N'Quality Control'),
 ('Facility','tour',                50, N'廠區導覽',   N'Plant Tour'),
 -- 單元 12 supplier-notice
 ('SupplierNotice','policy',        10, N'政策公告',   N'Policy'),
 ('SupplierNotice','esg',           20, N'ESG 規範',   N'ESG'),
 ('SupplierNotice','quality',       30, N'品質要求',   N'Quality'),
 ('SupplierNotice','logistics',     40, N'物流配送',   N'Logistics'),
 -- 產業別：projects.html #industries 清單 + get-a-quote.html 產業下拉共用同一份主檔。
 -- 英文名逐字對齊 mockup/projects.html（客戶定案文案）。
 ('Industry','food-beverage',       10, N'食品飲料',     N'Food & Beverage'),
 ('Industry','electronics',         20, N'電子產品',     N'Electronics'),
 ('Industry','beauty',              30, N'美妝保養',     N'Beauty & Skincare'),
 ('Industry','medical',             40, N'醫療保健',     N'Medical & Healthcare'),
 ('Industry','luxury-gift',         50, N'精品禮盒',     N'Luxury & Gift Packaging'),
 ('Industry','hardware',            60, N'五金手工具',   N'Hardware & Hand Tools'),
 ('Industry','automotive',          70, N'汽車產業',     N'Automotive'),
 ('Industry','publishing',          80, N'出版文具',     N'Publishing & Stationery'),
 ('Industry','home-lifestyle',      90, N'居家生活',     N'Home & Lifestyle'),
 ('Industry','industrial',         100, N'工業與消費品', N'Industrial & Consumer Goods'),
 -- 報價表單的材質偏好下拉；英文名逐字對齊 mockup/get-a-quote.html。
 -- 「No preference — advise me」即 MaterialCategoryId = NULL，不建分類列。
 ('QuoteMaterial','fsc',            10, N'FSC™ 認證紙板',    N'FSC™-certified board'),
 ('QuoteMaterial','recycled',       20, N'再生紙板',          N'Recycled board'),
 ('QuoteMaterial','kraft',          30, N'牛皮紙',            N'Kraft'),
 ('QuoteMaterial','specialty',      40, N'特殊／金屬鍍膜紙材', N'Specialty / metallized');

INSERT dbo.Category (CategoryType, Code, SortOrder, IsActive)
SELECT s.CategoryType, s.Code, s.SortOrder, 1
FROM @src s
WHERE NOT EXISTS (
    SELECT 1 FROM dbo.Category c
    WHERE c.CategoryType = s.CategoryType AND c.Code = s.Code
);

/* i18n 以自然鍵 JOIN 回主表取 Id，不硬寫 identity 值 */
INSERT dbo.CategoryI18n (CategoryId, Lang, Name)
SELECT c.Id, x.Lang, x.Name
FROM @src s
JOIN dbo.Category c ON c.CategoryType = s.CategoryType AND c.Code = s.Code
CROSS APPLY (VALUES ('zh', s.NameZh), ('en', s.NameEn)) x (Lang, Name)
WHERE NOT EXISTS (
    SELECT 1 FROM dbo.CategoryI18n i
    WHERE i.CategoryId = c.Id AND i.Lang = x.Lang
);
GO
