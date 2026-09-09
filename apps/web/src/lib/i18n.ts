import type { Metadata } from 'next'
import { cmsMedia, getPage } from './api'
import { tr } from './t'
import { mediaUrl } from './media'
import { PAGE_KEY_BY_PATH } from './pages'

export const locales = ['en', 'zh'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

/** URL locale 段 → <html lang> / hreflang 值 */
export const htmlLang: Record<Locale, string> = { en: 'en', zh: 'zh-Hant' }

export function isLocale(v: string): v is Locale {
  return (locales as readonly string[]).includes(v)
}

/** 把 mockup 的相對路徑（如 `/about-difference`）補上語系前綴 */
export function withLocale(locale: Locale) {
  return (path: string) => (path === '/' ? `/${locale}` : `/${locale}${path}`)
}

/** 從 pathname 取出語系與去掉語系後的路徑 */
export function splitLocale(pathname: string): { locale: Locale; path: string } {
  const [, first = '', ...rest] = pathname.split('/')
  if (isLocale(first)) return { locale: first, path: '/' + rest.join('/') }
  return { locale: defaultLocale, path: pathname }
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
  const rel = path === '/' ? '' : path
  const cms = await cmsSeo(locale, path)

  // 後台沒填就用各頁寫死的英文，並在 /zh 換成字典裡的中文（見 lib/t.tsx）
  const title       = cms?.seo.seoTitle       || tr(locale, meta.title)
  const description = cms?.seo.seoDescription || (meta.description && tr(locale, meta.description))
  const canonical   = cms?.seo.canonicalUrl   || `${siteUrl}/${locale}${rel}`

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
        en: `${siteUrl}/en${rel}`,
        'zh-Hant': `${siteUrl}/zh${rel}`,
        'x-default': `${siteUrl}/en${rel}`,
      },
    },
  }
}

/** 取這條路由對應的固定頁 SEO；沒有對應 pageKey 或 API 未設定時回 null。 */
async function cmsSeo(locale: Locale, path: string) {
  const pageKey = PAGE_KEY_BY_PATH[path]
  return pageKey ? await getPage(locale, pageKey) : null
}
