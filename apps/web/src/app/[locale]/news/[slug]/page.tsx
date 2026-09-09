import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { A } from '@/components/A'
import { JsonLd } from '@/components/JsonLd'
import { cmsMedia, getNewsItem, hasApi } from '@/lib/api'
import { siteUrl, withLocale, type Locale } from '@/lib/i18n'
import { breadcrumbList, newsArticle } from '@/lib/jsonld'
import { tr } from '@/lib/t'

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

  // OG 與 Twitter 共用同一份，避免兩邊漂移。消息一定有封面圖，所以不需要預設圖 fallback
  const ogTitle = item.seo.ogTitle || item.title
  const ogDescription = item.seo.ogDescription || item.summary
  const image = cmsMedia(item.seo.ogImagePath || item.coverImagePath)

  return {
    title: item.seo.seoTitle || item.title,
    ...(item.seo.seoDescription || item.summary
      ? { description: item.seo.seoDescription || item.summary! }
      : {}),
    openGraph: {
      title: ogTitle,
      ...(ogDescription ? { description: ogDescription } : {}),
      url: canonical,
      siteName: 'NTI Printing',
      locale: locale === 'zh' ? 'zh_TW' : 'en_US',
      images: [image],
      type: 'article',
      publishedTime: item.publishDate,
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      ...(ogDescription ? { description: ogDescription } : {}),
      images: [image],
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

  // 這條路由是 CMS 專用的（mockup 沒有這一頁），不受版面驗收閘的節點比對限制，
  // 所以結構化資料就近放在頁面裡，資料與畫面同一份來源。
  const canonical = item.seo.canonicalUrl || `${siteUrl}/${locale}/news/${slug}`

  return (
    <>
      <JsonLd
        data={newsArticle(locale, {
          title: item.title,
          summary: item.summary,
          publishDate: item.publishDate,
          categoryName: item.categoryName,
          image: cmsMedia(item.seo.ogImagePath || item.coverImagePath),
          url: canonical,
        })}
      />
      {/* 與下方 .crumb 的四層完全一致（含語系——結構化資料不能跟畫面不同語言） */}
      <JsonLd
        data={breadcrumbList(locale, [
          { name: tr(locale, 'Home'), path: '/' },
          { name: tr(locale, 'Insights'), path: '/insights' },
          { name: tr(locale, 'Latest News'), path: '/news' },
          { name: item.categoryName },
        ])}
      />
      <section className="section subhead"><div className="wrap">
        {/* 這一頁是手寫的（mockup 沒有），沒有包在 <T> 裡，所以固定字串各自翻 */}
        <div className="crumb reveal">
          <A href={l("/")}>{tr(locale, 'Home')}</A><span>&rsaquo;</span>
          <A href={l("/insights")}>{tr(locale, 'Insights')}</A><span>&rsaquo;</span>
          <A href={l("/news")}>{tr(locale, 'Latest News')}</A><span>&rsaquo;</span>
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
      {/*
        標籤列。這是客戶 2026-09-08 SEO 簡報的「站內連結」建議來源之一，也是舊站
        100 個 /tag/* 封存頁在新站的落點（見 news/tag/[slug]/page.tsx 的檔頭）。
        後端只回還在啟用中的標籤，所以這裡不需要再過濾一次。
      */}
      {item.tags.length > 0 && (
        <section className="section tight"><div className="wrap reveal">
          <div style={{ display: 'flex', gap: '.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '.14em', textTransform: 'uppercase', opacity: .6 }}>
              {tr(locale, 'Tags')}
            </span>
            {item.tags.map((t) => (
              <A
                key={t.id}
                href={l(`/news/tag/${t.slug}`)}
                className="btn btn-out btn-sm"
                style={{ fontSize: '.8rem', padding: '.45em 1em' }}
              >
                {t.name}
              </A>
            ))}
          </div>
        </div></section>
      )}
      <section className="section tight"><div className="wrap reveal">
        <p><A href={l("/news")} className="btn btn-out">{tr(locale, '« All news')}</A></p>
      </div></section>
    </>
  )
}
