/**
 * 後台欄位 ↔ API 欄位對照。
 *
 * 兩邊的命名各有各的權威來源，刻意不統一：
 *   - UI 的 key 對應 docs/09 §3 的欄位定義（`check:units` 驗的是那份）
 *   - API 的欄位名對應 docs/08 的資料表欄位
 * 統一成任一邊都會讓另一邊的驗收失去意義，所以把差異集中在這一張表。
 *
 * 只列**不同名**的；同名的不用寫（例如 `linkUrl`、`categoryId`、`title`）。
 */

/** UI 的 Row 形狀：語系中性欄位平鋪，文字欄位在 i18n 之下 */
export type UnitMap = {
  /** UI key → API 主表欄位 */
  entity?: Record<string, string>
  /** UI key → API i18n 欄位 */
  i18n?: Record<string, string>
  /**
   * UI 有、schema 沒有對應欄位的 key。
   * 明確列出來而不是靜默丟掉——寫入時會被忽略，這是已知缺口，不是 bug。
   */
  unsupported?: string[]
}

/** SEO 欄位組（UI 的 SEO_FIELDS ↔ i18n 的 SEO 欄位）。page／news／solution 共用。 */
const SEO_I18N = {
  metaDescription: 'seoDescription',
  canonical: 'canonicalUrl',
  // slug／seoTitle／ogTitle／ogDescription 同名
} as const

const SEO_ENTITY = { ogImage: 'ogImagePath' } as const

/**
 * ⚠ `ogImageAlt` 在 schema 裡沒有對應欄位。
 * docs/09 §3 要求「每個圖片欄位必附中英 Alt」，但 docs/08 的 *I18n 側表沒有給
 * OG 圖 alt 欄位。OG 圖是 meta 標籤（`og:image` 不吃 alt），所以 schema 這樣設計
 * 是合理的；缺口在 09 的通則過寬。這個欄位目前存不進去。
 */
const SEO_UNSUPPORTED = ['ogImageAlt']

export const UNIT_MAP: Record<string, UnitMap> = {
  'home-banner': {
    entity: { imageDesktop: 'imagePath', imageMobile: 'imagePathMobile', newWindow: 'openInNewTab' },
    i18n: { alt: 'imageAlt' },
  },

  solution: {
    entity: { cover: 'coverImagePath', ...SEO_ENTITY },
    i18n: { intro: 'introHtml', ...SEO_I18N },
    unsupported: SEO_UNSUPPORTED,
  },

  // solution 的品項卡（子清單）
  'solution-item': {
    entity: { image: 'imagePath' },
    i18n: { alt: 'imageAlt' },
  },

  project: {
    entity: { image: 'imagePath' },
    i18n: { alt: 'imageAlt', description: 'summary' },
  },

  news: {
    entity: { cover: 'coverImagePath', featured: 'isFeaturedHome', ...SEO_ENTITY },
    i18n: { body: 'bodyHtml', ...SEO_I18N },
    unsupported: SEO_UNSUPPORTED,
  },

  vlog: {
    entity: { thumbOverride: 'thumbOverridePath', isHero: 'isMainFeature' },
    // ⚠ VlogI18n 沒有縮圖 alt 欄位（docs/08 §4.6 只給 Title／Description）
    unsupported: ['thumbAlt'],
  },

  faq: {
    i18n: { answer: 'answerHtml' },
  },

  trend: {
    i18n: { body: 'bodyHtml' },
  },

  certification: {
    entity: { logo: 'logoPath' },
    i18n: { alt: 'logoAlt' },
  },

  client: {
    entity: { logo: 'logoPath' },   // 品牌名不翻譯，這個單元沒有 i18n 側表
  },

  facility: {
    entity: { image: 'imagePath' },
    i18n: { alt: 'imageAlt' },
  },

  job: {
    i18n: { body: 'descriptionHtml' },
  },

  'supplier-notice': {
    entity: { attachment: 'attachmentPath' },
    i18n: { body: 'bodyHtml' },
  },

  'supplier-spec': {},

  'supplier-download': {
    entity: { file: 'filePath' },
    i18n: { displayName: 'name' },
    // fileMeta 是「PDF · 2.4 MB」這種顯示字串，由 fileExt/fileSizeBytes 組出來（見 client）
    unsupported: ['fileMeta'],
  },

  page: {
    entity: { path: 'routeTemplate', ...SEO_ENTITY },
    i18n: { body: 'bodyHtml', ...SEO_I18N },
    unsupported: SEO_UNSUPPORTED,
  },

  redirect: {
    entity: { isEnabled: 'isActive' },
  },

  quote: {
    entity: { assignee: 'assigneeId' },
    // replied 是 switch，對應 repliedAt 有沒有值（見 client 的特例處理）
  },

  contact: {
    // ⚠ ContactMessage 沒有 AssigneeId 欄位（docs/08 §4.12 只有 QuoteRequest 有）
    unsupported: ['assignee'],
  },

  member: {
    // isActive 是 switch，對應 Status 是不是 'Active'（見 client）
    // ⚠ Member 沒有 InternalNote 欄位
    unsupported: ['internalNote'],
  },

  order: {
    entity: { productName: 'title', etaDate: 'expectedShipDate' },
    // memberEmail／quoteNo 是顯示用的關聯欄位，API 目前只回 memberId／quoteRequestId
    unsupported: ['memberEmail', 'quoteNo'],
  },
}

/** 反查表：API 欄位 → UI key */
function invert(map?: Record<string, string>): Record<string, string> {
  return Object.fromEntries(Object.entries(map ?? {}).map(([ui, api]) => [api, ui]))
}

export function apiToUiEntity(unit: string, name: string): string {
  return invert(UNIT_MAP[unit]?.entity)[name] ?? name
}

export function uiToApiEntity(unit: string, key: string): string {
  return UNIT_MAP[unit]?.entity?.[key] ?? key
}

export function apiToUiI18n(unit: string, name: string): string {
  return invert(UNIT_MAP[unit]?.i18n)[name] ?? name
}

export function uiToApiI18n(unit: string, key: string): string {
  return UNIT_MAP[unit]?.i18n?.[key] ?? key
}

export function isUnsupported(unit: string, key: string): boolean {
  return UNIT_MAP[unit]?.unsupported?.includes(key) ?? false
}
