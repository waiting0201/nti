/* =============================================================================
   0011_certification_credential.sql  —  認證的證號與日期（2026-09-24）
   -----------------------------------------------------------------------------
   後台單元 08 certification 加三個不分語系的欄位：證號、取得日期、最近稽核日期。
   客戶 2026-09-22 的 SEO/GEO 文案要求每一項認證附上具體的證號／日期——AI 引擎
   只引用有具體數字的文字。都可空；沒填前台就不顯示。

   與 EF 那條路徑的 Api/Data/Migrations/*_CertificationCredential 一對一（schema 權威在那邊，
   見 db/README 與 docs/10 §8）。

   套用後：表數、外鍵、索引不變；Certification 欄位 +3。
   ============================================================================= */
SET NOCOUNT ON;
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET XACT_ABORT ON;
GO

BEGIN TRAN;

IF COL_LENGTH('dbo.Certification', 'CertificateNo') IS NULL
    ALTER TABLE dbo.Certification ADD
        CertificateNo NVARCHAR(100) NULL,                                     -- 例：FSC-C123456
        CertifiedDate DATE NULL,                                              -- 取得日期
        LastAuditDate DATE NULL;                                              -- 最近一次第三方稽核日期

IF NOT EXISTS (SELECT 1 FROM dbo.SchemaVersion WHERE ScriptName = N'0011_certification_credential.sql')
    INSERT dbo.SchemaVersion (ScriptName) VALUES (N'0011_certification_credential.sql');

COMMIT;
GO
