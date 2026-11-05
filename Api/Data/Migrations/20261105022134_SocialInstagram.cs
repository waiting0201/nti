using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Nti.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class SocialInstagram : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // 客戶 2026-11-05：頁尾社群改為 FB／IG／YouTube，LinkedIn 欄位換成 Instagram。
            // social.linkedin 從未提供過網址（各環境皆為 NULL，見 STATUS），刪除不會遺失內容。
            migrationBuilder.DeleteData(
                table: "SiteSetting",
                keyColumn: "SettingKey",
                keyValue: "social.linkedin");

            migrationBuilder.InsertData(
                table: "SiteSetting",
                columns: new[] { "SettingKey", "GroupName", "IsLocalized", "SortOrder", "UpdatedAt", "UpdatedBy", "ValueEn", "ValueType", "ValueZh" },
                values: new object[] { "social.instagram", "Social", false, 20, null, null, null, "url", null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "SiteSetting",
                keyColumn: "SettingKey",
                keyValue: "social.instagram");

            migrationBuilder.InsertData(
                table: "SiteSetting",
                columns: new[] { "SettingKey", "GroupName", "IsLocalized", "SortOrder", "UpdatedAt", "UpdatedBy", "ValueEn", "ValueType", "ValueZh" },
                values: new object[] { "social.linkedin", "Social", false, 20, null, null, null, "url", null });
        }
    }
}
