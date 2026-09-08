using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Nti.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class DropAttachmentScanStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // ⚠ 不用 DropCheckConstraint／DropColumn 的具名版本：EF 會產出
            // `ALTER TABLE [QuoteAttachment] DROP CONSTRAINT [DF_QuoteAttachment_ScanStatus]`，
            // 而正式庫的約束名稱不保證與模型一致——2026-09-06 移除會員與訂單時就是這樣
            // 撞上 SQL 3728、整支 migration 回滾、worker 起不來（docs/10 §11.1）。
            // 改成先從系統目錄查出實際名稱再砍，查不到就跳過。
            migrationBuilder.Sql("""
                DECLARE @sql nvarchar(max);

                SELECT @sql = STRING_AGG(
                    N'ALTER TABLE [QuoteAttachment] DROP CONSTRAINT [' + name + N'];', CHAR(10))
                FROM sys.check_constraints
                WHERE parent_object_id = OBJECT_ID(N'[QuoteAttachment]')
                  AND definition LIKE N'%ScanStatus%';
                IF @sql IS NOT NULL EXEC sp_executesql @sql;

                SET @sql = NULL;
                SELECT @sql = STRING_AGG(
                    N'ALTER TABLE [QuoteAttachment] DROP CONSTRAINT [' + dc.name + N'];', CHAR(10))
                FROM sys.default_constraints dc
                JOIN sys.columns c
                  ON c.object_id = dc.parent_object_id AND c.column_id = dc.parent_column_id
                WHERE dc.parent_object_id = OBJECT_ID(N'[QuoteAttachment]')
                  AND c.name = N'ScanStatus';
                IF @sql IS NOT NULL EXEC sp_executesql @sql;

                IF COL_LENGTH(N'[QuoteAttachment]', N'ScanStatus') IS NOT NULL
                    ALTER TABLE [QuoteAttachment] DROP COLUMN [ScanStatus];
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ScanStatus",
                table: "QuoteAttachment",
                type: "varchar(10)",
                unicode: false,
                maxLength: 10,
                nullable: false,
                defaultValue: "Pending")
                .Annotation("Relational:DefaultConstraintName", "DF_QuoteAttachment_ScanStatus");

            migrationBuilder.AddCheckConstraint(
                name: "CK_QuoteAtt_Scan",
                table: "QuoteAttachment",
                sql: "[ScanStatus] IN ('Pending','Clean','Infected')");
        }
    }
}
