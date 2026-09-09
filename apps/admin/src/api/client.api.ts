import type { ListQuery, ListResult, Row } from './types'
import { api } from './http'
import { apiToUiEntity, apiToUiI18n, isUnsupported, uiToApiEntity, uiToApiI18n } from './mapping'

/**
 * 打真實 `/api/v1/admin/*` 的資料存取層。
 *
 * 與 `client.mock.ts` 同一組簽章——上層的清單／編輯畫面不知道資料從哪來。
 * 由 `client.ts` 依 `VITE_API_BASE` 有沒有設定來選。
 *
 * 兩邊的欄位命名差異集中在 `mapping.ts`，這裡只負責搬運與形狀轉換。
 */

/** UI 的 id 是字串，API 是整數。 */
const toApiId = (id: string) => id

type ApiRow = Record<string, unknown> & {
  id: number
  i18n?: Record<string, Record<string, unknown>>
}

/** 報價附件（單筆端點的 `attachments`）。本期不做病毒掃描，沒有 scanStatus。 */
type ApiAttachment = { id: number; originalName: string; sizeBytes: number }

/** 後台路徑：子清單掛在 `/admin/solution/item`，其餘等於單元代號。 */
function pathOf(unit: string): string {
  return unit === 'solution-item' ? 'solution/item' : unit
}

/** API 的一列 → UI 的 Row（欄位改名、id 轉字串、組出 fileMeta 這類顯示欄位）。 */
function toRow(unit: string, source: ApiRow): Row {
  // 15 page 的識別是 PageKey 不是整數 Id —— 後端的 GET/PUT 都吃 key
  // （`/admin/page/{pageKey}`，見 AdminPageHandler；公開端點 `/pages/{key}` 也一樣）。
  // 送整數過去會查不到任何一頁而 404，編輯畫面就開不起來。
  const row: Row = { id: unit === 'page' ? String(source.pageKey ?? '') : String(source.id) }

  for (const [name, value] of Object.entries(source)) {
    if (name === 'id' || name === 'i18n') continue
    row[apiToUiEntity(unit, name)] = value as never
  }

  if (source.i18n) {
    const i18n: Record<string, Record<string, string>> = {}

    // page 的清單端點回的是**陣列** `[{ lang, slug, seoTitle, … }]`，不是以語系為鍵的物件。
    // 直接 Object.entries 會得到 i18n["0"]／i18n["1"]，中/英欄與完整度檢查就全錯了。
    const byLang = Array.isArray(source.i18n)
      ? Object.fromEntries(
          (source.i18n as Array<Record<string, unknown>>).map((x) => [String(x.lang), x]),
        )
      : source.i18n

    for (const [lang, fields] of Object.entries(byLang)) {
      // 分類的 i18n 只有一個名稱欄位，API 直接回 `{ zh: "最新消息" }`；
      // 其餘單元回的是欄位物件。UI 兩者都當成 `i18n[lang][key]` 讀。
      i18n[lang] =
        typeof fields === 'string'
          ? { name: fields }
          : Object.fromEntries(
              Object.entries(fields).map(([name, value]) => [apiToUiI18n(unit, name), String(value ?? '')]),
            )
    }

    row.i18n = i18n as Row['i18n']
  }

  // supplier-download 的「PDF · 2.4 MB」是顯示用字串，DB 存的是 fileExt 與 fileSizeBytes
  if (unit === 'supplier-download' && source.fileExt) {
    const mb = Number(source.fileSizeBytes ?? 0) / (1024 * 1024)
    row.fileMeta = `${String(source.fileExt).toUpperCase()} · ${mb.toFixed(1)} MB`
  }

  // quote 的「已回覆」是 switch，DB 存的是 repliedAt 有沒有值
  if (unit === 'quote') row.replied = Boolean(source.repliedAt)

  // news 的標籤：API 回整數 Id，UI 的 id 一律字串（見檔頭 toApiId 的說明）
  if (unit === 'news' && Array.isArray(source.tags)) row.tags = source.tags.map(String)

  return row
}

