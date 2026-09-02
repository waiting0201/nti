import type { Metadata } from 'next'
import { A } from '@/components/A'
import { mediaUrl } from '@/lib/media'
import { pageMetadata, withLocale, type Locale } from '@/lib/i18n'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata(locale, "/facility-eco-printing", {
    title: "Environmentally Friendly Printing — NTI Printing",
  })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  const l = withLocale(locale)
  return (
    <>
      <section className="fac-banner"><img src={mediaUrl("/assets/fac-eco-pressroom.jpg")} alt="NTI press room — production control" /></section>
      <section className="section subhead"><div className="wrap">
        <div className="crumb reveal"><A href={l("/")}>Home</A><span>&rsaquo;</span><A href={l("/differences")}>About Us</A><span>&rsaquo;</span><A href={l("/facility")}>Facilities &amp; Equipment</A><span>&rsaquo;</span><b>Environmentally Friendly Printing</b></div>
        <h1 className="sec-title reveal">Environmentally Friendly Printing</h1>
        <div className="sec-sub reveal">German presses with in-line varnishing &mdash; including a carbon-balanced line</div>
        <nav className="pr-tabs reveal" aria-label="Section pages">
          <A href={l("/facility-pre-press")}>Prepress Equipment</A>{' '}
          <A href={l("/facility-eco-printing")} className="active">Environmentally Friendly Printing</A>{' '}
          <A href={l("/facility-post-press")}>Post-Press Processing</A>{' '}
          <A href={l("/facility-quality")}>Quality Inspection</A>{' '}
          <A href={l("/facility-tour")}>Factory Tour</A>
        </nav>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <p className="prose wide">Heidelberg Press varnishing in line, to shorten the lead time and keep good quality at the same time. We also introduce an environmentally friendly system into the printing procedure.</p>
        <div className="dtitle mt-m">Presses in Use</div>
        <div className="flist plain cols mt-s"><p className="fi">Heidelberg Speedmaster CD 102-6+LX 6-Colour Coater Press</p><p className="fi">Heidelberg Speedmaster CD 102-5+LX 5-Colour Carbon Balanced Coater Press</p><p className="fi">Heidelberg Speedmaster CD 102-5+LX UV 5-Colour Coater Press</p><p className="fi">Man Roland D-6050 Offenbach Two-Colour Offset Press</p><p className="fi">Heidelberg Image Control System</p><p className="fi">Heidelberg Axis Control Colour Management System</p></div>
        <div className="flist mt-s"><p className="fi"><b>Heidelberg Speedmaster CD-102-6+LX</b>6-colour press with in-line coater, delivering roughly 30&#37; more efficiency than comparable presses.</p><p className="fi"><b>Heidelberg Speedmaster CD-102-5+LX</b>5-colour press with in-line coater; also available as a UV printing configuration and a carbon-balanced model.</p><p className="fi"><b>Man Roland D-6050 Offenbach</b>2-colour press for supporting work.</p><p className="fi"><b>Axis Control System</b>High-efficiency colour measurement, about 3 minutes faster per measurement cycle than comparable systems.</p><p className="fi"><b>Image Control System</b>Spectrophotometer-based in-line monitoring with automatic adjustment &mdash; reduces colour variance and generates reference values for repeat jobs.</p></div>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <div className="dtitle">Equipment</div>
        <div className="pr-grid">
          <article className="pr-card reveal">
            <div className="pr-img"><img src={mediaUrl("/assets/fac-eco-press.png")} alt="Heidelberg Speedmaster CD-102" loading="lazy" /></div>
            <div className="pr-body"><h3>Heidelberg Speedmaster CD-102</h3><p>The main press line, with in-line coater.</p></div>
          </article>
          <article className="pr-card reveal">
            <div className="pr-img"><img src={mediaUrl("/assets/fac-eco-pressroom.jpg")} alt="Press room" loading="lazy" /></div>
            <div className="pr-body"><h3>Press room</h3><p>Production control on the floor.</p></div>
          </article>
          <article className="pr-card reveal">
            <div className="pr-img"><img src={mediaUrl("/assets/fac-eco-axis.jpg")} alt="Axis Control" loading="lazy" /></div>
            <div className="pr-body"><h3>Axis Control</h3><p>Faster colour measurement per cycle.</p></div>
          </article>
          <article className="pr-card reveal">
            <div className="pr-img"><img src={mediaUrl("/assets/fac-eco-imagecontrol.jpg")} alt="Image Control" loading="lazy" /></div>
            <div className="pr-body"><h3>Image Control</h3><p>In-line spectral monitoring and auto-adjust.</p></div>
          </article>
        </div>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <p className="prose">Want this applied to your packaging? Send us the brief and we will come back with a spec and a quote.</p>
        <p className="mt-m"><A href={l("/get-a-quote")} className="btn btn-solid">Get a Quote</A></p>
        <p className="mt-m reveal"><A href={l("/facility-post-press")} className="blink">Next: Post-Press Processing</A></p>
      </div></section>
    </>
  )
}
