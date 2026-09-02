import type { Metadata } from 'next'
import { A } from '@/components/A'
import { mediaUrl } from '@/lib/media'
import { pageMetadata, withLocale, type Locale } from '@/lib/i18n'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata(locale, "/news-commonwealth-interview", {
    title: "NTI interviewed by CommonWealth Magazine — NTI Printing",
  })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  const l = withLocale(locale)
  return (
    <>
      <section className="section subhead"><div className="wrap">
        <div className="crumb reveal"><A href={l("/")}>Home</A><span>&rsaquo;</span><A href={l("/insights")}>Insights</A><span>&rsaquo;</span><A href={l("/news")}>Latest News</A><span>&rsaquo;</span><b>Media</b></div>
        <span className="news-meta reveal"><span className="cat">Media</span><span className="date">2024.11.11</span></span>
        <h1 className="sec-title reveal">NTI interviewed by CommonWealth Magazine</h1>
        <div className="sec-sub reveal">An interview covering how sustainable packaging printing achieves genuinely green production, and where NTI sees the green industry heading.</div>
        <div className="artimg reveal mt-l"><img src={mediaUrl("/assets/news/commonwealth-interview.jpg")} alt="NTI interviewed by CommonWealth Magazine" /></div>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <p className="prose wide mt-s">The conversation went into how NTI builds environmental thinking into every production detail &mdash; from material selection through to carbon reduction measures &mdash; and what it takes to be a green front-runner in this industry rather than a follower.</p>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <p><A href={l("/news")} className="btn btn-out">&laquo; All news</A></p>
        <p className="mt-m"><A href={l("/news-sme-investment-benchmark")} className="blink">Newer: Named a benchmark enterprise in the SME Accelerated Investment Programme</A></p>
        <p className="mt-m"><A href={l("/news-low-carbon-production-film")} className="blink">Older: Our integrated low-carbon production model &mdash; company film</A></p>
      </div></section>
    </>
  )
}