/** UI 的 Row → API 的請求內容（反向改名、丟掉存不進去的欄位）。 */
function toPayload(unit: string, row: Row): Record<string, unknown> {
  const payload: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(row)) {
    if (key === 'id' || key === 'i18n') continue

    // 已知缺口：UI 有這個欄位但 schema 沒有對應的欄（見 mapping.ts）
    if (isUnsupported(unit, key)) continue

    // 顯示用的衍生欄位不回寫
    if (unit === 'supplier-download' && key === 'fileMeta') continue
    if (unit === 'quote' && key === 'replied') continue

    payload[uiToApiEntity(unit, key)] = value
  }

  // news 的標籤送整數陣列——後端拿它直接比對 Tag.Id（見 AdminNewsHandler.SaveRelationsAsync）
  if (unit === 'news' && Array.isArray(row.tags)) {
    payload.tags = (row.tags as unknown[]).map(Number).filter((n) => Number.isInteger(n) && n > 0)
  }

  // 分類與標籤的 API 要的是 `i18n: { zh: "名稱" }`，不是欄位物件
  if ((unit === 'category' || unit === 'tag') && row.i18n) {
    payload.i18n = Object.fromEntries(
      Object.entries(row.i18n).map(([lang, fields]) => [lang, String((fields as Record<string, string>).name ?? '')]),
    )
    return payload
  }

  if (row.i18n) {
    const i18n: Record<string, Record<string, unknown>> = {}
    for (const [lang, fields] of Object.entries(row.i18n)) {
      const mapped: Record<string, unknown> = {}
      for (const [key, value] of Object.entries(fields)) {
        if (isUnsupported(unit, key)) continue
        mapped[uiToApiI18n(unit, key)] = value
      }
      i18n[lang] = mapped
    }
    payload.i18n = i18n
  }

  return payload
}

type PagedResponse = { items: ApiRow[]; totalCount: number }

/**
 * 有些單元的清單不分頁，直接回陣列（category／setting／page／admin——它們的筆數固定或很少）。
 * 兩種形狀都接，呼叫端不必知道差別。
 */
function unwrap(data: PagedResponse | ApiRow[]): { items: ApiRow[]; total: number } {
  return Array.isArray(data)
    ? { items: data, total: data.length }
    : { items: data.items ?? [], total: data.totalCount ?? 0 }
}

export async function list(unit: string, q: ListQuery = {}): Promise<ListResult> {
  const params = new URLSearchParams()
  params.set('page', String(q.page ?? 1))
  params.set('pageSize', String(q.pageSize ?? 20))
  if (q.categoryId) params.set('categoryId', q.categoryId)
  if (q.status && q.status !== 'all') params.set('status', q.status)
  // 搜尋交給後端（04-api §3.4 的 keyword）：清單是分頁的，在前端過濾只會搜到當頁那 20 筆
  if (q.keyword) params.set('keyword', q.keyword)

  const data = unwrap(await api.get<PagedResponse | ApiRow[]>(`/admin/${pathOf(unit)}?${params}`))
  const rows = data.items.map((r) => toRow(unit, r))

  return { rows, total: data.total }
}

/** 不分頁的整份資料（拖曳排序與儀表板統計用）。 */
export async function listAll(unit: string): Promise<Row[]> {
  const data = unwrap(await api.get<PagedResponse | ApiRow[]>(`/admin/${pathOf(unit)}?page=1&pageSize=100`))
  const rows = data.items.map((r) => toRow(unit, r))

  if (unit === 'category') cacheCategoryUsage(data.items)

  return rows.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
}

export async function get(unit: string, id: string): Promise<Row | undefined> {
  try {
    const data = await api.get<ApiRow>(`/admin/${pathOf(unit)}/${toApiId(id)}`)

    // 報價的單筆端點回的是 `{ quote, attachments }`（04-api §3.4），不是平的一列。
    // 照一般路徑丟給 toRow 會得到 id 為 "undefined"、欄位全空的一列——
    // 詳細頁看起來就像資料不見了。這裡先攤平再轉。
    if (unit === 'quote' && data.quote) {
      const row = toRow(unit, data.quote as ApiRow)
      row.attachments = (data.attachments as ApiAttachment[] | undefined ?? []).map((a) => ({
        id: String(a.id),
        name: a.originalName,
        sizeBytes: Number(a.sizeBytes ?? 0),
      }))
      return row
    }

    // 固定頁的單筆端點回的是 `{ item, i18n }`（AdminPageHandler.GetByKeyAsync），
    // 也不是平的一列。與上面的報價同一種狀況：不攤平的話整頁欄位會是空的。
    if (unit === 'page' && data.item) {
      return toRow(unit, { ...(data.item as ApiRow), i18n: data.i18n as ApiRow['i18n'] })
    }

    return toRow(unit, data)
  } catch {
    return undefined
  }
}

