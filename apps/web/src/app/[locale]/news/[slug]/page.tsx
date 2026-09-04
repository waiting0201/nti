import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { A } from '@/components/A'
import { cmsMedia, getNewsItem, hasApi } from '@/lib/api'
import { siteUrl, withLocale, type Locale } from '@/lib/i18n'

type Props = { params: Promise<{ locale: Locale; slug: string }> }

/**
 * CMS 的消息詳細頁。
 *
 * mockup 那 12 篇（`/news-*`）是設計稿附的示範文章，仍然保留——沒有 CMS 內容時
 * 列表會連到它們。後台建立的消息走這條路由，slug 由 `NewsI18n.Slug` 決定
 * （中英可以不同，docs/08 §2.5）。
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const item = await getNewsItem(locale, slug)
  if (!item) return {}

  const canonical = item.seo.canonicalUrl || `${siteUrl}/${locale}/news/${slug}`

  // hreflang 由同一篇的兩筆 i18n 推導（另一個語系的 slug 可能不同）
  const languages: Record<string, string> = {}
  for (const [lang, s] of Object.entries(item.seo.hreflang)) {
    languages[lang === 'zh' ? 'zh-Hant' : lang] = `${siteUrl}/${lang}/news/${s}`
  }

  return {
    title: item.seo.seoTitle || item.title,
    ...(item.seo.seoDescription || item.summary
      ? { description: item.seo.seoDescription || item.summary! }
      : {}),
    openGraph: {
      title: item.seo.ogTitle || item.title,
      ...(item.seo.ogDescription || item.summary
        ? { description: item.seo.ogDescription || item.summary! }
        : {}),
      url: canonical,
      images: [cmsMedia(item.seo.ogImagePath || item.coverImagePath)],
      type: 'article',
    },
    alternates: { canonical, languages },
  }
}

export default async function Page({ params }: Props) {
  const { locale, slug } = await params
  const l = withLocale(locale)

  // 缺語系不 fallback（docs/08 §2.5）：該語系沒有這篇就是 404，不會退回另一個語系
  const item = hasApi ? await getNewsItem(locale, slug) : null
  if (!item) notFound()

  return (
    <>
      <section className="section subhead"><div className="wrap">
        <div className="crumb reveal">
          <A href={l("/")}>Home</A><span>&rsaquo;</span>
          <A href={l("/insights")}>Insights</A><span>&rsaquo;</span>
          <A href={l("/news")}>Latest News</A><span>&rsaquo;</span>
          <b>{item.categoryName}</b>
        </div>
        <span className="news-meta reveal">
          <span className="cat">{item.categoryName}</span>
          <span className="date">{item.publishDate.slice(0, 10).replaceAll('-', '.')}</span>
        </span>
        <h1 className="sec-title reveal">{item.title}</h1>
        {item.summary && <div className="sec-sub reveal">{item.summary}</div>}
        <div className="artimg reveal mt-l">
          <img src={cmsMedia(item.coverImagePath)} alt={item.coverAlt} />
        </div>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        {/* 後台富文本編輯器產生的內容，不是使用者輸入 */}
        <div dangerouslySetInnerHTML={{ __html: item.bodyHtml }} />
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <p><A href={l("/news")} className="btn btn-out">&laquo; All news</A></p>
      </div></section>
    </>
  )
}
