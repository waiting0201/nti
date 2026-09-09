import type { ListQuery, ListResult, Row } from './types'
import { SEED } from './seed.generated'
import { MANUAL_SEED, SETTING_VALUES } from './seed.manual'
import { ROLE_LABEL, ROLE_PERMISSIONS, type RoleCode } from '@/lib/permissions'
import type { AdminAccount, AdminDraft, AdminPatch, AdminRole } from './client.api'

/**
 * 後台資料存取層。
 *
 * 目前是本機 mock（資料存在 localStorage，重整不會消失，可以真的操作給客戶看）。
 * 後端 `/api/v1/admin/*` 上線後，這個檔案是**唯一**要換掉的地方 ——
 * 上層的清單／編輯畫面只認下面這組函式簽章，不知道資料從哪來。
 *
 * 真實實作會是：帶 JWT 呼叫 Azure Functions，回應為 docs/10 的 ApiResponse 信封。
 */

const STORE_KEY = 'nti-admin-store-v1'

type Store = Record<string, Row[]>

function seedStore(): Store {
  return structuredClone({ ...SEED, ...MANUAL_SEED, __settings: [] }) as Store
}

function load(): Store {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    if (raw) return JSON.parse(raw) as Store
  } catch {
    // localStorage 不可用（無痕視窗等）時退回記憶體
  }
  return seedStore()
}

let store: Store = load()
let settings: Record<string, string | { zh: string; en: string }> = loadSettings()

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORE_KEY + ':settings')
    if (raw) return JSON.parse(raw)
  } catch {
    /* 同上 */
  }
  return structuredClone(SETTING_VALUES)
}

function persist() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(store))
    localStorage.setItem(STORE_KEY + ':settings', JSON.stringify(settings))
  } catch {
    /* 存不進去就只留在記憶體，不影響操作 */
  }
}

/** 把資料還原成初始種子（示範用，正式站不會有這顆按鈕） */
export function resetStore() {
  store = seedStore()
  settings = structuredClone(SETTING_VALUES)
  persist()
}

const delay = () => new Promise((r) => setTimeout(r, 80))

function table(unit: string): Row[] {
  if (!store[unit]) store[unit] = []
  return store[unit]
}

function matches(row: Row, q: ListQuery): boolean {
  if (row.isDeleted) return false
  if (q.categoryId && row.categoryId !== q.categoryId) return false
  if (q.status && q.status !== 'all') {
    if (q.status === 'published' && !row.isPublished) return false
    if (q.status === 'draft' && row.isPublished) return false
    if (q.status !== 'published' && q.status !== 'draft' && row.status !== q.status) return false
  }
  if (q.keyword) {
    const hay = JSON.stringify(row).toLowerCase()
    if (!hay.includes(q.keyword.toLowerCase())) return false
  }
  return true
}

export async function list(unit: string, q: ListQuery = {}): Promise<ListResult> {
  await delay()
  const all = table(unit)
    .filter((r) => matches(r, q))
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
  const page = q.page ?? 1
  const size = q.pageSize ?? 20
  return { rows: all.slice((page - 1) * size, page * size), total: all.length }
}

/** 不分頁、不篩選的整份資料（拖曳排序與儀表板統計用） */
export async function listAll(unit: string): Promise<Row[]> {
  await delay()
  return table(unit)
    .filter((r) => !r.isDeleted)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
}

export async function get(unit: string, id: string): Promise<Row | undefined> {
  await delay()
  return table(unit).find((r) => r.id === id)
}

export async function save(unit: string, row: Row): Promise<Row> {
  await delay()
  const rows = table(unit)
  const i = rows.findIndex((r) => r.id === row.id)
  if (i >= 0) rows[i] = row
  else rows.push({ ...row, sortOrder: row.sortOrder ?? (rows.length + 1) * 10 })
  persist()
  return row
}

export async function create(unit: string, row: Omit<Row, 'id'>): Promise<Row> {
  await delay()
  const rows = table(unit)
  const id = String(Date.now())
  const created: Row = { ...row, id, sortOrder: (rows.length + 1) * 10 }
  rows.push(created)
  persist()
  return created
}

/** docs §5.7：一律軟刪，列表隱藏 */
export async function softDelete(unit: string, ids: string[]): Promise<void> {
  await delay()
  for (const r of table(unit)) if (ids.includes(r.id)) r.isDeleted = true
  persist()
}

export async function setPublished(unit: string, ids: string[], published: boolean): Promise<void> {
  await delay()
  for (const r of table(unit)) if (ids.includes(r.id)) r.isPublished = published
  persist()
}

export async function reorder(unit: string, orderedIds: string[]): Promise<void> {
  await delay()
  const rows = table(unit)
  orderedIds.forEach((id, i) => {
    const row = rows.find((r) => r.id === id)
    if (row) row.sortOrder = (i + 1) * 10
  })
  persist()
}

/** 子清單（目前只有 solution 的品項卡）以 parentId 過濾同一張表 */
export async function listChildren(unit: string, parentId: string): Promise<Row[]> {
  await delay()
  return table(unit)
    .filter((r) => !r.isDeleted && r.parentId === parentId)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
}

export async function getSettings() {
  await delay()
  return settings
}

