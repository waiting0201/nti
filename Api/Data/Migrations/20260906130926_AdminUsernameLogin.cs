using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Nti.Api.Data.Migrations
{
    /// <summary>
    /// 後台登入帳號改用 <c>Username</c>，不再限定 email 格式（2026-09-06）。
    /// Email 降為選填的通知信箱（寄啟用信用），唯一鍵跟著從 Email 移到 Username。
    /// 既有帳號把 Email 原封搬進 Username，所以現行帳號的登入方式不變。
    /// <para>
    /// Email 的唯一性以查系統表的方式移除，不依賴約束名稱：2026-09-06 的部署實測，
    /// 正式庫上並沒有叫 <c>UQ_AdminUser_Email</c> 的約束（SQL 3728），
    /// 而 model 與兩條 migration 路徑都是這樣命名的。
    /// </para>
    /// </summary>
    public partial class AdminUsernameLogin : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Email 的唯一性：**不依賴名稱**去刪（docs/10 §11.1 第 2 條）。
            // 正式庫回 SQL 3728「'UQ_AdminUser_Email' is not a constraint」——名稱與
            // model 對不上（也可能根本是唯一索引、或已經沒有）。三種情況都要能過。
            // QUOTENAME 在 SELECT 就套上，EXEC() 括號內只接字串與變數相加（同第 3 條）。
            migrationBuilder.Sql(@"
DECLARE @uq sysname;

/* (1) UNIQUE 約束：只認「單欄且該欄是 Email」的那一個 */
SELECT @uq = QUOTENAME(kc.name)
FROM sys.key_constraints kc
JOIN sys.index_columns ic ON ic.object_id = kc.parent_object_id
                         AND ic.index_id  = kc.unique_index_id
JOIN sys.columns c ON c.object_id = ic.object_id AND c.column_id = ic.column_id
WHERE kc.parent_object_id = OBJECT_ID(N'dbo.AdminUser')
  AND kc.type = 'UQ'
GROUP BY kc.name
HAVING COUNT(*) = 1 AND MAX(c.name) = N'Email';

IF @uq IS NOT NULL
    EXEC(N'ALTER TABLE dbo.AdminUser DROP CONSTRAINT ' + @uq + N';');

/* (2) 唯一索引（非約束）：ALTER TABLE DROP CONSTRAINT 對它會回 3728 */
DECLARE @ux sysname;

SELECT @ux = QUOTENAME(i.name)
FROM sys.indexes i
JOIN sys.index_columns ic ON ic.object_id = i.object_id AND ic.index_id = i.index_id
JOIN sys.columns c ON c.object_id = ic.object_id AND c.column_id = ic.column_id
WHERE i.object_id = OBJECT_ID(N'dbo.AdminUser')
  AND i.is_unique = 1 AND i.is_primary_key = 0 AND i.is_unique_constraint = 0
GROUP BY i.name
HAVING COUNT(*) = 1 AND MAX(c.name) = N'Email';

IF @ux IS NOT NULL
    EXEC(N'DROP INDEX ' + @ux + N' ON dbo.AdminUser;');
");

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

            // 回頭路一律建成 model 上的正規名稱——Up 刪掉的那個叫什麼已經不可考
            migrationBuilder.AddUniqueConstraint(
                name: "UQ_AdminUser_Email",
                table: "AdminUser",
                column: "Email");
        }
    }
}
