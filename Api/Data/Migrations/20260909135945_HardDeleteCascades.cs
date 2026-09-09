using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Nti.Api.Data.Migrations
{
    /// <summary>
    /// 後台各單元的刪除改為真刪（2026-09-09，docs/10 §8.4）。三件事：
    /// <list type="number">
    ///   <item>所有 <c>*I18n</c> 側表、方案品項、報價附件的 FK 由 <c>NO ACTION</c> 改為
    ///     <c>ON DELETE CASCADE</c>——側表是主檔的一部分，不跟著走的話每一次刪除都會撞 FK。</item>
    ///   <item>權限矩陣補上 <c>page.delete</c>／<c>quote.delete</c>／<c>contact.delete</c>（僅超管）。</item>
    ///   <item>清掉既有的軟刪列（下方 SQL）。它們在後台早就看不到，卻仍佔著 slug 這類唯一鍵，
    ///     留著就等於「刪過的東西名字再也用不回來」——正是這次要解決的問題。</item>
    /// </list>
    /// </summary>
    public partial class HardDeleteCascades : Migration
    {

        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CategoryI18n_Category",
                table: "CategoryI18n");

            migrationBuilder.DropForeignKey(
                name: "FK_CertificationI18n_Certification",
                table: "CertificationI18n");

            migrationBuilder.DropForeignKey(
                name: "FK_FacilityItemI18n_FacilityItem",
                table: "FacilityItemI18n");

            migrationBuilder.DropForeignKey(
                name: "FK_FaqI18n_Faq",
                table: "FaqI18n");

            migrationBuilder.DropForeignKey(
                name: "FK_HomeBannerI18n_HomeBanner",
                table: "HomeBannerI18n");

            migrationBuilder.DropForeignKey(
                name: "FK_IndustryTrendI18n_IndustryTrend",
                table: "IndustryTrendI18n");

            migrationBuilder.DropForeignKey(
                name: "FK_JobPostingI18n_JobPosting",
                table: "JobPostingI18n");

            migrationBuilder.DropForeignKey(
                name: "FK_NewsI18n_News",
                table: "NewsI18n");

            migrationBuilder.DropForeignKey(
                name: "FK_PageI18n_Page",
                table: "PageI18n");

            migrationBuilder.DropForeignKey(
                name: "FK_ProjectI18n_Project",
                table: "ProjectI18n");

            migrationBuilder.DropForeignKey(
                name: "FK_QuoteAttachment_QuoteRequest",
                table: "QuoteAttachment");

            migrationBuilder.DropForeignKey(
                name: "FK_SolutionI18n_Solution",
                table: "SolutionI18n");

            migrationBuilder.DropForeignKey(
                name: "FK_SolutionItem_Solution",
                table: "SolutionItem");

            migrationBuilder.DropForeignKey(
                name: "FK_SolutionItemI18n_SolutionItem",
                table: "SolutionItemI18n");

            migrationBuilder.DropForeignKey(
                name: "FK_SupplierDownloadI18n_SupplierDownload",
                table: "SupplierDownloadI18n");

            migrationBuilder.DropForeignKey(
                name: "FK_SupplierNoticeI18n_SupplierNotice",
                table: "SupplierNoticeI18n");

            migrationBuilder.DropForeignKey(
                name: "FK_SupplierSpecI18n_SupplierSpec",
                table: "SupplierSpecI18n");

            migrationBuilder.DropForeignKey(
                name: "FK_TagI18n_Tag",
                table: "TagI18n");

            migrationBuilder.DropForeignKey(
                name: "FK_VlogI18n_Vlog",
                table: "VlogI18n");

            migrationBuilder.InsertData(
                table: "RolePermission",
                columns: new[] { "PermissionCode", "RoleId" },
                values: new object[,]
                {
                    { "contact.delete", 1 },
                    { "page.delete", 1 },
                    { "quote.delete", 1 }
                });

            migrationBuilder.AddForeignKey(
                name: "FK_CategoryI18n_Category",
                table: "CategoryI18n",
                column: "CategoryId",
                principalTable: "Category",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_CertificationI18n_Certification",
                table: "CertificationI18n",
                column: "CertificationId",
                principalTable: "Certification",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FacilityItemI18n_FacilityItem",
                table: "FacilityItemI18n",
                column: "FacilityItemId",
                principalTable: "FacilityItem",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FaqI18n_Faq",
                table: "FaqI18n",
                column: "FaqId",
                principalTable: "Faq",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_HomeBannerI18n_HomeBanner",
                table: "HomeBannerI18n",
                column: "HomeBannerId",
                principalTable: "HomeBanner",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_IndustryTrendI18n_IndustryTrend",
                table: "IndustryTrendI18n",
                column: "IndustryTrendId",
                principalTable: "IndustryTrend",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_JobPostingI18n_JobPosting",
                table: "JobPostingI18n",
                column: "JobPostingId",
                principalTable: "JobPosting",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_NewsI18n_News",
                table: "NewsI18n",
                column: "NewsId",
                principalTable: "News",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PageI18n_Page",
                table: "PageI18n",
                column: "PageId",
                principalTable: "Page",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectI18n_Project",
                table: "ProjectI18n",
                column: "ProjectId",
                principalTable: "Project",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_QuoteAttachment_QuoteRequest",
                table: "QuoteAttachment",
                column: "QuoteRequestId",
                principalTable: "QuoteRequest",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SolutionI18n_Solution",
                table: "SolutionI18n",
                column: "SolutionId",
                principalTable: "Solution",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SolutionItem_Solution",
                table: "SolutionItem",
                column: "SolutionId",
                principalTable: "Solution",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SolutionItemI18n_SolutionItem",
                table: "SolutionItemI18n",
                column: "SolutionItemId",
                principalTable: "SolutionItem",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SupplierDownloadI18n_SupplierDownload",
                table: "SupplierDownloadI18n",
                column: "SupplierDownloadId",
                principalTable: "SupplierDownload",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SupplierNoticeI18n_SupplierNotice",
                table: "SupplierNoticeI18n",
                column: "SupplierNoticeId",
                principalTable: "SupplierNotice",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SupplierSpecI18n_SupplierSpec",
                table: "SupplierSpecI18n",
                column: "SupplierSpecId",
                principalTable: "SupplierSpec",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TagI18n_Tag",
                table: "TagI18n",
                column: "TagId",
                principalTable: "Tag",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_VlogI18n_Vlog",
                table: "VlogI18n",
                column: "VlogId",
                principalTable: "Vlog",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            // ── 清掉既有的軟刪列 ────────────────────────────────────────────
            // 表的清單直接問 sys.columns（凡是有 IsDeleted 的表），不寫死：漏掉一張的話
            // 那張表的舊資料會靜靜地留著，而這種漏不會有任何症狀。
            // 刪除順序未知（例如 SolutionItem 要先於 Solution），所以重複掃描直到沒有東西
            // 可刪為止；仍被引用而刪不掉的（如還有報價掛著的方案）由 TRY/CATCH 略過，
            // 遷移不該因為一筆刪不掉的舊資料而整個失敗。
            migrationBuilder.Sql("""
                -- DECLARE 一律放在迴圈外：T-SQL 的變數是批次範圍的，
                -- 在 WHILE 裡宣告第二圈就會炸「variable name has already been declared」。
                DECLARE @pass INT = 0, @deletedInPass INT = 1;
                DECLARE @table SYSNAME, @rows INT, @sql NVARCHAR(MAX);

                WHILE @pass < 5 AND @deletedInPass > 0
                BEGIN
                    SET @pass = @pass + 1;
                    SET @deletedInPass = 0;

                    DECLARE purge CURSOR LOCAL FAST_FORWARD FOR

                        SELECT t.name
                        FROM sys.tables t
                        JOIN sys.columns c ON c.object_id = t.object_id AND c.name = 'IsDeleted';

                    OPEN purge;
                    FETCH NEXT FROM purge INTO @table;

                    WHILE @@FETCH_STATUS = 0
                    BEGIN
                        BEGIN TRY
                            SET @rows = 0;
                            SET @sql = N'DELETE FROM ' + QUOTENAME(@table)
                                     + N' WHERE [IsDeleted] = 1; SET @c = @@ROWCOUNT;';
                            EXEC sp_executesql @sql, N'@c INT OUTPUT', @c = @rows OUTPUT;
                            SET @deletedInPass = @deletedInPass + @rows;
                        END TRY

                        BEGIN CATCH
                            PRINT '略過 ' + @table + '：仍有其他資料引用（' + ERROR_MESSAGE() + '）';
                        END CATCH

                        FETCH NEXT FROM purge INTO @table;
                    END

                    CLOSE purge;
                    DEALLOCATE purge;
                END
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CategoryI18n_Category",
                table: "CategoryI18n");

            migrationBuilder.DropForeignKey(
                name: "FK_CertificationI18n_Certification",
                table: "CertificationI18n");

            migrationBuilder.DropForeignKey(
                name: "FK_FacilityItemI18n_FacilityItem",
                table: "FacilityItemI18n");

            migrationBuilder.DropForeignKey(
                name: "FK_FaqI18n_Faq",
                table: "FaqI18n");

            migrationBuilder.DropForeignKey(
                name: "FK_HomeBannerI18n_HomeBanner",
                table: "HomeBannerI18n");

            migrationBuilder.DropForeignKey(
                name: "FK_IndustryTrendI18n_IndustryTrend",
                table: "IndustryTrendI18n");

            migrationBuilder.DropForeignKey(
                name: "FK_JobPostingI18n_JobPosting",
                table: "JobPostingI18n");

            migrationBuilder.DropForeignKey(
                name: "FK_NewsI18n_News",
                table: "NewsI18n");

            migrationBuilder.DropForeignKey(
                name: "FK_PageI18n_Page",
                table: "PageI18n");

            migrationBuilder.DropForeignKey(
                name: "FK_ProjectI18n_Project",
                table: "ProjectI18n");

            migrationBuilder.DropForeignKey(
                name: "FK_QuoteAttachment_QuoteRequest",
                table: "QuoteAttachment");

            migrationBuilder.DropForeignKey(
                name: "FK_SolutionI18n_Solution",
                table: "SolutionI18n");

            migrationBuilder.DropForeignKey(
                name: "FK_SolutionItem_Solution",
                table: "SolutionItem");

            migrationBuilder.DropForeignKey(
                name: "FK_SolutionItemI18n_SolutionItem",
                table: "SolutionItemI18n");

            migrationBuilder.DropForeignKey(
                name: "FK_SupplierDownloadI18n_SupplierDownload",
                table: "SupplierDownloadI18n");

            migrationBuilder.DropForeignKey(
                name: "FK_SupplierNoticeI18n_SupplierNotice",
                table: "SupplierNoticeI18n");

            migrationBuilder.DropForeignKey(
                name: "FK_SupplierSpecI18n_SupplierSpec",
                table: "SupplierSpecI18n");

            migrationBuilder.DropForeignKey(
                name: "FK_TagI18n_Tag",
                table: "TagI18n");

            migrationBuilder.DropForeignKey(
                name: "FK_VlogI18n_Vlog",
                table: "VlogI18n");

            migrationBuilder.DeleteData(
                table: "RolePermission",
                keyColumns: new[] { "PermissionCode", "RoleId" },
                keyValues: new object[] { "contact.delete", 1 });

            migrationBuilder.DeleteData(
                table: "RolePermission",
                keyColumns: new[] { "PermissionCode", "RoleId" },
                keyValues: new object[] { "page.delete", 1 });

            migrationBuilder.DeleteData(
                table: "RolePermission",
                keyColumns: new[] { "PermissionCode", "RoleId" },
                keyValues: new object[] { "quote.delete", 1 });

            migrationBuilder.AddForeignKey(
                name: "FK_CategoryI18n_Category",
                table: "CategoryI18n",
                column: "CategoryId",
                principalTable: "Category",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_CertificationI18n_Certification",
                table: "CertificationI18n",
                column: "CertificationId",
                principalTable: "Certification",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_FacilityItemI18n_FacilityItem",
                table: "FacilityItemI18n",
                column: "FacilityItemId",
                principalTable: "FacilityItem",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_FaqI18n_Faq",
                table: "FaqI18n",
                column: "FaqId",
                principalTable: "Faq",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_HomeBannerI18n_HomeBanner",
                table: "HomeBannerI18n",
                column: "HomeBannerId",
                principalTable: "HomeBanner",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_IndustryTrendI18n_IndustryTrend",
                table: "IndustryTrendI18n",
                column: "IndustryTrendId",
                principalTable: "IndustryTrend",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_JobPostingI18n_JobPosting",
                table: "JobPostingI18n",
                column: "JobPostingId",
                principalTable: "JobPosting",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_NewsI18n_News",
                table: "NewsI18n",
                column: "NewsId",
                principalTable: "News",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PageI18n_Page",
                table: "PageI18n",
                column: "PageId",
                principalTable: "Page",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectI18n_Project",
                table: "ProjectI18n",
                column: "ProjectId",
                principalTable: "Project",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_QuoteAttachment_QuoteRequest",
                table: "QuoteAttachment",
                column: "QuoteRequestId",
                principalTable: "QuoteRequest",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SolutionI18n_Solution",
                table: "SolutionI18n",
                column: "SolutionId",
                principalTable: "Solution",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SolutionItem_Solution",
                table: "SolutionItem",
                column: "SolutionId",
                principalTable: "Solution",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SolutionItemI18n_SolutionItem",
                table: "SolutionItemI18n",
                column: "SolutionItemId",
                principalTable: "SolutionItem",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SupplierDownloadI18n_SupplierDownload",
                table: "SupplierDownloadI18n",
                column: "SupplierDownloadId",
                principalTable: "SupplierDownload",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SupplierNoticeI18n_SupplierNotice",
                table: "SupplierNoticeI18n",
                column: "SupplierNoticeId",
                principalTable: "SupplierNotice",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SupplierSpecI18n_SupplierSpec",
                table: "SupplierSpecI18n",
                column: "SupplierSpecId",
                principalTable: "SupplierSpec",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TagI18n_Tag",
                table: "TagI18n",
                column: "TagId",
                principalTable: "Tag",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_VlogI18n_Vlog",
                table: "VlogI18n",
                column: "VlogId",
                principalTable: "Vlog",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
