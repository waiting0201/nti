using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Nti.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class VideoSettings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_SiteSetting_Group",
                table: "SiteSetting");

            migrationBuilder.InsertData(
                table: "SiteSetting",
                columns: new[] { "SettingKey", "GroupName", "IsLocalized", "SortOrder", "UpdatedAt", "UpdatedBy", "ValueEn", "ValueType", "ValueZh" },
                values: new object[,]
                {
                    { "video.about", "Video", false, 10, null, null, null, "text", null },
                    { "video.facility_tour", "Video", false, 20, null, null, null, "text", null }
                });

            migrationBuilder.AddCheckConstraint(
                name: "CK_SiteSetting_Group",
                table: "SiteSetting",
                sql: "[GroupName] IN ('Company','Social','Home','Video','Mail')");

            // 預設值＝原本寫死在頁面上的那支影片。這是內容、不是 schema，照理歸 db/content/220，
            // 但這兩個 key 是新加的：不在這裡補，部署後後台欄位是空白、看不出前台正在用哪支。
            // 不用 HasData 是因為 HasData 每次 migration 都會對齊種子、把後台改過的值蓋回去；
            // 這段只跑一次，且只補 NULL。220 也有同樣兩行（冪等，重跑不會重複寫）。
            migrationBuilder.Sql(
                """
                UPDATE dbo.SiteSetting
                   SET ValueZh = N'vECuYIiFSSM', ValueEn = N'vECuYIiFSSM', UpdatedAt = SYSUTCDATETIME()
                 WHERE SettingKey IN (N'video.about', N'video.facility_tour')
                   AND ValueZh IS NULL AND ValueEn IS NULL;
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_SiteSetting_Group",
                table: "SiteSetting");

            migrationBuilder.DeleteData(
                table: "SiteSetting",
                keyColumn: "SettingKey",
                keyValue: "video.about");

            migrationBuilder.DeleteData(
                table: "SiteSetting",
                keyColumn: "SettingKey",
                keyValue: "video.facility_tour");

            migrationBuilder.AddCheckConstraint(
                name: "CK_SiteSetting_Group",
                table: "SiteSetting",
                sql: "[GroupName] IN ('Company','Social','Home','Mail')");
        }
    }
}
