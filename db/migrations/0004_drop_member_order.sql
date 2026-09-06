/* =============================================================================
   0004_drop_member_order.sql  —  移除會員與訂單（2026-09-06）
   -----------------------------------------------------------------------------
   客戶 2026-08-31 版 sitemap 沒有會員節點（0626 版原有的 Button > Member 在 0818
   版即被移除），mockup 44 頁也沒有會員中心畫面。會員系統與訂單／生產進度因此
   移出本期範圍，見 docs/09 §19、reference/官網資訊架構_IA.md §5.1。

   0002／0003 已套用於共享環境，依 db/README 的規則不得回頭修改，故本檔以
   append-only 的方式把四張表與兩個欄位拿掉。與 EF 那條路徑的
   Api/Data/Migrations/20260906080035_RemoveMemberAndOrder 一對一。

   ⚠ 這支會**刪資料**。Member／MemberToken／Orders／OrderProgress 四張表在本專案
     從未寫入過任何一列（前台會員功能沒上線），所以實務上沒有資料損失；
     但若某個環境已自行灌過測試資料，跑之前請自行備份。

   套用後：表數 49 → 45、外鍵 35 → 30、非 PK/UQ 索引 20 → 17、
           RolePermission 171 → 167 列（斷言在 db/verify/verify.sql）。
   ============================================================================= */
SET NOCOUNT ON;
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET XACT_ABORT ON;
GO

BEGIN TRAN;

/* --- QuoteRequest.MemberId：先斷外鍵再砍欄位 ------------------------------- */
IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = N'FK_QuoteRequest_Member')
    ALTER TABLE dbo.QuoteRequest DROP CONSTRAINT FK_QuoteRequest_Member;

IF COL_LENGTH(N'dbo.QuoteRequest', N'MemberId') IS NOT NULL
    ALTER TABLE dbo.QuoteRequest DROP COLUMN MemberId;

/* --- SupplierDownload.RequireLogin：受控文件概念一併取消 --------------------
   具名 DEFAULT 約束要先卸掉，否則 DROP COLUMN 會被擋。 */
IF EXISTS (SELECT 1 FROM sys.default_constraints WHERE name = N'DF_SupplierDownload_RequireLogin')
    ALTER TABLE dbo.SupplierDownload DROP CONSTRAINT DF_SupplierDownload_RequireLogin;

IF COL_LENGTH(N'dbo.SupplierDownload', N'RequireLogin') IS NOT NULL
    ALTER TABLE dbo.SupplierDownload DROP COLUMN RequireLogin;

/* --- 四張表：依外鍵相依由葉往根砍（索引隨表一起消失）----------------------- */
IF OBJECT_ID(N'dbo.OrderProgress', N'U') IS NOT NULL DROP TABLE dbo.OrderProgress;
IF OBJECT_ID(N'dbo.Orders',        N'U') IS NOT NULL DROP TABLE dbo.Orders;
IF OBJECT_ID(N'dbo.MemberToken',   N'U') IS NOT NULL DROP TABLE dbo.MemberToken;
IF OBJECT_ID(N'dbo.Member',        N'U') IS NOT NULL DROP TABLE dbo.Member;

/* --- 權限碼：SuperAdmin 的 member.* / order.* 四列 -------------------------- */
DELETE rp
FROM dbo.RolePermission rp
WHERE rp.PermissionCode IN ('member.view','member.edit','order.view','order.edit');

COMMIT;
GO

IF NOT EXISTS (SELECT 1 FROM dbo.SchemaVersion WHERE ScriptName = N'0004_drop_member_order.sql')
    INSERT dbo.SchemaVersion (ScriptName) VALUES (N'0004_drop_member_order.sql');
GO
