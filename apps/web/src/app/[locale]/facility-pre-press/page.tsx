import type { Metadata } from 'next'
import { A } from '@/components/A'
import { mediaUrl } from '@/lib/media'
import { pageMetadata, withLocale, type Locale } from '@/lib/i18n'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata(locale, "/facility-pre-press", {
    title: "Prepress Equipment — NTI Printing",
  })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  const l = withLocale(locale)
  return (
    <>
      <section className="fac-banner"><img src={mediaUrl("/assets/fac-pre-ctp.jpg")} alt="Heidelberg Suprasetter 105 S CTP plate-making system" /></section>
      <section className="section subhead"><div className="wrap">
        <div className="crumb reveal"><A href={l("/")}>Home</A><span>&rsaquo;</span><A href={l("/differences")}>About Us</A><span>&rsaquo;</span><A href={l("/facility")}>Facilities &amp; Equipment</A><span>&rsaquo;</span><b>Prepress Equipment</b></div>
        <h1 className="sec-title reveal">Prepress Equipment</h1>
        <div className="sec-sub reveal">Accurate dot rendering and faithful colour, before ink hits paper</div>
        <nav className="pr-tabs reveal" aria-label="Section pages">
          <A href={l("/facility-pre-press")} className="active">Prepress Equipment</A>{' '}
          <A href={l("/facility-eco-printing")}>Environmentally Friendly Printing</A>{' '}
          <A href={l("/facility-post-press")}>Post-Press Processing</A>{' '}
          <A href={l("/facility-quality")}>Quality Inspection</A>{' '}
          <A href={l("/facility-tour")}>Factory Tour</A>
        </nav>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <p className="prose wide">NTI Printing utilizes the world&rsquo;s most advanced prepress output software, integrated with a CTP (Computer-to-Plate) direct plate-making system. Coupled with a precise plate production control process, this ensures that the printing dots are accurately rendered, achieving faithful color reproduction in the final print.</p>
        <div className="flist plain mt-s"><p className="fi">In-house CTP system for faster turnaround and reduced transport.</p><p className="fi">Daily and weekly dot calibration for color precision.</p><p className="fi">Eco-friendly production that minimizes heavy metals and wastewater.</p></div>
        <div className="flist mt-s"><p className="fi"><b>Heidelberg Suprasetter 105 S CTP</b>In-house plate output for quick turnaround and reduced transport, while minimising heavy metals and wastewater.</p><p className="fi"><b>Prinect Color Proof Pro + Epson Pro9900</b>Digital contract proofing; combined with imagesetter proofs and cut box samples to shorten lead times and cost.</p><p className="fi"><b>Jazzy Light Color Management System</b>X-Rite ColorMaster ink mixing with INTEKE colour assessment cabinets &mdash; spot colours matched to swatch under the ISO&nbsp;12647-2 standard litho procedure.</p><p className="fi"><b>Z&Uuml;ND CCD High-Speed Cutter</b>Optical auto-registration die cutting for precise, high-quality box samples and detailed work.</p></div>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <div className="dtitle">Equipment</div>
        <div className="pr-grid">
          <article className="pr-card reveal">
            <div className="pr-img"><img src={mediaUrl("/assets/fac-pre-ctp.jpg")} alt="Heidelberg Suprasetter 105 S CTP" loading="lazy" /></div>
            <div className="pr-body"><h3>Heidelberg Suprasetter 105 S CTP</h3><p>Direct plate-making, output in house.</p></div>
          </article>
          <article className="pr-card reveal">
            <div className="pr-img"><img src={mediaUrl("/assets/fac-pre-proof.jpg")} alt="Prinect Color Proof Pro" loading="lazy" /></div>
            <div className="pr-body"><h3>Prinect Color Proof Pro</h3><p>Digital contract proofing to signed-off colour.</p></div>
          </article>
          <article className="pr-card reveal">
            <div className="pr-img"><img src={mediaUrl("/assets/fac-pre-jazzy.jpg")} alt="Jazzy Light colour management" loading="lazy" /></div>
            <div className="pr-body"><h3>Jazzy Light colour management</h3><p>Ink mixing and spot-colour matching.</p></div>
          </article>
          <article className="pr-card reveal">
            <div className="pr-img"><img src={mediaUrl("/assets/fac-pre-zund.jpg")} alt="Z&Uuml;ND CCD high-speed cutter" loading="lazy" /></div>
            <div className="pr-body"><h3>Z&Uuml;ND CCD high-speed cutter</h3><p>Auto-registration cutting for box samples.</p></div>
          </article>
        </div>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <p className="prose">Want this applied to your packaging? Send us the brief and we will come back with a spec and a quote.</p>
        <p className="mt-m"><A href={l("/get-a-quote")} className="btn btn-solid">Get a Quote</A></p>
        <p className="mt-m reveal"><A href={l("/facility-eco-printing")} className="blink">Next: Environmentally Friendly Printing</A></p>
      </div></section>
    </>
  )
}
