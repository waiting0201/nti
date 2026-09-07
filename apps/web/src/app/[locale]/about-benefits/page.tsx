import type { Metadata } from 'next'
import { T } from '@/lib/t'
import { A } from '@/components/A'
import { mediaUrl } from '@/lib/media'
import { pageMetadata, withLocale, type Locale } from '@/lib/i18n'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata(locale, "/about-benefits", {
    title: "A Smarter Global Packaging Partner — NTI Printing",
  })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  const l = withLocale(locale)
  return (
    <T locale={locale}>
      <section className="fac-banner"><img src={mediaUrl("/assets/ref-about-mid3.png")} alt="Range of NTI sustainably printed pattern packaging" /></section>
      <section className="section subhead"><div className="wrap">
        <div className="crumb reveal"><A href={l("/")}>Home</A><span>&rsaquo;</span><A href={l("/differences")}>About Us</A><span>&rsaquo;</span><b>Benefits to Clients</b></div>
        <h1 className="sec-title reveal">A Smarter Global Packaging Partner</h1>
        <div className="sec-sub reveal">Why Global Brands Choose NTI</div>
        <nav className="pr-tabs reveal" aria-label="Section pages">
          <A href={l("/about-difference")}>The NTI Difference</A>{' '}
          <A href={l("/about-benefits")} className="active">Benefits to Clients</A>{' '}
          <A href={l("/about-certifications")}>Certifications, Partnerships &amp; Awards</A>{' '}
          <A href={l("/facility-tour")}>Factory Tour</A>
        </nav>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <p className="prose wide">NTI helps global brands create premium, sustainable packaging and custom packaging boxes that protect products, strengthen brand value, and reduce environmental impact. Combining world-class printing with advanced digital technology and responsible manufacturing, we support domestic and international clients with complete packaging solutions, efficient supply chain coordination, and direct global delivery.</p>
        <div className="why-grid">
          <article className="why-item">
            <span className="ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2 8.6h3.2M1.2 11.8h4M2.6 15h2.4" /><path d="M7 5.6h8v10H7z" /><path d="M15 9.1h3.3l2.7 3.2v3.3h-1.3" /><circle cx="9.1" cy="17.4" r="1.9" /><circle cx="17.9" cy="17.4" r="1.9" /></svg></span>
            <h3>Direct Delivery</h3>
            <p>Straight to factories, suppliers, warehouses, or assembly plants.</p>
          </article>
          <article className="why-item">
            <span className="ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8.6" /><path d="M12 3.4c-2.9 3-2.9 14.2 0 17.2M12 3.4c2.9 3 2.9 14.2 0 17.2" /><path d="M3.4 12h17.2M5.2 7.2h13.6M5.2 16.8h13.6" /><circle cx="8.3" cy="8.3" r="1.15" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.15" fill="currentColor" stroke="none" /><circle cx="16.2" cy="14.6" r="1.15" fill="currentColor" stroke="none" /></svg></span>
            <h3>Simplified Coordination</h3>
            <p>One trusted partner across Taiwan and Asia.</p>
          </article>
          <article className="why-item">
            <span className="ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="14" cy="14" r="7" /><path d="M14 10.2V14l2.6 1.9" /><path d="M12.3 2.6h3.4v1.7h-3.4zM14 4.3V7" /><path d="M19.6 7.6 21 6.2" /><path d="M1.6 9.6h3.6M0.8 13.4h3.6M2.2 17.2h2.6" /></svg></span>
            <h3>Faster Lead Times</h3>
            <p>Shorter supply chains and quicker production cycles.</p>
          </article>
          <article className="why-item">
            <span className="ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 19c-1-7 2-13 14-14 1 11-4 15-14 14Z" /><path d="M5.5 18.5 14 10" /></svg></span>
            <h3>Green Printing</h3>
            <p>Sustainable printing solutions and smart factory manufacturing.</p>
          </article>
          <article className="why-item">
            <span className="ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.8 19 5.5v6c0 5.4-3 8.6-7 10.2-4-1.6-7-4.8-7-10.2v-6Z" /><path d="m8.6 11.8 2.4 2.4 4.4-4.8" /></svg></span>
            <h3>Premium Quality</h3>
            <p>Reliable global logistics without compromising print quality.</p>
          </article>
          <article className="why-item">
            <span className="ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="m11 17 2 2a1 1 0 1 0 3-3" /><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" /><path d="m21 3 1 11h-2" /><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" /><path d="M3 4h8" /></svg></span>
            <h3>One Trusted Partner</h3>
            <p>From design and materials to final delivery.</p>
          </article>
        </div>
      </div></section>
      <section className="fac-banner reveal"><img src={mediaUrl("/assets/ref-about-banner.png")} alt="Colorful NTI paper-craft animal packaging figures" /></section>
      <section className="section tight"><div className="wrap reveal">
        <div className="dtitle">Already audited by the buyers you sell to</div>
        <p className="prose wide">NTI has passed GMI certification &mdash; the packaging-supplier audit programme commissioned by Target &mdash; for Target, Walgreens, Lowe&rsquo;s, The Home Depot, Academy Sports&nbsp;+&nbsp;Outdoors and CVS pharmacy. If you sell into those channels, the supplier check has already been done.</p>
        <p className="mt-m"><A href={l("/about-certifications")} className="blink">View certifications, partnerships &amp; awards</A></p>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <p className="prose">Want this applied to your packaging? Send us the brief and we will come back with a spec and a quote.</p>
        <p className="mt-m"><A href={l("/get-a-quote")} className="btn btn-solid">Get a Quote</A></p>
        <p className="mt-m reveal"><A href={l("/about-certifications")} className="blink">Next: Certifications, Partnerships &amp; Awards</A></p>
      </div></section>
    </T>
  )
}
