/* =============================================================================
   0001_schema_version.sql  —  遷移記錄表（journal bootstrap）
   -----------------------------------------------------------------------------
   docs/08-database.md §8 宣告用「.sql 遷移檔 + SchemaVersion 表」而非 EF Migrations，
   但原文件未給 SchemaVersion 的 DDL，此處補上。

   欄位設計刻意與 DbUp 相容：ScriptName / Applied 兩欄的名稱與型別不可更動，
   否則 .JournalToSqlTable("dbo","SchemaVersion") 會失敗。其餘欄位皆可為 NULL
   或帶 DEFAULT，故不影響 DbUp 寫入。
   ============================================================================= */
SET NOCOUNT ON;
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET XACT_ABORT ON;
GO

IF OBJECT_ID(N'dbo.SchemaVersion', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.SchemaVersion (
        Id         INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_SchemaVersion PRIMARY KEY,
        ScriptName NVARCHAR(255) NOT NULL,                                              -- DbUp 相容欄，勿改名
        Applied    DATETIME      NOT NULL CONSTRAINT DF_SchemaVersion_Applied DEFAULT GETDATE(),  -- DbUp 相容欄，勿改型別
        AppliedUtc DATETIME2(0)  NULL     CONSTRAINT DF_SchemaVersion_AppliedUtc DEFAULT SYSUTCDATETIME(),
        AppliedBy  NVARCHAR(128) NULL     CONSTRAINT DF_SchemaVersion_AppliedBy  DEFAULT SUSER_SNAME(),
        Checksum   CHAR(64)      NULL,     -- 腳本內容 SHA-256；供 runner 偵測「已套用的檔被事後編輯」
        CONSTRAINT UQ_SchemaVersion_ScriptName UNIQUE (ScriptName)
    );
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.SchemaVersion WHERE ScriptName = N'0001_schema_version.sql')
    INSERT dbo.SchemaVersion (ScriptName) VALUES (N'0001_schema_version.sql');
GO
