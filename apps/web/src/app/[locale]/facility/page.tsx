import type { Metadata } from 'next'
import { T } from '@/lib/t'
import { bannerSrc, getPage, midBannerSrc } from '@/lib/api'
import { PageBanner, PageMidBanner } from '@/components/cms'
import { A } from '@/components/A'
import { mediaUrl } from '@/lib/media'
import { FacilityExplorer } from '@/components/behaviors/FacilityExplorer'
import { pageMetadata, withLocale, type Locale } from '@/lib/i18n'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata(locale, "/facility", {
    title: "Facilities & Equipment — NTI Printing",
    description: "Pre-press, printing and post-press under one roof in NTI's G7 certified printing factory in Taiwan, built for precision, efficiency and sustainability.",
  })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  // 後台「頁面文字」的覆寫（單元 15）；沒接 API 或沒改過就是 undefined，照 mockup 原文
  const page = await getPage(locale, "facility")
  const l = withLocale(locale)
  return (
    <T locale={locale} overrides={page?.texts}>
      <PageBanner src={bannerSrc(page, "/assets/fac-banner.webp")} alt="NTI printing facility — Heidelberg press line" />
      <section className="section">
        <div className="wrap">
          <div className="crumb reveal"><A href={l("/")}>Home</A><span>&rsaquo;</span><A href={l("/differences")}>About Us</A><span>&rsaquo;</span><b>Facilities &amp; Equipment</b></div>
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
      <section className="section tight"><div className="wrap">
        <div className="fe-grid four">
          <div className="fe-card reveal" data-d="1" id="pre-press">
            <div className="fe-img"><img src={mediaUrl("/assets/ref-sol-mid5.webp")} alt="NTI technician handling freshly printed sheets" /></div>
            <div className="fe-body">
              <span className="fe-step"><b>01</b>Prepress Equipment <span className="zh">印前設備</span></span>
              <h3>Direct to plate, in house</h3>
              <p>NTI Printing utilizes the world&rsquo;s most advanced prepress output software, integrated with a CTP (Computer-to-Plate) direct plate-making system. Coupled with a precise plate production control process, this ensures that the printing dots are accurately rendered, achieving faithful color reproduction in the final print.</p>
              <ul className="fe-specs">
                <li>In-house CTP system for faster turnaround and reduced transport.</li>
                <li>Daily and weekly dot calibration for color precision.</li>
                <li>Eco-friendly production that minimizes heavy metals and wastewater.</li>
              </ul>
              <p className="fe-more"><A href={l("/facility-pre-press")} className="blink">More details &rsaquo;</A></p>
            </div>
          </div>
          <div className="fe-card reveal" data-d="2" id="eco-printing">
            <div className="fe-img"><img src={mediaUrl("/assets/ref-sol-mid4.webp")} alt="Heidelberg offset press line" /></div>
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
              <p className="fe-more"><A href={l("/facility-eco-printing")} className="blink">More details &rsaquo;</A></p>
            </div>
          </div>
          <div className="fe-card reveal" data-d="3" id="post-press">
            <div className="fe-img"><img src={mediaUrl("/assets/ps-box1.jpg")} alt="Cut and folded box sample" /></div>
            <div className="fe-body">
              <span className="fe-step"><b>03</b>Post-Press Processing <span className="zh">印後加工</span></span>
              <h3>Die-cutting, gluing, window patching and wrapping &mdash; all in-house</h3>
              <p>NTI Printing uses the most advanced die-cutting machines, automated gluing machines, and heat shrink film equipment to achieve high-efficiency production and deliver high-quality packaging products.</p>
              <ul className="fe-specs">
                <li>Automated die-cutting, gluing, window patching, and lamination systems.</li>
                <li>BOPP film coating eliminates solvent use and meets EU and US eco standards.</li>
                <li>High-speed shrink wrapping and labeling for efficient, secure finishing.</li>
              </ul>
              <p className="fe-more"><A href={l("/facility-post-press")} className="blink">More details &rsaquo;</A></p>
            </div>
          </div>
          <div className="fe-card reveal" data-d="4" id="quality">
            <div className="fe-img"><img src={mediaUrl("/assets/fac-qc-exact.png")} alt="X-Rite eXact spectrophotometer used for press-side colour measurement" /></div>
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
              <p className="fe-more"><A href={l("/facility-quality")} className="blink">More details &rsaquo;</A></p>
            </div>
          </div>
        </div>
      </div></section>
      <section className="section tour" id="tour">
        <div className="wrap"><h2 className="sec-title reveal">Factory Tour</h2>
          <h3 className="fac-sub reveal mt-s">See Sustainability in Action</h3>
          <p className="prose reveal mt-s">NTI’s factory is built around environmental care and employee well-being. Our modern, fully air-conditioned office and production facility has been designed to provide a safe, clean and inspiring workplace for every member of our team.</p>
          <p className="prose reveal mt-s">Visitors can explore our clean water treatment system, energy-efficient production lines, and green facilities designed for both people and the planet.</p>
          <p className="prose reveal mt-s">Book a guided tour and experience how we bring &lsquo;The Courage to Print Green&rsquo; to life.</p>
          <p className="mt-m reveal"><A href={l("/facility-tour")} className="blink">More details &rsaquo;</A></p></div>
        <PageMidBanner src={midBannerSrc(page, 1, "/assets/fac-tour-main.webp")} alt="Inside the NTI factory floor — palletised packaging stock and clean production aisles" as="div" className="fullbleed tour-photo reveal mt-m" />
      </section>
      <FacilityExplorer overrides={page?.texts} />
    </T>
  )
}
