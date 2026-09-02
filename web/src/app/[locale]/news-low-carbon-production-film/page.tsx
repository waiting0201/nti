import type { Metadata } from 'next'
import { A } from '@/components/A'
import { pageMetadata, withLocale, type Locale } from '@/lib/i18n'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata(locale, "/news-low-carbon-production-film", {
    title: "Our integrated low-carbon production model — company film — NTI Printing",
  })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  const l = withLocale(locale)
  return (
    <>
      <section className="section subhead"><div className="wrap">
        <div className="crumb reveal"><A href={l("/")}>Home</A><span>&rsaquo;</span><A href={l("/insights")}>Insights</A><span>&rsaquo;</span><A href={l("/news")}>Latest News</A><span>&rsaquo;</span><b>Sustainability</b></div>
        <span className="news-meta reveal"><span className="cat">Sustainability</span><span className="date">2024.08.09</span></span>
        <h1 className="sec-title reveal">Our integrated low-carbon production model &mdash; company film</h1>
        <div className="sec-sub reveal">NTI recently received both LEED Gold (US) and EEWH Diamond (Taiwan) green building certification. A new film walks through the integrated low-carbon production model behind them.</div>
        <div className="artimg reveal mt-l"><img src="/assets/news/low-carbon-production-film.jpg" alt="Our integrated low-carbon production model &mdash; company film" /></div>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <p className="prose wide mt-s">As a packaging printer focused on the environment, NTI works to supply products and services that meet the highest environmental standards. The dual green building certification recognises the work done so far &mdash; and sets the bar for what comes next.</p>
        <p className="prose wide mt-s">Customers today care about the quality of a product and about how it was made. The film covers every stage &mdash; material selection, structural design, the printing process, finished packaging and logistics &mdash; each running under international energy-saving and emission-reduction standards. An energy management platform coordinates efficiency planning across the whole plant.</p>
        <p className="prose wide mt-s">Our purpose is to supply refined, custom packaging solutions, because quality and environmental responsibility are not separate goals. Choosing NTI is a vote of confidence in us and a contribution to the environment.</p>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <p><A href={l("/news")} className="btn btn-out">&laquo; All news</A></p>
        <p className="mt-m"><A href={l("/news-commonwealth-interview")} className="blink">Newer: NTI interviewed by CommonWealth Magazine</A></p>
      </div></section>
    </>
  )
}
