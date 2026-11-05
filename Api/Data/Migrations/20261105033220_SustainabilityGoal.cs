using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Nti.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class SustainabilityGoal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SustainabilityGoal",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SortOrder = table.Column<int>(type: "int", nullable: false, defaultValue: 0)
                        .Annotation("Relational:DefaultConstraintName", "DF_SustainabilityGoal_SortOrder"),
                    IsPublished = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                        .Annotation("Relational:DefaultConstraintName", "DF_SustainabilityGoal_IsPublished"),
                    CreatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: false, defaultValueSql: "SYSUTCDATETIME()")
                        .Annotation("Relational:DefaultConstraintName", "DF_SustainabilityGoal_CreatedAt"),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                        .Annotation("Relational:DefaultConstraintName", "DF_SustainabilityGoal_IsDeleted")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SustainabilityGoal", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SustainabilityGoalI18n",
                columns: table => new
                {
                    SustainabilityGoalId = table.Column<int>(type: "int", nullable: false),
                    Lang = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: false),
                    Goal = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Timeline = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SustainabilityGoalI18n", x => new { x.SustainabilityGoalId, x.Lang });
                    table.CheckConstraint("CK_SustainabilityGoalI18n_Lang", "[Lang] IN ('zh','en')");
                    table.ForeignKey(
                        name: "FK_SustainabilityGoalI18n_SustainabilityGoal",
                        column: x => x.SustainabilityGoalId,
                        principalTable: "SustainabilityGoal",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SustainabilityGoalI18n");

            migrationBuilder.DropTable(
                name: "SustainabilityGoal");
        }
    }
}
