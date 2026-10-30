using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Nti.Api.Data.Migrations
{
    /// <summary>
    /// 認證頁清單改為客戶指定的七個區塊（2026-10-30）：管理系統／色彩與印刷品質資格／紙材與油墨／
    /// 廠房建築／會員與自有標章／獲獎記錄／合作夥伴。
    /// <para>
    /// 既有資料：standards（色彩標準）併入 quality；gmi（零售通路）改寫進 quality 區塊 GMI 那筆的說明，
    /// 原列軟刪除。各區的初始內容由 <c>db/content/340_cert_sections_oct30.sql</c> 補。
    /// </para>
    /// </summary>
    public partial class CertificationListSections : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_CertificationListItem_Section",
                table: "CertificationListItem");

            migrationBuilder.Sql("""
                UPDATE [CertificationListItem] SET [Section] = 'quality' WHERE [Section] = 'standards';
                UPDATE [CertificationListItem] SET [Section] = 'quality', [IsDeleted] = 1, [UpdatedAt] = SYSUTCDATETIME()
                WHERE [Section] = 'gmi';
                """);

            migrationBuilder.AddCheckConstraint(
                name: "CK_CertificationListItem_Section",
                table: "CertificationListItem",
                sql: "[Section] IN ('management','quality','material','building','membership','award','partner')");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_CertificationListItem_Section",
                table: "CertificationListItem");

            // 舊結構沒有的區塊只能軟刪除（掛在 award 下以滿足舊的 constraint）
            migrationBuilder.Sql("""
                UPDATE [CertificationListItem] SET [Section] = 'standards' WHERE [Section] = 'quality';
                UPDATE [CertificationListItem] SET [Section] = 'award', [IsDeleted] = 1, [UpdatedAt] = SYSUTCDATETIME()
                WHERE [Section] IN ('management','material','building','membership','partner');
                """);

            migrationBuilder.AddCheckConstraint(
                name: "CK_CertificationListItem_Section",
                table: "CertificationListItem",
                sql: "[Section] IN ('standards','gmi','award')");
        }
    }
}
