/* =============================================================================
   0021_certification_list_sections.sql  —  認證頁清單改為客戶指定的七個區塊（2026-10-30）
   -----------------------------------------------------------------------------
   CertificationListItem.Section 由 standards／gmi／award 改為
   management／quality／material／building／membership／award／partner。
   既有資料：standards 併入 quality；gmi（零售通路）已寫進 quality 區塊 GMI 那筆的說明，原列軟刪除。
   各區的初始內容由 db/content/340_cert_sections_oct30.sql 補。

   與 EF 那條路徑的 Api/Data/Migrations/ 下的 CertificationListSections 一對一（schema 權威在那邊，
   見 db/README 與 docs/10 §8）。表數、CHECK 數不變。
   ============================================================================= */
SET NOCOUNT ON;
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET XACT_ABORT ON;
GO

BEGIN TRAN;

IF EXISTS (SELECT 1 FROM sys.check_constraints
           WHERE name = 'CK_CertificationListItem_Section' AND definition LIKE '%standards%')
BEGIN
    ALTER TABLE dbo.CertificationListItem DROP CONSTRAINT CK_CertificationListItem_Section;

    UPDATE dbo.CertificationListItem SET Section = 'quality' WHERE Section = 'standards';
    UPDATE dbo.CertificationListItem SET Section = 'quality', IsDeleted = 1, UpdatedAt = SYSUTCDATETIME()
    WHERE Section = 'gmi';

    ALTER TABLE dbo.CertificationListItem ADD CONSTRAINT CK_CertificationListItem_Section
        CHECK ([Section] IN ('management','quality','material','building','membership','award','partner'));
END

IF NOT EXISTS (SELECT 1 FROM dbo.SchemaVersion WHERE ScriptName = N'0021_certification_list_sections.sql')
    INSERT dbo.SchemaVersion (ScriptName) VALUES (N'0021_certification_list_sections.sql');

COMMIT;
GO
