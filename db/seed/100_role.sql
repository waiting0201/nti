/* =============================================================================
   100_role.sql  —  角色（docs/08 §6.1、docs/09 §23）
   -----------------------------------------------------------------------------
   run-always 冪等腳本。三個系統角色 IsSystem=1，後台不可刪除。
   固定 Id：讓 dev / staging / prod 的角色 Id 完全一致，便於資料比對與 hotfix SQL。
   ============================================================================= */
SET NOCOUNT ON;
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET XACT_ABORT ON;
GO

SET IDENTITY_INSERT dbo.Role ON;

;WITH src (Id, Code, Name) AS (
    SELECT * FROM (VALUES
        (1, 'SuperAdmin', N'超級管理員'),
        (2, 'Editor',     N'內容編輯'),
        (3, 'Viewer',     N'檢視者')
    ) v (Id, Code, Name)
)
INSERT dbo.Role (Id, Code, Name, IsSystem)
SELECT s.Id, s.Code, s.Name, 1
FROM src s
WHERE NOT EXISTS (SELECT 1 FROM dbo.Role r WHERE r.Code = s.Code);

SET IDENTITY_INSERT dbo.Role OFF;
GO
