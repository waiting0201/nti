import type { Metadata } from 'next'
import { A } from '@/components/A'
import { pageMetadata, withLocale, type Locale } from '@/lib/i18n'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata(locale, "/news-taicca-partnership", {
    title: "NTI signs an ESG for Culture letter of intent with TAICCA — NTI Printing",
  })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  const l = withLocale(locale)
  return (
    <>
      <section className="section subhead"><div className="wrap">
        <div className="crumb reveal"><A href={l("/")}>Home</A><span>&rsaquo;</span><A href={l("/insights")}>Insights</A><span>&rsaquo;</span><A href={l("/news")}>Latest News</A><span>&rsaquo;</span><b>Partnership</b></div>
        <span className="news-meta reveal"><span className="cat">Partnership</span><span className="date">2025.11.13</span></span>
        <h1 className="sec-title reveal">NTI signs an ESG for Culture letter of intent with TAICCA</h1>
        <div className="sec-sub reveal">On 22 October NTI signed a cooperation letter of intent with the Taiwan Creative Content Agency (TAICCA) under the banner &ldquo;Sustainable Colour, Cultural Inclusion&rdquo;, linking green printing with cultural and creative work.</div>
        <div className="artimg reveal mt-l"><img src="/assets/news/taicca-partnership.jpg" alt="NTI signs an ESG for Culture letter of intent with TAICCA" /></div>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <p className="prose wide mt-s">ESG for Culture is TAICCA&rsquo;s cross-sector programme, pairing corporate sustainability strategy with creative energy to build collaborations that carry both social impact and brand value. The signing marks the printing industry formally entering that space, with NTI as one of the southern Taiwan partners.</p>
        <p className="prose wide mt-s">Chairman Cheng Chun-Ming: &ldquo;Printing is not only manufacturing &mdash; it is a carrier of culture and value. Through green technology and design thinking, we want every printed piece to convey a belief in sustainability and a warmth of culture. This partnership means corporate green transition is no longer only a technical upgrade, but an act of cultural co-creation.&rdquo;</p>
        <div className="dtitle mt-l">Paper instead of plastic: the Animals of Tomorrow tour</div>
        <p className="prose wide mt-s">With TAICCA-supported studio 72 Design, NTI produced the Animals of Tomorrow touring exhibition. Its core idea is replacing plastic with paper, using low-carbon printing and eco-certified stock to make exhibits that are creative and sustainable at once.</p>
        <p className="prose wide mt-s">The work draws on Taiwan&rsquo;s native species &mdash; the Formosan black bear and the leopard cat among them &mdash; as conservation symbols. The tour has shown at Space Moor in Keelung and Gallery Biga in Kyoto, and moves to Tainan at the end of the year.</p>
        <div className="dtitle mt-l">From printing plant to sustainability base</div>
        <p className="prose wide mt-s">Founded in 1968, NTI is a leading Taiwanese printing brand and an international partner. In recent years the company built a new headquarters in the Tainan Technology Industrial Park combining smart manufacturing, integrated production and environmental sustainability &mdash; earning both LEED Gold (US) and EEWH Diamond (Taiwan) green building certification.</p>
        <p className="prose wide mt-s">From process carbon reduction and energy management through to smart warehousing, NTI continues to expand FSC-certified stock, LED-UV energy-saving printing and plateless digital printing.</p>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <p><A href={l("/news")} className="btn btn-out">&laquo; All news</A></p>
        <p className="mt-m"><A href={l("/news-national-sustainable-development-award")} className="blink">Newer: NTI receives the National Sustainable Development Award</A></p>
        <p className="mt-m"><A href={l("/news-green-printing-digital-innovation")} className="blink">Older: Green printing and digital innovation at NTI Tainan</A></p>
      </div></section>
    </>
  )
}
