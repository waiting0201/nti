using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Nti.Api.Data.Migrations
{
    /// <inheritdoc />
    /// <summary>
    /// 工廠導覽英文版的相簿照片改在單元 15 該頁的英文分頁上傳：新表 <c>PageGalleryImage</c>
    /// （哪頁哪個語系有相簿見 <c>PageGalleryPages</c>）。
    /// <para>
    /// 照片原本借用單元 10 的「參觀」分類（<c>Category</c> Facility/tour）。一次性把那幾筆
    /// （有上架的、依排序）搬過來，替代文字取英文；搬完刪掉原本那幾筆並停用分類，
    /// 只留一個地方能改。圖片路徑原樣沿用，Blob 上的檔案不動。
    /// </para>
    /// </summary>
    public partial class PageGallery : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PageGalleryImage",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PageId = table.Column<int>(type: "int", nullable: false),
                    Lang = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: false),
                    ImagePath = table.Column<string>(type: "nvarchar(260)", maxLength: 260, nullable: false),
                    ImageAlt = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PageGalleryImage", x => x.Id);
                    table.CheckConstraint("CK_PageGalleryImage_Lang", "[Lang] IN ('zh','en')");
                    table.ForeignKey(
                        name: "FK_PageGalleryImage_Page",
                        column: x => x.PageId,
                        principalTable: "Page",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "Category",
                keyColumn: "Id",
                keyValue: 26,
                column: "IsActive",
                value: false);

            migrationBuilder.CreateIndex(
                name: "IX_PageGalleryImage_Page",
                table: "PageGalleryImage",
                columns: new[] { "PageId", "Lang", "SortOrder" });

            migrationBuilder.Sql(
                """
                INSERT dbo.PageGalleryImage (PageId, Lang, ImagePath, ImageAlt, SortOrder)
                SELECT p.Id, 'en', f.ImagePath, COALESCE(NULLIF(i.ImageAlt, N''), i.Name, N'NTI factory'),
                       ROW_NUMBER() OVER (ORDER BY f.SortOrder, f.Id) * 10
                FROM dbo.FacilityItem f
                INNER JOIN dbo.Category c ON c.Id = f.CategoryId AND c.CategoryType = 'Facility' AND c.Code = 'tour'
                INNER JOIN dbo.Page p ON p.PageKey = 'facility-tour'
                LEFT JOIN dbo.FacilityItemI18n i ON i.FacilityItemId = f.Id AND i.Lang = 'en'
                WHERE f.IsPublished = 1 AND f.IsDeleted = 0;

                DELETE i FROM dbo.FacilityItemI18n i
                INNER JOIN dbo.FacilityItem f ON f.Id = i.FacilityItemId
                INNER JOIN dbo.Category c ON c.Id = f.CategoryId AND c.CategoryType = 'Facility' AND c.Code = 'tour';

                DELETE f FROM dbo.FacilityItem f
                INNER JOIN dbo.Category c ON c.Id = f.CategoryId AND c.CategoryType = 'Facility' AND c.Code = 'tour';
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // 搬回「參觀」分類；FacilityItem 的名稱必填，中英都先放替代文字
            migrationBuilder.Sql(
                """
                DECLARE @moved TABLE (Id INT, Alt NVARCHAR(200));

                MERGE dbo.FacilityItem AS t
                USING (SELECT g.ImagePath, g.ImageAlt, g.SortOrder FROM dbo.PageGalleryImage g
                       INNER JOIN dbo.Page p ON p.Id = g.PageId
                       WHERE p.PageKey = 'facility-tour' AND g.Lang = 'en') AS s
                ON 1 = 0
                WHEN NOT MATCHED THEN
                    INSERT (CategoryId, ImagePath, SortOrder, IsPublished, CreatedAt, IsDeleted)
                    VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Facility' AND Code = 'tour'),
                            s.ImagePath, 200 + s.SortOrder, 1, SYSUTCDATETIME(), 0)
                OUTPUT inserted.Id, s.ImageAlt INTO @moved;

                INSERT dbo.FacilityItemI18n (FacilityItemId, Lang, Name, Description, ImageAlt)
                SELECT m.Id, l.Lang, LEFT(m.Alt, 120), NULL, m.Alt
                FROM @moved m CROSS JOIN (VALUES ('zh'), ('en')) l (Lang);
                """);

            migrationBuilder.DropTable(
                name: "PageGalleryImage");

            migrationBuilder.UpdateData(
                table: "Category",
                keyColumn: "Id",
                keyValue: 26,
                column: "IsActive",
                value: true);
        }
    }
}
