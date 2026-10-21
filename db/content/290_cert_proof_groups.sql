/* =============================================================================
   290_cert_proof_groups.sql  —  首頁 Proof 牆三張卡改由後台分組驅動（2026-10-21）
   -----------------------------------------------------------------------------
   首頁「品質管理／環境永續／社會責任與安全」三張卡，原本是前台依 logo 檔名寫死分類
   （14 張認證都在同一個「認證」分組，前台無從分卡）。這支把它交給後台：

     1. 建三個 Certification 分組（code：quality／eco／safety），中英名稱即卡片標題。
        ⚠ 後台「分類管理」目前只能停用／刪除，沒有改名的畫面（API 有 PUT /admin/category/{id}）。
     2. 把 14 張認證依 logo 檔名分進去——只動**還在原本「認證」分組或未分組**的列，
        後台已經改過分組的不會被蓋掉。
     3. 補上中英簡稱（CertificationI18n.ShortName，0015／EF CertificationShortName 加的欄位），
        只補 NULL。首頁卡片內那行用簡稱串起來，與 mockup 一致。

   前台只要看到兩個以上的分組就改照分組顯示（apps/web/src/components/cms.tsx 的
   CertificationLogos），圖示依分組代碼。冪等，可直接在正式庫執行（須先套用 EF migration）。
   ============================================================================= */
SET NOCOUNT ON;
SET XACT_ABORT ON;
GO

BEGIN TRAN;

/* 1. 三個分組 */
DECLARE @grp TABLE (Code VARCHAR(40), SortOrder INT, NameZh NVARCHAR(80), NameEn NVARCHAR(80));
INSERT @grp VALUES
 ('quality', 1, N'品質管理',       N'Quality Management'),
 ('eco',     2, N'環境永續',       N'Environmental Sustainability'),
 ('safety',  3, N'社會責任與安全', N'Social Responsibility & Safety');

INSERT dbo.Category (CategoryType, Code, SortOrder, IsActive)
SELECT 'Certification', g.Code, g.SortOrder, 1
FROM @grp g
WHERE NOT EXISTS (SELECT 1 FROM dbo.Category c WHERE c.CategoryType = 'Certification' AND c.Code = g.Code);

INSERT dbo.CategoryI18n (CategoryId, Lang, Name)
SELECT c.Id, x.Lang, x.Name
FROM @grp g
JOIN dbo.Category c ON c.CategoryType = 'Certification' AND c.Code = g.Code
CROSS APPLY (VALUES ('zh', g.NameZh), ('en', g.NameEn)) x (Lang, Name)
WHERE NOT EXISTS (SELECT 1 FROM dbo.CategoryI18n i WHERE i.CategoryId = c.Id AND i.Lang = x.Lang);
PRINT N'分組：品質管理／環境永續／社會責任與安全 已就緒';

/* 2. 依 logo 檔名分組＋ 3. 簡稱（順序同 mockup/index.html 的 Proof 區） */
DECLARE @cert TABLE (FileName NVARCHAR(80), GroupCode VARCHAR(40), ShortZh NVARCHAR(60), ShortEn NVARCHAR(60));
INSERT @cert VALUES
 (N'cert-g7.png',           'quality', N'G7 Master',          N'G7 Master'),
 (N'cert-iso9001.png',      'quality', N'ISO 9001',           N'ISO 9001'),
 (N'cert-gmi.png',          'quality', N'GMI',                N'GMI'),
 (N'cert-fsc.png',          'eco',     N'FSC',                N'FSC'),
 (N'cert-iso14001.png',     'eco',     N'ISO 14001',          N'ISO 14001'),
 (N'cert-co2neutral.png',   'eco',     N'碳中和',             N'CO2 Neutral'),
 (N'cert-green.png',        'eco',     N'綠色印刷',           N'Green Printing'),
 (N'cert-greenbuilding.png','eco',     N'綠建築（鑽石級）',   N'Green Building (Diamond)'),
 (N'cert-mof.png',          'eco',     N'無礦物油',           N'Mineral Oil Free'),
 (N'cert-iso45001.png',     'safety',  N'ISO 45001',          N'ISO 45001'),
 (N'cert-sedex.png',        'safety',  N'Sedex',              N'Sedex'),
 (N'cert-leed-gold.png',    'safety',  N'LEED 黃金級 2023',   N'LEED Gold 2023'),
 (N'cert-esg.png',          'safety',  N'ESG',                N'ESG'),
 (N'cert-esci.png',         'safety',  N'ESCI',               N'ESCI');

DECLARE @old INT = (SELECT Id FROM dbo.Category WHERE CategoryType = 'Certification' AND Code = 'certification');

UPDATE t SET t.CategoryId = g.Id, t.UpdatedAt = SYSUTCDATETIME()
FROM dbo.Certification t
JOIN @cert m ON t.LogoPath = m.FileName OR t.LogoPath LIKE N'%/' + m.FileName
JOIN dbo.Category g ON g.CategoryType = 'Certification' AND g.Code = m.GroupCode
WHERE t.IsDeleted = 0 AND (t.CategoryId IS NULL OR t.CategoryId = @old);
PRINT CONCAT(N'認證分組更新 ', @@ROWCOUNT, N' 筆');

UPDATE i SET i.ShortName = CASE i.Lang WHEN 'zh' THEN m.ShortZh ELSE m.ShortEn END
FROM dbo.CertificationI18n i
JOIN dbo.Certification t ON t.Id = i.CertificationId
JOIN @cert m ON t.LogoPath = m.FileName OR t.LogoPath LIKE N'%/' + m.FileName
WHERE i.ShortName IS NULL;
PRINT CONCAT(N'簡稱補上 ', @@ROWCOUNT, N' 筆');

/* 對不上檔名、仍留在原「認證」分組的（例：後台換過 logo），首頁會自成一張「認證」卡 */
SELECT t.Id, t.LogoPath AS [仍在原「認證」分組，請在後台指定分組]
FROM dbo.Certification t
WHERE t.IsDeleted = 0 AND (t.CategoryId IS NULL OR t.CategoryId = @old);

COMMIT;
GO
