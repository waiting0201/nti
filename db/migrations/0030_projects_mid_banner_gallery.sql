/* =============================================================================
   0030_projects_mid_banner_gallery.sql  —  Projects 中段橫幅改成可放多張（2026-11-16）
   -----------------------------------------------------------------------------
   projects 從 PageMidBannerPages 搬到 PageGalleryPages（中英各一組，前台依序整張顯示、不輪播）。
   現有的 Page.MidBanner1ImagePath 搬成兩語系相簿的第一張，替代文字沿用「頁面文字」改過的值
   （沒改過就用 mockup 原文／zh.ts 的譯文），搬完把舊欄位清成 NULL。schema 不變。

   與 EF 那條路徑的 Api/Data/Migrations/*_ProjectsMidBannerGallery 一對一（schema 權威在那邊，
   見 db/README 與 docs/10 §8）。該頁已經有相簿照片就不搬（冪等）。
   ============================================================================= */
SET NOCOUNT ON;
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET XACT_ABORT ON;
GO

BEGIN TRAN;

DECLARE @pageId INT, @path NVARCHAR(260);
SELECT @pageId = Id, @path = MidBanner1ImagePath FROM dbo.Page WHERE PageKey = 'projects';

IF @pageId IS NOT NULL AND @path IS NOT NULL
   AND NOT EXISTS (SELECT 1 FROM dbo.PageGalleryImage WHERE PageId = @pageId)
BEGIN
    INSERT dbo.PageGalleryImage (PageId, Lang, ImagePath, ImageAlt, SortOrder)
    SELECT @pageId, v.Lang, @path,
           LEFT(COALESCE(NULLIF(LTRIM(RTRIM(t.Value)), N''), v.DefaultAlt), 200), 10
    FROM (VALUES ('en', N'A showcase of NTI''s printed packaging work'),
                 ('zh', N'NTI 包裝印刷作品集')) v (Lang, DefaultAlt)
    LEFT JOIN dbo.PageText t
           ON t.PageId = @pageId AND t.Lang = v.Lang
          AND t.SourceText = N'A showcase of NTI''s printed packaging work';
END

UPDATE dbo.Page SET MidBanner1ImagePath = NULL WHERE PageKey = 'projects';

IF NOT EXISTS (SELECT 1 FROM dbo.SchemaVersion WHERE ScriptName = N'0030_projects_mid_banner_gallery.sql')
    INSERT dbo.SchemaVersion (ScriptName) VALUES (N'0030_projects_mid_banner_gallery.sql');

COMMIT;
GO
