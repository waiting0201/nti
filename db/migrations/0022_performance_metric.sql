/* =============================================================================
   0022_performance_metric.sql  —  碳效率頁的績效表改由後台驅動（2026-11-05）
   -----------------------------------------------------------------------------
   /green-carbon「水資源」段落下方新增一張績效表（指標／期間／結果），客戶要能自己更新數字、
   增減列。後台是單元 08 的附屬清單（/admin/certification/metric），權限沿用 certification.*。
   三欄都分語系（「2024 年」「度／年」這類單位中英寫法不同）。
   內容由 db/content/350_performance_metrics.sql 匯入。

   與 EF 那條路徑的 Api/Data/Migrations/*_PerformanceMetric 一對一（schema 權威在那邊，
   見 db/README 與 docs/10 §8）。

   套用後：表數 +2、外鍵 +1（CASCADE +1）、CHECK +1（*I18n 的 Lang）、非 PK/UQ 索引 +0
   （一頁幾列的小表，不另建索引）。
   ============================================================================= */
SET NOCOUNT ON;
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET XACT_ABORT ON;
GO

BEGIN TRAN;

IF OBJECT_ID('dbo.PerformanceMetric', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.PerformanceMetric (
        Id          INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_PerformanceMetric PRIMARY KEY,
        SortOrder   INT          NOT NULL CONSTRAINT DF_PerformanceMetric_SortOrder   DEFAULT 0,
        IsPublished BIT          NOT NULL CONSTRAINT DF_PerformanceMetric_IsPublished DEFAULT 1,
        CreatedAt   DATETIME2(0) NOT NULL CONSTRAINT DF_PerformanceMetric_CreatedAt   DEFAULT SYSUTCDATETIME(),
        CreatedBy   INT NULL,
        UpdatedAt   DATETIME2(0) NULL,
        UpdatedBy   INT NULL,
        IsDeleted   BIT NOT NULL CONSTRAINT DF_PerformanceMetric_IsDeleted DEFAULT 0
    );

    CREATE TABLE dbo.PerformanceMetricI18n (
        PerformanceMetricId INT           NOT NULL,
        Lang                VARCHAR(5)    NOT NULL,
        Indicator           NVARCHAR(100) NOT NULL,   -- 指標
        Period              NVARCHAR(50)  NOT NULL,   -- 期間
        Result              NVARCHAR(200) NOT NULL,   -- 結果
        CONSTRAINT PK_PerformanceMetricI18n PRIMARY KEY (PerformanceMetricId, Lang),
        CONSTRAINT CK_PerformanceMetricI18n_Lang CHECK ([Lang] IN ('zh','en')),
        CONSTRAINT FK_PerformanceMetricI18n_PerformanceMetric FOREIGN KEY (PerformanceMetricId)
            REFERENCES dbo.PerformanceMetric (Id) ON DELETE CASCADE
    );
END

IF NOT EXISTS (SELECT 1 FROM dbo.SchemaVersion WHERE ScriptName = N'0022_performance_metric.sql')
    INSERT dbo.SchemaVersion (ScriptName) VALUES (N'0022_performance_metric.sql');

COMMIT;
GO
