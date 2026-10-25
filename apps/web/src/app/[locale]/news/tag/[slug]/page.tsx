import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { A } from '@/components/A'
import { JsonLd } from '@/components/JsonLd'
import { NewsList, PageBanner } from '@/components/cms'
import { T, tr } from '@/lib/t'
import { bannerSrc, getNewsByTag, getPage, getTag, hasApi } from '@/lib/api'
import { breadcrumbList } from '@/lib/jsonld'
import { localeUrl, withLocale, type Locale } from '@/lib/i18n'

/**
 * 標籤封存頁 `/{語系}/news/tag/{slug}`。
 *
 * 為什麼要有這一頁：舊站 nti-printing.com 有 100 個 `/tag/*` 封存頁，內容遷移的
 * 決策 D4 是「全部保留標籤體系並逐一 301 對應」。沒有這頁的話那 100 條舊網址
 * 只能繼續轉回首頁 —— 那是 soft 404，累積的權重一點都傳不過去。
 *
 * ⚠ 空標籤直接 404，不做「目前沒有文章」的空頁面：後端的 `/tags/{slug}` 對
 * `NewsCount = 0` 的標籤就回 404（見 TagReadService），這裡照著走。一個標籤體系
 * 最容易搞砸的方式就是產出一百個沒有內容的封存頁，那在 Google 眼中是 thin content。
 *
 * slug 不分語系，所以 hreflang 是恆等式（中英同一個 slug），不必像消息詳細頁那樣配對。
 *
 * **`noindex, follow`**（2026-10-25）：標籤頁只是消息的另一種列表，內容全是別頁的摘要，
 * 收錄了只會跟 `/news` 與消息詳細頁搶同一批關鍵字。`follow` 保留——爬蟲仍會順著它走到各篇消息，
 * 舊站 `/tag/*` 301 過來的權重也還能經由這些連結傳下去。sitemap 因此不列標籤頁（見 `app/sitemap.ts`）。
 */
type Props = { params: Promise<{ locale: Locale; slug: string }> }

const canonicalOf = (locale: Locale, slug: string) => localeUrl(locale, `/news/tag/${slug}`)

/**
 * 標籤頁的 description。
 *
 * 標籤沒有自己的說明欄位（`TagI18n` 只有名稱），早期版本是固定句型＋標籤名，
 * 結果一百頁的開頭全是「NTI Printing 與「…」」——搜尋結果只看得到前段，等於每頁都一樣。
 * 所以**標籤名放最前面**，後面接該標籤底下最新幾篇的標題（API 已依發布日期新到舊排）：
 * 這是每頁真正不同的內容，也正是畫面上列出來的東西。
 *
 * 標題能塞幾篇看長度：Google 摘要約中文 80 字、英文 155 字元，至少放一篇。
 * 標籤頁 noindex 之後不會出現在搜尋結果，這段主要給分享卡（OG／Twitter）用。
 */
const DESC_MAX: Record<Locale, number> = { zh: 80, en: 155 }

function describeTag(locale: Locale, name: string, count: number, items: { title: string }[]) {
  const zh = locale === 'zh'
  const head = zh
    ? `${name}：NTI Printing 的 ${count} 則相關消息`
    : `${name}: ${count} ${count === 1 ? 'story' : 'stories'} from NTI Printing`
  const quote = (t: string) => (zh ? `「${t}」` : `“${t}”`)
  // 全部列得出來就不說「包括」（只有一篇時「1 則，包括…」讀起來很怪）
  const build = (titles: string[]) => {
    if (!titles.length) return `${head}${zh ? '。' : '.'}`
    const lead = titles.length < count ? (zh ? '，包括' : ', including ') : (zh ? '：' : ': ')
    return `${head}${lead}${titles.map(quote).join(zh ? '、' : ', ')}${zh ? '。' : '.'}`
  }

  const titles: string[] = []
  for (const { title } of items) {
    if (titles.length && build([...titles, title]).length > DESC_MAX[locale]) break
    titles.push(title)
  }
  return build(titles)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const tag = await getTag(locale, slug)
  if (!tag) return {}

  const canonical = canonicalOf(locale, slug)
  const title = `${tag.name} — ${tr(locale, 'News')} | NTI Printing`
  const description = describeTag(locale, tag.name, tag.newsCount, (await getNewsByTag(locale, slug)) ?? [])

  return {
    title,
    description,
    robots: { index: false, follow: true },
    openGraph: { title, description, url: canonical, siteName: 'NTI Printing', type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
    alternates: {
      canonical,
      languages: {
        en: canonicalOf('en', slug),
        'zh-Hant': canonicalOf('zh', slug),
        'x-default': canonicalOf('en', slug),
      },
    },
  }
}

export default async function Page({ params }: Props) {
  const { locale, slug } = await params
  const l = withLocale(locale)

  // 沒接 API 時這條路由本來就沒有資料可顯示（與 /news/{slug} 同一個處理）
  const tag = hasApi ? await getTag(locale, slug) : null
  if (!tag) notFound()

  // 頂部橫幅跟著 /news 列表頁（後台單元 15 的 news）走：那邊沒傳圖，這裡也不顯示
  const [news, newsPage] = await Promise.all([getNewsByTag(locale, slug), getPage(locale, 'news')])
  const items = news ?? []

  return (
    <T locale={locale}>
      <PageBanner src={bannerSrc(newsPage, '/assets/diff-grid.webp')} alt="NTI Printing news" />
      <section className="section">
        <div className="wrap">
          <div className="crumb reveal">
            <A href={l('/')}>Home</A> <span>/</span> <A href={l('/news')}>News</A> <span>/</span>{' '}
            <span>{tag.name}</span>
          </div>
          <h1 className="sec-title reveal">
            {tag.name} <span className="ti-slash">/</span>{' '}
            <span className="ti-alt">
              {tag.newsCount} {tag.newsCount === 1 ? 'story' : 'stories'}
            </span>
          </h1>
          <div className="sec-sub reveal">
            Everything we have published on {tag.name}. <A href={l('/news')}>Back to all news</A>
          </div>
          <NewsList items={items} locale={locale} />
        </div>
      </section>

      {/*
        麵包屑結構化資料。畫面上真的有 `.crumb`（就在上面），所以這條對得上可見內容 ——
        Google 對「結構化資料與畫面不符」是直接判違規的，見 lib/jsonld.ts 的檔頭。
      */}
      <JsonLd
        data={breadcrumbList(locale, [
          { name: tr(locale, 'Home'), path: '/' },
          { name: tr(locale, 'News'), path: '/news' },
          { name: tag.name },
        ])}
      />
    </T>
  )
}
