import type { Metadata } from 'next'
import { A } from '@/components/A'
import { pageMetadata, withLocale, type Locale } from '@/lib/i18n'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata(locale, "/news-national-sustainable-development-award", {
    title: "NTI receives the National Sustainable Development Award — NTI Printing",
  })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  const l = withLocale(locale)
  return (
    <>
      <section className="section subhead"><div className="wrap">
        <div className="crumb reveal"><A href={l("/")}>Home</A><span>&rsaquo;</span><A href={l("/insights")}>Insights</A><span>&rsaquo;</span><A href={l("/news")}>Latest News</A><span>&rsaquo;</span><b>Awards</b></div>
        <span className="news-meta reveal"><span className="cat">Awards</span><span className="date">2026.03.09</span></span>
        <h1 className="sec-title reveal">NTI receives the National Sustainable Development Award</h1>
        <div className="sec-sub reveal">Selected from 147 entrants, NTI was one of only seven SMEs in Taiwan to receive the award &mdash; recognition for its work on green printing and sustainable packaging.</div>
        <div className="artimg reveal mt-l"><img src="/assets/news/national-sustainable-development-award.jpg" alt="NTI receives the National Sustainable Development Award" /></div>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <p className="prose wide mt-s">Chairman Cheng Chun-Ming attended in person to receive the gold trophy from Vice Premier Cheng Li-Chiun. The award recognises years of work on ESG and low-carbon processes, and belongs to the whole team.</p>
        <div className="dtitle mt-l">Setting the benchmark for green printing</div>
        <p className="prose wide mt-s">As one of Taiwan&rsquo;s significant packaging printers, NTI works to a core principle of green printing and sustainable packaging, driving low-carbon transition through equipment upgrades, process optimisation and adoption of international standards.</p>
        <div className="dtitle mt-l">What the award recognised</div>
        <p className="prose wide mt-s"><b>Energy-efficient buildings and low-carbon process.</b> Energy and carbon reduction designed in from the factory building through to the production flow, with high-efficiency equipment and energy management lowering total emissions.</p>
        <p className="prose wide mt-s"><b>Innovative printing technology.</b> Digital and innovative print processes raise output efficiency while cutting material and energy waste.</p>
        <p className="prose wide mt-s"><b>Resource circulation and waste reduction.</b> Circular-economy practice applied to recovery and reuse, reducing process waste and improving material efficiency.</p>
        <p className="prose wide mt-s"><b>International certification and quality management.</b> Continuing certification &mdash; including FSC&reg; forest management and GMI international print quality &mdash; keeps product quality and sustainability management moving together, and strengthens NTI&rsquo;s position in global supply chains.</p>
        <div className="dtitle mt-l">Extending into cultural work</div>
        <p className="prose wide mt-s">NTI has extended green printing into ESG paper-craft cultural education, working with creative content partners using FSC-certified stock, plant-based eco inks and low-carbon printing on conservation, disaster-prevention and marine-conservation projects &mdash; so core technology creates cultural, educational and social value as well as product value.</p>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <p><A href={l("/news")} className="btn btn-out">&laquo; All news</A></p>
        <p className="mt-m"><A href={l("/news-firefighter-boardgame")} className="blink">Newer: NTI donates a paper-model board game promoting disaster-prevention education</A></p>
        <p className="mt-m"><A href={l("/news-taicca-partnership")} className="blink">Older: NTI signs an ESG for Culture letter of intent with TAICCA</A></p>
      </div></section>
    </>
  )
}