/**
 * 把一支回檔案的端點存成本機檔案。
 *
 * 這些端點都要帶 JWT，所以不能用 `<a href>` 直接連——先 fetch 回來
 * （http.ts 對非 JSON 的回應會把 Response 原樣交回），再用 object URL 觸發下載。
 */
async function saveAs(path: string, name: string): Promise<void> {
  const res = await api.get<Response>(path)
  const url = URL.createObjectURL(await res.blob())

  try {
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()
  } finally {
    // 立刻 revoke 會讓部分瀏覽器來不及取檔，隔一拍再放掉
    setTimeout(() => URL.revokeObjectURL(url), 10_000)
  }
}

/**
 * 下載報價附件（`quote.download`，僅超管）。
 * 後端一律以 `application/octet-stream` 送出，瀏覽器不會直接開啟這些檔案。
 */
export function downloadQuoteAttachment(quoteId: string, attachmentId: string, name: string): Promise<void> {
  return saveAs(`/admin/quote/${toApiId(quoteId)}/attachments/${attachmentId}`, name)
}

/** 匯出報價 CSV（`quote.export`，僅超管）。檔案帶 BOM，Excel 開中文不會亂碼。 */
export function exportQuotesCsv(): Promise<void> {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  return saveAs('/admin/quote/export', `quotes-${today}.csv`)
}

/** 匯出 301 對照 CSV（`redirect.export`）。內容遷移時要跟舊站清單在試算表裡比對。 */
export function exportRedirectsCsv(): Promise<void> {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  return saveAs('/admin/redirect/export', `redirects-${today}.csv`)
}

/**
 * 匯入 301 對照 CSV（`redirect.export`，與匯出同一個權限）。
 *
 * 後端以 `fromPath` 為鍵：已存在的更新、沒有的新增，所以**重跑同一份檔案不會產生重複**，
 * 客戶可以改完試算表再整份丟一次。回傳的三個數字直接顯示給操作者，
 * 因為被跳過的列（欄位不足、狀態碼不合法）不會有其他提示。
 */
export function importRedirectsCsv(file: File): Promise<{ created: number; updated: number; skipped: number }> {
  const form = new FormData()
  form.append('file', file)
  return api.upload('/admin/redirect/import', form)
}

export async function save(unit: string, row: Row): Promise<Row> {
  await api.put(`/admin/${pathOf(unit)}/${toApiId(row.id)}`, toPayload(unit, row))
  return row
}

export async function create(unit: string, row: Omit<Row, 'id'>): Promise<Row> {
  const created = await api.post<{ id: number }>(`/admin/${pathOf(unit)}`, toPayload(unit, row as Row))
  return { ...row, id: String(created.id) } as Row
}

/** docs §5.7：一律軟刪。後端的 DELETE 本來就是軟刪（`Remove()` 被改寫）。 */
export async function softDelete(unit: string, ids: string[]): Promise<void> {
  for (const id of ids) await api.delete(`/admin/${pathOf(unit)}/${toApiId(id)}`)
}

export async function setPublished(unit: string, ids: string[], published: boolean): Promise<void> {
  // 後端會在上架前檢查兩語系齊備，缺則 409 —— 錯誤往上拋讓畫面顯示原因
  for (const id of ids) {
    await api.patch(`/admin/${pathOf(unit)}/${toApiId(id)}/publish`, { isPublished: published })
  }
}

export async function reorder(unit: string, orderedIds: string[]): Promise<void> {
  await api.put(
    `/admin/${pathOf(unit)}/sort`,
    orderedIds.map((id, i) => ({ id: Number(id), sortOrder: (i + 1) * 10 })),
  )
}

/** 子清單（目前只有 solution 的品項卡）。 */
export async function listChildren(unit: string, parentId: string): Promise<Row[]> {
  const rows = await listAll(unit === 'solution' ? 'solution-item' : unit)
  return rows.filter((r) => String(r.solutionId ?? r.parentId ?? '') === parentId)
}

