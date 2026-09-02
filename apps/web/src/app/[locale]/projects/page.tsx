import type { Metadata } from 'next'
import { ProjectFilter } from '@/components/behaviors/ProjectFilter'
import { pageMetadata, type Locale } from '@/lib/i18n'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata(locale, "/projects", {
    title: "Projects — NTI Printing",
  })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  return (
    <>
      <section className="section"><div className="wrap">
        <h1 className="sec-title reveal">Projects</h1>
        <div className="sec-sub reveal">Real Projects. Real Impact.</div>
        <p className="prose wide reveal mt-s">From packaging to promotional materials, NTI collaborates with brands across industries to deliver sustainable, high-quality results &mdash; explore our custom box portfolio and packaging case study highlights below. Each project reflects our commitment to innovation, precision, and environmental responsibility.</p>
        <div className="dtitle reveal mt-m" id="industries">Industries / Applications</div>
        <div className="flist plain cols3 reveal mt-s"><p className="fi">Food &amp; Beverage</p><p className="fi">Electronics</p><p className="fi">Beauty &amp; Skincare</p><p className="fi">Medical &amp; Healthcare</p><p className="fi">Luxury &amp; Gift Packaging</p><p className="fi">Hardware &amp; Hand Tools</p><p className="fi">Automotive</p><p className="fi">Publishing &amp; Stationery</p><p className="fi">Home &amp; Lifestyle</p><p className="fi">Industrial &amp; Consumer Goods</p></div>
        <div className="dtitle reveal mt-m" id="cases">Case Studies &amp; Photos</div>
        <div className="filter-row reveal" id="pjFilters">
          <button className="fbtn active" data-f="All">All projects</button>{' '}
          <button className="fbtn" data-f="Food">Food</button>{' '}
          <button className="fbtn" data-f="Pharma">Pharma</button>{' '}
          <button className="fbtn" data-f="Retail">Retail</button>{' '}
          <button className="fbtn" data-f="ESG">ESG</button>
        </div>
        <div className="pj-grid" id="pjGrid">
          <article className="pj-card reveal" data-tag="Food">
            <div className="pj-img"><img src="/assets/hp-prod0.jpg" alt="" /><span className="pj-tag">Food</span><span className="pj-play"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg></span></div>
            <div className="pj-body">
              <h3>Export snack carton — 32% less carbon per unit</h3>
              <p>Migration-safe inks, FSC board and a right-weighted structure for a brand scaling into Japan and the EU.</p>
              <div className="pj-stat"><b>-32%</b><span>carbon / unit</span></div>
            </div>
          </article>
          <article className="pj-card reveal" data-tag="Pharma">
            <div className="pj-img"><img src="/assets/hp-prod1.jpg" alt="" /><span className="pj-tag">Pharma</span><span className="pj-play"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg></span></div>
            <div className="pj-body">
              <h3>Serialized pharma cartons, audit-ready</h3>
              <p>GMP-aligned inspection, batch traceability and tamper-evident structure for a regulated line.</p>
              <div className="pj-stat"><b>0</b><span>audit findings</span></div>
            </div>
          </article>
          <article className="pj-card reveal" data-tag="ESG">
            <div className="pj-img"><img src="/assets/diff-box.jpg" alt="" /><span className="pj-tag">ESG</span><span className="pj-play"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg></span></div>
            <div className="pj-body">
              <h3>Mono-material redesign kept the shelf wow</h3>
              <p>Replaced plastic lamination with a recyclable coating — same gloss, single recycling stream.</p>
              <div className="pj-stat"><b>100%</b><span>recyclable</span></div>
            </div>
          </article>
          <article className="pj-card reveal" data-tag="Retail">
            <div className="pj-img"><img src="/assets/hp-prod2.jpg" alt="" /><span className="pj-tag">Retail</span></div>
            <div className="pj-body">
              <h3>Holiday gift set with foil + emboss at volume</h3>
              <p>Hot foil and tactile coating across 400k units with color held to ΔE ≤ 2 through the run.</p>
              <div className="pj-stat"><b>ΔE≤2</b><span>color tolerance</span></div>
            </div>
          </article>
          <article className="pj-card reveal" data-tag="Food">
            <div className="pj-img"><img src="/assets/ps-box1.jpg" alt="" /><span className="pj-tag">Food</span></div>
            <div className="pj-body">
              <h3>Frozen-food board that survives the cold chain</h3>
              <p>Moisture-resistant coating and flute selection validated with transit and freezer testing.</p>
              <div className="pj-stat"><b>-18°C</b><span>validated</span></div>
            </div>
          </article>
          <article className="pj-card reveal" data-tag="ESG">
            <div className="pj-img"><img src="/assets/hp-casestudy.jpg" alt="" /><span className="pj-tag">ESG</span><span className="pj-play"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg></span></div>
            <div className="pj-body">
              <h3>Soy-ink corrugated shipper for a D2C brand</h3>
              <p>One-pass flexo on recycled kraft, printed inside and out for an unboxing moment.</p>
              <div className="pj-stat"><b>96%</b><span>recycled fiber</span></div>
            </div>
          </article>
        </div>
        <p className="prose wide reveal mt-l">Explore how global brands trust NTI to print greener &mdash; without compromise.</p>
      </div></section>
      <ProjectFilter />
    </>
  )
}
