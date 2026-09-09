using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Nti.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class DropAdminLockout : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // ⚠ 這裡刻意不用 migrationBuilder.DropColumn("FailedLoginCount", ...)。
            //
            // model 宣告的預設值約束名是 DF_AdminUser_FailedLoginCount，EF 因此會產出
            // `ALTER TABLE [AdminUser] DROP CONSTRAINT [DF_AdminUser_FailedLoginCount]`，
            // 但**正式庫裡的名字是 SQL Server 自動產生的**（DF__AdminUser__Faile__70DDC3D8）。
            // 2026-09-09 實測：107 個預設值約束裡有 103 個是自動命名的——早期的建庫沒有
            // 把 DefaultConstraintName 帶進去。硬寫名字去 DROP 會直接炸，而 Program.cs 是
            // 在啟動時跑 MigrateAsync()，migration 一失敗整個 Function App 就起不來
            // （實際發生過：health 連續回 404／502，App Insights 一筆紀錄都沒有，
            // 因為程序還沒走到能送遙測的地方）。
            //
            // 拿掉那個 .Annotation 之後，EF 就會改用「先查 sys.default_constraints
            // 拿實際名稱再卸」的寫法（它對沒有宣告名稱的 LockoutEndAt 本來就是這樣做的），
            // 兩個環境的命名不同也能正確執行。
            migrationBuilder.DropColumn(
                name: "FailedLoginCount",
                table: "AdminUser");

            migrationBuilder.DropColumn(
                name: "LockoutEndAt",
                table: "AdminUser");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<byte>(
                name: "FailedLoginCount",
                table: "AdminUser",
                type: "tinyint",
                nullable: false,
                defaultValue: (byte)0)
                .Annotation("Relational:DefaultConstraintName", "DF_AdminUser_FailedLoginCount");

            migrationBuilder.AddColumn<DateTime>(
                name: "LockoutEndAt",
                table: "AdminUser",
                type: "datetime2(0)",
                nullable: true);
        }
    }
}
