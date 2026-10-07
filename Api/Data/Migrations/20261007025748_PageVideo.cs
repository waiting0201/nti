using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Nti.Api.Data.Migrations
{
    /// <inheritdoc />
    /// <summary>
    /// 頁面影片從網站設定（<c>video.*</c>，VideoSettings）搬到 <c>Page.YoutubeId</c>：
    /// 編輯要改一頁的東西，應該都在那一頁的編輯畫面（單元 15）裡。
    /// <para>
    /// 先搬值、再刪 key——正式站在 VideoSettings 之後可能已經在後台換過影片，
    /// 直接刪掉等於默默把客戶的設定丟了。
    /// EF 依 HasData 產生的 29 筆 <c>UpdateData(Page, YoutubeId = null)</c> 是空動作，已拿掉。
    /// </para>
    /// </summary>
    public partial class PageVideo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "YoutubeId",
                table: "Page",
                type: "varchar(20)",
                unicode: false,
                maxLength: 20,
                nullable: true);

            // 單語 key 的 ValueZh／ValueEn 是同一個值（AdminSettingHandler 兩欄都寫），取 ValueEn 即可
            migrationBuilder.Sql(
                """
                UPDATE p SET p.YoutubeId = s.ValueEn
                FROM dbo.Page p
                INNER JOIN dbo.SiteSetting s
                    ON s.SettingKey = CASE p.PageKey WHEN 'about-hub'     THEN 'video.about'
                                                     WHEN 'facility-tour' THEN 'video.facility_tour' END
                WHERE s.ValueEn IS NOT NULL;
                """);

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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

            migrationBuilder.Sql(
                """
                UPDATE s SET s.ValueZh = p.YoutubeId, s.ValueEn = p.YoutubeId
                FROM dbo.SiteSetting s
                INNER JOIN dbo.Page p
                    ON p.PageKey = CASE s.SettingKey WHEN 'video.about'         THEN 'about-hub'
                                                     WHEN 'video.facility_tour' THEN 'facility-tour' END
                WHERE p.YoutubeId IS NOT NULL;
                """);

            migrationBuilder.DropColumn(
                name: "YoutubeId",
                table: "Page");
        }
    }
}
