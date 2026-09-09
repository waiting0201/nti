/**
 * 權限矩陣 — 逐格對照 docs/09-cms-admin.md §6 與其展開檔
 * `db/seed/110_role_permission.sql`（173 列：SuperAdmin 84／Editor 68／Viewer 21）。
 *
 * 下面的 GRANTS 與那份 SQL 是一對一的，`permissionRowCount()` 算出來的數字
 * 應該等於 173 —— 對不上就代表前後端對權限的認知已經岔開，要先修正再往下做。
 *
 * 權限碼格式 `{單元代號}.{view|edit|publish|delete|export}`，另有三個特例碼
 * `quote.download`／`redirect.export`／`audit.resend`。SuperAdmin 逐列展開、
 * 不使用萬用碼，與後端 RBAC 一律查 RolePermission 的做法一致。
 *
 * 前端的 can() 只決定畫面上顯不顯示；真正的把關在 `/api/v1/admin/*`
 * 的 JWT + RBAC（docs §5.8），前端不可信。
 */

export type RoleCode = 'SuperAdmin' | 'Editor' | 'Viewer'

export const ROLE_LABEL: Record<RoleCode, string> = {
  SuperAdmin: '超級管理員',
  Editor: '內容編輯',
  Viewer: '檢視者',
}

/** docs §2 表中「內容單元 01–14」的代號 */
export const CONTENT_UNITS = [
  'home-banner',
  'solution',
  'project',
  'news',
  'vlog',
  'faq',
  'trend',
  'certification',
  'client',
  'facility',
  'job',
  'supplier-notice',
  'supplier-spec',
  'supplier-download',
] as const

/**
 * 非內容單元的逐列授權，順序與註解對齊 110_role_permission.sql。
 * 內容單元 01–14 規則一致，另外用迴圈展開。
 */
const GRANTS: Record<RoleCode, string[]> = {
  SuperAdmin: [
    // 15 page：29 筆固定頁不可新增；刪除只給超管——刪掉之後前台那一頁就沒有 SEO 設定可讀
    'page.view', 'page.edit', 'page.delete',
    // 16 redirect
    'redirect.view', 'redirect.edit', 'redirect.delete', 'redirect.export',
    // 17 quote：附件下載、匯出 CSV 與刪除僅 SuperAdmin
    'quote.view', 'quote.edit', 'quote.download', 'quote.export', 'quote.delete',
    // 18 contact：刪除同報價，只給超管（客戶送出的紀錄刪掉就沒了）
    'contact.view', 'contact.edit', 'contact.delete',
    // 21 setting ／ 22 category ／ 25 tag
    'setting.view', 'setting.edit',
    'category.view', 'category.edit', 'category.delete',
    'tag.view', 'tag.edit', 'tag.delete',
    // 23 admin ／ 24 audit
    'admin.view', 'admin.edit', 'admin.delete',
    'audit.view', 'audit.resend',
  ],
  Editor: [
    'page.view', 'page.edit',
    'redirect.view', 'redirect.edit', 'redirect.delete', 'redirect.export',
    'quote.view', 'quote.edit',
    'contact.view', 'contact.edit',
    // 標籤是寫消息時順手建的，編輯要能新增；刪除會改動前台網址，留給超管
    'tag.view', 'tag.edit',
  ],
  Viewer: [
    'page.view',
    'redirect.view',
    'quote.view',
    'contact.view',
    'setting.view',
    'category.view',
    'tag.view',
  ],
}

const CONTENT_ACTIONS: Record<RoleCode, string[]> = {
  SuperAdmin: ['view', 'edit', 'publish', 'delete'],
  Editor: ['view', 'edit', 'publish', 'delete'],
  Viewer: ['view'],
}

function buildRole(role: RoleCode): Set<string> {
  const p = new Set<string>(GRANTS[role])
  for (const u of CONTENT_UNITS) for (const a of CONTENT_ACTIONS[role]) p.add(`${u}.${a}`)
  return p
}

export const ROLE_PERMISSIONS: Record<RoleCode, Set<string>> = {
  SuperAdmin: buildRole('SuperAdmin'),
  Editor: buildRole('Editor'),
  Viewer: buildRole('Viewer'),
}

export function can(role: RoleCode, code: string): boolean {
  return ROLE_PERMISSIONS[role].has(code)
}

/** 展開後的列數，應與 db/seed/110_role_permission.sql 的 173 列一致 */
export function permissionRowCount() {
  const SuperAdmin = ROLE_PERMISSIONS.SuperAdmin.size
  const Editor = ROLE_PERMISSIONS.Editor.size
  const Viewer = ROLE_PERMISSIONS.Viewer.size
  return { SuperAdmin, Editor, Viewer, total: SuperAdmin + Editor + Viewer }
}
