import type { Metadata } from 'next'
import { cmsMedia, getPage } from './api'
import { tr } from './t'
import { mediaUrl } from './media'
import { PAGE_KEY_BY_PATH } from './pages'

export const locales = ['en', 'zh'] as const
export type Locale = (typeof locales)[number]

/** URL locale 段 → <html lang> / hreflang 值 */
export const htmlLang: Record<Locale, string> = { en: 'en', zh: 'zh-Hant' }

export function isLocale(v: string): v is Locale {
  return (locales as readonly string[]).includes(v)
}

/**
 * 不帶語系前綴的語系：中文在根目錄（`/contact`），英文在 `/en/contact`。
 *
 * 與舊站 WordPress 的結構一致（2026-10-06 客戶決定拿掉 `/zh`）。`app/[locale]` 的
 * 資料夾結構沒變——middleware 把無前綴的網址 rewrite 給 `[locale]=zh`，網址列不動；
 * 舊的 `/zh/*` 一律 301 回無前綴的網址。
 *
 * ⚠ 站內所有網址都要經過 `localePath()`，不要自己組 `/${locale}…`——
 * 那樣組出來的 `/zh/…` 會多吃一次 301。
 */
export const PREFIXLESS_LOCALE: Locale = 'zh'

/** 站內路徑（如 `/about-difference`、`/`）→ 該語系的網址路徑 */
export function localePath(locale: Locale, path: string): string {
  if (locale === PREFIXLESS_LOCALE) return path
  return path === '/' ? `/${locale}` : `/${locale}${path}`
}

/** 同上，但是絕對網址（canonical、hreflang、sitemap、JSON-LD 用） */
export function localeUrl(locale: Locale, path: string): string {
  return siteUrl + localePath(locale, path)
}

/** 把 mockup 的相對路徑（如 `/about-difference`）補上語系前綴 */
export function withLocale(locale: Locale) {
  return (path: string) => localePath(locale, path)
}

/** 從 pathname 取出語系與去掉語系後的路徑；沒有前綴的就是中文 */
export function splitLocale(pathname: string): { locale: Locale; path: string } {
  const [, first = '', ...rest] = pathname.split('/')
  if (isLocale(first)) return { locale: first, path: '/' + rest.join('/') }
  return { locale: PREFIXLESS_LOCALE, path: pathname }
}

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.nti-printing.com'

/**
 * 後台沒填 OG 圖時的預設分享圖（1200×630，`mockup/assets/og-default.jpg`）。
 *
 * 沒有這張的話，40 個固定頁分享到 LINE／Facebook／Slack 都是空白卡片——後台的
 * OG 欄位是選填的，編輯不會每頁都上傳。刻意用 JPG 而不是 WebP：部分社群平台的
 * 抓取器至今仍不吃 WebP 的 og:image。
 *
 * `mediaUrl()` 在未設 MEDIA_BASE 時回的是站內相對路徑，但 OG／Twitter 的圖片
 * 必須是絕對網址，所以這裡補上 `siteUrl`。
 */
const DEFAULT_OG_IMAGE = (() => {
  const url = mediaUrl('/assets/og-default.jpg')
  return url.startsWith('/') ? siteUrl + url : url
})()

/**
 * 各頁共用的 metadata 組裝：canonical + 雙語 hreflang。
 *
 * 接了 CMS（`NEXT_PUBLIC_API_BASE`）時，SEO 欄位改由後台的「固定頁」單元提供
 * （docs/08 決議 3：固定頁的內容寫死在前端，這裡只管 SEO）。
 * 後台沒填的欄位就沿用各頁寫死的值——編輯還沒填之前不該讓 title 變空的。
 *
 * ⚠ 這裡只動 `<head>`。版面驗收閘 `verify:markup` 比對的是
 * `</header>` 到 `<footer>` 之間的輸出，不受影響。
 */
export async function pageMetadata(
  locale: Locale,
  path: string,
  meta: { title: string; description?: string },
): Promise<Metadata> {
  const cms = await cmsSeo(locale, path)

  // 後台沒填就用各頁寫死的英文，並在 /zh 換成字典裡的中文（見 lib/t.tsx）
  const title       = cms?.seo.seoTitle       || tr(locale, meta.title)
  const description = cms?.seo.seoDescription || (meta.description && tr(locale, meta.description))
  const canonical   = cms?.seo.canonicalUrl   || localeUrl(locale, path)

  // OG 與 Twitter 兩組共用同一份標題／描述／圖，避免兩邊漂移
  const ogTitle = cms?.seo.ogTitle || title
  const ogDescription = cms?.seo.ogDescription || description
  const image = cms?.seo.ogImagePath ? cmsMedia(cms.seo.ogImagePath) : DEFAULT_OG_IMAGE

  return {
    title,
    ...(description ? { description } : {}),

    // 後台把某頁設成 noindex 時要真的生效（預留的 green-csr 就是靠這個擋住）
    ...(cms && !cms.isIndexable ? { robots: { index: false, follow: false } } : {}),

    openGraph: {
      title: ogTitle,
      ...(ogDescription ? { description: ogDescription } : {}),
      url: canonical,
      siteName: 'NTI Printing',
      locale: locale === 'zh' ? 'zh_TW' : 'en_US',
      type: 'website',
      images: [image],
    },

    // Twitter Cards（客戶 2026-09-08 SEO 會議的「開放圖譜標記與社交分享」）。
    // X 之外，LinkedIn 與部分聊天軟體在缺 og:image 時也會回頭讀這組。
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      ...(ogDescription ? { description: ogDescription } : {}),
      images: [image],
    },

    alternates: {
      canonical,
      languages: {
        en: localeUrl('en', path),
        'zh-Hant': localeUrl('zh', path),
        'x-default': localeUrl('en', path),
      },
    },
  }
}

/** 取這條路由對應的固定頁 SEO；沒有對應 pageKey 或 API 未設定時回 null。 */
async function cmsSeo(locale: Locale, path: string) {
  const pageKey = PAGE_KEY_BY_PATH[path]
  return pageKey ? await getPage(locale, pageKey) : null
}
