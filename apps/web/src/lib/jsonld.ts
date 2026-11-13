import { BREADCRUMBS } from './breadcrumbs'
import { htmlLang, localeUrl, siteUrl, type Locale } from './i18n'
import { mediaUrl } from './media'

/**
 * 結構化資料（JSON-LD）。
 *
 * 只發**畫面上真的有、且我們有依據的事實**：公司資訊來自 mockup 與客戶提供的台南廠址，
 * 麵包屑來自 mockup 的 `.crumb`（`lib/breadcrumbs.ts`），消息來自 CMS。
 * Google 對「結構化資料與可見內容不符」會直接判違規，所以這裡不編任何東西。
 *
 * 沒有發的：**Product／Offer**——方案頁沒有價格、庫存、評價，發了只會拿到一堆 Search Console 警告。
 *
 * `FAQPage` 有發（2026-10-25）：Google 2023 年起只對政府與醫療網站顯示 FAQ 複合結果，
 * 但客戶 SEO 檢核表把它列為 P0、`/faq` 也確實有可見問答，而且生成式引擎讀得到（06-geo）。
 */

const ORG_ID = `${siteUrl}/#organization`
const WEBSITE_ID = `${siteUrl}/#website`

/** JSON-LD 的網址一律要絕對路徑；沒設 MEDIA_BASE 時 `mediaUrl()` 回的是站內相對路徑 */
const absolute = (url: string) => (url.startsWith('/') ? siteUrl + url : url)

/**
 * 公司資訊。
 *
 * - 中文名 `南台彩藝` 取自客戶現有官網（nti-printing.com 的 `<title>`），不是我們編的；
 *   法定全名 `南台彩藝股份有限公司` 見客戶自己的建置時程表抬頭（`reference/網站建置時程.html`）。
 *   **這裡是公司中文名的權威**——網站設定的 `company.name`（zh）由 `build-seed.mjs` 讀這一筆，
 *   不另抄一份
 * - 地址與電話＝客戶 2026-09-06 提供的台南廠址，與 contact 頁一致
 * - 創立年份取自 mockup 的「Founded in 1968／Since 1968」（客戶已確認的版本）；
 *   舊站 `/home/vision/` 寫的是 1970，兩者不一致時以 mockup 為準
 */
const ADDRESS: Record<Locale, Record<string, string>> = {
  en: {
    streetAddress: 'No. 29, Gongye 6th Rd.',
    addressLocality: 'Annan Dist.',
    addressRegion: 'Tainan City',
    postalCode: '709',
    addressCountry: 'TW',
  },
  zh: {
    streetAddress: '工業六路29號',
    addressLocality: '安南區',
    addressRegion: '臺南市',
    postalCode: '709',
    addressCountry: 'TW',
  },
}

/**
 * 後台「網站設定」（單元 21）的值，`getSettingMap()` 的回傳：
 * `null`／`undefined`＝沒接 CMS（用下面寫死的預設）；物件＝接上了，缺的 key 是客戶清空的 → 那個屬性不發。
 * 結構化資料必須跟畫面同一份來源：客戶在後台改了電話，頁尾與聯絡頁會變，這裡也要跟著變
 * （2026-11-13 稽核 A2；在那之前這裡全是寫死的）。
 */
type Settings = Record<string, string> | null | undefined

/** 與種子（`db/content/220_site_setting.sql`）相同的預設值；設定還是這個值時沿用上面拆好欄位的 ADDRESS */
const DEFAULT_ADDRESS: Record<Locale, string> = {
  en: 'No. 29, Gongye 6th Rd., Annan Dist., Tainan City 709, Taiwan',
  zh: '709 臺南市安南區媽祖宮里工業六路29號',
}
const squash = (s: string) => s.replace(/\s+/g, ' ').trim()

/** `+886 6 261 1358` → `+886-6-261-1358`（schema.org 建議的寫法；預設值轉出來與原本寫死的逐字相同） */
function telephone(settings: Settings): string | undefined {
  if (!settings) return '+886-6-261-1358'
  const phone = settings['company.phone']
  return phone ? squash(phone).replace(/ /g, '-') : undefined
}

const email = (settings: Settings) => (settings ? settings['company.email'] : 'service@nti-printing.com')

