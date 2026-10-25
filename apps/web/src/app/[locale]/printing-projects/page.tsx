import type { Metadata } from 'next'
import { T } from '@/lib/t'
import { A } from '@/components/A'
import { getPage } from '@/lib/api'
import { pageMetadata, withLocale, type Locale } from '@/lib/i18n'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata(locale, "/printing-projects", {
    title: "Projects — NTI Printing",
    description: "Custom box portfolio and packaging case studies from NTI — food and beverage, electronics, beauty, medical, luxury gift and hardware packaging projects.",
  })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  // 後台「頁面文字」的覆寫（單元 15）；沒接 API 或沒改過就是 undefined，照 mockup 原文
  const page = await getPage(locale, 'projects')
  const l = withLocale(locale)
  return (
    <T locale={locale} overrides={page?.texts}>
      <section className="section"><div className="wrap">
        <div className="crumb reveal"><A href={l("/")}>Home</A><span>&rsaquo;</span><b>Projects</b></div>
        <h1 className="sec-title reveal">Projects</h1>
        <div className="sec-sub reveal">Real Projects. Real Impact.</div>
        <p className="prose wide reveal mt-s">From packaging to promotional materials, NTI collaborates with brands across industries to deliver sustainable, high-quality results. Each project reflects our commitment to innovation, precision, and environmental responsibility.</p>
        <div className="dtitle reveal mt-m" id="industries">Industries / Applications</div>
        <div className="indgrid reveal mt-s">
          <div className="ind-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8.4h7.2l-.9 10.2a1.4 1.4 0 0 1-1.4 1.3H5.3a1.4 1.4 0 0 1-1.4-1.3z"/><path d="M2.4 8.4h8.4"/><path d="M8.6 8.2 10.4 3.6"/><path d="M12.6 13.4h9a4.5 4.5 0 0 1-4.5 4.7 4.5 4.5 0 0 1-4.5-4.7Z"/><path d="M12.4 20h9.4"/><circle cx="15.6" cy="11" r="1.5"/><path d="M19.4 11.4c1.4-1.8 2.6-2.2 2.6-2.2s-.3 3-2.6 3.4"/></svg><b>Food &amp; Beverage</b></div>
          <div className="ind-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="7" y="7" width="10" height="10" rx="1.2"/><path d="M9.4 7V4.2M12 7V4.2M14.6 7V4.2M9.4 17v2.8M12 17v2.8M14.6 17v2.8M7 9.4H4.2M7 12H4.2M7 14.6H4.2M17 9.4h2.8M17 12h2.8M17 14.6h2.8"/><circle cx="10.4" cy="10.2" r="1"/><circle cx="13.8" cy="13.8" r="1"/><path d="M11.4 10.2h2.4v2.6"/></svg><b>Electronics</b></div>
          <div className="ind-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12.6 9.4h6.2v9.4a1.4 1.4 0 0 1-1.4 1.4h-3.4a1.4 1.4 0 0 1-1.4-1.4z"/><path d="M14.6 9.4V7h2.2"/><path d="M15.4 7V4.6h2.6"/><path d="M4.2 13.6h6.6v5a1.4 1.4 0 0 1-1.4 1.4H5.6a1.4 1.4 0 0 1-1.4-1.4z"/><path d="M6.2 13.6v-1.8h2.6v1.8"/></svg><b>Beauty &amp; Skincare</b></div>
          <div className="ind-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4.6 9.6h6v9.2a1.3 1.3 0 0 1-1.3 1.3H5.9a1.3 1.3 0 0 1-1.3-1.3z"/><path d="M6.4 9.6V7.2h2.4v2.4"/><path d="M7.6 12.8v3.4M5.9 14.5h3.4"/><path d="M13.4 11.4h6v7.4a1.3 1.3 0 0 1-1.3 1.3h-3.4a1.3 1.3 0 0 1-1.3-1.3z"/><path d="M15.2 11.4V9h2.4v2.4"/><path d="M16.4 14v2.4M15.2 15.2h2.4"/></svg><b>Medical &amp; Healthcare</b></div>
          <div className="ind-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4.4 11.2h15.2V20H4.4z"/><rect x="3.4" y="8" width="17.2" height="3.2" rx=".5"/><path d="M12 8v12"/><path d="M12 8c-1.7-.3-4-.7-4.9-2.2-.6-1 .2-2.2 1.4-2.2 1.8 0 3 2.3 3.5 4.4Z"/><path d="M12 8c1.7-.3 4-.7 4.9-2.2.6-1-.2-2.2-1.4-2.2-1.8 0-3 2.3-3.5 4.4Z"/></svg><b>Luxury &amp; Gift Packaging</b></div>
          <div className="ind-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.9 6.5a1 1 0 0 0 0 1.4l1.5 1.5a1 1 0 0 0 1.4 0l3.5-3.5a5.6 5.6 0 0 1-7.4 7.4l-6.4 6.4a2 2 0 0 1-2.8-2.8l6.4-6.4a5.6 5.6 0 0 1 7.4-7.4z"/></svg><b>Hardware &amp; Hand Tools</b></div>
          <div className="ind-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6.4 11.6h11.2l-1.2 7.6a1.4 1.4 0 0 1-1.4 1.2H9a1.4 1.4 0 0 1-1.4-1.2z"/><path d="M6 11.6h12"/><path d="M9.5 11.6 8.6 5l1.5-1.6L11.6 5l-.6 6.6"/><path d="M8.9 5.6h2.5"/><path d="M13.6 11.6V4.6h2.4v7"/><path d="M13.6 6.4h1.1M13.6 8.2h1.1M13.6 10h1.1"/></svg><b>Publishing &amp; Stationery</b></div>
          <div className="ind-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3.4 18.2v-4.4l1.9-4.9A2 2 0 0 1 7.2 7.6h9.6a2 2 0 0 1 1.9 1.3l1.9 4.9v4.4"/><path d="M5.3 13.8h13.4"/><path d="M6 15.8h2.6M15.4 15.8h2.6"/><path d="M5.2 18.2v1.6M18.8 18.2v1.6"/></svg><b>Automotive</b></div>
          <div className="ind-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4.6 10.4h14.8L18.2 20H5.8z"/><path d="M4.6 10.4h14.8"/><path d="M9.2 10.4V8.2a2.8 2.8 0 0 1 5.6 0v2.2"/></svg><b>Industrial &amp; Consumer Goods</b></div>
          <div className="ind-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2.6 12 8.8 6.6 15 12"/><path d="M4.2 10.6V20h9.2v-9.4"/><path d="M7.2 20v-4.6h3.2V20"/><circle cx="19" cy="12.8" r="2.9"/><path d="M19 15.7V20"/><path d="M2 20h20"/></svg><b>Home &amp; Lifestyle</b></div>
        </div>
        <p className="prose wide reveal mt-l">Explore how global brands trust NTI to print greener &mdash; without compromise.</p>
      </div></section>
    </T>
  )
}
