using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Nti.Api.Data.Migrations
{
    /// <summary>
    /// 後台登入帳號改用 <c>Username</c>，不再限定 email 格式（2026-09-06）。
    /// Email 降為選填的通知信箱（寄啟用信用），唯一鍵跟著從 Email 移到 Username。
    /// 既有帳號把 Email 原封搬進 Username，所以現行帳號的登入方式不變。
    /// </summary>
    public partial class AdminUsernameLogin : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropUniqueConstraint(
                name: "UQ_AdminUser_Email",
                table: "AdminUser");

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "AdminUser",
                type: "nvarchar(160)",
                maxLength: 160,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(160)",
                oldMaxLength: 160);

            // 先加可為 NULL 的欄位再收成 NOT NULL：一步到位需要 defaultValue，
            // 那會在 DB 留下一個 model 沒有的系統命名 DEFAULT 約束
            // （verify 的「匿名約束數 = 0」就是在守這件事）。
            migrationBuilder.AddColumn<string>(
                name: "Username",
                table: "AdminUser",
                type: "nvarchar(80)",
                maxLength: 80,
                nullable: true);

            // 既有帳號：拿原本的 email 當帳號（Username 只有 80 字，超長的截掉尾巴）
            migrationBuilder.Sql(
                "UPDATE dbo.AdminUser SET Username = LEFT(Email, 80) WHERE Username IS NULL;");

            migrationBuilder.AlterColumn<string>(
                name: "Username",
                table: "AdminUser",
                type: "nvarchar(80)",
                maxLength: 80,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(80)",
                oldMaxLength: 80,
                oldNullable: true);

            migrationBuilder.AddUniqueConstraint(
                name: "UQ_AdminUser_Username",
                table: "AdminUser",
                column: "Username");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropUniqueConstraint(
                name: "UQ_AdminUser_Username",
                table: "AdminUser");

            // 回頭路：沒填信箱的帳號拿 Username 補上，Email 才能變回 NOT NULL + 唯一
            migrationBuilder.Sql(
                "UPDATE dbo.AdminUser SET Email = Username WHERE Email IS NULL;");

            migrationBuilder.DropColumn(
                name: "Username",
                table: "AdminUser");

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "AdminUser",
                type: "nvarchar(160)",
                maxLength: 160,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(160)",
                oldMaxLength: 160,
                oldNullable: true);

            migrationBuilder.AddUniqueConstraint(
                name: "UQ_AdminUser_Email",
                table: "AdminUser",
                column: "Email");
        }
    }
}