/** 地址是否仍是預設的台南廠址（是的話才敢用拆好欄位的 ADDRESS 與寫死的地圖連結） */
const isDefaultAddress = (locale: Locale, settings: Settings) =>
  !settings || squash(settings['company.address'] ?? '') === DEFAULT_ADDRESS[locale]

/**
 * 地址。後台只有一個自由文字欄位，改過之後我們拆不回 街／區／市／郵遞區號，
 * 所以整段放進 `streetAddress`（Google 接受），不猜欄位。清空了就不發。
 */
function postalAddress(locale: Locale, settings: Settings) {
  if (isDefaultAddress(locale, settings)) return { '@type': 'PostalAddress', ...ADDRESS[locale] }
  const address = settings?.['company.address']
  return address ? { '@type': 'PostalAddress', streetAddress: squash(address), addressCountry: 'TW' } : undefined
}

/** 社群連結＝後台填了網址的那幾個（與頁尾圖示同一份）；沒接 CMS 時是客戶的 Facebook 粉專 */
function sameAs(settings: Settings): string[] | undefined {
  if (!settings) return ['https://www.facebook.com/printingfarm']
  const links = ['social.facebook', 'social.instagram', 'social.youtube', 'social.linkedin']
    .map((k) => settings[k])
    .filter(Boolean)
  return links.length ? links : undefined
}

/**
 * 營業時間。後台是自由文字（`Mon–Fri 08:30–17:30 (GMT+8)`／`週一至週五 08:30–17:30（GMT+8）`），
 * 只有看得懂「週一到週五＋一組起迄時間」才發；看不懂就不發——寧缺勿編。
 */
function openingHours(settings: Settings) {
  const text = settings ? settings['company.hours'] : 'Mon–Fri 08:30–17:30'
  if (!text) return undefined
  const time = /(\d{1,2}):(\d{2})\s*[–—\-~～至到]\s*(\d{1,2}):(\d{2})/.exec(text)
  const weekdays = /mon\w*\s*(?:[–—\-~]|to)\s*fri|[週周]一\s*[至到~～–—\-]\s*[週周]五|星期一\s*[至到~～–—\-]\s*星期五/i.test(text)
  if (!time || !weekdays) return undefined
  const hhmm = (h: string, m: string) => `${h.padStart(2, '0')}:${m}`
  return [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: hhmm(time[1], time[2]),
      closes: hhmm(time[3], time[4]),
    },
  ]
}

export function organization(locale: Locale, settings?: Settings) {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: 'NTI Printing',
    legalName: '南台彩藝股份有限公司',
    alternateName: '南台彩藝',
    url: localeUrl(locale, '/'),
    logo: absolute(mediaUrl('/assets/logo.svg')),
    telephone: telephone(settings),
    email: email(settings),
    foundingDate: '1968',
    address: postalAddress(locale, settings),
    sameAs: sameAs(settings),
  }
}

export function website(locale: Locale) {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: localeUrl(locale, '/'),
    name: 'NTI Printing',
    inLanguage: htmlLang[locale],
    publisher: { '@id': ORG_ID },
  }
}

/**
 * 實體據點（`LocalBusiness`）——**只發給畫面上同時有地址與地圖的頁**，目前只有 `/contact`
 * （facility-tour／blog／differences 的 iframe 是 YouTube，不是地圖）。
 * 全站都帶地址的是 `Organization`；據點的營業時間、地圖是聯絡頁才有的可見內容。
 *
 * 地址、電話與 `Organization` 同一份來源；營業時間＝聯絡頁的「Mon–Fri 08:30–17:30 (GMT+8)」。
 * 不給 `geo`：我們手上沒有客戶確認過的經緯度，寧缺勿編。
 */
export const LOCAL_BUSINESS_PATHS = new Set(['/contact'])

const MAP_URL =
  'https://www.google.com/maps?q=No.+29,+Gongye+6th+Rd.,+Annan+Dist.,+Tainan+City+709,+Taiwan'

