import { BREADCRUMBS } from './breadcrumbs'
import { htmlLang, siteUrl, type Locale } from './i18n'
import { mediaUrl } from './media'

/**
 * 結構化資料（JSON-LD）。
 *
 * 只發**畫面上真的有、且我們有依據的事實**：公司資訊來自 mockup 與客戶提供的台南廠址，
 * 麵包屑來自 mockup 的 `.crumb`（`lib/breadcrumbs.ts`），消息來自 CMS。
 * Google 對「結構化資料與可見內容不符」會直接判違規，所以這裡不編任何東西。
 *
 * 沒有發的兩種：
 * - **FAQPage**：Google 2023 年起只對政府與醫療網站顯示 FAQ 複合結果，對本站無效益。
 * - **Product／Offer**：方案頁沒有價格、庫存、評價，發了只會拿到一堆 Search Console 警告。
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

export function organization(locale: Locale) {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: 'NTI Printing',
    legalName: '南台彩藝股份有限公司',
    alternateName: '南台彩藝',
    url: `${siteUrl}/${locale}`,
    logo: absolute(mediaUrl('/assets/logo.svg')),
    telephone: '+886-6-261-1358',
    email: 'service@nti-printing.com',
    foundingDate: '1968',
    address: { '@type': 'PostalAddress', ...ADDRESS[locale] },
    sameAs: ['https://www.facebook.com/printingfarm'],
  }
}

export function website(locale: Locale) {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${siteUrl}/${locale}`,
    name: 'NTI Printing',
    inLanguage: htmlLang[locale],
    publisher: { '@id': ORG_ID },
  }
}

/** 全站共用的那兩個節點，包成一張 graph 一次輸出 */
export const siteGraph = (locale: Locale) => ({
  '@context': 'https://schema.org',
  '@graph': [organization(locale), website(locale)],
})

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
      ...(c.path ? { item: `${siteUrl}/${locale}${c.path === '/' ? '' : c.path}` } : {}),
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
