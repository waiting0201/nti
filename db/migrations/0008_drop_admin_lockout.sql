/* =============================================================================
   0008_drop_admin_lockout.sql  —  移除後台登入的帳號鎖定（2026-09-09）
   -----------------------------------------------------------------------------
   docs/09 §23 原訂「連續 5 次登入失敗鎖定 15 分鐘」，依客戶 2026-09-09 決定移除。

   理由：這種鎖定會變成對帳號本身的阻斷服務——只要持續用錯誤密碼打某個帳號，
   就能讓真正的管理員登不進來，而攻擊者不必知道任何密碼。暴力破解改由登入端點的
   reCAPTCHA v3 擋（AuthHandler 進入點就檢查，見 docs/10 §9.6）。

   AdminUser.FailedLoginCount 與 LockoutEndAt 因此成為死欄位，一併移除；
   LastLoginAt 保留（後台的管理員清單會顯示）。

   0002 已套用於共享環境，依 db/README 的規則不得回頭修改，故本檔以 append-only
   的方式把欄位拿掉。與 EF 那條路徑的 Api/Data/Migrations/*_DropAdminLockout 一對一。

   ⚠ 這支會**刪欄位**。兩個欄位存的都是暫時性的登入失敗計數，沒有需要保留的資料。

   套用後：AdminUser 少兩欄；表數、外鍵數、權限列數皆不變。
   ============================================================================= */
SET NOCOUNT ON;
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET XACT_ABORT ON;
GO

BEGIN TRAN;

/* DEFAULT 約束要先卸，否則 DROP COLUMN 會被相依物件擋下 */
IF EXISTS (SELECT 1 FROM sys.default_constraints WHERE name = N'DF_AdminUser_FailedLoginCount')
    ALTER TABLE dbo.AdminUser DROP CONSTRAINT DF_AdminUser_FailedLoginCount;

IF COL_LENGTH(N'dbo.AdminUser', N'FailedLoginCount') IS NOT NULL
    ALTER TABLE dbo.AdminUser DROP COLUMN FailedLoginCount;

IF COL_LENGTH(N'dbo.AdminUser', N'LockoutEndAt') IS NOT NULL
    ALTER TABLE dbo.AdminUser DROP COLUMN LockoutEndAt;

COMMIT;
GO

IF NOT EXISTS (SELECT 1 FROM dbo.SchemaVersion WHERE ScriptName = N'0008_drop_admin_lockout.sql')
    INSERT dbo.SchemaVersion (ScriptName) VALUES (N'0008_drop_admin_lockout.sql');
GO
