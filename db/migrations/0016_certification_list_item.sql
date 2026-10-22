/* =============================================================================
   0016_certification_list_item.sql  —  認證頁四個清單區塊改由後台驅動（2026-10-22）
   -----------------------------------------------------------------------------
   /about-certifications 下方四個清單原本寫死在頁面裡，後台只能改字、不能增減：

     - Management System & Environmental Certification → 真正的認證，讀 Certification
       （新欄 ShowInDetailList 決定要不要列；標題＝Name、內文＝Description）
     - Printing & Colour Standards／GMI 通路／Awards → 不是認證（沒有 logo，也不該上
       logo 牆與首頁 Proof 牆），放新表 CertificationListItem，Section 區分三塊

   後台是單元 08 的附屬清單（/admin/certification/item），權限沿用 certification.*。
   內容由 db/content/310_cert_detail_list.sql 匯入。

   與 EF 那條路徑的 Api/Data/Migrations/*_CertificationListItem 一對一（schema 權威在那邊，
   見 db/README 與 docs/10 §8）。

   套用後：表數 +2、外鍵 +1（CASCADE +1）、CHECK +2、非 PK/UQ 索引 +1；Certification 欄位 +1。
   ============================================================================= */
SET NOCOUNT ON;
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET XACT_ABORT ON;
GO

BEGIN TRAN;

IF COL_LENGTH('dbo.Certification', 'ShowInDetailList') IS NULL
    ALTER TABLE dbo.Certification ADD ShowInDetailList BIT NOT NULL
        CONSTRAINT DF_Certification_ShowInDetailList DEFAULT 0;   -- 列在認證頁「管理系統與環境認證」清單

IF OBJECT_ID('dbo.CertificationListItem', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.CertificationListItem (
        Id          INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_CertificationListItem PRIMARY KEY,
        Section     VARCHAR(20)  NOT NULL,                                    -- standards／gmi／award
        SortOrder   INT          NOT NULL CONSTRAINT DF_CertificationListItem_SortOrder   DEFAULT 0,
        IsPublished BIT          NOT NULL CONSTRAINT DF_CertificationListItem_IsPublished DEFAULT 1,
        CreatedAt   DATETIME2(0) NOT NULL CONSTRAINT DF_CertificationListItem_CreatedAt   DEFAULT SYSUTCDATETIME(),
        CreatedBy   INT NULL,
        UpdatedAt   DATETIME2(0) NULL,
        UpdatedBy   INT NULL,
        IsDeleted   BIT NOT NULL CONSTRAINT DF_CertificationListItem_IsDeleted DEFAULT 0,
        CONSTRAINT CK_CertificationListItem_Section CHECK ([Section] IN ('standards','gmi','award'))
    );

    CREATE TABLE dbo.CertificationListItemI18n (
        CertificationListItemId INT           NOT NULL,
        Lang                    VARCHAR(5)    NOT NULL,
        Title                   NVARCHAR(200) NOT NULL,
        Description             NVARCHAR(400) NULL,
        CONSTRAINT PK_CertificationListItemI18n PRIMARY KEY (CertificationListItemId, Lang),
        CONSTRAINT CK_CertificationListItemI18n_Lang CHECK ([Lang] IN ('zh','en')),
        CONSTRAINT FK_CertificationListItemI18n_CertificationListItem FOREIGN KEY (CertificationListItemId)
            REFERENCES dbo.CertificationListItem (Id) ON DELETE CASCADE
    );

    CREATE INDEX IX_CertificationListItem_Section
        ON dbo.CertificationListItem (IsDeleted, IsPublished, Section, SortOrder);
END

IF NOT EXISTS (SELECT 1 FROM dbo.SchemaVersion WHERE ScriptName = N'0016_certification_list_item.sql')
    INSERT dbo.SchemaVersion (ScriptName) VALUES (N'0016_certification_list_item.sql');

COMMIT;
GO
