import type { Metadata } from 'next'
import { A } from '@/components/A'
import { pageMetadata, withLocale, type Locale } from '@/lib/i18n'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata(locale, "/facility-tour", {
    title: "Factory Tour — NTI Printing",
  })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  const l = withLocale(locale)
  return (
    <>
      <section className="fac-banner"><img src="/assets/fac-tour-main.jpg" alt="Inside the NTI factory floor — palletised packaging stock and clean production aisles" /></section>
      <section className="section subhead"><div className="wrap">
        <div className="crumb reveal"><A href={l("/")}>Home</A><span>&rsaquo;</span><A href={l("/differences")}>About Us</A><span>&rsaquo;</span><A href={l("/facility")}>Facilities &amp; Equipment</A><span>&rsaquo;</span><b>Factory Tour</b></div>
        <h1 className="sec-title reveal">Factory Tour</h1>
        <div className="sec-sub reveal">People are part of our sustainability journey</div>
        <nav className="pr-tabs reveal" aria-label="Section pages">
          <A href={l("/facility-pre-press")}>Prepress Equipment</A>{' '}
          <A href={l("/facility-eco-printing")}>Environmentally Friendly Printing</A>{' '}
          <A href={l("/facility-post-press")}>Post-Press Processing</A>{' '}
          <A href={l("/facility-quality")}>Quality Inspection</A>{' '}
          <A href={l("/facility-tour")} className="active">Factory Tour</A>
        </nav>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <p className="prose wide">At NTI Printing, ESG begins with people. Our state-of-the-art, fully air-conditioned facility is designed to provide a safe, comfortable, and inspiring workplace for every member of our team. From modern offices and efficient production floors to staff restaurants, library, dormitories, and shared spaces, we continually invest in the wellbeing of both our local and international employees. By creating an environment where people can thrive, we build a stronger culture, deliver better quality, and support a more sustainable future as a trusted sustainable packaging manufacturer in Taiwan.</p>
        <div className="video-frame reveal mt-l">
          <iframe src="https://www.youtube.com/embed/vECuYIiFSSM" title="Integrated Low-Carbon Production — NTI Printing company film" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
        </div>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <div className="dtitle">On the floor</div>
        <p className="prose wide">The plant runs on a well-planned production area with a dedicated wastewater treatment zone, supporting an environmentally friendly workplace. Alongside production there is an employee cafeteria, dormitories and training rooms &mdash; the site is built for the people running it, not only for the presses.</p>
      </div></section>
      {/* panoramas (2880x620 / 2880x750) run full-width so they are never cropped */}
      <section className="fac-banner reveal"><img src="/assets/fac-tour1.jpg" alt="NTI factory floor — press hall lighting and overhead services" loading="lazy" /></section>
      <section className="fac-banner reveal"><img src="/assets/fac-tour2.jpg" alt="NTI production aisle — palletised stock between press and finishing" loading="lazy" /></section>
      <section className="section tight"><div className="wrap reveal">
        <div className="dtitle">Booking a visit</div>
        <p className="prose wide">Factory visits run by appointment, Monday to Friday, 08:30&ndash;17:30 (GMT+8) at the Tainan plant. Tell us what you produce and we will shape the route around it.</p>
        <p className="mt-m"><A href={l("/contact")} className="btn btn-out">Arrange a visit</A></p>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <p className="prose">Want this applied to your packaging? Send us the brief and we will come back with a spec and a quote.</p>
        <p className="mt-m"><A href={l("/get-a-quote")} className="btn btn-solid">Get a Quote</A></p>
        <p className="mt-m reveal"><A href={l("/facility-pre-press")} className="blink">Next: Prepress Equipment</A></p>
      </div></section>
    </>
  )
}
