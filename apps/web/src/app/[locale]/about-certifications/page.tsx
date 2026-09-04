import type { Metadata } from 'next'
import { A } from '@/components/A'
import { CertificationWall } from '@/components/cms'
import { getCertifications } from '@/lib/api'
import { mediaUrl } from '@/lib/media'
import { pageMetadata, withLocale, type Locale } from '@/lib/i18n'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata(locale, "/about-certifications", {
    title: "Our Certifications — Proof of Quality &amp; Sustainability | NTI Printing",
  })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  const certs = await getCertifications(locale)
  const l = withLocale(locale)
  return (
    <>
      <section className="fac-banner"><img src={mediaUrl("/assets/ref-about-mid2.png")} alt="NTI Printing headquarters in Tainan, Taiwan" /></section>
      <section className="section subhead"><div className="wrap">
        <div className="crumb reveal"><A href={l("/")}>Home</A><span>&rsaquo;</span><A href={l("/differences")}>About Us</A><span>&rsaquo;</span><b>Our Certifications</b></div>
        <h1 className="sec-title reveal">Our Certifications &mdash; Proof of Quality &amp; Sustainability</h1>
        <div className="sec-sub reveal">Proving our promise through action</div>
        <nav className="pr-tabs reveal" aria-label="Section pages">
          <A href={l("/about-difference")}>The NTI Difference</A>{' '}
          <A href={l("/about-benefits")}>Benefits to Clients</A>{' '}
          <A href={l("/about-certifications")} className="active">Certifications, Partnerships &amp; Awards</A>{' '}
          <A href={l("/facility-tour")}>Factory Tour</A>
        </nav>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <div className="dtitle">Certifications</div>
        <p className="prose wide">NTI has built its reputation on printing quality, and our clients hold us to it. We keep applying for further certification so that every customer gets the same assurance of product quality &mdash; audited by an outside body rather than asserted by us. Alongside the international standards below, we developed the NTI Green Printing Certificate, a mark our clients can display on their packaging as proof of an eco-conscious process.</p>
      </div></section>
      <section className="section certs reveal">{certs?.length ? (
          <CertificationWall items={certs} />
        ) : (
        <div className="wrap certgrid">
        <img src={mediaUrl("/assets/cert-green.png")} alt="NTI Green Printing" />
        <img src={mediaUrl("/assets/cert-fsc.png")} alt="FSC certified" className="big" />
        <img src={mediaUrl("/assets/cert-leed.png")} alt="LEED Leadership in Energy and Environmental Design" />
        <img src={mediaUrl("/assets/cert-mof.png")} alt="Mineral Oil Free" />
        <img src={mediaUrl("/assets/cert-esg.png")} alt="ESG Environmental, Social, Governance" />
      </div>
        )}</section>
      <section className="section tight"><div className="wrap reveal">
        <div className="dtitle">Printing &amp; Colour Standards</div>
        <div className="flist mt-s"><p className="fi"><b>G7 Master Colorspace</b>Developed by Idealliance, a globally recognized colour calibration methodology based on ISO&nbsp;12647-2, ensuring consistent, accurate colour reproduction across every print run.</p><p className="fi"><b>ISO&nbsp;12647-2</b>The standard litho production procedure our colour management runs to, with spot colours matched to swatch under controlled viewing conditions.</p></div>
      </div></section>
      <section className="fac-banner reveal"><img src={mediaUrl("/assets/ref-about-mid1.png")} alt="NTI leadership on the pressroom floor" /></section>
      <section className="section tight"><div className="wrap reveal">
        <div className="dtitle">GMI Professional Printing Certification</div>
        <p className="prose wide">NTI is GMI certified, ensuring consistent, colour-accurate packaging that meets the quality standards of leading global retailers, including Target, Walgreens, Lowe&rsquo;s, The Home Depot, Academy Sports&nbsp;+&nbsp;Outdoors, and CVS Pharmacy.</p>
        <p className="prose wide mt-s">GMI (Graphic Measures International) is the body appointed by Target to verify packaging suppliers and inspect packaging samples. NTI has passed GMI certification for the following retail channels:</p>
        <div className="flist mt-s"><p className="fi"><b>Target</b>The retailer that commissioned the GMI audit programme.</p><p className="fi"><b>Walgreens</b>Approved packaging supplier.</p><p className="fi"><b>Lowe&rsquo;s</b>Approved packaging supplier.</p><p className="fi"><b>The Home Depot (THD)</b>Approved packaging supplier.</p><p className="fi"><b>Academy Sports + Outdoors</b>Approved packaging supplier.</p><p className="fi"><b>CVS pharmacy</b>Approved packaging supplier.</p></div>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <div className="dtitle">Management System &amp; Environmental Certification</div>
        <div className="flist mt-s"><p className="fi"><b>FSC&trade;-CoC Chain of Custody</b>Guarantees that certified paper materials are sourced from responsibly managed forests and verified throughout the supply chain.</p><p className="fi"><b>ISO&nbsp;14001 &mdash; Environmental Management</b>Demonstrates NTI&rsquo;s commitment to reducing environmental impact through responsible management across every stage of production and the product lifecycle.</p><p className="fi"><b>ISO&nbsp;9001 &mdash; Quality Management System</b>Demonstrates NTI&rsquo;s commitment to consistent quality, continuous improvement, and customer satisfaction.</p><p className="fi"><b>OHSAS&nbsp;18001 &mdash; Occupational Health &amp; Safety Management</b>Certifies NTI&rsquo;s commitment to maintaining a safe, healthy workplace through effective occupational health and safety management.</p><p className="fi"><b>MOF Certified</b>NTI uses MOF-certified eco-friendly printing materials and inks, helping clients reduce environmental impact while meeting recognized sustainability and quality standards.</p></div>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <div className="dtitle">Awards</div>
        <div className="flist mt-s"><p className="fi"><b>Outstanding Business Award</b>The 13th National Brand Yushan Award for Outstanding Business Award.</p><p className="fi"><b>Smart Building Award</b>Gold Award in the &lsquo;Smart Buildings&rsquo; category at the 7th APEC ESCI (Energy Smart Communities Initiative) Best Practices Awards Program.</p></div>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <p className="prose">Want this applied to your packaging? Send us the brief and we will come back with a spec and a quote.</p>
        <p className="mt-m"><A href={l("/get-a-quote")} className="btn btn-solid">Get a Quote</A></p>
        <p className="mt-m reveal"><A href={l("/facility-tour")} className="blink">Next: Factory Tour</A></p>
      </div></section>
    </>
  )
}
