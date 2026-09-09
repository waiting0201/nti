import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { A } from '@/components/A'
import { JsonLd } from '@/components/JsonLd'
import { NewsList } from '@/components/cms'
import { T, tr } from '@/lib/t'
import { getNewsByTag, getTag, hasApi } from '@/lib/api'
import { breadcrumbList } from '@/lib/jsonld'
import { siteUrl, withLocale, type Locale } from '@/lib/i18n'
import { mediaUrl } from '@/lib/media'

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
 */
type Props = { params: Promise<{ locale: Locale; slug: string }> }

const canonicalOf = (locale: Locale, slug: string) => `${siteUrl}/${locale}/news/tag/${slug}`

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const tag = await getTag(locale, slug)
  if (!tag) return {}

  const canonical = canonicalOf(locale, slug)
  const title = `${tag.name} — ${tr(locale, 'News')} | NTI Printing`
  const description =
    locale === 'zh'
      ? `NTI Printing 與「${tag.name}」相關的 ${tag.newsCount} 則消息：綠色印刷、永續包裝與工廠實務。`
      : `${tag.newsCount} stories from NTI Printing tagged ${tag.name} — green printing, sustainable packaging and plant practice.`

  return {
    title,
    description,
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

  const items = (await getNewsByTag(locale, slug)) ?? []

  return (
    <T locale={locale}>
      <section className="fac-banner">
        <img src={mediaUrl('/assets/diff-grid.webp')} alt="NTI Printing news" />
      </section>
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
