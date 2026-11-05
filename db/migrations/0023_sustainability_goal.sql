/* =============================================================================
   0023_sustainability_goal.sql  —  ESG 頁「南台彩藝永續目標」表改由後台驅動（2026-11-05）
   -----------------------------------------------------------------------------
   /green-esg「企業社會責任」上方新增一張兩欄表（目標／時程），客戶要能自己增減與更新。
   後台是單元 08 的附屬清單（/admin/certification/goal），權限沿用 certification.*。
   內容由 db/content/360_sustainability_goals.sql 匯入。

   與 EF 那條路徑的 Api/Data/Migrations/*_SustainabilityGoal 一對一（schema 權威在那邊，
   見 db/README 與 docs/10 §8）。

   套用後：表數 +2、外鍵 +1（CASCADE +1）、CHECK +1（*I18n 的 Lang）、非 PK/UQ 索引 +0。
   ============================================================================= */
SET NOCOUNT ON;
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET XACT_ABORT ON;
GO

BEGIN TRAN;

IF OBJECT_ID('dbo.SustainabilityGoal', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.SustainabilityGoal (
        Id          INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_SustainabilityGoal PRIMARY KEY,
        SortOrder   INT          NOT NULL CONSTRAINT DF_SustainabilityGoal_SortOrder   DEFAULT 0,
        IsPublished BIT          NOT NULL CONSTRAINT DF_SustainabilityGoal_IsPublished DEFAULT 1,
        CreatedAt   DATETIME2(0) NOT NULL CONSTRAINT DF_SustainabilityGoal_CreatedAt   DEFAULT SYSUTCDATETIME(),
        CreatedBy   INT NULL,
        UpdatedAt   DATETIME2(0) NULL,
        UpdatedBy   INT NULL,
        IsDeleted   BIT NOT NULL CONSTRAINT DF_SustainabilityGoal_IsDeleted DEFAULT 0
    );

    CREATE TABLE dbo.SustainabilityGoalI18n (
        SustainabilityGoalId INT           NOT NULL,
        Lang                VARCHAR(5)    NOT NULL,
        Goal                 NVARCHAR(100) NOT NULL,   -- 目標
        Timeline             NVARCHAR(50)  NOT NULL,   -- 時程
        CONSTRAINT PK_SustainabilityGoalI18n PRIMARY KEY (SustainabilityGoalId, Lang),
        CONSTRAINT CK_SustainabilityGoalI18n_Lang CHECK ([Lang] IN ('zh','en')),
        CONSTRAINT FK_SustainabilityGoalI18n_SustainabilityGoal FOREIGN KEY (SustainabilityGoalId)
            REFERENCES dbo.SustainabilityGoal (Id) ON DELETE CASCADE
    );
END

IF NOT EXISTS (SELECT 1 FROM dbo.SchemaVersion WHERE ScriptName = N'0023_sustainability_goal.sql')
    INSERT dbo.SchemaVersion (ScriptName) VALUES (N'0023_sustainability_goal.sql');

COMMIT;
GO
