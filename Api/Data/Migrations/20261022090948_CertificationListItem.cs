using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Nti.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class CertificationListItem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ShowInDetailList",
                table: "Certification",
                type: "bit",
                nullable: false,
                defaultValue: false)
                .Annotation("Relational:DefaultConstraintName", "DF_Certification_ShowInDetailList");

            migrationBuilder.CreateTable(
                name: "CertificationListItem",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Section = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false, defaultValue: 0)
                        .Annotation("Relational:DefaultConstraintName", "DF_CertificationListItem_SortOrder"),
                    IsPublished = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                        .Annotation("Relational:DefaultConstraintName", "DF_CertificationListItem_IsPublished"),
                    CreatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: false, defaultValueSql: "SYSUTCDATETIME()")
                        .Annotation("Relational:DefaultConstraintName", "DF_CertificationListItem_CreatedAt"),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                        .Annotation("Relational:DefaultConstraintName", "DF_CertificationListItem_IsDeleted")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CertificationListItem", x => x.Id);
                    table.CheckConstraint("CK_CertificationListItem_Section", "[Section] IN ('standards','gmi','award')");
                });

            migrationBuilder.CreateTable(
                name: "CertificationListItemI18n",
                columns: table => new
                {
                    CertificationListItemId = table.Column<int>(type: "int", nullable: false),
                    Lang = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: false),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CertificationListItemI18n", x => new { x.CertificationListItemId, x.Lang });
                    table.CheckConstraint("CK_CertificationListItemI18n_Lang", "[Lang] IN ('zh','en')");
                    table.ForeignKey(
                        name: "FK_CertificationListItemI18n_CertificationListItem",
                        column: x => x.CertificationListItemId,
                        principalTable: "CertificationListItem",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CertificationListItem_Section",
                table: "CertificationListItem",
                columns: new[] { "IsDeleted", "IsPublished", "Section", "SortOrder" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CertificationListItemI18n");

            migrationBuilder.DropTable(
                name: "CertificationListItem");

            migrationBuilder.DropColumn(
                name: "ShowInDetailList",
                table: "Certification")
                .Annotation("Relational:DefaultConstraintName", "DF_Certification_ShowInDetailList");
        }
    }
}
