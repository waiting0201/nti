/* =============================================================================
   330_factory_gallery_oldsite.sql  —  工廠導覽英文版相簿換成舊站的 12 張（2026-10-25）
   -----------------------------------------------------------------------------
   英文版 /facility-tour 改為相簿（一排四張縮圖＋燈箱，比照舊站 nti-printing.com/home/factory）。
   EF migration PageGallery 搬進來的是原本單元 10「參觀」分類那 3 張全景圖
   （fac-tour1／fac-tour2／fac-tour-main，2880 寬的超寬圖，裁成 4:3 縮圖不好看），
   這支換成舊站相簿的 12 張（mockup/assets/fac-gallery-01～12.webp，替代文字為英文）。

   只在相簿「還是那 3 張預設圖」時才換：只要有任何一張不是它們（客戶在後台換過、加過），
   或已經是這 12 張，就整個不動。全新建庫時 200 已直接匯入這 12 張，這支什麼都不會做。
   冪等。
   ============================================================================= */
SET NOCOUNT ON;
SET XACT_ABORT ON;
GO

BEGIN TRAN;

DECLARE @pageId INT = (SELECT Id FROM dbo.Page WHERE PageKey = N'facility-tour');

IF @pageId IS NOT NULL
   AND EXISTS (SELECT 1 FROM dbo.PageGalleryImage WHERE PageId = @pageId AND Lang = 'en')
   AND NOT EXISTS (
       SELECT 1 FROM dbo.PageGalleryImage
       WHERE PageId = @pageId AND Lang = 'en'
         AND ImagePath NOT LIKE N'assets/fac-tour1.%'
         AND ImagePath NOT LIKE N'assets/fac-tour2.%'
         AND ImagePath NOT LIKE N'assets/fac-tour-main.%')
BEGIN
    DELETE dbo.PageGalleryImage WHERE PageId = @pageId AND Lang = 'en';

    INSERT dbo.PageGalleryImage (PageId, Lang, ImagePath, ImageAlt, SortOrder)
    SELECT @pageId, 'en', v.ImagePath, v.ImageAlt, v.SortOrder
    FROM (VALUES
    (N'assets/fac-gallery-01.webp', N'NTI Printing headquarters — building exterior', 10),
    (N'assets/fac-gallery-02.webp', N'NTI Printing headquarters at night', 20),
    (N'assets/fac-gallery-03.webp', N'Ground-floor lobby', 30),
    (N'assets/fac-gallery-04.webp', N'Ground-floor lobby reception lounge', 40),
    (N'assets/fac-gallery-05.webp', N'Ground-floor meeting room', 50),
    (N'assets/fac-gallery-06.webp', N'Second-floor staff restaurant', 60),
    (N'assets/fac-gallery-07.webp', N'Second-floor office', 70),
    (N'assets/fac-gallery-08.webp', N'Second-floor pantry', 80),
    (N'assets/fac-gallery-09.webp', N'Fourth-floor operations room', 90),
    (N'assets/fac-gallery-10.webp', N'Second-floor post-press production area', 100),
    (N'assets/fac-gallery-11.webp', N'Ground-floor paper cutting area', 110),
    (N'assets/fac-gallery-12.webp', N'Offset press line on the production floor', 120)
    ) v (ImagePath, ImageAlt, SortOrder);
END

COMMIT;
GO
