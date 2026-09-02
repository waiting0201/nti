import type { Metadata } from 'next'
import { A } from '@/components/A'
import { pageMetadata, withLocale, type Locale } from '@/lib/i18n'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata(locale, "/news-sme-investment-benchmark", {
    title: "Named a benchmark enterprise in the SME Accelerated Investment Programme — NTI Printing",
  })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  const l = withLocale(locale)
  return (
    <>
      <section className="section subhead"><div className="wrap">
        <div className="crumb reveal"><A href={l("/")}>Home</A><span>&rsaquo;</span><A href={l("/insights")}>Insights</A><span>&rsaquo;</span><A href={l("/news")}>Latest News</A><span>&rsaquo;</span><b>Awards</b></div>
        <span className="news-meta reveal"><span className="cat">Awards</span><span className="date">2025.01.15</span></span>
        <h1 className="sec-title reveal">Named a benchmark enterprise in the SME Accelerated Investment Programme</h1>
        <div className="sec-sub reveal">Out of more than 1,000 participating companies, NTI was selected as one of six benchmark enterprises &mdash; closing a milestone year for the company.</div>
        <div className="artimg reveal mt-l"><img src="/assets/news/sme-investment-benchmark.jpg" alt="Named a benchmark enterprise in the SME Accelerated Investment Programme" /></div>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <p className="prose wide mt-s">2024 was a milestone year. In eco-friendly packaging printing NTI has held to a green and sustainable direction, earning client trust and then standing out in the SME Accelerated Investment Programme.</p>
        <p className="prose wide mt-s">The recognition came from performance across operational management, core differentiating technology, automation and digital transformation, and sustainable business practice. It belongs to every colleague, and it is the reason to keep going.</p>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <p><A href={l("/news")} className="btn btn-out">&laquo; All news</A></p>
        <p className="mt-m"><A href={l("/news-hp-variable-data-printing")} className="blink">Newer: HP variable data printing: small runs that still stand out</A></p>
        <p className="mt-m"><A href={l("/news-commonwealth-interview")} className="blink">Older: NTI interviewed by CommonWealth Magazine</A></p>
      </div></section>
    </>
  )
}
