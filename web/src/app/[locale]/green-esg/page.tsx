import type { Metadata } from 'next'
import { A } from '@/components/A'
import { pageMetadata, withLocale, type Locale } from '@/lib/i18n'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata(locale, "/green-esg", {
    title: "ESG & Future Goals — NTI Printing",
  })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  const l = withLocale(locale)
  return (
    <>
      <section className="fac-banner"><img src="/assets/ref-green-mid4.png" alt="CO2-neutral Heidelberg Speedmaster press line" /></section>
      <section className="section subhead"><div className="wrap">
        <div className="crumb reveal"><A href={l("/")}>Home</A><span>&rsaquo;</span><A href={l("/green-advantage")}>Sustainability</A><span>&rsaquo;</span><b>ESG &amp; Future Goals</b></div>
        <h1 className="sec-title reveal">ESG &amp; Future Goals</h1>
        <div className="sec-sub reveal">Environmental, social and governance commitments &mdash; and what comes next</div>
        <nav className="pr-tabs reveal" aria-label="Section pages">
          <A href={l("/green-our-advantage")}>Our Green Advantages</A>{' '}
          <A href={l("/green-carbon")}>Carbon Efficiency</A>{' '}
          <A href={l("/green-materials")}>ECO Materials</A>{' '}
          <A href={l("/green-esg")} className="active">ESG &amp; Future Goals</A>
        </nav>
      </div></section>
      <section className="section tight"><div className="wrap">
        <div className="ga-block reveal">
          <h2 className="ga-h">ESG &amp; Future Goals</h2>
          <p className="prose">At NTI Printing, ESG begins with people. We believe a safe, clean, modern, and comfortable workplace is fundamental to building a sustainable business. Our fully air-conditioned offices and production facility, together with staff amenities including a restaurant, library, dormitories, and shared spaces, reflect our commitment to the wellbeing of both our local and international employees.</p>
          <p className="prose mt-s">As a sustainable packaging manufacturer committed to responsible printing, NTI Printing is aligning its ESG packaging roadmap with the UN Sustainable Development Goals (SDGs) and evaluating Science-Based Targets (SBTi) status.</p>
        </div>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <div className="dtitle">Corporate Social Responsibility</div>
        <p className="prose wide">Corporate social responsibility is a continuing commitment to behave ethically and contribute to economic development, while improving the quality of life of the workforce and their families as well as the local community and society at large. NTI encourages its staff to take part in philanthropy, community volunteering and environmental clean-up work &mdash; the CSR programme is an extension of how the company already operates, not a separate initiative.</p>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <div className="dtitle">Environmental Sustainability</div>
        <p className="prose wide">Green printing is a direction the industry is moving in, so materials and equipment are purchased on the premise that they reduce pollution and energy consumption.</p>
        <div className="flist mt-s"><p className="fi"><b>Eco-Friendly Material</b>Main materials &mdash; ink, varnish, lotions and solvents &mdash; comply with RoHS and REACH, and hold FSC&trade; Chain of Custody certification.</p><p className="fi"><b>Waste Treatment</b>Internal sewage treatment and a waste-solvent recovery system separate impurities and recycle what can be reused. Treated wastewater leaves at pH&nbsp;7&ndash;7.8.</p><p className="fi"><b>Energy &amp; Emissions</b>Energy saving and carbon reduction are managed across the continuous production process rather than at a single stage.</p></div>
      </div></section>
      <section className="fac-banner reveal"><img src="/assets/ref-green-mid3.png" alt="Recovered paper and print waste sorted for recycling" /></section>
      <section className="section tight"><div className="wrap reveal">
        <div className="dtitle">Employee Development</div>
        <p className="prose wide">To build both competitiveness and technical depth, NTI runs education and training for every department and supports staff attending outside lectures and exhibitions.</p>
        <div className="flist mt-s"><p className="fi"><b>EHS &mdash; Safety, Health, Environment</b>Regular fire drills, escape-route and evacuation practice, AED first-aid training and occupational safety briefings.</p><p className="fi"><b>NTI Academy</b>Education and training courses across departments, with support for staff attending industry lectures and exhibitions.</p><p className="fi"><b>Committee of Employees&rsquo; Welfare</b>Runs activities that build cohesion across the team and manages employee welfare.</p></div>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <div className="dtitle">Contribution to the Community</div>
        <p className="prose wide">NTI takes part in public-welfare and environmental-protection activities, pushing community development forward and carrying out its mission through practical work rather than statements.</p>
        <div className="flist mt-s"><p className="fi"><b>Charity Bazaar</b>Charity events held through the year, with proceeds donated to related public-interest groups.</p><p className="fi"><b>Beach Cleanup</b>Coastal clean-up activity that keeps waste out of the ocean and raises awareness of marine debris in the community.</p></div>
      </div></section>
      <section className="section certs reveal"><div className="wrap certgrid">
        <img src="/assets/cert-green.png" alt="NTI Green Printing" />
        <img src="/assets/cert-fsc.png" alt="FSC certified" className="big" />
        <img src="/assets/cert-esg.png" alt="ESG Environmental, Social, Governance" />
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <p className="prose">Want this applied to your packaging? Send us the brief and we will come back with a spec and a quote.</p>
        <p className="mt-m"><A href={l("/get-a-quote")} className="btn btn-solid">Get a Quote</A></p>
        <p className="mt-m reveal"><A href={l("/green-our-advantage")} className="blink">Next: Our Green Advantage</A></p>
      </div></section>
    </>
  )
}
