using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Nti.Api.Data.Migrations
{
    /// <inheritdoc />
    /// <summary>
    /// 頂部橫幅圖改由後台維護：<c>Page.BannerImagePath</c>，只有 <c>PageBannerPages</c> 那 20 頁用。
    /// <para>
    /// 一次性補上 mockup 目前那張圖（只補 NULL），後台編輯畫面一打開就看得到現在用的是哪張，
    /// 不必再跑內容匯入。路徑寫成 <c>assets/...</c>，與 db/content 匯入的格式一致（前台 cmsMedia 認得）。
    /// EF 依 HasData 產生的 29 筆 <c>UpdateData(Page, BannerImagePath = null)</c> 是空動作，已拿掉。
    /// </para>
    /// </summary>
    public partial class PageBanner : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BannerImagePath",
                table: "Page",
                type: "nvarchar(260)",
                maxLength: 260,
                nullable: true);

            // 與 mockup 各頁頂部那張一致（db/migrations/0014_page_banner.sql 同一份對照）
            migrationBuilder.Sql(
                """
                UPDATE p SET p.BannerImagePath = v.Path
                FROM dbo.Page p
                INNER JOIN (VALUES
                    ('about-hub',             N'assets/ref-about-banner.webp'),
                    ('about-difference',      N'assets/ref-about-mid1.webp'),
                    ('about-benefits',        N'assets/ref-about-mid3.webp'),
                    ('about-certifications',  N'assets/ref-about-mid2.webp'),
                    ('facility',              N'assets/fac-banner.webp'),
                    ('facility-pre-press',    N'assets/fac-pre-ctp.jpg'),
                    ('facility-eco-printing', N'assets/fac-eco-pressroom.jpg'),
                    ('facility-post-press',   N'assets/fac-post-diecut.jpg'),
                    ('facility-quality',      N'assets/fac-banner.webp'),
                    ('facility-tour',         N'assets/fac-tour-main.webp'),
                    ('solutions',             N'assets/ref-sol-banner.webp'),
                    ('sustainability-hub',    N'assets/ref-green-banner.webp'),
                    ('green-our-advantage',   N'assets/ref-green-mid2.webp'),
                    ('green-carbon',          N'assets/ref-green-mid3.webp'),
                    ('green-materials',       N'assets/ref-green-mid1.webp'),
                    ('green-esg',             N'assets/ref-green-mid4.webp'),
                    ('insights',              N'assets/green-tree.webp'),
                    ('news-list',             N'assets/diff-grid.webp'),
                    ('industry-trends',       N'assets/sol-patterns.webp'),
                    ('careers',               N'assets/fac-tour-main.webp')
                ) v(PageKey, Path) ON v.PageKey = p.PageKey
                WHERE p.BannerImagePath IS NULL;
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BannerImagePath",
                table: "Page");
        }
    }
}