// ── 21 setting ────────────────────────────────────────────────────────────
type ApiSetting = { settingKey: string; isLocalized: boolean; valueZh: string | null; valueEn: string | null }

export async function getSettings(): Promise<Record<string, string | { zh: string; en: string }>> {
  const rows = await api.get<ApiSetting[]>('/admin/setting')
  const out: Record<string, string | { zh: string; en: string }> = {}

  for (const r of rows) {
    out[r.settingKey] = r.isLocalized
      ? { zh: r.valueZh ?? '', en: r.valueEn ?? '' }
      : (r.valueZh ?? '')
  }

  return out
}

export async function saveSettings(next: Record<string, string | { zh: string; en: string }>) {
  // 整批送出：後台設定頁是一次存整張表單，逐筆 PUT 會留下半套設定
  const payload = Object.entries(next).map(([settingKey, value]) =>
    typeof value === 'string'
      ? { settingKey, valueZh: value, valueEn: value }
      : { settingKey, valueZh: value.zh, valueEn: value.en },
  )

  await api.put('/admin/setting', payload)
}

// ── 22 category ───────────────────────────────────────────────────────────
/**
 * 分類引用筆數。
 *
 * UI 是在 render 當下同步取這個數字（刪除前顯示前台影響，docs §5.7），
 * 所以不能是 async。改由清單回應一併帶回 `usageCount`，這裡只讀快取。
 */
const usageCache = new Map<string, number>()

function cacheCategoryUsage(items: ApiRow[]) {
  usageCache.clear()
  for (const item of items) usageCache.set(String(item.id), Number(item.usageCount ?? 0))
}

export function categoryUsage(categoryId: string): number {
  return usageCache.get(categoryId) ?? 0
}

/** mock 專用的「還原種子」；接了 API 之後沒有這個概念。 */
export function resetStore() {
  /* no-op */
}

// ── 23 admin：管理員帳號與角色 ────────────────────────────────────────────
/**
 * 這個單元不走上面那組泛用的 list/create/save —— 它的形狀跟內容單元不一樣：
 * 沒有 i18n、識別是帳號、新增時後端可能回一組初始密碼（沒填通知信箱時），
 * 而角色清單是另一支端點。硬塞進泛用路徑只會讓 mapping.ts 多一堆特例。
 */
export type AdminAccount = {
  id: string
  username: string
  email: string | null
  displayName: string
  roleId: number
  roleCode: string
  isActive: boolean
  lastLoginAt: string | null
  mustChangePassword: boolean
}

export type AdminRole = { id: number; code: string; name: string; isSystem: boolean; permissions: string[] }

/** 新增：密碼由後端產生，不接受指定（docs/10 §7.4）。 */
export type AdminDraft = { username: string; displayName: string; email?: string; roleId: number }

/** 編輯：帳號建立後唯讀，只送有改的欄位。 */
export type AdminPatch = { displayName?: string; email?: string | null; roleId?: number; isActive?: boolean }

type ApiAdminAccount = Omit<AdminAccount, 'id'> & { id: number }

export async function listAdmins(keyword = ''): Promise<AdminAccount[]> {
  const qs = keyword.trim() ? `?keyword=${encodeURIComponent(keyword.trim())}` : ''
  const rows = await api.get<ApiAdminAccount[]>(`/admin/admin${qs}`)
  return rows.map((r) => ({ ...r, id: String(r.id), email: r.email ?? null, lastLoginAt: r.lastLoginAt ?? null }))
}

export function listRoles(): Promise<AdminRole[]> {
  return api.get<AdminRole[]>('/admin/admin/roles')
}

/**
 * 建立管理員。`initialPassword` 只在**沒填通知信箱**時才有值——
 * 有信箱時初始密碼直接寄出、不離開伺服器，畫面上就不該顯示。
 */
export async function createAdmin(draft: AdminDraft): Promise<{ id: string; initialPassword: string | null }> {
  const created = await api.post<{ id: number; initialPassword: string | null }>('/admin/admin', draft)
  return { id: String(created.id), initialPassword: created.initialPassword ?? null }
}

export async function updateAdmin(id: string, patch: AdminPatch): Promise<void> {
  await api.put(`/admin/admin/${id}`, patch)
}

export async function deleteAdmin(id: string): Promise<void> {
  await api.delete(`/admin/admin/${id}`)
}
