import type { Metadata } from 'next'

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

/** 各頁共用的 metadata 組裝：canonical + 雙語 hreflang */
export function pageMetadata(
  locale: Locale,
  path: string,
  meta: { title: string; description?: string },
): Metadata {
  const rel = path === '/' ? '' : path
  return {
    title: meta.title,
    ...(meta.description ? { description: meta.description } : {}),
    alternates: {
      canonical: `${siteUrl}/${locale}${rel}`,
      languages: {
        en: `${siteUrl}/en${rel}`,
        'zh-Hant': `${siteUrl}/zh${rel}`,
        'x-default': `${siteUrl}/en${rel}`,
      },
    },
  }
}
