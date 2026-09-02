import type { Metadata } from 'next'
import { A } from '@/components/A'
import { mediaUrl } from '@/lib/media'
import { pageMetadata, withLocale, type Locale } from '@/lib/i18n'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata(locale, "/facility-quality", {
    title: "Quality Inspection — NTI Printing",
  })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  const l = withLocale(locale)
  return (
    <>
      <section className="fac-banner"><img src={mediaUrl("/assets/fac-banner.jpg")} alt="NTI press line — quality is measured at every stage" /></section>
      <section className="section subhead"><div className="wrap">
        <div className="crumb reveal"><A href={l("/")}>Home</A><span>&rsaquo;</span><A href={l("/differences")}>About Us</A><span>&rsaquo;</span><A href={l("/facility")}>Facilities &amp; Equipment</A><span>&rsaquo;</span><b>Quality Inspection</b></div>
        <h1 className="sec-title reveal">Quality Inspection</h1>
        <div className="sec-sub reveal">Quality You Can Measure</div>
        <nav className="pr-tabs reveal" aria-label="Section pages">
          <A href={l("/facility-pre-press")}>Prepress Equipment</A>{' '}
          <A href={l("/facility-eco-printing")}>Environmentally Friendly Printing</A>{' '}
          <A href={l("/facility-post-press")}>Post-Press Processing</A>{' '}
          <A href={l("/facility-quality")} className="active">Quality Inspection</A>{' '}
          <A href={l("/facility-tour")}>Factory Tour</A>
        </nav>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <p className="prose wide">NTI conducts strict quality control throughout every production stage &mdash; from materials to finished goods. Each print is tested for accuracy, durability, and consistency using precision tools such as:</p>
        <div className="flist mt-s"><p className="fi"><b>X-Rite i1iO</b>Automated spectral colour measurement for profiling and colour control.</p><p className="fi"><b>X-Rite eXact Spectrophotometer</b>Press-side colour measurement with single-click operation &mdash; strict colour-deviation control with less manual error.</p><p className="fi"><b>X-Rite IC Plate II</b>Measures plate dot area percentage to verify and adjust dot specifications.</p><p className="fi"><b>Barcode Grade Scanner</b>Verifies every printed barcode meets grade compliance.</p><p className="fi"><b>Temperature &amp; Humidity Chamber</b>High/low temperature simulation to catch issues from environmental fluctuation before shipment.</p><p className="fi"><b>Ink Rub Tester</b>Confirms abrasion resistance of printed surfaces to customer requirements.</p><p className="fi"><b>Gloss Meter &amp; Cross-Hatch Adhesion Tester</b>Verifies surface brightness and coating adhesion against specification.</p><p className="fi"><b>Blister Pack Strength Testing</b>Tests gluing strength for vacuum blister packaging components.</p></div>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <div className="dtitle">Measurement &amp; Test Equipment</div>
        <div className="pr-grid">
          <article className="pr-card reveal">
            <div className="pr-img"><img src={mediaUrl("/assets/fac-qc-i1io.png")} alt="X-Rite i1iO" loading="lazy" /></div>
            <div className="pr-body"><h3>X-Rite i1iO</h3><p>Automated spectral colour measurement.</p></div>
          </article>
          <article className="pr-card reveal">
            <div className="pr-img"><img src={mediaUrl("/assets/fac-qc-exact.png")} alt="X-Rite eXact" loading="lazy" /></div>
            <div className="pr-body"><h3>X-Rite eXact</h3><p>Press-side spectrophotometer.</p></div>
          </article>
          <article className="pr-card reveal">
            <div className="pr-img"><img src={mediaUrl("/assets/fac-qc-icplate.png")} alt="X-Rite IC Plate II" loading="lazy" /></div>
            <div className="pr-body"><h3>X-Rite IC Plate II</h3><p>Plate dot area verification.</p></div>
          </article>
          <article className="pr-card reveal">
            <div className="pr-img"><img src={mediaUrl("/assets/fac-qc-barcode.png")} alt="Barcode grade scanner" loading="lazy" /></div>
            <div className="pr-body"><h3>Barcode grade scanner</h3><p>Grade compliance on every printed code.</p></div>
          </article>
          <article className="pr-card reveal">
            <div className="pr-img"><img src={mediaUrl("/assets/fac-qc-chamber.png")} alt="Temperature &amp; humidity chamber" loading="lazy" /></div>
            <div className="pr-body"><h3>Temperature &amp; humidity chamber</h3><p>Environmental simulation before shipment.</p></div>
          </article>
          <article className="pr-card reveal">
            <div className="pr-img"><img src={mediaUrl("/assets/fac-qc-rub.png")} alt="Ink rub tester" loading="lazy" /></div>
            <div className="pr-body"><h3>Ink rub tester</h3><p>Abrasion resistance to customer spec.</p></div>
          </article>
          <article className="pr-card reveal">
            <div className="pr-img"><img src={mediaUrl("/assets/fac-qc-gloss.png")} alt="Gloss meter" loading="lazy" /></div>
            <div className="pr-body"><h3>Gloss meter</h3><p>Surface brightness against specification.</p></div>
          </article>
          <article className="pr-card reveal">
            <div className="pr-img"><img src={mediaUrl("/assets/fac-qc-blister.png")} alt="Blister strength tester" loading="lazy" /></div>
            <div className="pr-body"><h3>Blister strength tester</h3><p>Gluing strength for blister components.</p></div>
          </article>
        </div>
        <p className="prose wide reveal mt-l">Our goal: every print that leaves NTI meets international standards &mdash; and your expectations.</p>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <p className="prose">Want this applied to your packaging? Send us the brief and we will come back with a spec and a quote.</p>
        <p className="mt-m"><A href={l("/get-a-quote")} className="btn btn-solid">Get a Quote</A></p>
        <p className="mt-m reveal"><A href={l("/facility-tour")} className="blink">Next: Factory Tour</A></p>
      </div></section>
    </>
  )
}