export async function saveSettings(next: typeof settings) {
  await delay()
  settings = next
  persist()
}

/** docs §5.7：刪除前顯示前台影響 —— 這裡算的是引用這個分類的內容筆數 */
/** 下載報價附件——mock 沒有實際檔案，讓畫面走到同一條錯誤處理。 */
export async function downloadQuoteAttachment(_quoteId: string, _attachmentId: string, name: string): Promise<void> {
  throw new Error(`示範資料沒有 ${name} 這個檔案，接上 API 後才會真的下載。`)
}

/** 匯出報價 CSV——mock 不產檔，同樣走錯誤處理提示尚未接 API。 */
export async function exportQuotesCsv(): Promise<void> {
  throw new Error('匯出 CSV 需要連上 API，示範資料不產生檔案。')
}

/** 匯出 301 對照 CSV——同上。 */
export async function exportRedirectsCsv(): Promise<void> {
  throw new Error('匯出 CSV 需要連上 API，示範資料不產生檔案。')
}

/** 匯入 301 對照 CSV——mock 不寫入，避免讓人以為示範資料真的收下了那份檔案。 */
export async function importRedirectsCsv(_file: File): Promise<{ created: number; updated: number; skipped: number }> {
  throw new Error('匯入 CSV 需要連上 API，示範資料不會被寫入。')
}

export function categoryUsage(categoryId: string): number {
  let n = 0
  for (const rows of Object.values(store)) {
    for (const r of rows) if (!r.isDeleted && r.categoryId === categoryId) n++
  }
  return n
}

// ── 23 admin：管理員帳號與角色 ────────────────────────────────────────────
/**
 * 與 `client.api.ts` 同一組簽章。示範模式不存密碼——
 * 新增與重設密碼都只把帳號那一列改一改，密碼本身丟掉。
 */
/** 角色 Id 與 db/seed/100_role.sql 的三列一致（1 超管／2 編輯／3 檢視）。 */
const ROLE_IDS: RoleCode[] = ['SuperAdmin', 'Editor', 'Viewer']
const roleIdOf = (code: string) => ROLE_IDS.indexOf(code as RoleCode) + 1
const roleCodeOf = (id: number) => ROLE_IDS[id - 1] ?? 'Viewer'

/** 種子裡的一列（`role` 是角色代號）→ 與真 API 一致的形狀。 */
function toAccount(row: Row): AdminAccount {
  return {
    id: row.id,
    username: String(row.username ?? ''),
    email: (row.email as string | undefined) ?? null,
    displayName: String(row.displayName ?? ''),
    roleId: roleIdOf(String(row.role ?? 'Viewer')),
    roleCode: String(row.role ?? 'Viewer'),
    isActive: row.isActive !== false,
    lastLoginAt: (row.lastLoginAt as string | undefined) ?? null,
    mustChangePassword: row.mustChangePassword === true,
  }
}

export async function listAdmins(keyword = ''): Promise<AdminAccount[]> {
  await delay()
  const k = keyword.trim().toLowerCase()
  return table('adminUser')
    .filter((r) => !r.isDeleted)
    .filter((r) => !k || JSON.stringify(r).toLowerCase().includes(k))
    .map(toAccount)
}

export async function listRoles(): Promise<AdminRole[]> {
  await delay()
  return ROLE_IDS.map((code, i) => ({
    id: i + 1,
    code,
    name: ROLE_LABEL[code],
    isSystem: true,
    permissions: [...ROLE_PERMISSIONS[code]],
  }))
}

export async function createAdmin(draft: AdminDraft): Promise<{ id: string }> {
  await delay()
  const rows = table('adminUser')

  if (rows.some((r) => !r.isDeleted && r.username === draft.username))
    throw new Error('此帳號已存在。')

  rows.push({
    id: String(Date.now()),
    username: draft.username,
    email: draft.email || undefined,
    displayName: draft.displayName,
    role: roleCodeOf(draft.roleId),
    isActive: true,
    lastLoginAt: null,
    mustChangePassword: false,
  })
  persist()

  return { id: rows[rows.length - 1].id }
}

export async function setAdminPassword(id: string, _password: string): Promise<void> {
  await delay()
  const row = table('adminUser').find((r) => r.id === id)
  if (!row) throw new Error('查無此帳號。')
  row.mustChangePassword = false
  persist()
}

export async function updateAdmin(id: string, patch: AdminPatch): Promise<void> {
  await delay()
  const row = table('adminUser').find((r) => r.id === id)
  if (!row) throw new Error('查無此帳號。')

  if (patch.displayName !== undefined) row.displayName = patch.displayName
  if (patch.email !== undefined) row.email = patch.email || undefined
  if (patch.roleId !== undefined) row.role = roleCodeOf(patch.roleId)
  if (patch.isActive !== undefined) row.isActive = patch.isActive
  persist()
}

export async function deleteAdmin(id: string): Promise<void> {
  await delay()
  const rows = table('adminUser')
  const i = rows.findIndex((r) => r.id === id)
  if (i < 0) throw new Error('查無此帳號。')
  // 與真 API 一致：管理員是真刪，不是軟刪——軟刪會讓帳號名被永久佔住
  rows.splice(i, 1)
  persist()
}
