using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Nti.Api.Data.Migrations
{
    /// <inheritdoc />
    /// <summary>
    /// Projects 頁產業圖示下方的橫幅改成可放多張（2026-11-16，schema 不變）：
    /// projects 從 <c>PageMidBannerPages</c> 搬到 <c>PageGalleryPages</c>（中英各一組，前台依序整張顯示、不輪播）。
    /// <para>
    /// 把現有的 <c>Page.MidBanner1ImagePath</c> 搬成中英兩語系相簿的第一張，替代文字沿用「頁面文字」裡改過的值
    /// （沒改過就用 mockup 原文／zh.ts 的譯文），搬完把舊欄位清成 NULL——後台已不再顯示那一格，
    /// 留著只會變成刪不掉的孤兒參照。該頁已經有相簿照片就不搬（冪等）。
    /// </para>
    /// db/migrations/0030_projects_mid_banner_gallery.sql 同一份對照。
    /// </summary>
    public partial class ProjectsMidBannerGallery : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
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
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // 相簿第一張（英文優先）搬回單一格；其餘照片刪掉
            migrationBuilder.Sql(
                """
                DECLARE @pageId INT = (SELECT Id FROM dbo.Page WHERE PageKey = 'projects');

                UPDATE dbo.Page
                SET MidBanner1ImagePath = (SELECT TOP 1 ImagePath FROM dbo.PageGalleryImage
                                           WHERE PageId = @pageId ORDER BY CASE Lang WHEN 'en' THEN 0 ELSE 1 END, SortOrder, Id)
                WHERE Id = @pageId;

                DELETE dbo.PageGalleryImage WHERE PageId = @pageId;
                """);
        }
    }
}
