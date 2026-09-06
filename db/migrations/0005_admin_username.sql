/* =============================================================================
   0005_admin_username.sql  —  後台登入帳號改用 Username（2026-09-06）
   -----------------------------------------------------------------------------
   後台帳號不再限定 email 格式：登入識別改為 AdminUser.Username（唯一），
   Email 降級為選填的通知信箱（新增管理員時寄啟用信用；沒填就寄不出去，
   初始密碼改由建立者當場轉交，見 Api/Handlers/Admin/AdminAccountHandler.cs）。

   0002～0004 已套用於共享環境，依 db/README 的規則不得回頭修改，故本檔以
   append-only 的方式加欄位、搬唯一鍵。與 EF 那條路徑的
   Api/Data/Migrations/20260906130926_AdminUsernameLogin 一對一。

   既有帳號的 Email 原封搬進 Username（超過 80 字截斷），所以現行帳號的
   登入方式不變——本來輸入 email，改版後輸入的就是「帳號」，值一樣。

   套用後：AdminUser 多一個 Username 欄位、UQ_AdminUser_Email 換成
           UQ_AdminUser_Username、Email 允許 NULL。
   ============================================================================= */
SET NOCOUNT ON;
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET XACT_ABORT ON;
GO

BEGIN TRAN;

/* --- 1. 加欄位：先允許 NULL，回填後再收成 NOT NULL --------------------------
   直接 NOT NULL 就得給 DEFAULT，而那個約束 model 裡沒有，兩條路徑會長得不一樣
   （verify 的「匿名約束數 = 0」就是在守這件事）。 */
IF COL_LENGTH(N'dbo.AdminUser', N'Username') IS NULL
    ALTER TABLE dbo.AdminUser ADD Username nvarchar(80) NULL;
GO

/* --- 2. 既有帳號：拿原本的 email 當帳號（超過 80 字截斷）--------------------- */
UPDATE dbo.AdminUser SET Username = LEFT(Email, 80) WHERE Username IS NULL;
GO

ALTER TABLE dbo.AdminUser ALTER COLUMN Username nvarchar(80) NOT NULL;
GO

/* --- 3. 唯一鍵從 Email 搬到 Username ---------------------------------------- */
IF EXISTS (SELECT 1 FROM sys.key_constraints WHERE name = N'UQ_AdminUser_Email')
    ALTER TABLE dbo.AdminUser DROP CONSTRAINT UQ_AdminUser_Email;

IF NOT EXISTS (SELECT 1 FROM sys.key_constraints WHERE name = N'UQ_AdminUser_Username')
    ALTER TABLE dbo.AdminUser ADD CONSTRAINT UQ_AdminUser_Username UNIQUE (Username);
GO

/* --- 4. Email 改為選填 ------------------------------------------------------ */
ALTER TABLE dbo.AdminUser ALTER COLUMN Email nvarchar(160) NULL;
GO

COMMIT;
GO

IF NOT EXISTS (SELECT 1 FROM dbo.SchemaVersion WHERE ScriptName = N'0005_admin_username.sql')
    INSERT dbo.SchemaVersion (ScriptName) VALUES (N'0005_admin_username.sql');
GO
