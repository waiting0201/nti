import type { Metadata } from 'next'
import { A } from '@/components/A'
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
    <>
      <section className="fac-banner"><img src="/assets/ref-about-mid3.png" alt="Range of NTI sustainably printed pattern packaging" /></section>
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
        <div className="flist plain mt-s"><p className="fi">Sustainable packaging that meets international environmental standards.</p><p className="fi">Direct delivery to factories, suppliers, warehouses, or assembly plants.</p><p className="fi">Simplified coordination across Taiwan and Asia.</p><p className="fi">Reduced handling, transportation, and packaging waste.</p><p className="fi">Faster production and shorter supply chain lead times.</p><p className="fi">Premium print quality with reliable global logistics.</p><p className="fi">One trusted partner from design to final delivery.</p></div>
      </div></section>
      <section className="fac-banner reveal"><img src="/assets/ref-about-banner.png" alt="Colorful NTI paper-craft animal packaging figures" /></section>
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
    </>
  )
}
