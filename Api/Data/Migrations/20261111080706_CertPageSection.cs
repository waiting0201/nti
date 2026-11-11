using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Nti.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class CertPageSection : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PageCategoryId",
                table: "Certification",
                type: "int",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Certification_PageCategory",
                table: "Certification",
                columns: new[] { "PageCategoryId", "CategoryTypeGuard" },
                principalTable: "Category",
                principalColumns: new[] { "Id", "CategoryType" },
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Certification_PageCategory",
                table: "Certification");

            migrationBuilder.DropColumn(
                name: "PageCategoryId",
                table: "Certification");
        }
    }
}