export function localBusiness(locale: Locale, settings?: Settings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteUrl}/#tainan-plant`,
    name: locale === 'zh' ? '南台彩藝' : 'NTI Printing',
    url: localeUrl(locale, '/contact'),
    image: absolute(mediaUrl('/assets/logo.svg')),
    telephone: telephone(settings),
    email: email(settings),
    address: postalAddress(locale, settings),
    // 地圖連結是照預設廠址寫的；客戶改了地址就不發，免得指到舊地點
    hasMap: isDefaultAddress(locale, settings) ? MAP_URL : undefined,
    openingHoursSpecification: openingHours(settings),
    parentOrganization: { '@id': ORG_ID },
  }
}

/** 全站共用的那兩個節點，包成一張 graph 一次輸出 */
export const siteGraph = (locale: Locale, settings?: Settings) => ({
  '@context': 'https://schema.org',
  '@graph': [organization(locale, settings), website(locale)],
})

type CredentialInput = {
  name: string
  description: string | null
  certificateNo: string | null
  certifiedDate: string | null
}

/**
 * 認證頁的 `hasCredential`：以同一個 `@id` 補在全站的 Organization 節點上（Google 會合併同 id 的節點）。
 * 只列有證號或取得日期的那幾項——畫面上也只有它們會出現說明文字，結構化資料不能多於畫面。
 */
export function organizationCredentials(items: CredentialInput[]) {
  const withData = items.filter((c) => c.certificateNo || c.certifiedDate)
  if (!withData.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    hasCredential: withData.map((c) => ({
      '@type': 'EducationalOccupationalCredential',
      name: c.name,
      ...(c.description ? { description: c.description } : {}),
      ...(c.certificateNo ? { identifier: c.certificateNo } : {}),
      ...(c.certifiedDate ? { dateCreated: c.certifiedDate } : {}),
    })),
  }
}

type CrumbInput = { name: string; path?: string }

export function breadcrumbList(locale: Locale, trail: CrumbInput[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      // 最後一層是當前頁，依規範不給 item
      ...(c.path ? { item: localeUrl(locale, c.path) } : {}),
    })),
  }
}

/** 靜態頁的麵包屑：查產生出來的對照表，沒有就回 null（該頁畫面上也沒有麵包屑） */
export function staticBreadcrumbList(locale: Locale, path: string) {
  const trail = BREADCRUMBS[path]
  if (!trail) return null
  return breadcrumbList(
    locale,
    trail.map((c) => ({ name: locale === 'zh' ? c.zh : c.en, path: c.path })),
  )
}

export function newsArticle(
  locale: Locale,
  article: {
    title: string
    summary?: string | null
    publishDate: string
    categoryName: string
    image: string
    url: string
  },
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    ...(article.summary ? { description: article.summary } : {}),
    datePublished: article.publishDate,
    articleSection: article.categoryName,
    inLanguage: htmlLang[locale],
    ...(article.image ? { image: [absolute(article.image)] } : {}),
    mainEntityOfPage: article.url,
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
  }
}

/**
 * `/faq` 的問答。答案原樣給後台富文本的 HTML——Google 允許 `p`／`ul`／`a`／`strong` 等少數標籤，
 * 與畫面上 `<details>` 裡渲染的是同一份。
 */
export function faqPage(items: { question: string; answerHtml: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answerHtml },
    })),
  }
}

/**
 * 頁面上嵌入播放的 YouTube 影片（只算 `<iframe>`；連去 YouTube 的縮圖卡不算——那支影片不在本頁播）。
 *
 * `uploadDate`／`duration`／預設的名稱與說明來自 YouTube 觀看頁（`lib/youtube.ts`）；
 * `name`／`description`／`thumbnailUrl` 有傳就用傳進來的（Vlog 的標題、後台換過的縮圖是畫面上那份）。
 * 不給 `inLanguage`：英文頁也可能嵌中文影片，頁面語系不等於影片語系。
 */
export function videoObject(video: {
  id: string
  uploadDate: string
  name: string
  description?: string | null
  duration?: string | null
  thumbnailUrl?: string | null
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.name,
    ...(video.description ? { description: video.description } : {}),
    thumbnailUrl: [absolute(video.thumbnailUrl ?? `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`)],
    uploadDate: video.uploadDate,
    ...(video.duration ? { duration: video.duration } : {}),
    embedUrl: `https://www.youtube.com/embed/${video.id}`,
    contentUrl: `https://www.youtube.com/watch?v=${video.id}`,
  }
}
