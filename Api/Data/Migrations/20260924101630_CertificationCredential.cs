using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Nti.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class CertificationCredential : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CertificateNo",
                table: "Certification",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "CertifiedDate",
                table: "Certification",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "LastAuditDate",
                table: "Certification",
                type: "date",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CertificateNo",
                table: "Certification");

            migrationBuilder.DropColumn(
                name: "CertifiedDate",
                table: "Certification");

            migrationBuilder.DropColumn(
                name: "LastAuditDate",
                table: "Certification");
        }
    }
}
