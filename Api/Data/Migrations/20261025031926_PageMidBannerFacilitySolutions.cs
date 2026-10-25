using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Nti.Api.Data.Migrations
{
    /// <inheritdoc />
    /// <summary>
    /// <c>PageMidBannerPages</c> 補上漏掉的兩頁（9 → 11 頁、15 → 17 張）：
    /// <c>solutions</c> 的 Projects 圖（mockup 是 <c>&lt;div class="fac-banner reveal mt-m"&gt;</c>）、
    /// <c>facility</c> 的 Factory Tour 全幅照（<c>.fullbleed.tour-photo</c>）。
    /// <para>
    /// 只有資料、schema 不變。一次性補上 mockup 那張（只補 NULL），與 PageMidBanner 同一個做法。
    /// </para>
    /// </summary>
    public partial class PageMidBannerFacilitySolutions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // db/migrations/0018_page_mid_banner_facility_solutions.sql 同一份對照
            migrationBuilder.Sql(
                """
                UPDATE p SET p.MidBanner1ImagePath = COALESCE(p.MidBanner1ImagePath, v.P1)
                FROM dbo.Page p
                INNER JOIN (VALUES
                    ('facility',  N'assets/fac-tour-main.webp'),
                    ('solutions', N'assets/ref-sol-projects.webp')
                ) v(PageKey, P1) ON v.PageKey = p.PageKey;
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("UPDATE dbo.Page SET MidBanner1ImagePath = NULL WHERE PageKey IN ('facility', 'solutions');");
        }
    }
}
