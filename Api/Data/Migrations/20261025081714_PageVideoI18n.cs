using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Nti.Api.Data.Migrations
{
    /// <inheritdoc />
    /// <summary>
    /// 頁面影片分語系：<c>Page.YoutubeId</c> 搬到 <c>PageI18n.YoutubeId</c>。
    /// 關於我們中英各一支；工廠導覽只有中文版是影片，英文版改為單元 10「參觀」分類的照片輪播
    /// （哪頁哪個語系有影片見 <c>PageVideoPages.LangsByPage</c>）。
    /// <para>
    /// 先搬值、再刪欄——正式站可能已經在後台換過影片：關於我們的值抄到中英兩列，工廠導覽只抄到中文那列。
    /// EF 依 HasData 產生的 58 筆 <c>UpdateData(PageI18n, YoutubeId = null)</c> 是空動作，已拿掉。
    /// </para>
    /// </summary>
    public partial class PageVideoI18n : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "YoutubeId",
                table: "PageI18n",
                type: "varchar(20)",
                unicode: false,
                maxLength: 20,
                nullable: true);

            migrationBuilder.Sql(
                """
                UPDATE i SET i.YoutubeId = p.YoutubeId
                FROM dbo.PageI18n i
                INNER JOIN dbo.Page p ON p.Id = i.PageId
                WHERE p.YoutubeId IS NOT NULL
                  AND (p.PageKey = 'about-hub' OR (p.PageKey = 'facility-tour' AND i.Lang = 'zh'));
                """);

            migrationBuilder.DropColumn(
                name: "YoutubeId",
                table: "Page");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "YoutubeId",
                table: "Page",
                type: "varchar(20)",
                unicode: false,
                maxLength: 20,
                nullable: true);

            // 回到不分語系：取中文那支（兩頁都有中文影片）
            migrationBuilder.Sql(
                """
                UPDATE p SET p.YoutubeId = i.YoutubeId
                FROM dbo.Page p
                INNER JOIN dbo.PageI18n i ON i.PageId = p.Id AND i.Lang = 'zh'
                WHERE i.YoutubeId IS NOT NULL;
                """);

            migrationBuilder.DropColumn(
                name: "YoutubeId",
                table: "PageI18n");
        }
    }
}
