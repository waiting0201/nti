import type { Metadata } from 'next'
import { A } from '@/components/A'
import { pageMetadata, withLocale, type Locale } from '@/lib/i18n'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata(locale, "/green-materials", {
    title: "ECO Materials — NTI Printing",
  })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  const l = withLocale(locale)
  return (
    <>
      <section className="fac-banner"><img src="/assets/ref-green-mid1.png" alt="Low-VOC eco-inks used on NTI's presses" /></section>
      <section className="section subhead"><div className="wrap">
        <div className="crumb reveal"><A href={l("/")}>Home</A><span>&rsaquo;</span><A href={l("/green-advantage")}>Sustainability</A><span>&rsaquo;</span><b>ECO Materials</b></div>
        <h1 className="sec-title reveal">ECO Materials</h1>
        <div className="sec-sub reveal">Substrates, inks and equipment chosen for what they leave behind</div>
        <nav className="pr-tabs reveal" aria-label="Section pages">
          <A href={l("/green-our-advantage")}>Our Green Advantages</A>{' '}
          <A href={l("/green-carbon")}>Carbon Efficiency</A>{' '}
          <A href={l("/green-materials")} className="active">ECO Materials</A>{' '}
          <A href={l("/green-esg")}>ESG &amp; Future Goals</A>
        </nav>
      </div></section>
      <section className="section tight"><div className="wrap">
        <div className="ga-block reveal">
          <h2 className="ga-h">ECO Materials</h2>
          <p className="prose">Our commitment to sustainable packaging materials begins with the materials we choose and the technology we invest in. From FSC paper printing and low-VOC eco friendly printing ink to RoHS-compliant materials, solvent recovery, and advanced wastewater recycling systems, every step of our production process is designed to reduce environmental impact. Combined with energy-efficient presses and finishing equipment, we deliver exceptional print quality while minimizing waste, emissions, and resource consumption.</p>
        </div>
        <div className="flist mt-s"><p className="fi"><b>RoHS-Compliant Throughout</b>Every material, ink and solvent used in production passes RoHS inspection standards.</p><p className="fi"><b>Eco-Friendly Ink</b>Ink systems formulated to under 1&#37; VOC, used with sewage treatment and solvent recovery on site.</p><p className="fi"><b>FSC&trade; Chain of Custody</b>Ink, varnish, lotions and solvents comply with RoHS and REACH; substrates carry FSC&trade; certified chain of custody from mill to finished carton.</p><p className="fi"><b>Solvent-Free Lamination</b>BOPP pre-coated film replaces traditional wet lamination &mdash; no solvent, no drying oven, no emissions.</p><p className="fi"><b>Waste Oil &amp; Water Recovery</b>Waste-oil recovery equipment and a wastewater recycling system, both meeting international environmental protection standards.</p></div>
      </div></section>
      <section className="fac-banner reveal"><img src="/assets/ref-green-mid2.png" alt="FSC and NTI Green Printing marks on eco-friendly packaging" /></section>
      <section className="section tight"><div className="wrap reveal">
        <div className="dtitle">Integrated Green Production</div>
        <p className="prose wide">Our integrated production process improves efficiency while reducing environmental impact. By utilizing Computer-to-Plate (CTP) technology, we eliminate traditional plate-making processes, reducing heavy metal contamination, wastewater, material waste, and overall carbon emissions.</p>
        <div className="dtitle mt-l">Printing</div>
        <p className="prose wide">NTI&rsquo;s advanced printing equipment is designed to maximize production efficiency while minimizing energy consumption. Our eco-friendly printing systems reduce ink waste, solvent usage, and paper waste, delivering exceptional print quality with a lower environmental footprint.</p>
        <div className="dtitle mt-l">Eco-Friendly Ink</div>
        <p className="prose wide">We use environmentally responsible eco friendly printing ink containing less than 1&#37; VOC (Volatile Organic Compounds), together with solvent recovery systems that help reduce emissions and improve workplace safety while maintaining outstanding print performance.</p>
        <div className="dtitle mt-l">Sewage Treatment</div>
        <p className="prose wide">Environmental responsibility extends beyond the printing press. NTI operates advanced wastewater treatment and recycling systems for both production and domestic water, ensuring discharged water consistently meets strict environmental standards. Together with our renewable solar energy infrastructure and ongoing carbon footprint reduction initiatives, we continue to build a cleaner and more sustainable future.</p>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <div className="dtitle">Mono-material by default</div>
        <p className="prose wide">Where a structure allows it, we redesign to a single recyclable material rather than a laminate &mdash; keeping shelf impact while making the pack straightforward for consumers to recycle.</p>
        <p className="mt-m"><A href={l("/projects")} className="blink">See a mono-material redesign</A></p>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <p className="prose">Want this applied to your packaging? Send us the brief and we will come back with a spec and a quote.</p>
        <p className="mt-m"><A href={l("/get-a-quote")} className="btn btn-solid">Get a Quote</A></p>
        <p className="mt-m reveal"><A href={l("/green-esg")} className="blink">Next: ESG &amp; Future Goals</A></p>
      </div></section>
    </>
  )
}
