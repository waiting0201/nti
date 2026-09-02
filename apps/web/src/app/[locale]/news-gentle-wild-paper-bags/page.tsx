import type { Metadata } from 'next'
import { A } from '@/components/A'
import { mediaUrl } from '@/lib/media'
import { pageMetadata, withLocale, type Locale } from '@/lib/i18n'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata(locale, "/news-gentle-wild-paper-bags", {
    title: "Gentle Wild paper bags: a different animal on every bag — NTI Printing",
  })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  const l = withLocale(locale)
  return (
    <>
      <section className="section subhead"><div className="wrap">
        <div className="crumb reveal"><A href={l("/")}>Home</A><span>&rsaquo;</span><A href={l("/insights")}>Insights</A><span>&rsaquo;</span><A href={l("/news")}>Latest News</A><span>&rsaquo;</span><b>Digital Printing</b></div>
        <span className="news-meta reveal"><span className="cat">Digital Printing</span><span className="date">2025.04.18</span></span>
        <h1 className="sec-title reveal">Gentle Wild paper bags: a different animal on every bag</h1>
        <div className="sec-sub reveal">&ldquo;We are not printing paper bags &mdash; we are making a brand&rsquo;s first impression.&rdquo; How a small brand used variable data printing to make every bag different and still look like one range.</div>
        <div className="artimg reveal mt-l"><img src={mediaUrl("/assets/news/gentle-wild-paper-bags.png")} alt="Gentle Wild paper bags: a different animal on every bag" /></div>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <p className="prose wide mt-s">The market is unforgiving: however good the product is, if the packaging does not catch the eye the customer may never look. Gentle Wild designed a full series of animal illustrations &mdash; each one reading like a miniature story with its own character and setting.</p>
        <p className="prose wide mt-s">Paired with HP variable data printing, no two bags repeat, yet the range stays visually consistent: recognisable, but never dull.</p>
        <div className="dtitle mt-l">Why it works for a small brand</div>
        <p className="prose wide mt-s">No plate-making, so small runs are viable &mdash; fast and low cost, which matters when despatch has to stay flexible. And because NTI runs eco specifications from paper and ink through to the printing process itself, the brand can tell customers the packaging is kind to the environment as well as to the design.</p>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <p><A href={l("/news")} className="btn btn-out">&laquo; All news</A></p>
        <p className="mt-m"><A href={l("/news-animals-of-tomorrow")} className="blink">Newer: Speaking up for the leopard cat: NTI joins the Animals of Tomorrow exhibition</A></p>
        <p className="mt-m"><A href={l("/news-hp-variable-data-printing")} className="blink">Older: HP variable data printing: small runs that still stand out</A></p>
      </div></section>
    </>
  )
}
