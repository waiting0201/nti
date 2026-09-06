/* =============================================================================
   0006_drop_auditlog.sql  —  移除操作紀錄（2026-09-06）
   -----------------------------------------------------------------------------
   操作紀錄（docs/09 §24 的「操作紀錄」分頁）移出本期範圍。單元 24 保留，但只剩
   信件紀錄（EmailLog）——它是報價與聯絡表單的送達證明，與稽核是兩回事。
   權限碼 audit.view／audit.resend 因此原樣保留，RolePermission 仍為 167 列。

   0002／0003 已套用於共享環境，依 db/README 的規則不得回頭修改，故本檔以
   append-only 的方式把表與索引拿掉。與 EF 那條路徑的
   Api/Data/Migrations/*_DropAuditLog 一對一。

   ⚠ 這支會**刪資料**。AuditLog 在本專案從未上線寫入過，實務上沒有資料損失；
     但若某個環境已自行灌過紀錄，跑之前請自行備份。

   套用後：表數 45 → 44、非 PK/UQ 索引 17 → 16（斷言在 db/verify/）。
   ============================================================================= */
SET NOCOUNT ON;
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET XACT_ABORT ON;
GO

BEGIN TRAN;

/* AdminUserId 刻意不建 FK（docs/08 §2.3），沒有相依要先斷；
   IX_AuditLog_Entity 隨表一起消失。 */
IF OBJECT_ID(N'dbo.AuditLog', N'U') IS NOT NULL DROP TABLE dbo.AuditLog;

COMMIT;
GO

IF NOT EXISTS (SELECT 1 FROM dbo.SchemaVersion WHERE ScriptName = N'0006_drop_auditlog.sql')
    INSERT dbo.SchemaVersion (ScriptName) VALUES (N'0006_drop_auditlog.sql');
GO
