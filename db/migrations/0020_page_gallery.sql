/* =============================================================================
   0020_page_gallery.sql  —  工廠導覽英文版的相簿照片改在單元 15 上傳（2026-10-25）
   -----------------------------------------------------------------------------
   新表 PageGalleryImage：固定頁某語系的相簿照片，只開放 Api/Common/Constants.cs 的
   PageGalleryPages 列出的頁與語系（目前只有 facility-tour 的英文；中文版是影片）。

   照片原本借用單元 10 的「參觀」分類（Category Facility/tour）。一次性把那幾筆
   （有上架的、依排序）搬過來，替代文字取英文；搬完刪掉原本那幾筆並停用分類。
   圖片路徑原樣沿用，Blob 上的檔案不動。

   與 EF 那條路徑的 Api/Data/Migrations/ 下的 PageGallery 一對一（schema 權威在那邊，
   見 db/README 與 docs/10 §8）。

   套用後：表 +1、外鍵 +1（CASCADE）、CHECK +1、索引 +1。
   ============================================================================= */
SET NOCOUNT ON;
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET XACT_ABORT ON;
GO

IF OBJECT_ID('dbo.PageGalleryImage', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.PageGalleryImage (
        Id        INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_PageGalleryImage PRIMARY KEY,
        PageId    INT           NOT NULL,
        Lang      VARCHAR(5)    NOT NULL,
        ImagePath NVARCHAR(260) NOT NULL,
        ImageAlt  NVARCHAR(200) NOT NULL,
        SortOrder INT           NOT NULL,
        CONSTRAINT FK_PageGalleryImage_Page FOREIGN KEY (PageId) REFERENCES dbo.Page(Id) ON DELETE CASCADE,
        CONSTRAINT CK_PageGalleryImage_Lang CHECK (Lang IN ('zh','en'))
    );
    CREATE INDEX IX_PageGalleryImage_Page ON dbo.PageGalleryImage (PageId, Lang, SortOrder);
END
GO

BEGIN TRAN;

-- 只在還沒有任何照片時搬，重跑不會重複
IF NOT EXISTS (SELECT 1 FROM dbo.PageGalleryImage g INNER JOIN dbo.Page p ON p.Id = g.PageId
               WHERE p.PageKey = 'facility-tour' AND g.Lang = 'en')
    INSERT dbo.PageGalleryImage (PageId, Lang, ImagePath, ImageAlt, SortOrder)
    SELECT p.Id, 'en', f.ImagePath, COALESCE(NULLIF(i.ImageAlt, N''), i.Name, N'NTI factory'),
           ROW_NUMBER() OVER (ORDER BY f.SortOrder, f.Id) * 10
    FROM dbo.FacilityItem f
    INNER JOIN dbo.Category c ON c.Id = f.CategoryId AND c.CategoryType = 'Facility' AND c.Code = 'tour'
    INNER JOIN dbo.Page p ON p.PageKey = 'facility-tour'
    LEFT JOIN dbo.FacilityItemI18n i ON i.FacilityItemId = f.Id AND i.Lang = 'en'
    WHERE f.IsPublished = 1 AND f.IsDeleted = 0;

DELETE i FROM dbo.FacilityItemI18n i
INNER JOIN dbo.FacilityItem f ON f.Id = i.FacilityItemId
INNER JOIN dbo.Category c ON c.Id = f.CategoryId AND c.CategoryType = 'Facility' AND c.Code = 'tour';

DELETE f FROM dbo.FacilityItem f
INNER JOIN dbo.Category c ON c.Id = f.CategoryId AND c.CategoryType = 'Facility' AND c.Code = 'tour';

UPDATE dbo.Category SET IsActive = 0 WHERE CategoryType = 'Facility' AND Code = 'tour';

IF NOT EXISTS (SELECT 1 FROM dbo.SchemaVersion WHERE ScriptName = N'0020_page_gallery.sql')
    INSERT dbo.SchemaVersion (ScriptName) VALUES (N'0020_page_gallery.sql');

COMMIT;
GO
