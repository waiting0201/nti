/* =============================================================================
   0025_merge_cert_section_into_certification.sql  —  認證頁清單區塊併回認證分類（2026-11-09）
   -----------------------------------------------------------------------------
   0024 另開的 CertSection 與 08 logo 的首頁 Proof 分組（Certification）是同一套分類，合併：
   08 與 08b 共用 Certification。每個 CertSection 依序對到一個 Certification 分類——
   中文名稱相同 → 英文名稱相同 → 名稱互相包含且唯一 → 都沒有就新建（代號 section-原代號）。

   與 EF 那條路徑的 Api/Data/Migrations/ 下的 MergeCertSectionIntoCertification 一對一
   （schema 權威在那邊，見 db/README 與 docs/10 §8）。表數、外鍵數、CHECK 數、計算欄數不變。
   ============================================================================= */
SET NOCOUNT ON;
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET XACT_ABORT ON;
GO

IF EXISTS (SELECT 1 FROM sys.computed_columns
           WHERE object_id = OBJECT_ID('dbo.CertificationListItem') AND name = 'CategoryTypeGuard'
             AND definition LIKE '%CertSection%')
BEGIN
    BEGIN TRAN;
    ALTER TABLE dbo.CertificationListItem DROP CONSTRAINT FK_CertificationListItem_Category;
    ALTER TABLE dbo.CertificationListItem DROP COLUMN CategoryTypeGuard;
    COMMIT;
END
GO

IF COL_LENGTH('dbo.CertificationListItem', 'CategoryTypeGuard') IS NULL
BEGIN
BEGIN TRAN;

DECLARE @map TABLE (SectionId INT PRIMARY KEY, TargetId INT NULL);
DECLARE @maxSort INT = ISNULL((SELECT MAX([SortOrder]) FROM [Category]
                               WHERE [CategoryType] = 'Certification' AND [IsDeleted] = 0), 0);

DECLARE @sid INT, @code VARCHAR(40), @sort INT, @zh NVARCHAR(80), @en NVARCHAR(80), @target INT, @rank INT = 0;
DECLARE cur CURSOR LOCAL FAST_FORWARD FOR
    SELECT c.[Id], c.[Code], c.[SortOrder],
           LTRIM(RTRIM(zh.[Name])), LTRIM(RTRIM(en.[Name]))
    FROM [Category] c
    LEFT JOIN [CategoryI18n] zh ON zh.[CategoryId] = c.[Id] AND zh.[Lang] = 'zh'
    LEFT JOIN [CategoryI18n] en ON en.[CategoryId] = c.[Id] AND en.[Lang] = 'en'
    WHERE c.[CategoryType] = 'CertSection'
    ORDER BY c.[SortOrder], c.[Id];
OPEN cur;
FETCH NEXT FROM cur INTO @sid, @code, @sort, @zh, @en;
WHILE @@FETCH_STATUS = 0
BEGIN
    -- 已被前面的區塊用掉的分類不再對（一對一）
    ;WITH cand AS (
        SELECT c.[Id], LTRIM(RTRIM(zh.[Name])) AS Zh, LTRIM(RTRIM(en.[Name])) AS En
        FROM [Category] c
        LEFT JOIN [CategoryI18n] zh ON zh.[CategoryId] = c.[Id] AND zh.[Lang] = 'zh'
        LEFT JOIN [CategoryI18n] en ON en.[CategoryId] = c.[Id] AND en.[Lang] = 'en'
        WHERE c.[CategoryType] = 'Certification' AND c.[IsDeleted] = 0
          AND c.[Id] NOT IN (SELECT [TargetId] FROM @map WHERE [TargetId] IS NOT NULL))
    SELECT @target = COALESCE(
        (SELECT TOP 1 [Id] FROM cand WHERE Zh = @zh ORDER BY [Id]),
        (SELECT TOP 1 [Id] FROM cand WHERE En = @en ORDER BY [Id]),
        (SELECT MIN([Id]) FROM cand
         WHERE LEN(@zh) > 0 AND LEN(Zh) > 0
           AND (CHARINDEX(@zh, Zh) > 0 OR CHARINDEX(Zh, @zh) > 0)
         HAVING COUNT(*) = 1));

    IF @target IS NULL
    BEGIN
        SET @rank += 1;
        DECLARE @newCode VARCHAR(40) = LEFT('section-' + @code, 40);
        IF EXISTS (SELECT 1 FROM [Category] WHERE [CategoryType] = 'Certification' AND [Code] = @newCode)
            SET @newCode = LEFT('section-' + @code + '-' + CAST(@sid AS VARCHAR(10)), 40);

        INSERT [Category] ([CategoryType], [Code], [SortOrder], [IsActive], [CreatedAt], [IsDeleted])
        SELECT 'Certification', @newCode, @maxSort + 10 * @rank, [IsActive], SYSUTCDATETIME(), 0
        FROM [Category] WHERE [Id] = @sid;
        SET @target = SCOPE_IDENTITY();

        INSERT [CategoryI18n] ([CategoryId], [Lang], [Name])
        SELECT @target, [Lang], [Name] FROM [CategoryI18n] WHERE [CategoryId] = @sid;
    END

    INSERT @map VALUES (@sid, @target);
    SET @target = NULL;
    FETCH NEXT FROM cur INTO @sid, @code, @sort, @zh, @en;
END
CLOSE cur; DEALLOCATE cur;

UPDATE t SET t.[CategoryId] = m.[TargetId]
FROM [CertificationListItem] t INNER JOIN @map m ON m.[SectionId] = t.[CategoryId];

DELETE i FROM [CategoryI18n] i INNER JOIN [Category] c ON c.[Id] = i.[CategoryId] WHERE c.[CategoryType] = 'CertSection';
DELETE FROM [Category] WHERE [CategoryType] = 'CertSection';

ALTER TABLE dbo.Category DROP CONSTRAINT CK_Category_Type;
ALTER TABLE dbo.Category ADD CONSTRAINT CK_Category_Type CHECK ([CategoryType] IN
    ('News','Project','Vlog','Faq','Certification','Facility','SupplierNotice','Industry','QuoteMaterial'));

ALTER TABLE dbo.CertificationListItem ADD CategoryTypeGuard AS CAST('Certification' AS VARCHAR(30)) PERSISTED;
COMMIT;
END
GO

IF OBJECT_ID('dbo.FK_CertificationListItem_Category', 'F') IS NULL
    ALTER TABLE dbo.CertificationListItem ADD CONSTRAINT FK_CertificationListItem_Category
        FOREIGN KEY (CategoryId, CategoryTypeGuard) REFERENCES dbo.Category (Id, CategoryType);

IF NOT EXISTS (SELECT 1 FROM dbo.SchemaVersion WHERE ScriptName = N'0025_merge_cert_section_into_certification.sql')
    INSERT dbo.SchemaVersion (ScriptName) VALUES (N'0025_merge_cert_section_into_certification.sql');
GO
