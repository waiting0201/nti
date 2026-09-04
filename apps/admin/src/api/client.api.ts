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

/** 後台路徑：子清單掛在 `/admin/solution/item`，其餘等於單元代號。 */
function pathOf(unit: string): string {
  return unit === 'solution-item' ? 'solution/item' : unit
}

/** API 的一列 → UI 的 Row（欄位改名、id 轉字串、組出 fileMeta 這類顯示欄位）。 */
function toRow(unit: string, source: ApiRow): Row {
  const row: Row = { id: String(source.id) }

  for (const [name, value] of Object.entries(source)) {
    if (name === 'id' || name === 'i18n') continue
    row[apiToUiEntity(unit, name)] = value as never
  }

  if (source.i18n) {
    const i18n: Record<string, Record<string, string>> = {}

    for (const [lang, fields] of Object.entries(source.i18n)) {
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

  // member 的「啟用」是 switch，DB 存的是三態 Status
  if (unit === 'member') row.isActive = source.status === 'Active'

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
    if (unit === 'member' && key === 'isActive') continue

    payload[uiToApiEntity(unit, key)] = value
  }

  // 分類的 API 要的是 `i18n: { zh: "名稱" }`，不是欄位物件
  if (unit === 'category' && row.i18n) {
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

  const data = unwrap(await api.get<PagedResponse | ApiRow[]>(`/admin/${pathOf(unit)}?${params}`))
  let rows = data.items.map((r) => toRow(unit, r))

  // 關鍵字目前在前端過濾：後端還沒有搜尋端點（04-api §3.4 沒有列），
  // 而清單已經分頁，跨頁搜尋要等後端補 keyword 參數才會準。
  if (q.keyword) {
    const needle = q.keyword.toLowerCase()
    rows = rows.filter((r) => JSON.stringify(r).toLowerCase().includes(needle))
  }

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
    return toRow(unit, await api.get<ApiRow>(`/admin/${pathOf(unit)}/${toApiId(id)}`))
  } catch {
    return undefined
  }
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
