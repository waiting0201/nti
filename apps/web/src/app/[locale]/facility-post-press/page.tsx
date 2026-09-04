import type { Metadata } from 'next'
import { A } from '@/components/A'
import { FacilityGrid } from '@/components/cms'
import { getFacility } from '@/lib/api'
import { mediaUrl } from '@/lib/media'
import { pageMetadata, withLocale, type Locale } from '@/lib/i18n'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata(locale, "/facility-post-press", {
    title: "Post-Press Processing — NTI Printing",
  })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  const equipment = await getFacility(locale, 'post-press')
  const l = withLocale(locale)
  return (
    <>
      <section className="fac-banner"><img src={mediaUrl("/assets/fac-post-diecut.jpg")} alt="Heidelberg Varimatrix 105 die-cutter" /></section>
      <section className="section subhead"><div className="wrap">
        <div className="crumb reveal"><A href={l("/")}>Home</A><span>&rsaquo;</span><A href={l("/differences")}>About Us</A><span>&rsaquo;</span><A href={l("/facility")}>Facilities &amp; Equipment</A><span>&rsaquo;</span><b>Post-Press Processing</b></div>
        <h1 className="sec-title reveal">Post-Press Processing</h1>
        <div className="sec-sub reveal">Die-cutting, gluing, window patching and wrapping &mdash; all in-house</div>
        <nav className="pr-tabs reveal" aria-label="Section pages">
          <A href={l("/facility-pre-press")}>Prepress Equipment</A>{' '}
          <A href={l("/facility-eco-printing")}>Environmentally Friendly Printing</A>{' '}
          <A href={l("/facility-post-press")} className="active">Post-Press Processing</A>{' '}
          <A href={l("/facility-quality")}>Quality Inspection</A>{' '}
          <A href={l("/facility-tour")}>Factory Tour</A>
        </nav>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <p className="prose wide">NTI Printing uses the most advanced die-cutting machines, automated gluing machines, and heat shrink film equipment to achieve high-efficiency production and deliver high-quality packaging products.</p>
        <div className="flist plain mt-s"><p className="fi">Automated die-cutting, gluing, window patching, and lamination systems.</p><p className="fi">BOPP film coating eliminates solvent use and meets EU and US eco standards.</p><p className="fi">High-speed shrink wrapping and labeling for efficient, secure finishing.</p></div>
        <div className="flist mt-s"><p className="fi"><b>Heidelberg Varimatrix 105 Die-Cutter</b>High-performance automatic flat-bed die-cutting with non-stop feeder, German CITO creasing matrix, precise alignment, and clean waste stripping for straight, sturdy creases.</p><p className="fi"><b>SBL High-Speed Automatic Die-Cutter</b>Non-stop operation across paper sizes from 400 &times; 370 mm to 1050 &times; 750 mm, up to 7,500 sheets per hour.</p><p className="fi"><b>High-Speed Intelligent Laminating Machine</b>BOPP pre-coated film instead of traditional wet lamination &mdash; solvent-free, no drying, meeting European and American environmental standards.</p><p className="fi"><b>Digital Window Patching Machine</b>Servo-controlled alignment, creasing, corner cutting, and splitting in a single pass.</p><p className="fi"><b>High-Speed Universal Folder-Gluer</b>Up to 200 metres per minute with optional cold or hot glue systems and plasma surface treatment for strong adhesion.</p><p className="fi"><b>Automatic Heat Shrink Wrap Machine</b>Complete wrapping protects finished goods from dust, moisture, and handling damage &mdash; no rope-bundling marks.</p><p className="fi"><b>Supporting Equipment</b>Automatic labeling machine, automatic box sealing machine, and two DATIEN guillotine cutters.</p></div>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <div className="dtitle">Equipment</div>
        {equipment?.length ? (
          <FacilityGrid items={equipment} />
        ) : (
        <div className="pr-grid">
          <article className="pr-card reveal">
            <div className="pr-img"><img src={mediaUrl("/assets/fac-post-diecut.jpg")} alt="Heidelberg Varimatrix 105" loading="lazy" /></div>
            <div className="pr-body"><h3>Heidelberg Varimatrix 105</h3><p>Flat-bed die-cutting with non-stop feeder.</p></div>
          </article>
          <article className="pr-card reveal">
            <div className="pr-img"><img src={mediaUrl("/assets/fac-post-laminate.jpg")} alt="Intelligent laminating machine" loading="lazy" /></div>
            <div className="pr-body"><h3>Intelligent laminating machine</h3><p>Solvent-free BOPP pre-coated film.</p></div>
          </article>
          <article className="pr-card reveal">
            <div className="pr-img"><img src={mediaUrl("/assets/fac-post-window.jpg")} alt="Digital window patching" loading="lazy" /></div>
            <div className="pr-body"><h3>Digital window patching</h3><p>Alignment, creasing and splitting in one pass.</p></div>
          </article>
          <article className="pr-card reveal">
            <div className="pr-img"><img src={mediaUrl("/assets/fac-post-gluer.jpg")} alt="Universal folder-gluer" loading="lazy" /></div>
            <div className="pr-body"><h3>Universal folder-gluer</h3><p>Up to 200 metres per minute.</p></div>
          </article>
          <article className="pr-card reveal">
            <div className="pr-img"><img src={mediaUrl("/assets/fac-post-shrink.jpg")} alt="Heat shrink wrap machine" loading="lazy" /></div>
            <div className="pr-body"><h3>Heat shrink wrap machine</h3><p>Full wrap protection for finished goods.</p></div>
          </article>
        </div>
        )}
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <p className="prose">Want this applied to your packaging? Send us the brief and we will come back with a spec and a quote.</p>
        <p className="mt-m"><A href={l("/get-a-quote")} className="btn btn-solid">Get a Quote</A></p>
        <p className="mt-m reveal"><A href={l("/facility-quality")} className="blink">Next: Quality Inspection</A></p>
      </div></section>
    </>
  )
}
