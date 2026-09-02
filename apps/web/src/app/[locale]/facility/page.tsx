import type { Metadata } from 'next'
import { A } from '@/components/A'
import { mediaUrl } from '@/lib/media'
import { FacilityExplorer } from '@/components/behaviors/FacilityExplorer'
import { pageMetadata, withLocale, type Locale } from '@/lib/i18n'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata(locale, "/facility", {
    title: "Facilities &amp; Equipment — NTI Printing",
  })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  const l = withLocale(locale)
  return (
    <>
      <section className="fac-banner"><img src={mediaUrl("/assets/fac-banner.jpg")} alt="NTI printing facility — Heidelberg press line" /></section>
      <section className="section">
        <div className="wrap">
          <h1 className="sec-title reveal">Facilities &amp; Equipment</h1>
          <h3 className="fac-sub reveal mt-s">Where Technology Meets Sustainability</h3>
          <p className="prose reveal mt-s">NTI Printing integrates advanced pre-press, printing, and post-press systems inside our G7 certified printing plant &mdash; a printing factory in Taiwan designed for precision, efficiency and sustainability. We use Heidelberg and Man Roland presses with in-line varnishing and carbon-balanced systems, reducing energy use and emissions.</p>
          <div className="mt-l"><div className="explorer fac-explorer reveal">
          <div className="ex-list fac-list"><A href="#pre-press" className="active" data-set="pre">Prepress Equipment</A><A href="#eco-printing" data-set="eco">Environmentally Friendly Printing</A><A href="#post-press" data-set="post">Post-Press Processing</A><A href="#quality" data-set="qc">Quality Inspection</A><A href="#tour" data-set="tour">Factory Tour</A></div>
          <div className="ex-media">
            <button className="ex-arrow" id="facPrev" aria-label="Previous"><svg width="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="m15 18-6-6 6-6" /></svg></button>
            <div className="ex-stack">
              <div className="ex-frame fac-frame"><img id="facImg" src={mediaUrl("/assets/fac-pre-ctp.jpg")} alt="Heidelberg Suprasetter 105 S CTP" /></div>
              <p className="fac-cap" id="facCap">Heidelberg Suprasetter 105 S CTP <span className="fac-count">1 / 4</span></p>
            </div>
            <button className="ex-arrow" id="facNext" aria-label="Next"><svg width="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="m9 18 6-6-6-6" /></svg></button>
          </div>
        </div></div>
        </div>
      </section>
      <section className="section tight" id="pre-press"><div className="wrap reveal">
        <div className="dtitle">Prepress Equipment <span className="zh">印前設備</span></div>
        <p className="prose">NTI Printing utilizes the world’s most advanced prepress output software, integrated with a CTP (Computer-to-Plate) direct plate-making system. Coupled with a precise plate production control process, this ensures that the printing dots are accurately rendered, achieving faithful color reproduction in the final print.</p>
        <div className="flist plain mt-s">
          <p className="fi">In-house CTP system for faster turnaround and reduced transport.</p>
          <p className="fi">Daily and weekly dot calibration for color precision.</p>
          <p className="fi">Eco-friendly production that minimizes heavy metals and wastewater.</p>
        </div>
        <div className="dtitle mt-l">Equipment Cards</div>
        <div className="flist mt-s">
          <p className="fi"><b>Heidelberg Suprasetter 105 S CTP</b>In-house pre-press and CTP plate: short lead time, reducing the cost of transportation. Dot values controlled every day and dot value correction every week to ensure precise dot value. Environmental performance: reduced heavy metal and sewage during production.</p>
          <p className="fi"><b>Prinect Color Toolbox</b>Heidelberg Prinect Color Proof Pro (digital color proof), Epson Pro9900 Image setter and ZÜND high-speed die cutting machine. NTI Printing can provide the box sample with imagesetter proof to save the cost and lead time for machine proofing.</p>
          <p className="fi"><b>Jazzy Light / X-Rite Color Master</b>Ink mixed system can mix up the spot colour precisely the same as the colour swatch book. Standard litho printing production procedure, meeting international printing standard ISO 12647-2.</p>
        </div>
        <p className="mt-m"><A href={l("/facility-pre-press")} className="blink">More details &rsaquo;</A></p>
      </div></section>
      <section className="section tight" id="eco-printing"><div className="wrap reveal">
        <div className="dtitle">Environmentally Friendly Printing <span className="zh">環保印刷流程</span></div>
        <p className="prose">Heidelberg Press varnishing in line, to shorten the lead time and keep good quality at the same time. We also introduce an environmentally friendly system into the printing procedure.</p>
        <div className="dtitle mt-m">Presses in Use</div>
        <div className="flist plain cols mt-s">
          <p className="fi">Heidelberg Speedmaster CD 102-6+LX 6-Colour Coater Press</p>
          <p className="fi">Heidelberg Speedmaster CD 102-5+LX 5-Colour Carbon Balanced Coater Press</p>
          <p className="fi">Heidelberg Speedmaster CD 102-5+LX UV 5-Colour Coater Press</p>
          <p className="fi">Man Roland D-6050 Offenbach Two-Colour Offset Press</p>
          <p className="fi">Heidelberg Image Control System</p>
          <p className="fi">Heidelberg Axis Control Colour Management System</p>
        </div>
        <p className="mt-m"><A href={l("/facility-eco-printing")} className="blink">More details &rsaquo;</A></p>
      </div></section>
      <section className="section tight" id="post-press"><div className="wrap reveal">
        <div className="dtitle">Post-Press Processing <span className="zh">印後加工</span></div>
        <p className="prose">NTI Printing uses the most advanced die-cutting machines, automated gluing machines, and heat shrink film equipment to achieve high-efficiency production and deliver high-quality packaging products.</p>
        <div className="flist plain mt-s">
          <p className="fi">Automated die-cutting, gluing, window patching, and lamination systems.</p>
          <p className="fi">BOPP film coating eliminates solvent use and meets EU and US eco standards.</p>
          <p className="fi">High-speed shrink wrapping and labeling for efficient, secure finishing.</p>
        </div>
        <div className="flist mt-s">
          <p className="fi"><b>Heidelberg Varimatrix 105 Die-Cutter</b>High-performance automatic flat-bed die-cutting with non-stop feeder, German CITO creasing matrix, precise alignment, and clean waste stripping for straight, sturdy creases.</p>
          <p className="fi"><b>SBL High-Speed Automatic Die-Cutter</b>Non-stop operation across paper sizes from 400 × 370 mm to 1050 × 750 mm, up to 7,500 sheets per hour.</p>
          <p className="fi"><b>High-Speed Intelligent Laminating Machine</b>BOPP pre-coated film instead of traditional wet lamination — solvent-free, no drying, meeting European and American environmental standards.</p>
          <p className="fi"><b>Digital Window Patching Machine</b>Servo-controlled alignment, creasing, corner cutting, and splitting in a single pass.</p>
          <p className="fi"><b>High-Speed Universal Folder-Gluer</b>Up to 200 metres per minute with optional cold or hot glue systems and plasma surface treatment for strong adhesion.</p>
          <p className="fi"><b>Automatic Heat Shrink Wrap Machine</b>Complete wrapping protects finished goods from dust, moisture, and handling damage — no rope-bundling marks.</p>
          <p className="fi"><b>Supporting Equipment</b>Automatic labeling machine, automatic box sealing machine, and two DATIEN guillotine cutters.</p>
        </div>
        <p className="mt-m"><A href={l("/facility-post-press")} className="blink">More details &rsaquo;</A></p>
      </div></section>
      <section className="section tight" id="quality"><div className="wrap reveal">
        <div className="dtitle">Quality Inspection <span className="zh">品質檢驗</span></div>
        <h3 className="fac-sub mt-s">Quality You Can Measure</h3>
        <p className="prose mt-s">NTI conducts strict quality control throughout every production stage &mdash; from materials to finished goods. Each print is tested for accuracy, durability, and consistency using precision tools such as:</p>
        <div className="flist mt-s">
          <p className="fi"><b>X-Rite i1iO</b>Automated spectral color measurement for profiling and color control.</p>
          <p className="fi"><b>X-Rite eXact Spectrophotometer</b>Press-side color measurement with single-click operation — strict color-deviation control with less manual error.</p>
          <p className="fi"><b>X-Rite IC Plate II</b>Measures plate dot area percentage to verify and adjust dot specifications.</p>
          <p className="fi"><b>Barcode Grade Scanner</b>Verifies every printed barcode meets grade compliance.</p>
          <p className="fi"><b>Temperature &amp; Humidity Chamber</b>High/low temperature simulation to catch issues from environmental fluctuation before shipment.</p>
          <p className="fi"><b>Ink Rub Tester</b>Confirms abrasion resistance of printed surfaces to customer requirements.</p>
          <p className="fi"><b>Gloss Meter &amp; Cross-Hatch Adhesion Tester</b>Verifies surface brightness and coating adhesion against specification.</p>
          <p className="fi"><b>Blister Pack Strength Testing</b>Tests gluing strength for vacuum blister packaging components.</p>
        </div>
        <p className="prose mt-m">Our goal: every print that leaves NTI meets international standards &mdash; and your expectations.</p>
        <p className="mt-m"><A href={l("/facility-quality")} className="blink">More details &rsaquo;</A></p>
      </div></section>
      <section className="section tour" id="tour">
        <div className="wrap"><h2 className="sec-title reveal">Factory Tour</h2>
          <h3 className="fac-sub reveal mt-s">See Sustainability in Action</h3>
          <p className="prose reveal mt-s">NTI’s factory is built around environmental care and employee well-being. Our modern, fully air-conditioned office and production facility has been designed to provide a safe, clean and inspiring workplace for every member of our team.</p>
          <p className="prose reveal mt-s">Visitors can explore our clean water treatment system, energy-efficient production lines, and green facilities designed for both people and the planet.</p>
          <p className="prose reveal mt-s">Book a guided tour and experience how we bring &lsquo;The Courage to Print Green&rsquo; to life.</p>
          <p className="mt-m reveal"><A href={l("/facility-tour")} className="blink">More details &rsaquo;</A></p></div>
        <div className="fullbleed tour-photo reveal mt-m"><img src={mediaUrl("/assets/fac-tour-main.jpg")} alt="Inside the NTI factory floor — palletised packaging stock and clean production aisles" /></div>
      </section>
      <FacilityExplorer />
    </>
  )
}
