using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Nti.Api.Data.Migrations
{
    /// <inheritdoc />
    /// <summary>
    /// 頁面中段的橫幅圖改由後台維護：<c>Page.MidBanner1ImagePath</c>～<c>MidBanner4ImagePath</c>，
    /// 張數由 <c>PageMidBannerPages</c> 決定（9 頁、15 張）。
    /// <para>
    /// 一次性補上 mockup 目前那幾張（只補 NULL），與 PageBanner 同一個做法。
    /// EF 依 HasData 產生的 29 筆 <c>UpdateData(Page, MidBanner*ImagePath = null)</c> 是空動作，已拿掉。
    /// </para>
    /// </summary>
    public partial class PageMidBanner : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "MidBanner1ImagePath",
                table: "Page",
                type: "nvarchar(260)",
                maxLength: 260,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MidBanner2ImagePath",
                table: "Page",
                type: "nvarchar(260)",
                maxLength: 260,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MidBanner3ImagePath",
                table: "Page",
                type: "nvarchar(260)",
                maxLength: 260,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MidBanner4ImagePath",
                table: "Page",
                type: "nvarchar(260)",
                maxLength: 260,
                nullable: true);

            // 與 mockup 各頁中段那幾張一致，依頁面由上而下（db/migrations/0017_page_mid_banner.sql 同一份對照）
            migrationBuilder.Sql(
                """
                UPDATE p SET
                    p.MidBanner1ImagePath = COALESCE(p.MidBanner1ImagePath, v.P1),
                    p.MidBanner2ImagePath = COALESCE(p.MidBanner2ImagePath, v.P2),
                    p.MidBanner3ImagePath = COALESCE(p.MidBanner3ImagePath, v.P3),
                    p.MidBanner4ImagePath = COALESCE(p.MidBanner4ImagePath, v.P4)
                FROM dbo.Page p
                INNER JOIN (VALUES
                    ('about-hub',            N'assets/ref-about-mid1.webp',   N'assets/ref-about-mid2.webp', N'assets/ref-about-mid3.webp', NULL),
                    ('about-difference',     N'assets/ref-about-mid2.webp',   NULL, NULL, NULL),
                    ('about-benefits',       N'assets/ref-about-banner.webp', NULL, NULL, NULL),
                    ('about-certifications', N'assets/ref-about-mid1.webp',   NULL, NULL, NULL),
                    ('facility-tour',        N'assets/fac-tour1.webp',        N'assets/fac-tour2.webp', NULL, NULL),
                    ('sustainability-hub',   N'assets/ref-green-mid2.webp',   N'assets/ref-green-mid3.webp', N'assets/ref-green-mid1.webp', N'assets/ref-green-mid4.webp'),
                    ('green-our-advantage',  N'assets/ref-green-mid4.webp',   NULL, NULL, NULL),
                    ('green-carbon',         N'assets/ref-green-mid4.webp',   NULL, NULL, NULL),
                    ('green-esg',            N'assets/ref-green-mid3.webp',   NULL, NULL, NULL)
                ) v(PageKey, P1, P2, P3, P4) ON v.PageKey = p.PageKey;
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MidBanner1ImagePath",
                table: "Page");

            migrationBuilder.DropColumn(
                name: "MidBanner2ImagePath",
                table: "Page");

            migrationBuilder.DropColumn(
                name: "MidBanner3ImagePath",
                table: "Page");

            migrationBuilder.DropColumn(
                name: "MidBanner4ImagePath",
                table: "Page");
        }
    }
}
