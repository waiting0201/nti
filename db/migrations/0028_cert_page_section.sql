/* =============================================================================
   0028_cert_page_section.sql  —  認證加「認證頁區塊」：Certification.PageCategoryId（2026-11-11）
   -----------------------------------------------------------------------------
   客戶要認證頁排成「區塊大標 → 文字清單 → 該區塊的 logo」。CategoryId 仍是首頁 Proof 的分組
   （三張卡），認證頁的區塊（七個）粒度不同，所以另開一欄；同一套認證分類，共用 CategoryTypeGuard。
   NULL＝前台沿用 CategoryId。初始值由 db/content/370_cert_page_section.sql 補。

   與 EF 那條路徑的 Api/Data/Migrations/*_CertPageSection 一對一（schema 權威在那邊，
   見 db/README 與 docs/10 §8）。

   套用後：Certification 多一欄、外鍵 +1（FK_Certification_PageCategory）。
   ============================================================================= */
SET NOCOUNT ON;
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET XACT_ABORT ON;
GO

BEGIN TRAN;

IF COL_LENGTH('dbo.Certification', 'PageCategoryId') IS NULL
    ALTER TABLE dbo.Certification ADD PageCategoryId INT NULL;

COMMIT;
GO

BEGIN TRAN;

IF OBJECT_ID('dbo.FK_Certification_PageCategory', 'F') IS NULL
    ALTER TABLE dbo.Certification ADD CONSTRAINT FK_Certification_PageCategory
        FOREIGN KEY (PageCategoryId, CategoryTypeGuard) REFERENCES dbo.Category (Id, CategoryType);

IF NOT EXISTS (SELECT 1 FROM dbo.SchemaVersion WHERE ScriptName = N'0028_cert_page_section.sql')
    INSERT dbo.SchemaVersion (ScriptName) VALUES (N'0028_cert_page_section.sql');

COMMIT;
GO
