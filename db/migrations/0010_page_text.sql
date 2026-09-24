/* =============================================================================
   0010_page_text.sql  —  頁面文字覆寫（2026-09-24）
   -----------------------------------------------------------------------------
   後台單元 15 page 的「頁面文字」：固定頁上的段落／標題／圖片 alt 可在後台逐段
   改寫中英文，沒改的沿用 mockup 原文（中文沿用 zh.ts 的譯文）。版面與段落數
   仍由 mockup 決定，這張表只存「原文 → 改過的字」。首批開放 About Us 五頁
   （about-hub、about-difference、about-benefits、about-certifications、facility-tour）。

   以原文（空白正規化後）的 SHA-256 為鍵：原文可能是一整段，nvarchar(max) 不能進索引。

   與 EF 那條路徑的 Api/Data/Migrations/*_PageText 一對一（schema 權威在那邊，
   見 db/README 與 docs/10 §8）。

   套用後：表數 47 → 48、外鍵 33 → 34（CASCADE 20 → 21）、CHECK +1、非 PK/UQ 索引 +1。
   ============================================================================= */
SET NOCOUNT ON;
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET XACT_ABORT ON;
GO

BEGIN TRAN;

CREATE TABLE dbo.PageText (
    Id         INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_PageText PRIMARY KEY,
    PageId     INT           NOT NULL,
    Lang       VARCHAR(5)    NOT NULL,
    SourceHash CHAR(64)      NOT NULL,                                        -- SHA-256(正規化原文)，小寫 hex
    SourceText NVARCHAR(MAX) NOT NULL,                                        -- 原文（英文，mockup 的字面）
    Value      NVARCHAR(MAX) NOT NULL,                                        -- 後台改過的字；空字串不存，直接刪列
    CreatedAt  DATETIME2(0)  NOT NULL CONSTRAINT DF_PageText_CreatedAt DEFAULT SYSUTCDATETIME(),
    CreatedBy  INT NULL,
    UpdatedAt  DATETIME2(0) NULL,
    UpdatedBy  INT NULL,
    IsDeleted  BIT NOT NULL CONSTRAINT DF_PageText_IsDeleted DEFAULT 0,
    CONSTRAINT CK_PageText_Lang CHECK ([Lang] IN ('zh','en')),
    CONSTRAINT FK_PageText_Page FOREIGN KEY (PageId) REFERENCES dbo.Page (Id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX UX_PageText_Page_Lang_Hash ON dbo.PageText (PageId, Lang, SourceHash);

IF NOT EXISTS (SELECT 1 FROM dbo.SchemaVersion WHERE ScriptName = N'0010_page_text.sql')
    INSERT dbo.SchemaVersion (ScriptName) VALUES (N'0010_page_text.sql');

COMMIT;
GO
