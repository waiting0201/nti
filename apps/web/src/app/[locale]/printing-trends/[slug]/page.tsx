import type { Metadata } from 'next'
import { notFound, permanentRedirect, redirect } from 'next/navigation'
import { A } from '@/components/A'
import { JsonLd } from '@/components/JsonLd'
import { TrendCta } from '@/components/cms'
import { cmsMedia, getTrend, getTrendMoved, hasApi } from '@/lib/api'
import { DEFAULT_OG_IMAGE, localePath, localeUrl, locales, withLocale, type Locale } from '@/lib/i18n'
import { breadcrumbList, trendArticle } from '@/lib/jsonld'
import { tr } from '@/lib/t'

type Props = { params: Promise<{ locale: Locale; slug: string }> }

/**
 * 產業趨勢詳細頁（後台單元 07，2026-11-16 起）。
 *
 * `/printing-trends` 只列標題＋摘要，內文在這裡。這條路由是 CMS 專用的（mockup 沒有這一頁），
 * 不受 `verify:markup` 的節點比對限制；版面沿用消息詳細頁（`news/[slug]`）的寫法。
 * slug 由 `IndustryTrendI18n.Slug` 決定，中英可以不同。
 */

/** 這個語系找不到這個 slug 時：改過 slug → 301；從另一個語系切過來 → 轉到這個語系的 slug。理由同 news/[slug] */
async function resolveMissing(locale: Locale, slug: string): Promise<never> {
  const moved = await getTrendMoved(locale, slug)
  if (moved) permanentRedirect(moved.toPath)

  for (const other of locales.filter((l) => l !== locale)) {
    const item = await getTrend(other, slug)
    if (!item) continue
    const mine = item.seo.hreflang[locale]
    redirect(localePath(locale, mine ? `/printing-trends/${mine}` : '/printing-trends'))
  }

  notFound()
}

/** 分享圖：後台沒填就用全站預設那張（趨勢沒有封面圖可以沿用） */
const ogImage = (path: string | null) => (path ? cmsMedia(path) : DEFAULT_OG_IMAGE)

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const item = await getTrend(locale, slug)
  if (!item) return {}

  const canonical = item.seo.canonicalUrl || localeUrl(locale, `/printing-trends/${slug}`)

  // hreflang 由同一篇的兩筆 i18n 推導（另一個語系的 slug 可能不同）
  const languages: Record<string, string> = {}
  for (const [lang, s] of Object.entries(item.seo.hreflang)) {
    languages[lang === 'zh' ? 'zh-Hant' : lang] = localeUrl(lang as Locale, `/printing-trends/${s}`)
  }
  if (item.seo.hreflang.en) languages['x-default'] = localeUrl('en', `/printing-trends/${item.seo.hreflang.en}`)

  const title = item.seo.seoTitle || item.title
  const description = item.seo.seoDescription || item.summary
  const ogTitle = item.seo.ogTitle || title
  const ogDescription = item.seo.ogDescription || description
  const image = ogImage(item.seo.ogImagePath)

  return {
    title,
    ...(description ? { description } : {}),
    openGraph: {
      title: ogTitle,
      ...(ogDescription ? { description: ogDescription } : {}),
      url: canonical,
      siteName: 'NTI Printing',
      locale: locale === 'zh' ? 'zh_TW' : 'en_US',
      images: [image],
      type: 'article',
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

  // 缺語系不 fallback（docs/08 §2.5）：該語系沒有這篇就是 404
  if (!hasApi) notFound()
  const item = (await getTrend(locale, slug)) ?? (await resolveMissing(locale, slug))

  const canonical = item.seo.canonicalUrl || localeUrl(locale, `/printing-trends/${slug}`)

  return (
    <>
      <JsonLd
        data={trendArticle(locale, {
          title: item.title,
          summary: item.summary,
          image: ogImage(item.seo.ogImagePath),
          url: canonical,
        })}
      />
      {/* 與下方 .crumb 的四層完全一致（含語系） */}
      <JsonLd
        data={breadcrumbList(locale, [
          { name: tr(locale, 'Home'), path: '/' },
          { name: tr(locale, 'Insights'), path: '/insights' },
          { name: tr(locale, 'Industry Trends'), path: '/printing-trends' },
          { name: item.title },
        ])}
      />
      <section className="section subhead"><div className="wrap">
        {/* 這一頁是手寫的（mockup 沒有），沒有包在 <T> 裡，所以固定字串各自翻 */}
        <div className="crumb reveal">
          <A href={l("/")}>{tr(locale, 'Home')}</A><span>&rsaquo;</span>
          <A href={l("/insights")}>{tr(locale, 'Insights')}</A><span>&rsaquo;</span>
          <A href={l("/printing-trends")}>{tr(locale, 'Industry Trends')}</A><span>&rsaquo;</span>
          <b>{item.title}</b>
        </div>
        <h1 className="sec-title reveal">{item.title}</h1>
        {item.summary && <div className="sec-sub reveal">{item.summary}</div>}
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        {/* 後台富文本編輯器產生的內容，不是使用者輸入 */}
        <div className="rte rte-text" dangerouslySetInnerHTML={{ __html: item.bodyHtml }} />
        <TrendCta locale={locale} />
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <p><A href={l("/printing-trends")} className="btn btn-out">{tr(locale, '« All trends')}</A></p>
      </div></section>
    </>
  )
}
