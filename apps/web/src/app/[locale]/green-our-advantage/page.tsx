import type { Metadata } from 'next'
import { A } from '@/components/A'
import { mediaUrl } from '@/lib/media'
import { pageMetadata, withLocale, type Locale } from '@/lib/i18n'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata(locale, "/green-our-advantage", {
    title: "Our Green Advantage — NTI Printing",
  })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  const l = withLocale(locale)
  return (
    <>
      <section className="fac-banner"><img src={mediaUrl("/assets/ref-green-mid2.png")} alt="FSC and NTI Green Printing marks on eco-friendly packaging" /></section>
      <section className="section subhead"><div className="wrap">
        <div className="crumb reveal"><A href={l("/")}>Home</A><span>&rsaquo;</span><A href={l("/green-advantage")}>Sustainability</A><span>&rsaquo;</span><b>Our Green Advantages</b></div>
        <h1 className="sec-title reveal">Our Green Advantages</h1>
        <div className="sec-sub reveal">Sustainability built into every stage of the business</div>
        <nav className="pr-tabs reveal" aria-label="Section pages">
          <A href={l("/green-our-advantage")} className="active">Our Green Advantages</A>{' '}
          <A href={l("/green-carbon")}>Carbon Efficiency</A>{' '}
          <A href={l("/green-materials")}>ECO Materials</A>{' '}
          <A href={l("/green-esg")}>ESG &amp; Future Goals</A>
        </nav>
      </div></section>
      <section className="section tight"><div className="wrap">
        <div className="ga-block reveal">
          <h2 className="ga-h">Our Green Advantage</h2>
          <p className="prose">NTI Printing is one of Taiwan&rsquo;s most certified eco-friendly printing manufacturers, holding FSC CoC, G7 Master Printer, and ISO 14001 certifications.</p>
          <h2 className="ga-h">Benefit to Clients from Green Printing</h2>
          <p className="prose">Partnering with NTI Printing, a leading green printing company in Taiwan, means your brand doesn&rsquo;t just look exceptional &mdash; it demonstrates a genuine commitment to sustainability. Through advanced green printing practices, carbon-conscious production, and internationally recognized eco-friendly materials, we help businesses strengthen their ESG performance and support the carbon reduction expectations of customers and global markets. By choosing NTI, you enhance your brand reputation, build consumer confidence, and show The Courage to Print Green.</p>
          <h2 className="ga-h">What green printing means here</h2>
          <p className="prose">It is not a claim bolted onto the finished job. Every material, ink and solvent we run passes RoHS inspection standards, and the plant operates waste-oil recovery and wastewater recycling systems built to international environmental standards. The advantage shows up as fewer make-ready sheets on the floor, solvent-free lamination, an FSC&trade; claim you can print on the pack, and a supply chain your ESG team can actually evidence.</p>
        </div>
      </div></section>
      <section className="fac-banner reveal"><img src={mediaUrl("/assets/ref-green-mid4.png")} alt="CO2-neutral Heidelberg Speedmaster press line" /></section>
      <section className="section tight"><div className="wrap reveal">
        <div className="dtitle">Company mission</div>
        <p className="prose wide">Keep promoting green packaging and build the full concept of green supply-chain management for our customers &mdash; becoming a printing firm with genuine environmental awareness and a high sense of social responsibility.</p>
        <p className="mt-m"><A href={l("/green-carbon")} className="blink">How we cut carbon</A></p>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <p className="prose">Want this applied to your packaging? Send us the brief and we will come back with a spec and a quote.</p>
        <p className="mt-m"><A href={l("/get-a-quote")} className="btn btn-solid">Get a Quote</A></p>
        <p className="mt-m reveal"><A href={l("/green-carbon")} className="blink">Next: Carbon Efficiency</A></p>
      </div></section>
    </>
  )
}
