import type { Metadata } from 'next'
import { A } from '@/components/A'
import { mediaUrl } from '@/lib/media'
import { pageMetadata, withLocale, type Locale } from '@/lib/i18n'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata(locale, "/green-advantage", {
    title: "Eco-Friendly Printing in Taiwan | NTI Green Advantage",
  })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  const l = withLocale(locale)
  return (
    <>
      <section className="fac-banner"><img src={mediaUrl("/assets/ref-green-banner.png")} alt="The courage to print green — recovered print waste ready for recycling" /></section>
      <section className="section"><div className="wrap">
        <h1 className="sec-title reveal">Eco-Friendly Printing in Taiwan</h1>
        <div className="ga-block reveal mt-m">
          <h3 className="ga-h">Our Green Advantage</h3>
          <p className="prose">NTI Printing is one of Taiwan&rsquo;s most certified eco-friendly printing manufacturers, holding FSC CoC, G7 Master Printer, and ISO 14001 certifications.</p>
          <p className="prose mt-s">Partnering with NTI Printing, a leading green printing company in Taiwan, means your brand doesn&rsquo;t just look exceptional &mdash; it demonstrates a genuine commitment to sustainability. Through advanced green printing practices, carbon-conscious production, and internationally recognized eco-friendly materials, we help businesses strengthen their ESG performance and support the carbon reduction expectations of customers and global markets. By choosing NTI, you enhance your brand reputation, build consumer confidence, and show The Courage to Print Green.</p>
          <p className="mt-m"><A href={l("/green-our-advantage")} className="blink">More details &rsaquo;</A></p>
        </div>
      </div></section>
      <section className="fac-banner reveal"><img src={mediaUrl("/assets/ref-green-mid2.png")} alt="FSC and NTI Green Printing marks on eco-friendly packaging" /></section>
      <section className="section"><div className="wrap">
        <div className="ga-block reveal">
          <h3 className="ga-h">Carbon Efficiency / Carbon Neutral Printing</h3>
          <p className="prose">NTI Printing is committed to measurable carbon neutral printing and low carbon packaging production in Taiwan. We track our carbon footprint across printing cycles, invest in energy-efficient machines and adopt digital workflows that cut waste. Through the 4&nbsp;Rs &mdash; Reduce, Reuse, Recover, Recycle &mdash; we lower raw-material use and emissions while maintaining premium print standards.</p>
          <p className="mt-m"><A href={l("/green-carbon")} className="blink">More details &rsaquo;</A></p>
        </div>
      </div></section>
      <section className="fac-banner reveal"><img src={mediaUrl("/assets/ref-green-mid3.png")} alt="Recovered paper and print waste sorted for recycling" /></section>
      <section className="section"><div className="wrap">
        <div className="ga-block reveal">
          <h3 className="ga-h">ECO Materials / Sustainable Printing Materials</h3>
          <p className="prose">Our commitment to sustainable packaging materials begins with the materials we choose and the technology we invest in. From FSC paper printing and low-VOC eco friendly printing ink to RoHS-compliant materials, solvent recovery, and advanced wastewater recycling systems, every step of our production process is designed to reduce environmental impact. Combined with energy-efficient presses and finishing equipment, we deliver exceptional print quality while minimizing waste, emissions, and resource consumption.</p>
          <p className="mt-m"><A href={l("/green-materials")} className="blink">More details &rsaquo;</A></p>
        </div>
      </div></section>
      <section className="fac-banner reveal"><img src={mediaUrl("/assets/ref-green-mid1.png")} alt="Low-VOC eco-inks used on NTI's presses" /></section>
      <section className="section"><div className="wrap">
        <div className="ga-block reveal">
          <h3 className="ga-h">ESG &amp; Future Goals / ESG Printing Commitment</h3>
          <p className="prose">At NTI Printing, ESG begins with people. We believe a safe, clean, modern, and comfortable workplace is fundamental to building a sustainable business. Our fully air-conditioned offices and production facility, together with staff amenities including a restaurant, library, dormitories, and shared spaces, reflect our commitment to the wellbeing of both our local and international employees.</p>
          <p className="prose mt-s">As a sustainable packaging manufacturer committed to responsible printing, NTI Printing is aligning its ESG packaging roadmap with the UN Sustainable Development Goals (SDGs) and evaluating Science-Based Targets (SBTi) status.</p>
          <p className="mt-m"><A href={l("/green-esg")} className="blink">More details &rsaquo;</A></p>
        </div>
      </div></section>
      <section className="fac-banner reveal"><img src={mediaUrl("/assets/ref-green-mid4.png")} alt="CO2-neutral Heidelberg Speedmaster press line" /></section>
      <section className="section certs reveal"><div className="wrap certgrid">
        <img src={mediaUrl("/assets/cert-green.png")} alt="NTI Green Printing" />
        <img src={mediaUrl("/assets/cert-fsc.png")} alt="FSC certified" className="big" />
        <img src={mediaUrl("/assets/cert-leed.png")} alt="LEED Leadership in Energy and Environmental Design" />
        <img src={mediaUrl("/assets/cert-mof.png")} alt="Mineral Oil Free" />
        <img src={mediaUrl("/assets/cert-esg.png")} alt="ESG Environmental, Social, Governance" />
      </div></section>
    </>
  )
}
