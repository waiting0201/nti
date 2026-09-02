import type { Metadata } from 'next'
import { A } from '@/components/A'
import { ProductShowcase } from '@/components/behaviors/ProductShowcase'
import { pageMetadata, withLocale, type Locale } from '@/lib/i18n'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata(locale, "/solutions", {
    title: "Custom Packaging &amp; Printing Solutions | NTI Printing Taiwan",
  })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  const l = withLocale(locale)
  return (
    <>
      <section className="fac-banner"><img src="/assets/ref-sol-banner.png" alt="NTI custom printed packaging solutions" /></section>
      <section className="section"><div className="wrap">
        <h1 className="sec-title reveal">Custom Packaging &amp; Printing Solutions</h1>
        <h3 className="fac-sub reveal mt-s">Tailored Printing. Sustainable Design.</h3>
        <p className="prose wide reveal mt-s">NTI provides complete custom packaging boxes and packaging printing solutions, from material recommendation and selection to structural design, printing techniques, finishing, and technical support. We help brands create custom boxes and packaging that perform beautifully, strengthen their brand, and support a more sustainable future.</p>
        <div className="flist reveal mt-s"><p className="fi"><b>Structural Design</b>Optimized packaging that reduces material use and waste.</p><p className="fi"><b>Pre-Press</b>Digital CTP technology improves quality while reducing pollution.</p><p className="fi"><b>Printing</b>Energy-efficient production with lower waste and emissions.</p></div>
        <div className="mt-l"><div className="explorer fac-explorer reveal">
          <div className="ex-left">
            <h4 className="ga-h">Products</h4>
            <div className="ex-list fac-list tight">
              <A href="#" className="active" data-set="boxes">Color Box Packaging</A>{' '}
              <A href="#" data-set="cardboard">Packaging Paperboard</A>{' '}
              <A href="#" data-set="uv">UV Printing</A>{' '}
              <A href="#" data-set="other">Other Printing</A>
            </div>
            <h4 className="ga-h ps-applications">Applications</h4>
            <p className="ps-apps-text" id="psApps">Food | Electronics | Beauty | Medical | Luxury | Consumer Goods</p>
          </div>
          <div className="ps-mediawrap">
            <div className="ex-media">
              <button className="ex-arrow" id="psPrev" aria-label="Previous"><svg width="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="m15 18-6-6 6-6" /></svg></button>
              <div className="ex-frame ps-frame"><img id="psImg" src="/assets/prod-box-gluing.jpg" alt="Gluing box" /></div>
              <button className="ex-arrow" id="psNext" aria-label="Next"><svg width="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="m9 18 6-6-6-6" /></svg></button>
            </div>
            <p className="fac-cap" id="psName">Gluing Box <span className="fac-count">1 / 6</span></p>
            <p className="ps-cap" id="psCap">The most common box type — top and bottom open, easy to assemble, and suited to lighter products.</p>
          </div>
        </div></div>
      </div></section>
      <section className="section"><div className="wrap">
        <h2 className="sec-title reveal">Projects</h2>
        <h3 className="fac-sub reveal mt-s">Real Projects. Real Impact.</h3>
      </div>
      <div className="fac-banner reveal mt-m"><img src="/assets/ref-sol-mid3.png" alt="Range of NTI sustainably printed product packaging" /></div>
      <div className="wrap">
        <p className="prose wide reveal mt-m">From packaging to promotional materials, NTI collaborates with brands across industries to deliver sustainable, high-quality results &mdash; explore our custom box portfolio and packaging case study highlights below. Each project reflects our commitment to innovation, precision, and environmental responsibility.</p>
        <div className="dtitle reveal mt-m">Industries / Applications</div>
        <div className="flist chips reveal mt-s"><p className="fi">Food &amp; Beverage</p><p className="fi">Electronics</p><p className="fi">Beauty &amp; Skincare</p><p className="fi">Medical &amp; Healthcare</p><p className="fi">Luxury &amp; Gift Packaging</p><p className="fi">Hardware &amp; Hand Tools</p><p className="fi">Automotive</p><p className="fi">Publishing &amp; Stationery</p><p className="fi">Home &amp; Lifestyle</p><p className="fi">Industrial &amp; Consumer Goods</p></div>
        <p className="prose wide reveal mt-m">Explore how global brands trust NTI to print greener &mdash; without compromise.</p>
        <p className="mt-m reveal"><A href={l("/projects")} className="tour-more">View more projects<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M13 6l6 6-6 6" /></svg></A></p>
      </div>
      </section>
      <section className="section"><div className="wrap">
        <h2 className="sec-title reveal">Facilities &amp; Equipment</h2>
        <h3 className="fac-sub reveal mt-s">Where Technology Meets Sustainability</h3>
        <p className="prose wide reveal mt-s">NTI Printing integrates advanced pre-press, printing, and post-press systems inside our G7 certified printing plant &mdash; a printing factory in Taiwan designed for precision, efficiency and sustainability. We use Heidelberg and Man Roland presses with in-line varnishing and carbon-balanced systems, reducing energy use and emissions.</p>
        <div className="fe-grid four">
          <div className="fe-card reveal" data-d="1">
            <div className="fe-img"><img src="/assets/ref-sol-mid5.png" alt="NTI technician handling freshly printed sheets" /></div>
            <div className="fe-body">
              <span className="fe-step"><b>01</b>Prepress Equipment <span className="zh">印前設備</span></span>
              <h3>Direct to plate, in house</h3>
              <p>NTI Printing utilizes the world&rsquo;s most advanced prepress output software, integrated with a CTP (Computer-to-Plate) direct plate-making system. Coupled with a precise plate production control process, this ensures that the printing dots are accurately rendered, achieving faithful color reproduction in the final print.</p>
              <ul className="fe-specs">
                <li>In-house CTP system for faster turnaround and reduced transport.</li>
                <li>Daily and weekly dot calibration for color precision.</li>
                <li>Eco-friendly production that minimizes heavy metals and wastewater.</li>
              </ul>
            </div>
          </div>
          <div className="fe-card reveal" data-d="2">
            <div className="fe-img"><img src="/assets/ref-sol-mid4.png" alt="Heidelberg offset press line" /></div>
            <div className="fe-body">
              <span className="fe-step"><b>02</b>Environmentally Friendly Printing <span className="zh">環保印刷流程</span></span>
              <h3>German presses with in-line varnishing &mdash; including a carbon-balanced line</h3>
              <p>Heidelberg Press varnishing in line, to shorten the lead time and keep good quality at the same time. We also introduce an environmentally friendly system into the printing procedure.</p>
              <ul className="fe-specs">
                <li>Heidelberg Speedmaster CD 102-6+LX 6-Colour Coater Press</li>
                <li>Heidelberg Speedmaster CD 102-5+LX 5-Colour Carbon Balanced Coater Press</li>
                <li>Heidelberg Speedmaster CD 102-5+LX UV 5-Colour Coater Press</li>
                <li>Man Roland D-6050 Offenbach Two-Colour Offset Press</li>
                <li>Heidelberg Image Control System</li>
                <li>Heidelberg Axis Control Colour Management System</li>
              </ul>
            </div>
          </div>
          <div className="fe-card reveal" data-d="3">
            <div className="fe-img"><img src="/assets/ps-box1.jpg" alt="Cut and folded box sample" /></div>
            <div className="fe-body">
              <span className="fe-step"><b>03</b>Post-Press Processing <span className="zh">印後加工</span></span>
              <h3>Die-cutting, gluing, window patching and wrapping &mdash; all in-house</h3>
              <p>NTI Printing uses the most advanced die-cutting machines, automated gluing machines, and heat shrink film equipment to achieve high-efficiency production and deliver high-quality packaging products.</p>
              <ul className="fe-specs">
                <li>Automated die-cutting, gluing, window patching, and lamination systems.</li>
                <li>BOPP film coating eliminates solvent use and meets EU and US eco standards.</li>
                <li>High-speed shrink wrapping and labeling for efficient, secure finishing.</li>
              </ul>
            </div>
          </div>
          <div className="fe-card reveal" data-d="4">
            <div className="fe-img"><img src="/assets/fac-qc-exact.png" alt="X-Rite eXact spectrophotometer used for press-side colour measurement" /></div>
            <div className="fe-body">
              <span className="fe-step"><b>04</b>Quality Inspection <span className="zh">品質檢驗</span></span>
              <h3>Quality You Can Measure</h3>
              <p>NTI conducts strict quality control throughout every production stage &mdash; from materials to finished goods. Each print is tested for accuracy, durability, and consistency using precision tools such as:</p>
              <ul className="fe-specs">
                <li>X-Rite i1iO &amp; eXact spectrophotometers &mdash; spectrum colour control testing apparatus.</li>
                <li>IC Plate II plate checker &mdash; measures percentage dot area and analyzes the data to adjust dot areas.</li>
                <li>Barcode grade scanner &mdash; all barcodes printed on goods are tested to check barcode grade.</li>
                <li>Ink rub and gloss testers &mdash; used whenever a customer requests abrasion resistance testing.</li>
                <li>Temperature &amp; humidity chambers &mdash; simulate high/low temperature conditions.</li>
                <li>Gloss-Meter &mdash; tests whether the brightness of the paper surface meets requirements.</li>
                <li>Blister Packing Machine &mdash; tests the strength of the gluing part of the vacuum blister.</li>
              </ul>
            </div>
          </div>
        </div>
        <p className="mt-m reveal"><A href={l("/facility")} className="blink">Explore our facilities &amp; equipment</A></p>
      </div></section>
      <ProductShowcase />
    </>
  )
}
