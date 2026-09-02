/**
 * 後台的單元定義型別。
 *
 * docs/09-cms-admin.md 的決議 1：「一個前台內容區塊 = 一個後台單元」，
 * 所以每個單元用一份宣告描述欄位與行為，清單／編輯畫面由通用元件渲染。
 * 這不是 page-builder（決議 1 明文排除）—— 欄位是寫死在程式裡的，
 * 編輯者不能自己增減欄位，只能填內容。
 */

export type Locale = 'zh' | 'en'
export const LOCALES: Locale[] = ['zh', 'en']
export const LOCALE_LABEL: Record<Locale, string> = { zh: '中文', en: 'English' }

export type FieldType =
  | 'text'
  | 'textarea'
  | 'richtext'
  | 'image'
  | 'file'
  | 'select'
  | 'date'
  | 'switch'
  | 'readonly'
  | 'url'
  | 'youtube'
  | 'email-list'
  | 'embed'
  | 'number'

export type Field = {
  key: string
  label: string
  type: FieldType
  /** 中英各存一份（docs §5.2：右側中文／English 分頁） */
  i18n?: boolean
  required?: boolean
  /** 字數上限提示（docs §5.6 的 70／180 即時字數計） */
  max?: number
  /** 欄位旁的說明；上傳欄位一律逐字引用 docs §3 的權威文字 */
  hint?: string
  /** select 的選項；字串代表引用 category 的某個 CategoryType */
  options?: Array<{ value: string; label: string }>
  categoryType?: string
  /** 圖片欄位對應的 Alt 欄位 key（docs §3 共通規則：每個圖片欄位必附中英 Alt） */
  altKey?: string
  /** 放在編輯頁哪一側：語系中性欄位在左，文字欄位在右（docs §5.2） */
  side?: 'neutral' | 'locale'
  placeholder?: string
}

export type ListColumn = {
  key: string
  label: string
  /** thumb 會渲染成縮圖、status 渲染成上下架狀態、i18n 渲染成中/英完成度 badge */
  render?: 'text' | 'thumb' | 'status' | 'i18n' | 'date' | 'bool' | 'category'
  width?: string
}

export type UnitGroup = '儀表板' | '首頁' | '內容' | '供應商' | '頁面／SEO' | '表單' | '會員' | '系統'

export type Unit = {
  /** docs §2 的代號，同時是權限碼前綴 */
  code: string
  no: string
  title: string
  group: UnitGroup
  phase: 'P4' | 'P6' | 'P8'
  /** 前台對應位置，顯示在單元頁抬頭讓編輯者知道改的是哪裡 */
  frontend?: string
  /** 給編輯者看的操作說明（docs 各單元的「操作」段） */
  note?: string
  fields: Field[]
  columns: ListColumn[]
  /** 有 SortOrder，清單可拖曳排序（docs §5.1） */
  sortable?: boolean
  /** 上架開關 + 上下架時間（docs §5.4） */
  hasStatus?: boolean
  /** SEO 欄位組（docs §5.6），僅 page／news／solution */
  hasSeo?: boolean
  /** 固定筆數，不可新增／刪除（solution 4 筆、page 29 筆） */
  fixedRows?: boolean
  /** 唯讀資料，只能改狀態（quote／contact）或全唯讀（audit／dashboard） */
  readOnly?: 'status-only' | 'full'
  /** 自訂頁面（setting／category／admin／audit／dashboard 不走通用清單） */
  custom?: boolean
  /** 筆數建議提示，例如 banner 建議 3–5 張 */
  countHint?: { min?: number; max?: number; message: string }
  /** 子清單（solution 的品項卡） */
  child?: { title: string; fields: Field[]; columns: ListColumn[] }
}

/** docs §5.4：上架開關與時間組合出的四種顯示狀態 */
export type PublishState = '草稿' | '已排程' | '上架中' | '已下架'

export function publishState(row: {
  isPublished?: boolean
  publishAt?: string | null
  unpublishAt?: string | null
}): PublishState {
  const now = Date.now()
  if (!row.isPublished) return '草稿'
  if (row.publishAt && new Date(row.publishAt).getTime() > now) return '已排程'
  if (row.unpublishAt && new Date(row.unpublishAt).getTime() < now) return '已下架'
  return '上架中'
}
