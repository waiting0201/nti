import type { Metadata } from 'next'
import { A } from '@/components/A'
import { mediaUrl } from '@/lib/media'
import { pageMetadata, withLocale, type Locale } from '@/lib/i18n'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata(locale, "/news-green-printing-digital-innovation", {
    title: "Green printing and digital innovation at NTI Tainan — NTI Printing",
  })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  const l = withLocale(locale)
  return (
    <>
      <section className="section subhead"><div className="wrap">
        <div className="crumb reveal"><A href={l("/")}>Home</A><span>&rsaquo;</span><A href={l("/insights")}>Insights</A><span>&rsaquo;</span><A href={l("/news")}>Latest News</A><span>&rsaquo;</span><b>Sustainability</b></div>
        <span className="news-meta reveal"><span className="cat">Sustainability</span><span className="date">2025.09.16</span></span>
        <h1 className="sec-title reveal">Green printing and digital innovation at NTI Tainan</h1>
        <div className="sec-sub reveal">Green printing is not a tweak to the printing process &mdash; it is a whole-system approach to sustainability: cutting carbon, reducing VOC use, and choosing paper and ink that are kinder to the environment.</div>
        <div className="artimg reveal mt-l"><img src={mediaUrl("/assets/news/green-printing-digital-innovation.jpg")} alt="Green printing and digital innovation at NTI Tainan" /></div>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <div className="dtitle">Why it matters</div>
        <p className="prose wide mt-s">For a business, green printing supports international ESG expectations and strengthens brand credibility by showing real responsibility. For the environment, it cuts pollution and reduces ecological load. As the global net-zero push accelerates, printing is moving towards low-carbon and digital production, and green printing has become a precondition for working with international brands.</p>
        <div className="dtitle mt-l">How NTI practises it</div>
        <p className="prose wide mt-s"><b>Low-carbon process and eco materials.</b> FSC-certified stock across the board, with continuous process optimisation to reduce energy use and waste &mdash; meeting both client sustainability requirements and international supply-chain rules.</p>
        <p className="prose wide mt-s"><b>AI and digital printing.</b> HP Indigo digital presses and an AI energy-monitoring system make production smarter, giving small-run customisation more flexibility while cutting proofing and consumable waste.</p>
        <p className="prose wide mt-s"><b>Energy management and the smart factory.</b> Low-energy LED-UV printing equipment paired with AI energy analysis gives precise control, from raw-material storage through to finished-goods despatch.</p>
        <div className="dtitle mt-l">What digital innovation changes</div>
        <p className="prose wide mt-s">Digital production responds to market demand quickly, shortens lead times and improves quality consistency. Variable data printing (VDP) makes every piece unique where the brief calls for it. ERP/MES integration connects design, printing and finishing so the whole chain moves faster.</p>
        <p className="prose wide mt-s">NTI also runs open factory visits and exchange sessions, sharing practical experience of sustainable printing and AI-enabled manufacturing with other companies.</p>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <p><A href={l("/news")} className="btn btn-out">&laquo; All news</A></p>
        <p className="mt-m"><A href={l("/news-taicca-partnership")} className="blink">Newer: NTI signs an ESG for Culture letter of intent with TAICCA</A></p>
        <p className="mt-m"><A href={l("/news-green-drive-seminar")} className="blink">Older: Green Drive × Digital Innovation seminar wraps up</A></p>
      </div></section>
    </>
  )
}
