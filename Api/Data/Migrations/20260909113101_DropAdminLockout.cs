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
            migrationBuilder.DropColumn(
                name: "FailedLoginCount",
                table: "AdminUser")
                .Annotation("Relational:DefaultConstraintName", "DF_AdminUser_FailedLoginCount");

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
