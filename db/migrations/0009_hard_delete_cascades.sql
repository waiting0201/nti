/* =============================================================================
   0009_hard_delete_cascades.sql  —  刪除改為真刪（2026-09-09）
   -----------------------------------------------------------------------------
   後台各單元的刪除原本一律是軟刪（IsDeleted = 1）。客戶的回饋是「刪了卻沒刪掉」：
   資料從清單消失、前台也查不到，可是 slug、分類代號這些唯一鍵仍被那一列佔著，
   同一個名字再也建不回來。因此改為真刪（docs/10 §8.4），本檔做三件事：

     1. 子表的外鍵由 NO ACTION 改為 ON DELETE CASCADE —— 17 張 *I18n 側表、
        方案品項（SolutionItem）、報價附件（QuoteAttachment）。這些表沒有獨立於
        主檔的生命週期，不跟著走的話每一次刪除都會撞 FK 而失敗。
     2. 權限矩陣補三列（僅 SuperAdmin）：page.delete／quote.delete／contact.delete。
     3. 清掉既有的軟刪列 —— 它們就是上面那個「名字再也用不回來」的來源。

   ⚠ 沒有改成 CASCADE 的外鍵是刻意留著的：Category、Tag 那幾條是「被引用」而非
     「被擁有」，要擋住刪除（後台會先給出「仍有 N 筆內容引用」的理由）；
     QuoteRequest→Solution 同理，已送出的報價不該因為刪一個方案就跟著消失。

   IsDeleted 欄位與各處查詢的 IsDeleted = 0 條件**保留不動**：既有索引依賴它，
   日後若要對特定表恢復軟刪也不必再開一次遷移。現在沒有任何一處寫入它。

   0002／0007 已套用於共享環境，依 db/README 的規則不得回頭修改，故本檔以
   append-only 的方式重建外鍵。與 EF 那條路徑的
   Api/Data/Migrations/20260909135945_HardDeleteCascades 一對一。

   套用後：表數與外鍵總數不變（33），其中 CASCADE 由 1 條變 20 條；
           RolePermission 由 170 列變 173 列。
   ============================================================================= */
SET NOCOUNT ON;
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET XACT_ABORT ON;
GO

BEGIN TRAN;

/* ---------- 1. 子表外鍵改 CASCADE ----------
   逐條列出而不是掃 sys.foreign_keys 自動改：哪些是「擁有」、哪些只是「引用」
   是設計決定，讓腳本自己猜會在某天新增一張表時默默把不該連動的關聯一起改掉。 */
DECLARE @fk TABLE (
    Name     SYSNAME,
    Child    SYSNAME,
    ChildCol SYSNAME,
    Parent   SYSNAME
);

INSERT @fk (Name, Child, ChildCol, Parent) VALUES
    (N'FK_CategoryI18n_Category',                 N'CategoryI18n',           N'CategoryId',         N'Category'),
    (N'FK_HomeBannerI18n_HomeBanner',             N'HomeBannerI18n',         N'HomeBannerId',       N'HomeBanner'),
    (N'FK_SolutionI18n_Solution',                 N'SolutionI18n',           N'SolutionId',         N'Solution'),
    (N'FK_SolutionItemI18n_SolutionItem',         N'SolutionItemI18n',       N'SolutionItemId',     N'SolutionItem'),
    (N'FK_ProjectI18n_Project',                   N'ProjectI18n',            N'ProjectId',          N'Project'),
    (N'FK_NewsI18n_News',                         N'NewsI18n',               N'NewsId',             N'News'),
    (N'FK_VlogI18n_Vlog',                         N'VlogI18n',               N'VlogId',             N'Vlog'),
    (N'FK_FaqI18n_Faq',                           N'FaqI18n',                N'FaqId',              N'Faq'),
    (N'FK_IndustryTrendI18n_IndustryTrend',       N'IndustryTrendI18n',      N'IndustryTrendId',    N'IndustryTrend'),
    (N'FK_CertificationI18n_Certification',       N'CertificationI18n',      N'CertificationId',    N'Certification'),
    (N'FK_FacilityItemI18n_FacilityItem',         N'FacilityItemI18n',       N'FacilityItemId',     N'FacilityItem'),
    (N'FK_JobPostingI18n_JobPosting',             N'JobPostingI18n',         N'JobPostingId',       N'JobPosting'),
    (N'FK_SupplierNoticeI18n_SupplierNotice',     N'SupplierNoticeI18n',     N'SupplierNoticeId',   N'SupplierNotice'),
    (N'FK_SupplierSpecI18n_SupplierSpec',         N'SupplierSpecI18n',       N'SupplierSpecId',     N'SupplierSpec'),
    (N'FK_SupplierDownloadI18n_SupplierDownload', N'SupplierDownloadI18n',   N'SupplierDownloadId', N'SupplierDownload'),
    (N'FK_PageI18n_Page',                         N'PageI18n',               N'PageId',             N'Page'),
    (N'FK_TagI18n_Tag',                           N'TagI18n',                N'TagId',              N'Tag'),
    (N'FK_SolutionItem_Solution',                 N'SolutionItem',           N'SolutionId',         N'Solution'),
    (N'FK_QuoteAttachment_QuoteRequest',          N'QuoteAttachment',        N'QuoteRequestId',     N'QuoteRequest');

