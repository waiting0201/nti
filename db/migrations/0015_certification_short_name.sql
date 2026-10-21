/* =============================================================================
   0015_certification_short_name.sql  —  認證的簡稱：CertificationI18n.ShortName（2026-10-21）
   -----------------------------------------------------------------------------
   首頁 Proof 牆每張卡 logo 下方那行（例：G7 Master, ISO 9001, GMI）原本用 Name 串起來，
   但 Name 是全名（G7 Master Qualified Facility…），串起來太長。加一個分語系的簡稱，
   空的就落回 Name。值由 db/content/290_cert_proof_groups.sql 補上。

   與 EF 那條路徑的 Api/Data/Migrations/*_CertificationShortName 一對一（schema 權威在那邊，
   見 db/README 與 docs/10 §8）。

   套用後：表數、外鍵、索引不變；CertificationI18n 欄位 +1。
   ============================================================================= */
SET NOCOUNT ON;
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET XACT_ABORT ON;
GO

BEGIN TRAN;

IF COL_LENGTH('dbo.CertificationI18n', 'ShortName') IS NULL
    ALTER TABLE dbo.CertificationI18n ADD ShortName NVARCHAR(60) NULL;   -- 首頁 Proof 牆的簡稱

IF NOT EXISTS (SELECT 1 FROM dbo.SchemaVersion WHERE ScriptName = N'0015_certification_short_name.sql')
    INSERT dbo.SchemaVersion (ScriptName) VALUES (N'0015_certification_short_name.sql');

COMMIT;
GO
