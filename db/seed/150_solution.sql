/* =============================================================================
   150_solution.sql  —  四個解決方案（docs/09 §02）
   =============================================================================
   固定 4 筆，後台不提供新增／刪除。同時驅動 solutions.html、四個 products-* 內頁、
   以及首頁 Printing Solutions 四張卡。

   Slug 採語意化字串（color-box-packaging）而非 mockup 的檔名（products-boxes）：
   SEO 較佳，且 mockup 非正式站、無需 301 對照。

   佔位資料：CoverImagePath 指向尚未上傳的 placeholder，故一律 IsPublished = 0
   （草稿），避免佔位內容意外出現在前台。客戶素材到位後由後台改為上架。
   ============================================================================= */
SET NOCOUNT ON;
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET XACT_ABORT ON;
GO

DECLARE @src TABLE (Id INT, Code VARCHAR(30), SortOrder INT, Slug NVARCHAR(160),
                    NameZh NVARCHAR(80),  NameEn NVARCHAR(80),
                    H1Zh   NVARCHAR(160), H1En   NVARCHAR(160),
                    AltZh  NVARCHAR(200), AltEn  NVARCHAR(200));

INSERT @src VALUES
 (1,'boxes',     10, N'color-box-packaging',
    N'彩盒包裝',   N'Color Box Packaging',
    N'客製化彩盒包裝', N'Custom Color Box Packaging',
    N'NTI 客製化彩盒包裝成品',   N'Custom color box packaging by NTI'),
 (2,'cardboard', 20, N'packaging-paperboard',
    N'包裝紙板',   N'Packaging Paperboard',
    N'客製化包裝紙板', N'Custom Packaging Paperboard',
    N'NTI 客製化包裝紙板成品',   N'Custom packaging paperboard by NTI'),
 (3,'uv',        30, N'uv-printing',
    N'UV 印刷',    N'UV Printing',
    N'環保 UV 印刷',   N'Eco-Friendly UV Printing',
    N'NTI 環保 UV 印刷成品',     N'Eco-friendly UV printing by NTI'),
 (4,'other',     40, N'other-printing',
    N'其他印刷',   N'Other Printing',
    N'其他印刷服務',   N'Other Printing Services',
    N'NTI 其他印刷服務成品',     N'Other printing services by NTI');

SET IDENTITY_INSERT dbo.Solution ON;

INSERT dbo.Solution (Id, Code, CoverImagePath, SortOrder, IsPublished)
SELECT s.Id, s.Code, N'solutions/_placeholder.webp', s.SortOrder, 0
FROM @src s
WHERE NOT EXISTS (SELECT 1 FROM dbo.Solution t WHERE t.Code = s.Code);

SET IDENTITY_INSERT dbo.Solution OFF;

INSERT dbo.SolutionI18n (SolutionId, Lang, Name, H1, CoverAlt, Slug)
SELECT t.Id, x.Lang, x.Name, x.H1, x.Alt, s.Slug
FROM @src s
JOIN dbo.Solution t ON t.Code = s.Code
CROSS APPLY (VALUES ('zh', s.NameZh, s.H1Zh, s.AltZh),
                    ('en', s.NameEn, s.H1En, s.AltEn)) x (Lang, Name, H1, Alt)
WHERE NOT EXISTS (
    SELECT 1 FROM dbo.SolutionI18n i WHERE i.SolutionId = t.Id AND i.Lang = x.Lang
);
GO
