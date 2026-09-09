using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Nti.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class DropDashboardPermission : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "RolePermission",
                keyColumns: new[] { "PermissionCode", "RoleId" },
                keyValues: new object[] { "dashboard.view", 1 });

            migrationBuilder.DeleteData(
                table: "RolePermission",
                keyColumns: new[] { "PermissionCode", "RoleId" },
                keyValues: new object[] { "dashboard.view", 2 });

            migrationBuilder.DeleteData(
                table: "RolePermission",
                keyColumns: new[] { "PermissionCode", "RoleId" },
                keyValues: new object[] { "dashboard.view", 3 });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "RolePermission",
                columns: new[] { "PermissionCode", "RoleId" },
                values: new object[,]
                {
                    { "dashboard.view", 1 },
                    { "dashboard.view", 2 },
                    { "dashboard.view", 3 }
                });
        }
    }
}
