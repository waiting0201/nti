/* =============================================================================
   140_page.sql  —  固定頁註冊表（docs/08 §6.4）
   =============================================================================
   29 筆 = 28 筆既有（mockup 44 頁扣掉 12 支 news-* 與 4 支 products-*，後兩者的
   SEO 由 NewsI18n / SolutionI18n 提供）+ 1 筆預留的 green-csr。

   HasRichBody = 1 的兩筆：
     privacy-legal —— 唯一原生可後台編輯全文的固定頁
     green-csr     —— 預留（待客戶確認）。設為 1 是為了讓客戶點頭後可直接在後台
                      撰稿上線、不需改前端程式（09 §7 的擴充路徑）；IsIndexable = 0
                      避免未確認前的空頁被搜尋引擎索引。

   固定 Id：29 筆固定頁不可增刪，讓各環境 Id 一致，利於資料比對與內容遷移對照。

   ⚠ RouteTemplate 為提案值：依 05-seo 的 /zh 、/en 子路徑策略與 IA 層級推導，
     但 02-frontend 尚未定案路由。本檔獨立於 schema，路由確定後直接改此檔即可。

   SeoTitle / SeoDescription 一律留 NULL 由後台填；PageI18n.Slug 為 NOT NULL，
   中英先塞相同的 ASCII slug（05-seo 要求小寫連字號，中文站也不用中文 URL）。
   ============================================================================= */
SET NOCOUNT ON;
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET XACT_ABORT ON;
GO

DECLARE @src TABLE (Id INT, PageKey VARCHAR(60), RouteTemplate NVARCHAR(200),
                    HasRichBody BIT, IsIndexable BIT, Slug NVARCHAR(160));

INSERT @src (Id, PageKey, RouteTemplate, HasRichBody, IsIndexable, Slug) VALUES
 ( 1,'home',                  N'/{lang}',                                 0,1,N'home'),
 -- About
 ( 2,'about-hub',             N'/{lang}/about',                           0,1,N'about'),
 ( 3,'about-difference',      N'/{lang}/about/difference',                0,1,N'difference'),
 ( 4,'about-benefits',        N'/{lang}/about/benefits',                  0,1,N'benefits'),
 ( 5,'about-certifications',  N'/{lang}/about/certifications',            0,1,N'certifications'),
 -- Facility（一個 hub + 五個子頁）
 ( 6,'facility',              N'/{lang}/about/facility',                  0,1,N'facility'),
 ( 7,'facility-pre-press',    N'/{lang}/about/facility/pre-press',        0,1,N'pre-press'),
 ( 8,'facility-eco-printing', N'/{lang}/about/facility/eco-printing',     0,1,N'eco-printing'),
 ( 9,'facility-post-press',   N'/{lang}/about/facility/post-press',       0,1,N'post-press'),
 (10,'facility-quality',      N'/{lang}/about/facility/quality',          0,1,N'quality'),
 (11,'facility-tour',         N'/{lang}/about/facility/tour',             0,1,N'tour'),
 -- Solutions / Projects（列表頁；細部內容分別由 Solution、Project 提供）
 (12,'solutions',             N'/{lang}/solutions',                       0,1,N'solutions'),
 (13,'projects',              N'/{lang}/projects',                        0,1,N'projects'),
 -- Sustainability（green-*）
 (14,'sustainability-hub',    N'/{lang}/sustainability',                  0,1,N'sustainability'),
 (15,'green-our-advantage',   N'/{lang}/sustainability/our-advantage',    0,1,N'our-advantage'),
 (16,'green-carbon',          N'/{lang}/sustainability/carbon-efficiency',0,1,N'carbon-efficiency'),
 (17,'green-materials',       N'/{lang}/sustainability/eco-materials',    0,1,N'eco-materials'),
 (18,'green-esg',             N'/{lang}/sustainability/esg',              0,1,N'esg'),
 (19,'green-csr',             N'/{lang}/sustainability/csr',              1,0,N'csr'),  -- 預留（待客戶確認）
 -- Insights
 (20,'insights',              N'/{lang}/insights',                        0,1,N'insights'),
 (21,'news-list',             N'/{lang}/insights/news',                   0,1,N'news'),
 (22,'green-vlog',            N'/{lang}/insights/green-vlog',             0,1,N'green-vlog'),
 (23,'faq',                   N'/{lang}/insights/faq',                    0,1,N'faq'),
 (24,'industry-trends',       N'/{lang}/insights/industry-trends',        0,1,N'industry-trends'),
 -- 其餘
 (25,'careers',               N'/{lang}/careers',                         0,1,N'careers'),
 (26,'supplier-area',         N'/{lang}/supplier-area',                   0,1,N'supplier-area'),
 (27,'contact',               N'/{lang}/contact',                         0,1,N'contact'),
 (28,'get-a-quote',           N'/{lang}/get-a-quote',                     0,1,N'get-a-quote'),
 (29,'privacy-legal',         N'/{lang}/privacy-legal',                   1,1,N'privacy-legal');

SET IDENTITY_INSERT dbo.Page ON;

INSERT dbo.Page (Id, PageKey, RouteTemplate, HasRichBody, IsIndexable)
SELECT s.Id, s.PageKey, s.RouteTemplate, s.HasRichBody, s.IsIndexable
FROM @src s
WHERE NOT EXISTS (SELECT 1 FROM dbo.Page p WHERE p.PageKey = s.PageKey);

SET IDENTITY_INSERT dbo.Page OFF;

INSERT dbo.PageI18n (PageId, Lang, Slug)
SELECT p.Id, x.Lang, s.Slug
FROM @src s
JOIN dbo.Page p ON p.PageKey = s.PageKey
CROSS APPLY (VALUES ('zh'), ('en')) x (Lang)
WHERE NOT EXISTS (
    SELECT 1 FROM dbo.PageI18n i WHERE i.PageId = p.Id AND i.Lang = x.Lang
);
GO
