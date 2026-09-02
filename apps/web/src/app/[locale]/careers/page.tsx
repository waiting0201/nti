import type { Metadata } from 'next'
import { A } from '@/components/A'
import { mediaUrl } from '@/lib/media'
import { pageMetadata, withLocale, type Locale } from '@/lib/i18n'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata(locale, "/careers", {
    title: "Careers — NTI Printing",
    description: "Careers at NTI Printing in Tainan, Taiwan — press operators, prepress engineers, structural designers, ESG specialists and international sales.",
  })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  const l = withLocale(locale)
  return (
    <>
      <section className="fac-banner"><img src={mediaUrl("/assets/fac-tour-main.jpg")} alt="Working at NTI Printing in Tainan, Taiwan" /></section>
      <section className="section"><div className="wrap">
        <h1 className="sec-title reveal">Careers <span className="ti-slash">/</span> <span className="ti-alt">Join the green print team</span></h1>
        <div className="sec-sub reveal">We are building Taiwan&rsquo;s most sustainable packaging plant. That takes press operators, engineers, designers and people who ask better questions.</div>
        <p className="prose wide reveal mt-s">NTI Printing has been printing in Tainan for over three decades, and reinvesting in low-carbon production for the last ten. If you want your work to show up in a measurable carbon number as well as on a shelf, this is a good place to do it.</p>
        <div className="dtitle reveal mt-m">Why NTI</div>
        <div className="flist plain cols3 reveal mt-s"><p className="fi">Modern Heidelberg and HP lines, maintained properly</p><p className="fi">Training budget and certification support</p><p className="fi">Profit sharing and performance bonus</p><p className="fi">Group insurance above statutory cover</p><p className="fi">Stable orders from international brands</p><p className="fi">A real, audited sustainability programme</p></div>
      </div></section>
      <section className="section tight"><div className="wrap">
        <div className="dtitle reveal">Open positions</div>
        <div className="faq-list reveal mt-s">
          <details className="faq" open><summary><span>Offset Press Operator &mdash; Tainan plant</span></summary><p>Run and maintain sheet-fed offset presses to ISO&nbsp;12647-2 colour standards. Experience on Heidelberg equipment preferred; we will train the right candidate on our colour management workflow. Shift allowance applies.</p></details>
          <details className="faq"><summary><span>Prepress / Colour Management Engineer</span></summary><p>Own CTP output, proofing and dot calibration. You will work with the Jazzy colour system and X-Rite instruments, and be the last check before a job reaches the press.</p></details>
          <details className="faq"><summary><span>Structural Packaging Designer</span></summary><p>Turn product dimensions into dielines that survive transit and recycle cleanly. CAD plus hands-on sample making on our Z&Uuml;ND cutter; close collaboration with brand-side design teams.</p></details>
          <details className="faq"><summary><span>ESG &amp; Sustainability Specialist</span></summary><p>Maintain our carbon accounting, certification evidence and customer ESG reporting. Suits someone comfortable with both a spreadsheet and a pressroom floor.</p></details>
          <details className="faq"><summary><span>International Sales Representative</span></summary><p>Develop and service accounts in Japan, the EU and North America. Business-level English required; packaging or print background an advantage.</p></details>
        </div>
        <div className="faq-cta reveal mt-l">
          <div><h3>Nothing matching your skills?</h3><p>Send us your CV anyway &mdash; we hire ahead of the posting when someone is right.</p></div>
          <A href={l("/contact")} className="btn btn-solid">Contact us</A>
        </div>
      </div></section>
    </>
  )
}
