import type { Metadata } from 'next'
import { A } from '@/components/A'
import { pageMetadata, withLocale, type Locale } from '@/lib/i18n'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata(locale, "/industry-trends", {
    title: "Industry Trends — NTI Printing",
    description: "Sustainable packaging industry trends: regulation, mono-material design, carbon data, short runs and traceability — read from the pressroom floor.",
  })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  const l = withLocale(locale)
  return (
    <>
      <section className="fac-banner"><img src="/assets/sol-patterns.jpg" alt="Sustainable packaging industry trends" /></section>
      <section className="section"><div className="wrap">
        <div className="crumb reveal"><A href={l("/")}>Home</A><span>&rsaquo;</span><A href={l("/insights")}>Insights</A><span>&rsaquo;</span><b>Industry Trends</b></div>
        <h1 className="sec-title reveal">Industry Trends <span className="ti-slash">/</span> <span className="ti-alt">Where packaging is heading</span></h1>
        <div className="sec-sub reveal">What brand owners are asking us for, and what the regulations, materials and machines are about to make standard.</div>
        <p className="prose wide reveal mt-s">We sit between brand owners and the pressroom, so we see requirement changes early &mdash; usually a year or two before they land in a tender document. These are the shifts our customers are planning around right now.</p>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <div className="dtitle">Regulation is setting the pace</div>
        <p className="prose wide">Packaging rules in the EU, Japan and North America are converging on recyclability, recycled content and disclosure. Design decisions that used to be aesthetic &mdash; a laminate, a foil, a window &mdash; are now compliance decisions.</p>
        <div className="flist plain mt-s"><p className="fi">Recyclability assessed at the pack level, not the material level.</p><p className="fi">Recycled-content thresholds written into purchase specifications.</p><p className="fi">Carbon and material data requested as part of the quote, not after delivery.</p></div>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <div className="dtitle">Mono-material replaces the composite pack</div>
        <p className="prose wide">Composite structures print beautifully and recycle badly. The move is toward one board, one coating, one waste stream &mdash; which pushes the burden onto printing and finishing to deliver the same shelf impact without plastic lamination.</p>
        <div className="flist plain mt-s"><p className="fi">Recyclable water-based coatings in place of PET/OPP lamination.</p><p className="fi">Structural strength engineered through the dieline rather than added film.</p><p className="fi">FSC&trade; virgin and recycled boards specified side by side in one range.</p></div>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <div className="dtitle">Carbon data becomes a line item</div>
        <p className="prose wide">Scope&nbsp;3 reporting has turned the printed carton into a data point. Brands increasingly need a per-order figure their ESG team can cite &mdash; measured against an audited baseline, not estimated from an industry average.</p>
        <div className="flist plain mt-s"><p className="fi">Per-order footprint reported with methodology notes.</p><p className="fi">Energy, board, ink and waste metered by production stage.</p><p className="fi">Supplier carbon performance weighted in vendor selection.</p></div>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <div className="dtitle">Shorter runs, more versions</div>
        <p className="prose wide">Product ranges are fragmenting into regional, seasonal and campaign variants. The economic run length keeps falling, which favours digital and variable-data workflows alongside offset rather than instead of it.</p>
        <div className="flist plain mt-s"><p className="fi">Variable data and versioning handled without new plates.</p><p className="fi">Hybrid routing &mdash; the same artwork quoted offset, digital or UV.</p><p className="fi">Right-weighted inventory instead of over-printing to hit a price break.</p></div>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <div className="dtitle">Traceability from plate to pallet</div>
        <p className="prose wide">Food-contact and pharmaceutical work has raised the bar for everyone. Batch traceability, migration-safe ink systems and inspection records are moving from regulated categories into mainstream retail packaging.</p>
        <div className="flist plain mt-s"><p className="fi">Batch records linking board lot, ink set and press run.</p><p className="fi">Low-migration, low-odour inks as a default rather than an upgrade.</p><p className="fi">Barcode, colour and rub testing logged per job.</p></div>
        <div className="faq-cta reveal mt-l">
          <div><h3>Planning against one of these shifts?</h3><p>Tell us the spec you are being asked to hit &mdash; we will tell you what it costs to print.</p></div>
          <A href={l("/get-a-quote")} className="btn btn-solid">Get a quote</A>
        </div>
      </div></section>
    </>
  )
}
