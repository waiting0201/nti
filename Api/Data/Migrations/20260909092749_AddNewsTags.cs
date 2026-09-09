using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Nti.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddNewsTags : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Tag",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Slug = table.Column<string>(type: "varchar(160)", unicode: false, maxLength: 160, nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false, defaultValue: 0)
                        .Annotation("Relational:DefaultConstraintName", "DF_Tag_SortOrder"),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                        .Annotation("Relational:DefaultConstraintName", "DF_Tag_IsActive"),
                    CreatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: false, defaultValueSql: "SYSUTCDATETIME()")
                        .Annotation("Relational:DefaultConstraintName", "DF_Tag_CreatedAt"),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                        .Annotation("Relational:DefaultConstraintName", "DF_Tag_IsDeleted")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tag", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "NewsTag",
                columns: table => new
                {
                    NewsId = table.Column<int>(type: "int", nullable: false),
                    TagId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NewsTag", x => new { x.NewsId, x.TagId });
                    table.ForeignKey(
                        name: "FK_NewsTag_News",
                        column: x => x.NewsId,
                        principalTable: "News",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_NewsTag_Tag",
                        column: x => x.TagId,
                        principalTable: "Tag",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TagI18n",
                columns: table => new
                {
                    TagId = table.Column<int>(type: "int", nullable: false),
                    Lang = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TagI18n", x => new { x.TagId, x.Lang });
                    table.CheckConstraint("CK_TagI18n_Lang", "[Lang] IN ('zh','en')");
                    table.ForeignKey(
                        name: "FK_TagI18n_Tag",
                        column: x => x.TagId,
                        principalTable: "Tag",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "RolePermission",
                columns: new[] { "PermissionCode", "RoleId" },
                values: new object[,]
                {
                    { "tag.delete", 1 },
                    { "tag.edit", 1 },
                    { "tag.view", 1 },
                    { "tag.edit", 2 },
                    { "tag.view", 2 },
                    { "tag.view", 3 }
                });

            migrationBuilder.InsertData(
                table: "Tag",
                columns: new[] { "Id", "CreatedAt", "CreatedBy", "IsActive", "IsDeleted", "Slug", "SortOrder", "UpdatedAt", "UpdatedBy" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, "green-printing", 10, null, null },
                    { 2, new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, "low-carbon", 20, null, null },
                    { 3, new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, "carbon-footprint", 30, null, null },
                    { 4, new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, "esg", 40, null, null },
                    { 5, new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, "csr", 50, null, null },
                    { 6, new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, "green-building", 60, null, null },
                    { 7, new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, "green-supply-chain", 70, null, null },
                    { 8, new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, "sustainable-packaging", 80, null, null },
                    { 9, new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, "packaging-design", 90, null, null },
                    { 10, new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, "digital-printing", 100, null, null },
                    { 11, new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, "variable-data-printing", 110, null, null },
                    { 12, new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, "paper-craft", 120, null, null },
                    { 13, new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, "conservation", 130, null, null },
                    { 14, new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, "disaster-education", 140, null, null },
                    { 15, new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, "awards", 150, null, null },
                    { 16, new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, "media-coverage", 160, null, null },
                    { 17, new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, "partnership", 170, null, null }
                });

            migrationBuilder.InsertData(
                table: "TagI18n",
                columns: new[] { "Lang", "TagId", "Name" },
                values: new object[,]
                {
                    { "en", 1, "Green Printing" },
                    { "zh", 1, "綠色印刷" },
                    { "en", 2, "Low Carbon" },
                    { "zh", 2, "低碳製程" },
                    { "en", 3, "Carbon Footprint" },
                    { "zh", 3, "碳足跡" },
                    { "en", 4, "ESG" },
                    { "zh", 4, "ESG" },
                    { "en", 5, "Corporate Social Responsibility" },
                    { "zh", 5, "企業社會責任" },
                    { "en", 6, "Green Building" },
                    { "zh", 6, "綠建築" },
                    { "en", 7, "Green Supply Chain" },
                    { "zh", 7, "綠色供應鏈" },
                    { "en", 8, "Sustainable Packaging" },
                    { "zh", 8, "永續包裝" },
                    { "en", 9, "Packaging Design" },
                    { "zh", 9, "包裝設計" },
                    { "en", 10, "Digital Printing" },
                    { "zh", 10, "數位印刷" },
                    { "en", 11, "Variable Data Printing" },
                    { "zh", 11, "可變資料印刷" },
                    { "en", 12, "Paper Craft" },
                    { "zh", 12, "紙藝與紙模型" },
                    { "en", 13, "Conservation" },
                    { "zh", 13, "生態保育" },
                    { "en", 14, "Disaster-Prevention Education" },
                    { "zh", 14, "防災教育" },
                    { "en", 15, "Awards & Recognition" },
                    { "zh", 15, "獲獎與認證" },
                    { "en", 16, "Media Coverage" },
                    { "zh", 16, "媒體報導" },
                    { "en", 17, "Partnership" },
                    { "zh", 17, "產業合作" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_NewsTag_Tag",
                table: "NewsTag",
                column: "TagId");

            migrationBuilder.CreateIndex(
                name: "IX_Tag_List",
                table: "Tag",
                columns: new[] { "IsDeleted", "IsActive", "SortOrder" });

            migrationBuilder.CreateIndex(
                name: "UX_Tag_Slug",
                table: "Tag",
                column: "Slug",
                unique: true,
                filter: "[IsDeleted] = 0");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "NewsTag");

            migrationBuilder.DropTable(
                name: "TagI18n");

            migrationBuilder.DropTable(
                name: "Tag");

            migrationBuilder.DeleteData(
                table: "RolePermission",
                keyColumns: new[] { "PermissionCode", "RoleId" },
                keyValues: new object[] { "tag.delete", 1 });

            migrationBuilder.DeleteData(
                table: "RolePermission",
                keyColumns: new[] { "PermissionCode", "RoleId" },
                keyValues: new object[] { "tag.edit", 1 });

            migrationBuilder.DeleteData(
                table: "RolePermission",
                keyColumns: new[] { "PermissionCode", "RoleId" },
                keyValues: new object[] { "tag.view", 1 });

            migrationBuilder.DeleteData(
                table: "RolePermission",
                keyColumns: new[] { "PermissionCode", "RoleId" },
                keyValues: new object[] { "tag.edit", 2 });

            migrationBuilder.DeleteData(
                table: "RolePermission",
                keyColumns: new[] { "PermissionCode", "RoleId" },
                keyValues: new object[] { "tag.view", 2 });

            migrationBuilder.DeleteData(
                table: "RolePermission",
                keyColumns: new[] { "PermissionCode", "RoleId" },
                keyValues: new object[] { "tag.view", 3 });
        }
    }
}