DECLARE @name SYSNAME, @child SYSNAME, @col SYSNAME, @parent SYSNAME, @sql NVARCHAR(MAX);

DECLARE fks CURSOR LOCAL FAST_FORWARD FOR
    SELECT Name, Child, ChildCol, Parent FROM @fk;

OPEN fks;
FETCH NEXT FROM fks INTO @name, @child, @col, @parent;

WHILE @@FETCH_STATUS = 0
BEGIN
    IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = @name)
    BEGIN
        SET @sql = N'ALTER TABLE dbo.' + QUOTENAME(@child) + N' DROP CONSTRAINT ' + QUOTENAME(@name) + N';';
        EXEC sp_executesql @sql;
    END

    SET @sql = N'ALTER TABLE dbo.' + QUOTENAME(@child)
             + N' ADD CONSTRAINT ' + QUOTENAME(@name)
             + N' FOREIGN KEY (' + QUOTENAME(@col) + N') REFERENCES dbo.' + QUOTENAME(@parent) + N'(Id)'
             + N' ON DELETE CASCADE;';
    EXEC sp_executesql @sql;

    FETCH NEXT FROM fks INTO @name, @child, @col, @parent;
END

CLOSE fks;
DEALLOCATE fks;

/* ---------- 2. 權限矩陣補三列（僅 SuperAdmin）---------- */
INSERT dbo.RolePermission (RoleId, PermissionCode)
SELECT r.Id, v.Code
FROM (VALUES (N'page.delete'), (N'quote.delete'), (N'contact.delete')) v (Code)
JOIN dbo.Role r ON r.Code = N'SuperAdmin'
WHERE NOT EXISTS (
    SELECT 1 FROM dbo.RolePermission rp
    WHERE rp.RoleId = r.Id AND rp.PermissionCode = v.Code
);

COMMIT;
GO

/* ---------- 3. 清掉既有的軟刪列 ----------
   表的清單直接問 sys.columns（凡是有 IsDeleted 的表），不寫死：漏掉一張的話那張表的
   舊資料會靜靜地留著，而這種漏不會有任何症狀。刪除順序未知（SolutionItem 要先於
   Solution），所以重複掃描直到沒有東西可刪；仍被引用而刪不掉的由 TRY/CATCH 略過，
   遷移不該因為一筆刪不掉的舊資料而整個失敗。 */
DECLARE @pass INT = 0, @deletedInPass INT = 1;
DECLARE @table SYSNAME, @rows INT, @purgeSql NVARCHAR(MAX);

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
            SET @purgeSql = N'DELETE FROM ' + QUOTENAME(@table) + N' WHERE [IsDeleted] = 1; SET @c = @@ROWCOUNT;';
            EXEC sp_executesql @purgeSql, N'@c INT OUTPUT', @c = @rows OUTPUT;
            SET @deletedInPass = @deletedInPass + @rows;
        END TRY
        BEGIN CATCH
            PRINT N'略過 ' + @table + N'：仍有其他資料引用（' + ERROR_MESSAGE() + N'）';
        END CATCH

        FETCH NEXT FROM purge INTO @table;
    END

    CLOSE purge;
    DEALLOCATE purge;
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.SchemaVersion WHERE ScriptName = N'0009_hard_delete_cascades.sql')
    INSERT dbo.SchemaVersion (ScriptName) VALUES (N'0009_hard_delete_cascades.sql');
GO
