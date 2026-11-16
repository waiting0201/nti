using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Nti.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class TrendDetailPage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CanonicalUrl",
                table: "IndustryTrendI18n",
                type: "nvarchar(300)",
                maxLength: 300,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OgDescription",
                table: "IndustryTrendI18n",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OgTitle",
                table: "IndustryTrendI18n",
                type: "nvarchar(90)",
                maxLength: 90,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SeoDescription",
                table: "IndustryTrendI18n",
                type: "nvarchar(180)",
                maxLength: 180,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SeoTitle",
                table: "IndustryTrendI18n",
                type: "nvarchar(70)",
                maxLength: 70,
                nullable: true);


            migrationBuilder.AddColumn<string>(
                name: "Summary",
                table: "IndustryTrendI18n",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OgImagePath",
                table: "IndustryTrend",
                type: "nvarchar(260)",
                maxLength: 260,
                nullable: true);

            // Slug 是 NOT NULL，但 EF 產生的「ADD ... NOT NULL DEFAULT N''」會留下一個匿名
            // DEFAULT 約束（verify-ef.sql 的「匿名約束數必須為 0」），而且空字串馬上撞唯一索引。
            // 改成三步：先加可為 NULL 的欄 → 給既有列一個暫用 slug（trend-{Id}）→ 再收成 NOT NULL。
            // 正式的 slug／摘要／SEO 由 db/content/400_trend_detail.sql 帶入，
            // 它只覆寫還是 trend-{Id} 的那幾筆，客戶在後台改過的不動。
            migrationBuilder.AddColumn<string>(
                name: "Slug",
                table: "IndustryTrendI18n",
                type: "nvarchar(160)",
                maxLength: 160,
                nullable: true);

            migrationBuilder.Sql("""
                UPDATE IndustryTrendI18n
                SET    Slug = CONCAT('trend-', IndustryTrendId)
                WHERE  Slug IS NULL;
                """);

            migrationBuilder.AlterColumn<string>(
                name: "Slug",
                table: "IndustryTrendI18n",
                type: "nvarchar(160)",
                maxLength: 160,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(160)",
                oldMaxLength: 160,
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "UX_IndustryTrendI18n_Lang_Slug",
                table: "IndustryTrendI18n",
                columns: new[] { "Lang", "Slug" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "UX_IndustryTrendI18n_Lang_Slug",
                table: "IndustryTrendI18n");

            migrationBuilder.DropColumn(
                name: "CanonicalUrl",
                table: "IndustryTrendI18n");

            migrationBuilder.DropColumn(
                name: "OgDescription",
                table: "IndustryTrendI18n");

            migrationBuilder.DropColumn(
                name: "OgTitle",
                table: "IndustryTrendI18n");

            migrationBuilder.DropColumn(
                name: "SeoDescription",
                table: "IndustryTrendI18n");

            migrationBuilder.DropColumn(
                name: "SeoTitle",
                table: "IndustryTrendI18n");

            migrationBuilder.DropColumn(
                name: "Slug",
                table: "IndustryTrendI18n");

            migrationBuilder.DropColumn(
                name: "Summary",
                table: "IndustryTrendI18n");

            migrationBuilder.DropColumn(
                name: "OgImagePath",
                table: "IndustryTrend");
        }
    }
}
