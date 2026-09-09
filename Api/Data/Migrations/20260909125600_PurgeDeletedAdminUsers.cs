using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Nti.Api.Data.Migrations
{
    /// <summary>
    /// 清掉 <c>AdminUser</c> 裡舊的軟刪列（2026-09-09）。
    /// <para>
    /// 管理員的刪除改為真刪（見 <c>AdminAccountHandler.DeleteAsync</c>）。在那之前刪掉的帳號
    /// 只是 <c>IsDeleted = 1</c>，卻仍佔著 <c>UQ_AdminUser_Username</c>——同名重建會被擋成
    /// 「此帳號已存在」，操作者看到的就是「刪了卻沒刪掉」。這些列在後台已經不可見、也登不進來，
    /// 沒有留著的理由。純資料清理，schema 不動（docs/10 §11.1 對資料操作的例外）。
    /// </para>
    /// </summary>
    public partial class PurgeDeletedAdminUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DELETE FROM [AdminUser] WHERE [IsDeleted] = 1;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // 刪掉的列救不回來，Down 只能是 no-op
        }
    }
}
