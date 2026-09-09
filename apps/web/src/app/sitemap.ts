import type { MetadataRoute } from 'next'
import { getNews, getTags } from '@/lib/api'
import { locales, siteUrl, type Locale } from '@/lib/i18n'
import { ROUTES } from '@/lib/routes'

/**
 * sitemap.xml
 *
 * 每個網址一列、兩個語系各一列，並用 `alternates.languages` 帶出 hreflang——
 * 與各頁 `<head>` 的 hreflang 同一組值（`lib/i18n.ts` 的 `pageMetadata`），
 * 兩邊不一致的話 Google 會兩邊都不信。
 *
 * - 靜態路由來自 `lib/routes.ts`（由 mockup 產生，44 條）
 * - CMS 的消息詳細頁在有設 `NEXT_PUBLIC_API_BASE` 時一併展開；沒設就只有靜態路由
 *   （`/news/{slug}` 那條路由此時本來就會 404，列進來只會製造無效網址）
 *
 * 刻意不寫 `changeFrequency` 與 `priority`：Google 明說兩者一律忽略，
 * 留著只會讓人以為改了有效果。`lastModified` 只給真的有日期的消息。
 *
 * ⚠ 網址前綴吃 `NEXT_PUBLIC_SITE_URL`，是 build 當下內嵌的。上線當天翻
 * `SITE_URL` 與 `ALLOW_INDEXING` 兩個 variable 之後要重新 build 才會生效（STATUS §七）。
 */
const langKey = (locale: Locale) => (locale === 'zh' ? 'zh-Hant' : 'en')

const url = (locale: Locale, path: string) =>
  `${siteUrl}/${locale}${path === '/' ? '' : path}`

/** 一條路由的雙語 hreflang（含 x-default，與 `<head>` 一致指向英文） */
const languages = (path: string) => ({
  ...Object.fromEntries(locales.map((l) => [langKey(l), url(l, path)])),
  'x-default': url('en', path),
})

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  for (const path of ROUTES) {
    for (const locale of locales) {
      entries.push({ url: url(locale, path), alternates: { languages: languages(path) } })
    }
  }

  /*
   * CMS 消息：slug 是可翻譯欄位，中英可能不同，所以逐語系取自己的清單，
   * 再用 Id 把同一篇的兩個語系配對起來（清單端點沒有 hreflang 欄位，只有詳細頁有）。
   * 缺語系不 fallback（docs/08 §2.5）——只有英文的消息就只列英文那一條，
   * 也不會被硬塞一個指向 /zh 的 hreflang。
   */
  const news = Object.fromEntries(
    await Promise.all(locales.map(async (l) => [l, (await getNews(l)) ?? []] as const)),
  ) as Record<Locale, Awaited<ReturnType<typeof getNews>> & object>

  const slugById = new Map<number, Partial<Record<Locale, string>>>()
  for (const locale of locales) {
    for (const item of news[locale]) {
      slugById.set(item.id, { ...slugById.get(item.id), [locale]: item.slug })
    }
  }

  for (const locale of locales) {
    for (const item of news[locale]) {
      const siblings = slugById.get(item.id) ?? {}
      const languages = Object.fromEntries(
        locales
          .filter((l) => siblings[l])
          .map((l) => [langKey(l), url(l, `/news/${siblings[l]}`)]),
      )
      entries.push({
        url: url(locale, `/news/${item.slug}`),
        lastModified: new Date(item.publishDate),
        alternates: {
          languages: siblings.en ? { ...languages, 'x-default': url('en', `/news/${siblings.en}`) } : languages,
        },
      })
    }
  }

  /*
   * 標籤封存頁。後端只回有已上架消息的標籤（見 TagReadService），所以這裡不會
   * 產生空頁面的網址——sitemap 裡出現一堆 thin content 反而會拖累整站的評估。
   *
   * slug 不分語系，中英是同一個值，hreflang 因此是恆等式（與消息詳細頁不同，
   * 那邊的 slug 可翻譯、要用 Id 配對）。
   */
  const tags = (await getTags('en')) ?? []
  for (const tag of tags) {
    for (const locale of locales) {
      entries.push({
        url: url(locale, `/news/tag/${tag.slug}`),
        alternates: { languages: languages(`/news/tag/${tag.slug}`) },
      })
    }
  }

  return entries
}
