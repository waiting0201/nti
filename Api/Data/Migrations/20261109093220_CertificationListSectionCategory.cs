using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Nti.Api.Data.Migrations
{
    /// <summary>
    /// 認證頁清單的區塊改由分類表驅動（2026-11-09）：<c>CertificationListItem.Section</c>（寫死七個值的字串）
    /// → <c>CategoryId</c>，指向 <c>CategoryType = 'CertSection'</c> 的分類。客戶可在後台「分類管理」
    /// 新增區塊、改名（＝前台大標）、調順序、停用。
    /// <para>
    /// 資料搬移：建立七個區塊分類，代號沿用原本的 Section 值，所以既有項目照代號一一對回；
    /// 區塊名稱優先取客戶在「頁面文字」對大標做過的覆寫，沒有就用前台目前顯示的字（mockup 原文／zh.ts）。
    /// 冪等：分類已存在（例如 down 後再 up）就不重建。
    /// </para>
    /// <para>
    /// 大標的「頁面文字」覆寫搬進分類名稱後即刪除：前台的覆寫是整頁套用的（英文版也會套），
    /// 留著會把資料驅動的大標再換一次。後台「頁面文字」也不再列出這七段。down 時依分類名稱重建。
    /// </para>
    /// </summary>
    public partial class CertificationListSectionCategory : Migration
    {
        /// <summary>代號、排序、英文、中文——英文＝mockup 大標，中文＝apps/web/src/lib/zh.ts 的譯文</summary>
        private static readonly (string Code, int Sort, string En, string Zh)[] Sections =
        [
            ("management", 10, "Management Systems", "管理系統"),
            ("quality",    20, "Colour & Print Quality Qualifications", "色彩與印刷品質資格"),
            ("material",   30, "Paper & Inks", "紙材與油墨"),
            ("building",   40, "Green Buildings", "廠房建築"),
            ("membership", 50, "Memberships & Own Marks", "會員與自有標章"),
            ("award",      60, "Awards", "獲獎肯定"),
            ("partner",    70, "Partnerships", "合作夥伴"),
        ];

        private static string Q(string s) => s.Replace("'", "''");

        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_CertificationListItem_Section",
                table: "CertificationListItem");

            migrationBuilder.DropCheckConstraint(
                name: "CK_CertificationListItem_Section",
                table: "CertificationListItem");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Category_Type",
                table: "Category");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Category_Type",
                table: "Category",
                sql: "[CategoryType] IN ('News','Project','Vlog','Faq','Certification','Facility','SupplierNotice','Industry','QuoteMaterial','CertSection')");

            // 1. 七個區塊分類（不寫死 Id：正式庫的 Category 已有後台新增的列，identity 不可預期）
            foreach (var (code, sort, en, zh) in Sections)
            {
                migrationBuilder.Sql($"""
                    IF NOT EXISTS (SELECT 1 FROM [Category] WHERE [CategoryType] = 'CertSection' AND [Code] = '{code}')
                    BEGIN
                        INSERT [Category] ([CategoryType], [Code], [SortOrder], [IsActive], [CreatedAt], [IsDeleted])
                        VALUES ('CertSection', '{code}', {sort}, 1, SYSUTCDATETIME(), 0);

                        DECLARE @id INT = SCOPE_IDENTITY();
                        INSERT [CategoryI18n] ([CategoryId], [Lang], [Name])
                        SELECT @id, v.Lang,
                               LEFT(COALESCE(
                                   (SELECT TOP 1 NULLIF(LTRIM(RTRIM(pt.[Value])), N'')
                                    FROM [PageText] pt INNER JOIN [Page] p ON p.[Id] = pt.[PageId]
                                    WHERE p.[PageKey] = 'about-certifications' AND pt.[Lang] = v.Lang
                                      AND pt.[SourceText] = N'{Q(en)}' AND pt.[IsDeleted] = 0
                                    ORDER BY pt.[Id] DESC),
                                   v.Fallback), 80)
                        FROM (VALUES ('en', N'{Q(en)}'), ('zh', N'{Q(zh)}')) v(Lang, Fallback);
                    END
                    """);
            }

            // 覆寫已搬進分類名稱，刪掉（PageText 是真刪；down 由分類名稱重建）
            var sources = string.Join(", ", Sections.Select(x => $"N'{Q(x.En)}'"));
            migrationBuilder.Sql($"""
                DELETE pt FROM [PageText] pt INNER JOIN [Page] p ON p.[Id] = pt.[PageId]
                WHERE p.[PageKey] = 'about-certifications' AND pt.[SourceText] IN ({sources});
                """);

            // 2. 新欄位先允許 NULL，照代號對回分類後再收緊
            migrationBuilder.AddColumn<int>(
                name: "CategoryId",
                table: "CertificationListItem",
                type: "int",
                nullable: true);

            migrationBuilder.Sql("""
                UPDATE t SET t.[CategoryId] = c.[Id]
                FROM [CertificationListItem] t
                INNER JOIN [Category] c ON c.[CategoryType] = 'CertSection' AND c.[Code] = t.[Section];
                """);

            migrationBuilder.AlterColumn<int>(
                name: "CategoryId",
                table: "CertificationListItem",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.DropColumn(
                name: "Section",
                table: "CertificationListItem");

            migrationBuilder.AddColumn<string>(
                name: "CategoryTypeGuard",
                table: "CertificationListItem",
                type: "varchar(30)",
                unicode: false,
                maxLength: 30,
                nullable: true,
                computedColumnSql: "CAST('CertSection' AS VARCHAR(30))",
                stored: true);

            migrationBuilder.CreateIndex(
                name: "IX_CertificationListItem_Category",
                table: "CertificationListItem",
                columns: new[] { "IsDeleted", "IsPublished", "CategoryId", "SortOrder" });

            migrationBuilder.AddForeignKey(
                name: "FK_CertificationListItem_Category",
                table: "CertificationListItem",
                columns: new[] { "CategoryId", "CategoryTypeGuard" },
                principalTable: "Category",
                principalColumns: new[] { "Id", "CategoryType" },
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CertificationListItem_Category",
                table: "CertificationListItem");

            migrationBuilder.DropIndex(
                name: "IX_CertificationListItem_Category",
                table: "CertificationListItem");

            migrationBuilder.DropColumn(
                name: "CategoryTypeGuard",
                table: "CertificationListItem");

            migrationBuilder.AddColumn<string>(
                name: "Section",
                table: "CertificationListItem",
                type: "varchar(20)",
                unicode: false,
                maxLength: 20,
                nullable: true);

            // 原本七個代號照對回；後台新增的區塊在舊結構放不下，只能軟刪除（掛在 award 下以滿足舊的 constraint）
            migrationBuilder.Sql("""
                UPDATE t SET t.[Section] = c.[Code]
                FROM [CertificationListItem] t
                INNER JOIN [Category] c ON c.[Id] = t.[CategoryId]
                WHERE c.[Code] IN ('management','quality','material','building','membership','award','partner');

                UPDATE [CertificationListItem]
                SET [Section] = 'award', [IsDeleted] = 1, [UpdatedAt] = SYSUTCDATETIME()
                WHERE [Section] IS NULL;
                """);

            migrationBuilder.AlterColumn<string>(
                name: "Section",
                table: "CertificationListItem",
                type: "varchar(20)",
                unicode: false,
                maxLength: 20,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(20)",
                oldUnicode: false,
                oldMaxLength: 20,
                oldNullable: true);

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "CertificationListItem");

            // 大標改名放回「頁面文字」：原本七個代號的分類名稱跟預設字不同的，建成覆寫
            foreach (var (code, _, en, zh) in Sections)
            {
                var hash = Nti.Api.Common.PageTextPages.Hash(Nti.Api.Common.PageTextPages.Normalize(en));
                migrationBuilder.Sql($"""
                    INSERT [PageText] ([PageId], [Lang], [SourceHash], [SourceText], [Value], [CreatedAt], [IsDeleted])
                    SELECT p.[Id], i.[Lang], '{hash}', N'{Q(en)}', i.[Name], SYSUTCDATETIME(), 0
                    FROM [Category] c
                    INNER JOIN [CategoryI18n] i ON i.[CategoryId] = c.[Id]
                    CROSS JOIN [Page] p
                    WHERE c.[CategoryType] = 'CertSection' AND c.[Code] = '{code}' AND p.[PageKey] = 'about-certifications'
                      AND i.[Name] <> CASE i.[Lang] WHEN 'en' THEN N'{Q(en)}' ELSE N'{Q(zh)}' END
                      AND NOT EXISTS (SELECT 1 FROM [PageText] x
                                      WHERE x.[PageId] = p.[Id] AND x.[Lang] = i.[Lang] AND x.[SourceHash] = '{hash}');
                    """);
            }

            migrationBuilder.Sql("""
                DELETE i FROM [CategoryI18n] i INNER JOIN [Category] c ON c.[Id] = i.[CategoryId] WHERE c.[CategoryType] = 'CertSection';
                DELETE FROM [Category] WHERE [CategoryType] = 'CertSection';
                """);

            migrationBuilder.DropCheckConstraint(
                name: "CK_Category_Type",
                table: "Category");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Category_Type",
                table: "Category",
                sql: "[CategoryType] IN ('News','Project','Vlog','Faq','Certification','Facility','SupplierNotice','Industry','QuoteMaterial')");

            migrationBuilder.CreateIndex(
                name: "IX_CertificationListItem_Section",
                table: "CertificationListItem",
                columns: new[] { "IsDeleted", "IsPublished", "Section", "SortOrder" });

            migrationBuilder.AddCheckConstraint(
                name: "CK_CertificationListItem_Section",
                table: "CertificationListItem",
                sql: "[Section] IN ('management','quality','material','building','membership','award','partner')");
        }
    }
}
