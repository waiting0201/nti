/* =============================================================================
   110_role_permission.sql  —  權限矩陣（docs/09 §6 為權威）
   =============================================================================
   ⚠ 權威來源是 docs/09-cms-admin.md §6 的矩陣，不是 docs/08 §6.1 的文字描述。
     08 §6.1 有兩處與矩陣不符，已於本次一併回寫修正：
       (a) 08 寫 Editor 為「view/edit/publish」→ 矩陣第 4 列明列 Editor 可 delete。
       (b) 08 寫 Viewer「全部 view」→ 矩陣中 Viewer 對單元 19/20/23/24 是無權限，
           只有 15/16、17/18、21/22 才是檢視。
     另 08 §6.1 用的 `system.*` / `member.*` 群組前綴不屬於 24 個單元代號，已棄用。

   權限碼格式 {單元代號}.{action}。矩陣描述到、但 08/09 都未定代號的三項，
   本次補上：quote.download（附件下載）、redirect.export（CSV 匯入匯出）、
   audit.resend（EmailLog 重寄）。

   SuperAdmin 亦逐列展開，不用萬用碼 —— RBAC 檢查邏輯保持單一（一律查
   RolePermission），且可稽核。新增後台單元時只需在本檔加一列 VALUES。

   預期列數：SuperAdmin 83、Editor 67、Viewer 21 → 合計 171（由 verify.sql 斷言）。
   ============================================================================= */
SET NOCOUNT ON;
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET XACT_ABORT ON;
GO

;WITH
/* 內容單元 01–14：三個角色的規則一致（SuperAdmin/Editor 全動作、Viewer 僅檢視） */
ContentUnit (u) AS (
    SELECT * FROM (VALUES
        ('home-banner'),('solution'),('project'),('news'),('vlog'),('faq'),('trend'),
        ('certification'),('client'),('facility'),('job'),
        ('supplier-notice'),('supplier-spec'),('supplier-download')
    ) v (u)
),
Act (a) AS (SELECT * FROM (VALUES ('view'),('edit'),('publish'),('delete')) v (a)),
grants (RoleCode, Code) AS (
    SELECT r.RoleCode, u.u + '.' + a.a
    FROM (VALUES ('SuperAdmin'),('Editor')) r (RoleCode)
    CROSS JOIN ContentUnit u CROSS JOIN Act a
    UNION ALL
    SELECT 'Viewer', u.u + '.view' FROM ContentUnit u
    UNION ALL
    SELECT * FROM (VALUES
        -- 00 dashboard：三個角色皆可看待辦總覽
        ('SuperAdmin','dashboard.view'),('Editor','dashboard.view'),('Viewer','dashboard.view'),
        -- 15 page：29 筆固定頁不可增刪，故無 delete
        ('SuperAdmin','page.view'),('SuperAdmin','page.edit'),
        ('Editor','page.view'),('Editor','page.edit'),
        ('Viewer','page.view'),
        -- 16 redirect
        ('SuperAdmin','redirect.view'),('SuperAdmin','redirect.edit'),
        ('SuperAdmin','redirect.delete'),('SuperAdmin','redirect.export'),
        ('Editor','redirect.view'),('Editor','redirect.edit'),
        ('Editor','redirect.delete'),('Editor','redirect.export'),
        ('Viewer','redirect.view'),
        -- 17 quote：附件下載與匯出 CSV 僅 SuperAdmin（矩陣第 7 列）
        ('SuperAdmin','quote.view'),('SuperAdmin','quote.edit'),
        ('SuperAdmin','quote.download'),('SuperAdmin','quote.export'),
        ('Editor','quote.view'),('Editor','quote.edit'),
        ('Viewer','quote.view'),
        -- 18 contact
        ('SuperAdmin','contact.view'),('SuperAdmin','contact.edit'),
        ('Editor','contact.view'),('Editor','contact.edit'),
        ('Viewer','contact.view'),
        -- 19 member ／ 20 order：僅 SuperAdmin
        ('SuperAdmin','member.view'),('SuperAdmin','member.edit'),
        ('SuperAdmin','order.view'),('SuperAdmin','order.edit'),
        -- 21 setting ／ 22 category：SuperAdmin 全權、Viewer 檢視、Editor 無
        ('SuperAdmin','setting.view'),('SuperAdmin','setting.edit'),
        ('Viewer','setting.view'),
        ('SuperAdmin','category.view'),('SuperAdmin','category.edit'),('SuperAdmin','category.delete'),
        ('Viewer','category.view'),
        -- 23 admin ／ 24 audit：僅 SuperAdmin
        ('SuperAdmin','admin.view'),('SuperAdmin','admin.edit'),('SuperAdmin','admin.delete'),
        ('SuperAdmin','audit.view'),('SuperAdmin','audit.resend')
    ) v (RoleCode, Code)
)
INSERT dbo.RolePermission (RoleId, PermissionCode)
SELECT r.Id, g.Code
FROM grants g
JOIN dbo.Role r ON r.Code = g.RoleCode
WHERE NOT EXISTS (
    SELECT 1 FROM dbo.RolePermission rp
    WHERE rp.RoleId = r.Id AND rp.PermissionCode = g.Code
);
GO
