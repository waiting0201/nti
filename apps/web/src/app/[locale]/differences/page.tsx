import type { Metadata } from 'next'
import { A } from '@/components/A'
import { mediaUrl } from '@/lib/media'
import { pageMetadata, withLocale, type Locale } from '@/lib/i18n'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata(locale, "/differences", {
    title: "Why Choose NTI Printing | Quality, Sustainability &amp; Partnership",
  })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  const l = withLocale(locale)
  return (
    <>
      <section className="fac-banner"><img src={mediaUrl("/assets/ref-about-banner.png")} alt="Colorful NTI paper-craft animal packaging figures" /></section>
      <section className="section"><div className="wrap">
        <h1 className="sec-title reveal">The NTI Difference &mdash; Where Sustainability Meets Uncompromising Quality</h1>
        <div className="sec-sub reveal">What makes NTI different is not the machines. It is how we take your constraint — food safety, pharma compliance, carbon targets — and hand back a working solution.</div>
        <div className="video-frame reveal mt-l">
          <iframe src="https://www.youtube.com/embed/vECuYIiFSSM" title="Integrated Low-Carbon Production — NTI Printing company film" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
        </div>
      </div></section>
      <section className="section"><div className="wrap">
        <div className="eyebrow reveal">The NTI Difference</div>
        <h2 className="sec-title reveal">Beyond Ink. A mindset of sustainability.</h2>
        <p className="prose wide reveal mt-s">Today, NTI Printing stands as one of Taiwan’s most certified eco-friendly printing companies and a trusted sustainable printing partner for global brands &mdash; proving that premium quality and environmental responsibility can thrive together. We deliver the sharpest prints, the richest colors, and the smallest footprint.</p>
        <p className="prose wide reveal mt-s"><b>NTI. The Courage to Print Green.</b><br />Since 1968</p>
        <p className="mt-m reveal"><A href={l("/about-difference")} className="blink">More details &rsaquo;</A></p>
      </div></section>
      <section className="fac-banner reveal"><img src={mediaUrl("/assets/ref-about-mid1.png")} alt="NTI leadership on the pressroom floor" /></section>
      <section className="section"><div className="wrap">
        <div className="eyebrow reveal">Benefits to Clients</div>
        <h2 className="sec-title reveal">A Smarter Global Packaging Partner</h2>
        <div className="sec-sub reveal">Why Global Brands Choose NTI</div>
        <p className="prose wide reveal mt-s">NTI helps global brands create premium, sustainable packaging and custom packaging boxes that protect products, strengthen brand value, and reduce environmental impact. Combining world-class printing with advanced digital technology and responsible manufacturing, we support domestic and international clients with complete packaging solutions, efficient supply chain coordination, and direct global delivery.</p>
        <div className="flist plain reveal"><div className="fi"><span>Sustainable packaging that meets international environmental standards.</span></div><div className="fi"><span>Direct delivery to factories, suppliers, warehouses, or assembly plants.</span></div><div className="fi"><span>Simplified coordination across Taiwan and Asia.</span></div><div className="fi"><span>Reduced handling, transportation, and packaging waste.</span></div><div className="fi"><span>Faster production and shorter supply chain lead times.</span></div><div className="fi"><span>Premium print quality with reliable global logistics.</span></div><div className="fi"><span>One trusted partner from design to final delivery.</span></div></div>
        <p className="mt-m reveal"><A href={l("/about-benefits")} className="blink">More details &rsaquo;</A></p>
      </div></section>
      <section className="fac-banner reveal"><img src={mediaUrl("/assets/ref-about-mid2.png")} alt="NTI Printing headquarters in Tainan, Taiwan" /></section>
      <section className="section"><div className="wrap">
        <div className="eyebrow reveal">Certifications, Partnerships &amp; Awards</div>
        <h2 className="sec-title reveal">Proving our promise through action</h2>
        <p className="prose reveal mt-s">NTI Printing holds FSC CoC certification, G7 Master Printer status, and ISO 9001/14001 certification, making it one of Taiwan&rsquo;s most certified eco-friendly printing manufacturers.</p>
        <p className="prose reveal">Green printing is more than a process &mdash; it is the way we do business. Every decision, from the materials we select to the equipment we invest in, is guided by our commitment to sustainability. Through energy-efficient production, low-emission inks, wastewater recycling, solvent recovery, solar energy, and ongoing carbon footprint reduction, NTI proves that exceptional printing and environmental responsibility can thrive together.</p>
        <p className="prose reveal"><b>That&rsquo;s The Courage to Print Green.</b></p>
        <p className="mt-m reveal"><A href={l("/about-certifications")} className="blink">More details &rsaquo;</A></p>
      </div></section>
      <section className="fac-banner reveal"><img src={mediaUrl("/assets/ref-about-mid3.png")} alt="Range of NTI sustainably printed pattern packaging" /></section>
      <section className="section"><div className="wrap">
        <div className="eyebrow reveal">Factory Tour</div>
        <h2 className="sec-title reveal">People are part of our sustainability journey</h2>
        <p className="prose wide reveal mt-s">At NTI Printing, ESG begins with people. Our state-of-the-art, fully air-conditioned facility is designed to provide a safe, comfortable, and inspiring workplace for every member of our team. From modern offices and efficient production floors to staff restaurants, library, dormitories, and shared spaces, we continually invest in the wellbeing of both our local and international employees. By creating an environment where people can thrive, we build a stronger culture, deliver better quality, and support a more sustainable future as a trusted sustainable packaging manufacturer in Taiwan.</p>
        <p className="mt-m reveal"><A href={l("/facility-tour")} className="blink">Take a factory tour</A></p>
      </div></section>
      <section className="section certs reveal"><div className="wrap certgrid">
        <img src={mediaUrl("/assets/cert-green.png")} alt="NTI Green Printing" />
        <img src={mediaUrl("/assets/cert-fsc.png")} alt="FSC certified" className="big" />
        <img src={mediaUrl("/assets/cert-leed.png")} alt="LEED Leadership in Energy and Environmental Design" />
        <img src={mediaUrl("/assets/cert-mof.png")} alt="Mineral Oil Free" />
      </div></section>
    </>
  )
}
