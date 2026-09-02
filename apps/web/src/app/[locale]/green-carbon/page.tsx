import type { Metadata } from 'next'
import { A } from '@/components/A'
import { mediaUrl } from '@/lib/media'
import { pageMetadata, withLocale, type Locale } from '@/lib/i18n'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata(locale, "/green-carbon", {
    title: "Carbon Efficiency — NTI Printing",
  })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  const l = withLocale(locale)
  return (
    <>
      <section className="fac-banner"><img src={mediaUrl("/assets/ref-green-mid3.png")} alt="Recovered paper and print waste sorted for recycling" /></section>
      <section className="section subhead"><div className="wrap">
        <div className="crumb reveal"><A href={l("/")}>Home</A><span>&rsaquo;</span><A href={l("/green-advantage")}>Sustainability</A><span>&rsaquo;</span><b>Carbon Efficiency</b></div>
        <h1 className="sec-title reveal">Carbon Efficiency</h1>
        <div className="sec-sub reveal">Measured, tracked and reduced across every printing cycle</div>
        <nav className="pr-tabs reveal" aria-label="Section pages">
          <A href={l("/green-our-advantage")}>Our Green Advantages</A>{' '}
          <A href={l("/green-carbon")} className="active">Carbon Efficiency</A>{' '}
          <A href={l("/green-materials")}>ECO Materials</A>{' '}
          <A href={l("/green-esg")}>ESG &amp; Future Goals</A>
        </nav>
      </div></section>
      <section className="section tight"><div className="wrap">
        <div className="ga-block reveal">
          <h2 className="ga-h">Carbon Efficiency</h2>
          <p className="prose">NTI Printing is committed to measurable carbon neutral printing and low carbon packaging production in Taiwan. We track our carbon footprint across printing cycles, invest in energy-efficient machines and adopt digital workflows that cut waste. Through the 4&nbsp;Rs &mdash; Reduce, Reuse, Recover, Recycle &mdash; we lower raw-material use and emissions while maintaining premium print standards.</p>
        </div>
      </div></section>
      <section className="fac-banner reveal"><img src={mediaUrl("/assets/ref-green-mid4.png")} alt="CO2-neutral Heidelberg Speedmaster press line" /></section>
      <section className="section tight"><div className="wrap reveal">
        <div className="dtitle">One-stop process, lower carbon</div>
        <p className="prose wide">Design, pre-press, plate-making, printing, coating, die-cutting, folding/gluing and quality control all happen in house. That removes rounds of communication and, more to the point, removes transport between suppliers &mdash; the single largest avoidable emission in conventional packaging production.</p>
        <div className="flist mt-s"><p className="fi"><b>Design</b>Structure design works for function first and to cut paper wastage &mdash; the cheapest carbon to remove is the material never used.</p><p className="fi"><b>Pre-Press</b>Computer-to-plate replaces traditional plate-making, reducing heavy metals and sewage while improving plate quality.</p><p className="fi"><b>Printing</b>Energy-efficient presses plus an ink pre-release system reduce waste ink, solvent and paper at make-ready.</p><p className="fi"><b>The 4&nbsp;Rs</b>Reduce, Reuse, Recover, Recycle &mdash; applied across materials, tooling, solvent and offcuts.</p></div>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <div className="dtitle">Water &amp; solvent</div>
        <p className="prose wide">Waste-oil recovery and wastewater recycling systems run to international environmental standards. Treated water leaves at a COD value of 100&ndash;250&nbsp;mg/L and pH&nbsp;7&ndash;7.8; recovered solvent is separated and reused rather than discarded.</p>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <p className="prose">Want this applied to your packaging? Send us the brief and we will come back with a spec and a quote.</p>
        <p className="mt-m"><A href={l("/get-a-quote")} className="btn btn-solid">Get a Quote</A></p>
        <p className="mt-m reveal"><A href={l("/green-materials")} className="blink">Next: ECO Materials</A></p>
      </div></section>
    </>
  )
}
