import type { Metadata } from 'next'
import { A } from '@/components/A'
import { mediaUrl } from '@/lib/media'
import { pageMetadata, withLocale, type Locale } from '@/lib/i18n'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata(locale, "/about-difference", {
    title: "The NTI Difference — NTI Printing",
  })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  const l = withLocale(locale)
  return (
    <>
      <section className="fac-banner"><img src={mediaUrl("/assets/ref-about-mid1.png")} alt="NTI leadership on the pressroom floor" /></section>
      <section className="section subhead"><div className="wrap">
        <div className="crumb reveal"><A href={l("/")}>Home</A><span>&rsaquo;</span><A href={l("/differences")}>About Us</A><span>&rsaquo;</span><b>The NTI Difference</b></div>
        <h1 className="sec-title reveal">The NTI Difference &mdash; Where Sustainability Meets Uncompromising Quality</h1>
        <div className="sec-sub reveal">Beyond Ink. A mindset of sustainability.</div>
        <nav className="pr-tabs reveal" aria-label="Section pages">
          <A href={l("/about-difference")} className="active">The NTI Difference</A>{' '}
          <A href={l("/about-benefits")}>Benefits to Clients</A>{' '}
          <A href={l("/about-certifications")}>Certifications, Partnerships &amp; Awards</A>{' '}
          <A href={l("/facility-tour")}>Factory Tour</A>
        </nav>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <p className="prose wide">Today, NTI Printing stands as one of Taiwan&rsquo;s most certified eco-friendly printing companies and a trusted sustainable printing partner for global brands &mdash; proving that premium quality and environmental responsibility can thrive together. We deliver the sharpest prints, the richest colors, and the smallest footprint.</p>
        <p className="prose wide mt-s"><b>NTI. The Courage to Print Green.</b><br />Since 1968</p>
        <div className="flist mt-s"><p className="fi"><b>Sustainability First</b>We follow the 4&nbsp;Rs &mdash; Reduce, Reuse, Recover, Recycle &mdash; to cut waste, save energy and keep material in circulation rather than in landfill.</p><p className="fi"><b>Digital Green Printing</b>Digital pre-press and workflow automation remove make-ready sheets, cut ink consumption and shrink the carbon cost of every short run.</p><p className="fi"><b>Future-Ready Thinking</b>We invest in green technology before regulation forces it, so our clients are already compliant when the requirement arrives.</p><p className="fi"><b>Material Responsibility</b>FSC&trade;-certified substrates, low-VOC eco-inks and RoHS-compliant formulations &mdash; safer for food contact, cleaner for the environment.</p><p className="fi"><b>Integrated Innovation</b>Colour management, in-line measurement and smart production systems raise precision and repeatability while removing rework.</p></div>
      </div></section>
      <section className="fac-banner reveal"><img src={mediaUrl("/assets/ref-about-mid2.png")} alt="NTI Printing headquarters in Tainan, Taiwan" /></section>
      <section className="section tight"><div className="wrap reveal">
        <div className="dtitle">Core values</div>
        <div className="flist mt-s"><p className="fi"><b>Honesty and Integrity</b>We respect intellectual property rights, and select and work with suppliers on an objective, impartial basis.</p><p className="fi"><b>Keep Commitment</b>We stay committed to shareholders, employees, suppliers and society, balancing and protecting the interests of each &mdash; and we ask the same of our partners.</p><p className="fi"><b>Mutual Trust and Assistance</b>Long-term, win-win partnerships with customers and employees are built on mutual trust and practical support.</p></div>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <div className="dtitle">Vision, mission and strategy</div>
        <p className="prose wide"><b>Vision.</b> We place great significance in our employees, our product quality and the environment, working to be an outstanding printing company in the packaging field.</p>
        <p className="prose wide"><b>Mission.</b> Keep promoting green packaging and build the full concept of green supply-chain management for our customers &mdash; becoming a printing firm with genuine environmental awareness and a high sense of social responsibility.</p>
        <p className="prose wide"><b>Strategy.</b> Serve customers with all-round service and high product quality to raise satisfaction; create value and profit to sustain the business; and keep developing new technology and certification to open up new opportunities.</p>
        <p className="mt-m"><A href={l("/solutions")} className="blink">See our printing solutions</A></p>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <p className="prose">Want this applied to your packaging? Send us the brief and we will come back with a spec and a quote.</p>
        <p className="mt-m"><A href={l("/get-a-quote")} className="btn btn-solid">Get a Quote</A></p>
        <p className="mt-m reveal"><A href={l("/about-benefits")} className="blink">Next: Client Benefits</A></p>
      </div></section>
    </>
  )
}
