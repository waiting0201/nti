using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Nti.Api.Data.Migrations
{
    /// <inheritdoc />
    /// <summary>
    /// 客戶 2026-11-11《NTI 官網修改清單》的資料面變更（schema 不變）：
    /// <list type="bullet">
    /// <item>頁尾社群加回 LinkedIn：新增設定 <c>social.linkedin</c>（值留 NULL，等客戶在後台填網址；留空前台不顯示）。</item>
    /// <item>首頁方案卡英文改短名：Color Box／Paperboard／UV Printing（不變）／Other。只動英文 Name，H1 與中文不變。</item>
    /// <item>Projects 頁加頂部橫幅與圖示下方的圖（<c>PageBannerPages</c>／<c>PageMidBannerPages</c> 加 projects）：
    /// 一次性補上 mockup 那兩張（只補 NULL），之後在後台「頁面設定與 SEO › Projects」換圖。</item>
    /// </list>
    /// db/migrations/0027_client_revisions_nov11.sql 同一份對照。
    /// </summary>
    public partial class ClientRevisionsNov11 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "SiteSetting",
                columns: new[] { "SettingKey", "GroupName", "IsLocalized", "SortOrder", "UpdatedAt", "UpdatedBy", "ValueEn", "ValueType", "ValueZh" },
                values: new object[] { "social.linkedin", "Social", false, 40, null, null, null, "url", null });

            migrationBuilder.UpdateData(
                table: "SolutionI18n",
                keyColumns: new[] { "Lang", "SolutionId" },
                keyValues: new object[] { "en", 1 },
                column: "Name",
                value: "Color Box");

            migrationBuilder.UpdateData(
                table: "SolutionI18n",
                keyColumns: new[] { "Lang", "SolutionId" },
                keyValues: new object[] { "en", 2 },
                column: "Name",
                value: "Paperboard");

            migrationBuilder.UpdateData(
                table: "SolutionI18n",
                keyColumns: new[] { "Lang", "SolutionId" },
                keyValues: new object[] { "en", 4 },
                column: "Name",
                value: "Other");

            migrationBuilder.Sql(
                """
                UPDATE dbo.Page
                SET BannerImagePath     = COALESCE(BannerImagePath, N'assets/ref-sol-projects.webp'),
                    MidBanner1ImagePath = COALESCE(MidBanner1ImagePath, N'assets/ref-home-mid1.webp')
                WHERE PageKey = 'projects';
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("UPDATE dbo.Page SET BannerImagePath = NULL, MidBanner1ImagePath = NULL WHERE PageKey = 'projects';");

            migrationBuilder.DeleteData(
                table: "SiteSetting",
                keyColumn: "SettingKey",
                keyValue: "social.linkedin");

            migrationBuilder.UpdateData(
                table: "SolutionI18n",
                keyColumns: new[] { "Lang", "SolutionId" },
                keyValues: new object[] { "en", 1 },
                column: "Name",
                value: "Color Box Packaging");

            migrationBuilder.UpdateData(
                table: "SolutionI18n",
                keyColumns: new[] { "Lang", "SolutionId" },
                keyValues: new object[] { "en", 2 },
                column: "Name",
                value: "Packaging Paperboard");

            migrationBuilder.UpdateData(
                table: "SolutionI18n",
                keyColumns: new[] { "Lang", "SolutionId" },
                keyValues: new object[] { "en", 4 },
                column: "Name",
                value: "Other Printing");
        }
    }
}
