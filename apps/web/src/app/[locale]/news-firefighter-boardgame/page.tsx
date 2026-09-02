import type { Metadata } from 'next'
import { A } from '@/components/A'
import { mediaUrl } from '@/lib/media'
import { pageMetadata, withLocale, type Locale } from '@/lib/i18n'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata(locale, "/news-firefighter-boardgame", {
    title: "NTI donates a paper-model board game promoting disaster-prevention education — NTI Printing",
  })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  const l = withLocale(locale)
  return (
    <>
      <section className="section subhead"><div className="wrap">
        <div className="crumb reveal"><A href={l("/")}>Home</A><span>&rsaquo;</span><A href={l("/insights")}>Insights</A><span>&rsaquo;</span><A href={l("/news")}>Latest News</A><span>&rsaquo;</span><b>ESG</b></div>
        <span className="news-meta reveal"><span className="cat">ESG</span><span className="date">2026.03.13</span></span>
        <h1 className="sec-title reveal">NTI donates a paper-model board game promoting disaster-prevention education</h1>
        <div className="sec-sub reveal">Working with design studio 72 Design, NTI developed the &ldquo;Fire Heroes: Rescue Now&rdquo; paper-model board game and formally donated it to the Tainan City Fire Bureau.</div>
        <div className="artimg reveal mt-l"><img src={mediaUrl("/assets/news/firefighter-boardgame.jpg")} alt="NTI donates a paper-model board game promoting disaster-prevention education" /></div>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <p className="prose wide mt-s">The game turns fire and rescue scenarios into experiential learning &mdash; converting firefighting knowledge into material families can work through together. It is produced on FSC-certified paper using a low-carbon printing process, so the object itself carries the message.</p>
        <div className="dtitle mt-l">Design and play as a teaching method</div>
        <p className="prose wide mt-s">Built around rescue scenarios, the game combines paper modelling with board-game play so that players absorb the safety content while assembling and playing rather than reading it.</p>
        <p className="prose wide mt-s">Eco-certified paper stock and low-carbon printing reduce the environmental load of production, giving the finished product both educational value and environmental responsibility.</p>
        <div className="dtitle mt-l">Core capability, applied to a social need</div>
        <p className="prose wide mt-s">NTI has worked on green printing and sustainable manufacturing for years. This project is less a board game than a demonstration of what happens when a company answers a social need with its own core technical capability.</p>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <p><A href={l("/news")} className="btn btn-out">&laquo; All news</A></p>
        <p className="mt-m"><A href={l("/news-global-views-esg-award")} className="blink">Newer: NTI wins a 2026 Global Views ESG Award for low-carbon operations</A></p>
        <p className="mt-m"><A href={l("/news-national-sustainable-development-award")} className="blink">Older: NTI receives the National Sustainable Development Award</A></p>
      </div></section>
    </>
  )
}
