import type { Metadata } from 'next'
import { A } from '@/components/A'
import { pageMetadata, withLocale, type Locale } from '@/lib/i18n'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata(locale, "/news-hp-variable-data-printing", {
    title: "HP variable data printing: small runs that still stand out — NTI Printing",
  })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  const l = withLocale(locale)
  return (
    <>
      <section className="section subhead"><div className="wrap">
        <div className="crumb reveal"><A href={l("/")}>Home</A><span>&rsaquo;</span><A href={l("/insights")}>Insights</A><span>&rsaquo;</span><A href={l("/news")}>Latest News</A><span>&rsaquo;</span><b>Digital Printing</b></div>
        <span className="news-meta reveal"><span className="cat">Digital Printing</span><span className="date">2025.03.21</span></span>
        <h1 className="sec-title reveal">HP variable data printing: small runs that still stand out</h1>
        <div className="sec-sub reveal">In a fast-moving market, flexible, quick, high-quality printing is how brands hold their position. That is why more clients are choosing digital printing.</div>
        <div className="artimg reveal mt-l"><img src="/assets/news/hp-variable-data-printing.jpg" alt="HP variable data printing: small runs that still stand out" /></div>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <div className="dtitle">Five reasons</div>
        <p className="prose wide mt-s"><b>Variable data printing.</b> Every printed piece can differ &mdash; name, serial number, barcode, artwork. One-off printing becomes possible; so does one design per box.</p>
        <p className="prose wide mt-s"><b>Small runs, lower inventory risk.</b> No large minimum order. Print to demand, with high flexibility and low risk &mdash; suited to pop-ups, limited blind-box products and custom services.</p>
        <p className="prose wide mt-s"><b>Fast delivery.</b> No plate-making and a simplified workflow move a job from design to despatch faster, shortening time to market.</p>
        <p className="prose wide mt-s"><b>High-quality output.</b> Advanced digital printing renders fine gradients and saturated colour, lifting product feel and brand image.</p>
        <p className="prose wide mt-s"><b>Flexible market testing.</b> Test consumer reaction on a small run first, then adjust design or marketing &mdash; less waste, better efficiency.</p>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <p><A href={l("/news")} className="btn btn-out">&laquo; All news</A></p>
        <p className="mt-m"><A href={l("/news-gentle-wild-paper-bags")} className="blink">Newer: Gentle Wild paper bags: a different animal on every bag</A></p>
        <p className="mt-m"><A href={l("/news-sme-investment-benchmark")} className="blink">Older: Named a benchmark enterprise in the SME Accelerated Investment Programme</A></p>
      </div></section>
    </>
  )
}
