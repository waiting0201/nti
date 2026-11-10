/* =============================================================================
   0026_certification_description_1000.sql  —  認證說明放寬：CertificationI18n.Description 400 → 1000（2026-11-10）
   -----------------------------------------------------------------------------
   客戶在後台 08 填的說明超過 400 字，存檔被 SQL 截斷錯誤（2628）擋下。只放寬、不縮減，
   既有資料不受影響。

   與 EF 那條路徑的 Api/Data/Migrations/*_CertificationDescription1000 一對一（schema 權威在那邊，
   見 db/README 與 docs/10 §8）。

   套用後：表數、外鍵、索引不變；CertificationI18n.Description 長度 1000。
   ============================================================================= */
SET NOCOUNT ON;
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET XACT_ABORT ON;
GO

BEGIN TRAN;

IF COL_LENGTH('dbo.CertificationI18n', 'Description') < 2000   -- NVARCHAR 的位元組數＝字數 × 2
    ALTER TABLE dbo.CertificationI18n ALTER COLUMN Description NVARCHAR(1000) NULL;

IF NOT EXISTS (SELECT 1 FROM dbo.SchemaVersion WHERE ScriptName = N'0026_certification_description_1000.sql')
    INSERT dbo.SchemaVersion (ScriptName) VALUES (N'0026_certification_description_1000.sql');

COMMIT;
GO
