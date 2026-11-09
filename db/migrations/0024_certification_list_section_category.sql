/* =============================================================================
   0024_certification_list_section_category.sql  —  認證頁清單的區塊改由分類驅動（2026-11-09）
   -----------------------------------------------------------------------------
   CertificationListItem.Section（寫死七個值的字串）→ CategoryId，指向
   CategoryType = 'CertSection' 的分類。客戶在後台「分類管理」新增區塊、改名（＝前台大標）、
   調順序、停用。

   資料搬移：建立七個區塊分類，代號沿用原本的 Section 值，既有項目照代號對回；
   區塊名稱優先取「頁面文字」對大標的覆寫，沒有就用前台目前顯示的字；搬完即刪除那些覆寫。

   與 EF 那條路徑的 Api/Data/Migrations/ 下的 CertificationListSectionCategory 一對一
   （schema 權威在那邊，見 db/README 與 docs/10 §8）。

   套用後：表數不變、外鍵 +1（型別安全複合外鍵 +1）、PERSISTED 計算欄 +1、
   CHECK −1（CK_CertificationListItem_Section；CK_Category_Type 換定義）、索引換名不增減。
   ============================================================================= */
SET NOCOUNT ON;
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET XACT_ABORT ON;
GO

BEGIN TRAN;

IF COL_LENGTH('dbo.CertificationListItem', 'Section') IS NOT NULL
BEGIN
    ALTER TABLE dbo.Category DROP CONSTRAINT CK_Category_Type;
    ALTER TABLE dbo.Category ADD CONSTRAINT CK_Category_Type CHECK ([CategoryType] IN
        ('News','Project','Vlog','Faq','Certification','Facility','SupplierNotice','Industry','QuoteMaterial','CertSection'));

    DECLARE @pid INT = (SELECT Id FROM dbo.Page WHERE PageKey = N'about-certifications');
    DECLARE @s TABLE (Code VARCHAR(40), SortOrder INT, En NVARCHAR(80), Zh NVARCHAR(80));
    INSERT @s VALUES
     ('management', 10, N'Management Systems',                    N'管理系統'),
     ('quality',    20, N'Colour & Print Quality Qualifications', N'色彩與印刷品質資格'),
     ('material',   30, N'Paper & Inks',                          N'紙材與油墨'),
     ('building',   40, N'Green Buildings',                       N'廠房建築'),
     ('membership', 50, N'Memberships & Own Marks',               N'會員與自有標章'),
     ('award',      60, N'Awards',                                N'獲獎肯定'),
     ('partner',    70, N'Partnerships',                          N'合作夥伴');

    INSERT dbo.Category (CategoryType, Code, SortOrder, IsActive)
    SELECT 'CertSection', s.Code, s.SortOrder, 1 FROM @s s
    WHERE NOT EXISTS (SELECT 1 FROM dbo.Category c WHERE c.CategoryType = 'CertSection' AND c.Code = s.Code);

    INSERT dbo.CategoryI18n (CategoryId, Lang, Name)
    SELECT c.Id, v.Lang,
           LEFT(COALESCE((SELECT TOP 1 NULLIF(LTRIM(RTRIM(pt.Value)), N'') FROM dbo.PageText pt
                          WHERE pt.PageId = @pid AND pt.Lang = v.Lang AND pt.SourceText = s.En AND pt.IsDeleted = 0
                          ORDER BY pt.Id DESC), v.Fallback), 80)
    FROM @s s
    JOIN dbo.Category c ON c.CategoryType = 'CertSection' AND c.Code = s.Code
    CROSS APPLY (VALUES ('en', s.En), ('zh', s.Zh)) v (Lang, Fallback)
    WHERE NOT EXISTS (SELECT 1 FROM dbo.CategoryI18n i WHERE i.CategoryId = c.Id AND i.Lang = v.Lang);

    -- 覆寫已搬進分類名稱，刪掉：前台的覆寫整頁套用（英文版也會），留著會把大標再換一次
    DELETE FROM dbo.PageText WHERE PageId = @pid AND SourceText IN (SELECT En FROM @s);

    ALTER TABLE dbo.CertificationListItem ADD CategoryId INT NULL;
END
GO

IF COL_LENGTH('dbo.CertificationListItem', 'Section') IS NOT NULL
BEGIN
    UPDATE t SET t.CategoryId = c.Id
    FROM dbo.CertificationListItem t
    JOIN dbo.Category c ON c.CategoryType = 'CertSection' AND c.Code = t.Section;

    ALTER TABLE dbo.CertificationListItem ALTER COLUMN CategoryId INT NOT NULL;
    DROP INDEX IX_CertificationListItem_Section ON dbo.CertificationListItem;
    ALTER TABLE dbo.CertificationListItem DROP CONSTRAINT CK_CertificationListItem_Section;
    ALTER TABLE dbo.CertificationListItem DROP COLUMN Section;

    ALTER TABLE dbo.CertificationListItem
        ADD CategoryTypeGuard AS CAST('CertSection' AS VARCHAR(30)) PERSISTED;
END
GO

IF OBJECT_ID('dbo.FK_CertificationListItem_Category', 'F') IS NULL
BEGIN
    ALTER TABLE dbo.CertificationListItem ADD CONSTRAINT FK_CertificationListItem_Category
        FOREIGN KEY (CategoryId, CategoryTypeGuard) REFERENCES dbo.Category (Id, CategoryType);

    CREATE INDEX IX_CertificationListItem_Category
        ON dbo.CertificationListItem (IsDeleted, IsPublished, CategoryId, SortOrder);
END

IF NOT EXISTS (SELECT 1 FROM dbo.SchemaVersion WHERE ScriptName = N'0024_certification_list_section_category.sql')
    INSERT dbo.SchemaVersion (ScriptName) VALUES (N'0024_certification_list_section_category.sql');

COMMIT;
GO
