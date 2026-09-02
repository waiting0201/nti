import type { Metadata } from 'next'
import { A } from '@/components/A'
import { mediaUrl } from '@/lib/media'
import { HeroSlider } from '@/components/behaviors/HeroSlider'
import { pageMetadata, withLocale, type Locale } from '@/lib/i18n'
import '../home.css'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata(locale, "/", {
    title: "NTI Printing | Taiwan's Eco-Friendly Packaging &amp; Printing Manufacturer",
    description: "NTI Printing — Taiwan's leading sustainable packaging manufacturer. FSC CoC certified, G7 Master Printer, ISO 9001/14001. Custom color boxes, UV printing &amp; eco-friendly packaging solutions for global brands.",
  })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  const l = withLocale(locale)
  return (
    <>

      {/* ============ HERO ============ */}
      <section className="hero" id="hero" aria-label="Featured highlights">
        <A className="slide on" href={l("/green-advantage")}><img src={mediaUrl("/assets/ref-home-banner1.png")} alt="The courage to print green? — NTI Printing" /></A>{' '}
        <A className="slide" href={l("/solutions")}><img src={mediaUrl("/assets/ref-home-banner2.png")} alt="NTI custom printed packaging solutions" /></A>{' '}
        <A className="slide" href={l("/differences")}><img src={mediaUrl("/assets/ref-home-mid2.png")} alt="NTI printing facility — Heidelberg press line in Tainan" /></A>{' '}
        <button className="sbtn prev" aria-label="Previous slide"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M15 5l-7 7 7 7" /></svg></button>{' '}
        <button className="sbtn next" aria-label="Next slide"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M9 5l7 7-7 7" /></svg></button>
        <div className="dots"></div>
      </section>

      {/* ============ INTRO STATEMENT ============ */}
      <section className="intro">
        <div className="wrap">
          <h1 className="reveal">Taiwan&rsquo;s Sustainable Packaging &amp; Printing Leader</h1>
          <p className="h1-sub reveal">The Courage to Print Green</p>
          <p className="reveal">NTI Printing is Taiwan&rsquo;s pioneer eco-friendly printing company and sustainable packaging manufacturer, combining uncompromising digital-first quality with measurable environmental responsibility.</p>
        </div>
      </section>

      {/* ============ WHAT WE DO ============ */}
      <section className="whatwedo" id="what-we-do">
        <div className="wrap">
          <h2 className="sec-h reveal">What We Do</h2>
          <div className="wwd-tiles">
            <article className="tile t-deep reveal" data-d="1">
              <span className="num">01</span>
              <h3>Structural Design</h3>
              <p>Optimized packaging that reduces material use and waste.</p>
            </article>
            <article className="tile t-leaf reveal" data-d="2">
              <span className="num">02</span>
              <h3>Pre-Press (CTP)</h3>
              <p>Digital plate-making improves quality while reducing pollution.</p>
            </article>
            <article className="tile t-lime reveal" data-d="2">
              <span className="num">03</span>
              <h3>Printing</h3>
              <p>Energy-efficient production with lower waste and emissions.</p>
            </article>
            <article className="tile t-coral reveal" data-d="3">
              <span className="num">04</span>
              <h3>Finishing</h3>
              <p>Foil stamping, embossing and specialty coatings.</p>
            </article>
          </div>
        </div>
      </section>

      {/* ============ PRODUCT CARDS ============ */}
      <section className="products" id="products">
        <div className="wrap">
          <h2 className="sec-h reveal">Printing Solutions</h2>
          <div className="prod-grid">
            <article className="pcard reveal" data-d="1">
              <div className="ph"><img src={mediaUrl("/assets/hp-prod-boxes.png")} alt="Paper box printing" /></div>
              <h3>Color Box Packaging</h3>
              <div className="st"><span className="ch">&rsaquo;</span> Customize package</div>
              <p>Multiple box-types: besides folding box, we also provide customize box structure design.</p>
              <A href={l("/products-boxes")} className="btn btn-out">More details &raquo;</A>
            </article>
            <article className="pcard reveal" data-d="2">
              <div className="ph"><img src={mediaUrl("/assets/hp-prod-cardboard.png")} alt="Packaging paperboard printing" /></div>
              <h3>Packaging Paperboard</h3>
              <div className="st"><span className="ch">&rsaquo;</span> Various packaging paperboards</div>
              <p>Hang tags, blister cards and backcards for retail walls.</p>
              <A href={l("/products-cardboard")} className="btn btn-out">More details &raquo;</A>
            </article>
            <article className="pcard reveal" data-d="3">
              <div className="ph"><img src={mediaUrl("/assets/hp-prod-uv.png")} alt="UV printing" /></div>
              <h3>UV Printing</h3>
              <div className="st"><span className="ch">&rsaquo;</span> Special printing</div>
              <p>Printing on special materials, special varnish, anti-counterfeiting and more.</p>
              <A href={l("/products-uv")} className="btn btn-out">More details &raquo;</A>
            </article>
            <article className="pcard reveal" data-d="3">
              <div className="ph"><img src={mediaUrl("/assets/hp-prod-other.png")} alt="Other printing — hand bags, calendars, manuals" /></div>
              <h3>Other Printing</h3>
              <div className="st"><span className="ch">&rsaquo;</span> Beyond the box</div>
              <p>Desk calendars, hand bags, red envelopes, mouse pads and manuals.</p>
              <A href={l("/products-other")} className="btn btn-out">More details &raquo;</A>
            </article>
          </div>
        </div>
      </section>

      {/* ============ GALLERY ============ */}
      <section className="gallery reveal">
        <img src={mediaUrl("/assets/ref-home-mid1.png")} alt="A showcase of NTI's printed packaging work" />
      </section>

      {/* ============ WHY NTI ============ */}
      <section className="whynti" id="why-nti">
        <div className="wrap"><h2 className="sec-h reveal">Why global brands choose NTI?</h2></div>
        <div className="why-grid">
          <article className="tile t-leaf reveal" data-d="1">
            <span className="num">01</span>
            <h3>Direct Delivery</h3>
            <p>Straight to factories, suppliers, warehouses, or assembly plants.</p>
          </article>
          <article className="tile t-deep reveal" data-d="2">
            <span className="num">02</span>
            <h3>Simplified Coordination</h3>
            <p>One trusted partner across Taiwan and Asia.</p>
          </article>
          <article className="tile t-lime reveal" data-d="3">
            <span className="num">03</span>
            <h3>Faster Lead Times</h3>
            <p>Shorter supply chains and quicker production cycles.</p>
          </article>
          <article className="tile t-deep reveal" data-d="1">
            <span className="num">04</span>
            <h3>Green Printing</h3>
            <p>Sustainable printing solutions and smart factory manufacturing.</p>
          </article>
          <article className="tile t-coral reveal" data-d="2">
            <span className="num">05</span>
            <h3>Premium Quality</h3>
            <p>Reliable global logistics without compromising print quality.</p>
          </article>
          <article className="tile t-leaf reveal" data-d="3">
            <span className="num">06</span>
            <h3>One Trusted Partner</h3>
            <p>From design and materials to final delivery.</p>
          </article>
        </div>
      </section>

      {/* ============ PROOF ============ */}
      <section className="proof" id="proof">
        <div className="wrap">
          <h2 className="proof-h reveal"><b>Proof</b><span>&mdash; Through action, not words.</span></h2>
          <div className="cert-wall reveal" data-d="1">
            <img src={mediaUrl("/assets/cert-g7.png")} alt="G7 Master Qualified Facility" />
            <img src={mediaUrl("/assets/cert-gmi.png")} alt="GMI Certified Print Facility" />
            <img src={mediaUrl("/assets/cert-iso9001.png")} alt="ISO 9001 Quality Assurance Management" />
            <img src={mediaUrl("/assets/cert-iso14001.png")} alt="ISO 14001 Environmental Management" />
            <img src={mediaUrl("/assets/cert-iso45001.png")} alt="ISO 45001 Occupational Health &amp; Safety" />
            <img className="pad-lg" src={mediaUrl("/assets/cert-fsc.png")} alt="FSC certified" />
            <img src={mediaUrl("/assets/cert-leed-gold.png")} alt="LEED Gold 2023" />
            <img src={mediaUrl("/assets/cert-greenbuilding.png")} alt="Green Building Label &mdash; Diamond grade" />
            <img src={mediaUrl("/assets/cert-co2neutral.png")} alt="CO2 Neutral" />
            <img className="pad-md" src={mediaUrl("/assets/cert-green.png")} alt="Green Printing" />
            <img src={mediaUrl("/assets/cert-mof.png")} alt="Mineral Oil Free" />
            <img className="pad-sm" src={mediaUrl("/assets/cert-esg.png")} alt="ESG &mdash; Environmental, Social, Governance" />
            <img className="wide" src={mediaUrl("/assets/cert-sedex.png")} alt="Sedex Member" />
            <img className="lockup" src={mediaUrl("/assets/cert-esci.png")} alt="Energy Smart Communities Initiative" />
          </div>
        </div>
      </section>

      {/* ============ BRANDS ============ */}
      <section className="brands" id="brands">
        <div className="wrap">
          <h2 className="sec-h tight reveal">Our Clients</h2>
          <p className="lead reveal">Trusted by leading domestic and international brands.</p>
          <div className="carousel reveal" data-d="1" aria-label="Trusted by Target, CVS pharmacy, Walgreens, Lowe&rsquo;s, Academy Sports + Outdoors, and The Home Depot">
            <div className="logo-track">
              <div className="logo-set">
                <img src={mediaUrl("/assets/client-target.png")} alt="Target" />
                <img src={mediaUrl("/assets/client-cvs.png")} alt="CVS pharmacy" />
                <img src={mediaUrl("/assets/client-walgreens.png")} alt="Walgreens" />
                <img src={mediaUrl("/assets/client-lowes.png")} alt="Lowe&rsquo;s" />
                <img src={mediaUrl("/assets/client-academy.png")} alt="Academy Sports + Outdoors" />
                <img src={mediaUrl("/assets/client-homedepot.png")} alt="The Home Depot" />
              </div>
              <div className="logo-set" aria-hidden="true">
                <img src={mediaUrl("/assets/client-target.png")} alt="" />
                <img src={mediaUrl("/assets/client-cvs.png")} alt="" />
                <img src={mediaUrl("/assets/client-walgreens.png")} alt="" />
                <img src={mediaUrl("/assets/client-lowes.png")} alt="" />
                <img src={mediaUrl("/assets/client-academy.png")} alt="" />
                <img src={mediaUrl("/assets/client-homedepot.png")} alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <HeroSlider />
    </>
  )
}
