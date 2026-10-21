using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Nti.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class CertificationShortName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ShortName",
                table: "CertificationI18n",
                type: "nvarchar(60)",
                maxLength: 60,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ShortName",
                table: "CertificationI18n");
        }
    }
}
