/* =============================================================================
   380_factory_gallery_zh.sql  —  工廠導覽中文版也放相簿（2026-11-13）
   -----------------------------------------------------------------------------
   中文版 /facility-tour 原本只有影片，這次在影片下方加上與英文版同一種相簿
   （一排四張縮圖＋燈箱）。相簿分語系存（PageGalleryImage.Lang），所以中文要有自己的一組：
   預設帶入與英文版相同的 12 張（mockup/assets/fac-gallery-01～12.webp），替代文字為中文。

   只在中文相簿「一張都沒有」時才匯入：客戶在後台放過就不動。
   ⚠️ 也因此，客戶若之後把中文相簿整個清空，重跑這支會把 12 張放回來——這支是一次性匯入，
   上線後不要再跑。冪等。
   須先部署含 PageGalleryPages 中文語系的 API，否則資料在、前台與後台都不會顯示。
   ============================================================================= */
SET NOCOUNT ON;
SET XACT_ABORT ON;
GO

BEGIN TRAN;

DECLARE @pageId INT = (SELECT Id FROM dbo.Page WHERE PageKey = N'facility-tour');

IF @pageId IS NOT NULL
   AND NOT EXISTS (SELECT 1 FROM dbo.PageGalleryImage WHERE PageId = @pageId AND Lang = 'zh')
BEGIN
    INSERT dbo.PageGalleryImage (PageId, Lang, ImagePath, ImageAlt, SortOrder)
    SELECT @pageId, 'zh', v.ImagePath, v.ImageAlt, v.SortOrder
    FROM (VALUES
    (N'assets/fac-gallery-01.webp', N'NTI 總部大樓外觀', 10),
    (N'assets/fac-gallery-02.webp', N'NTI 總部大樓夜景', 20),
    (N'assets/fac-gallery-03.webp', N'一樓大廳', 30),
    (N'assets/fac-gallery-04.webp', N'一樓大廳接待區', 40),
    (N'assets/fac-gallery-05.webp', N'一樓會議室', 50),
    (N'assets/fac-gallery-06.webp', N'二樓員工餐廳', 60),
    (N'assets/fac-gallery-07.webp', N'二樓辦公室', 70),
    (N'assets/fac-gallery-08.webp', N'二樓茶水間', 80),
    (N'assets/fac-gallery-09.webp', N'四樓作業室', 90),
    (N'assets/fac-gallery-10.webp', N'二樓印後加工區', 100),
    (N'assets/fac-gallery-11.webp', N'一樓裁紙區', 110),
    (N'assets/fac-gallery-12.webp', N'生產線上的平版印刷機', 120)
    ) v (ImagePath, ImageAlt, SortOrder);
END

COMMIT;
GO
