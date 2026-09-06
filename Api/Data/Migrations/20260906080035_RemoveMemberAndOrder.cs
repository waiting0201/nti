using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Nti.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class RemoveMemberAndOrder : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // ⚠ 這支不用 EF 產的 DropForeignKey／具名 DropColumn，改成查系統表再刪。
            //   正式庫的 DEFAULT 約束名稱與 model 上的 Relational:DefaultConstraintName
            //   對不上（2026-09-06 部署實測：'DF_SupplierDownload_RequireLogin' is not a
            //   constraint，SQL 3728），依名稱刪就會整支交易回滾、host 起不來。
            //   FK 一併改為先確認存在——這支要能在名稱不一致的庫上重播。
            migrationBuilder.Sql(@"
                DECLARE @fk sysname;
                SELECT @fk = name FROM sys.foreign_keys
                WHERE parent_object_id = OBJECT_ID(N'[QuoteRequest]')
                  AND referenced_object_id = OBJECT_ID(N'[Member]');
                IF @fk IS NOT NULL
                    EXEC(N'ALTER TABLE [QuoteRequest] DROP CONSTRAINT ' + QUOTENAME(@fk));");

            migrationBuilder.DropTable(
                name: "MemberToken");

            migrationBuilder.DropTable(
                name: "OrderProgress");

            migrationBuilder.DropTable(
                name: "Orders");

            migrationBuilder.DropTable(
                name: "Member");

            migrationBuilder.DeleteData(
                table: "RolePermission",
                keyColumns: new[] { "PermissionCode", "RoleId" },
                keyValues: new object[] { "member.edit", 1 });

            migrationBuilder.DeleteData(
                table: "RolePermission",
                keyColumns: new[] { "PermissionCode", "RoleId" },
                keyValues: new object[] { "member.view", 1 });

            migrationBuilder.DeleteData(
                table: "RolePermission",
                keyColumns: new[] { "PermissionCode", "RoleId" },
                keyValues: new object[] { "order.edit", 1 });

            migrationBuilder.DeleteData(
                table: "RolePermission",
                keyColumns: new[] { "PermissionCode", "RoleId" },
                keyValues: new object[] { "order.view", 1 });

            // 不帶 Relational:DefaultConstraintName 的 DropColumn，EF 會自己查系統表
            // 找出該欄的 DEFAULT 約束再刪，不依賴名稱——這正是要的行為。
            migrationBuilder.DropColumn(
                name: "RequireLogin",
                table: "SupplierDownload");

            migrationBuilder.DropColumn(
                name: "MemberId",
                table: "QuoteRequest");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "RequireLogin",
                table: "SupplierDownload",
                type: "bit",
                nullable: false,
                defaultValue: false)
                .Annotation("Relational:DefaultConstraintName", "DF_SupplierDownload_RequireLogin");

            migrationBuilder.AddColumn<int>(
                name: "MemberId",
                table: "QuoteRequest",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Member",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Company = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: false, defaultValueSql: "SYSUTCDATETIME()")
                        .Annotation("Relational:DefaultConstraintName", "DF_Member_CreatedAt"),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    DisplayName = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(160)", maxLength: 160, nullable: false),
                    EmailConfirmedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    FailedLoginCount = table.Column<byte>(type: "tinyint", nullable: false, defaultValue: (byte)0)
                        .Annotation("Relational:DefaultConstraintName", "DF_Member_FailedLoginCount"),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                        .Annotation("Relational:DefaultConstraintName", "DF_Member_IsDeleted"),
                    LastLoginAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    LockoutEndAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    PasswordHash = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: true),
                    PreferredLang = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: false, defaultValue: "zh")
                        .Annotation("Relational:DefaultConstraintName", "DF_Member_PreferredLang"),
                    Status = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: false, defaultValue: "Pending")
                        .Annotation("Relational:DefaultConstraintName", "DF_Member_Status"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Member", x => x.Id);
                    table.UniqueConstraint("UQ_Member_Email", x => x.Email);
                    table.CheckConstraint("CK_Member_PreferredLang", "[PreferredLang] IN ('zh','en')");
                    table.CheckConstraint("CK_Member_Status", "[Status] IN ('Pending','Active','Suspended')");
                });

            migrationBuilder.CreateTable(
                name: "MemberToken",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: false, defaultValueSql: "SYSUTCDATETIME()")
                        .Annotation("Relational:DefaultConstraintName", "DF_MemberToken_CreatedAt"),
                    ExpiresAt = table.Column<DateTime>(type: "datetime2(0)", nullable: false),
                    MemberId = table.Column<int>(type: "int", nullable: false),
                    TokenHash = table.Column<byte[]>(type: "varbinary(32)", nullable: false),
                    TokenType = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: false),
                    UsedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MemberToken", x => x.Id);
                    table.CheckConstraint("CK_MemberToken_Type", "[TokenType] IN ('EmailVerify','PasswordReset')");
                    table.ForeignKey(
                        name: "FK_MemberToken_Member",
                        column: x => x.MemberId,
                        principalTable: "Member",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: false, defaultValueSql: "SYSUTCDATETIME()")
                        .Annotation("Relational:DefaultConstraintName", "DF_Orders_CreatedAt"),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    ExpectedShipDate = table.Column<DateOnly>(type: "date", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                        .Annotation("Relational:DefaultConstraintName", "DF_Orders_IsDeleted"),
                    MemberId = table.Column<int>(type: "int", nullable: false),
                    OrderNo = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: false),
                    QuoteRequestId = table.Column<int>(type: "int", nullable: true),
                    Status = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: false, defaultValue: "Confirmed")
                        .Annotation("Relational:DefaultConstraintName", "DF_Orders_Status"),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.Id);
                    table.UniqueConstraint("UQ_Orders_OrderNo", x => x.OrderNo);
                    table.CheckConstraint("CK_Order_Status", "[Status] IN ('Confirmed','InProduction','Shipped','Completed','Cancelled')");
                    table.ForeignKey(
                        name: "FK_Orders_Member",
                        column: x => x.MemberId,
                        principalTable: "Member",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Orders_QuoteRequest",
                        column: x => x.QuoteRequestId,
                        principalTable: "QuoteRequest",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "OrderProgress",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: false, defaultValueSql: "SYSUTCDATETIME()")
                        .Annotation("Relational:DefaultConstraintName", "DF_OrderProgress_CreatedAt"),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    HappenedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: false),
                    Note = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: true),
                    OrderId = table.Column<int>(type: "int", nullable: false),
                    Stage = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: false),
                    StageStatus = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderProgress", x => x.Id);
                    table.CheckConstraint("CK_OrderProgress_Stage", "[Stage] IN ('Design','PrePress','Printing','PostPress','QC','Shipping')");
                    table.CheckConstraint("CK_OrderProgress_StageStatus", "[StageStatus] IN ('Pending','Doing','Done')");
                    table.ForeignKey(
                        name: "FK_OrderProgress_Orders",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "RolePermission",
                columns: new[] { "PermissionCode", "RoleId" },
                values: new object[,]
                {
                    { "member.edit", 1 },
                    { "member.view", 1 },
                    { "order.edit", 1 },
                    { "order.view", 1 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_MemberToken_Lookup",
                table: "MemberToken",
                column: "TokenHash")
                .Annotation("SqlServer:Include", new[] { "MemberId", "ExpiresAt", "UsedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_OrderProgress_Order",
                table: "OrderProgress",
                columns: new[] { "OrderId", "HappenedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_Orders_Member",
                table: "Orders",
                columns: new[] { "MemberId", "CreatedAt" },
                descending: new[] { false, true });

            migrationBuilder.AddForeignKey(
                name: "FK_QuoteRequest_Member",
                table: "QuoteRequest",
                column: "MemberId",
                principalTable: "Member",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
