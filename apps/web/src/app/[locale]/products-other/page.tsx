import type { Metadata } from 'next'
import { A } from '@/components/A'
import { SolutionItems } from '@/components/cms'
import { getSolutionByCode } from '@/lib/api'
import { mediaUrl } from '@/lib/media'
import { pageMetadata, withLocale, type Locale } from '@/lib/i18n'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata(locale, "/products-other", {
    title: "Other Printing Services — NTI Printing",
  })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  const solution = await getSolutionByCode(locale, 'other')
  const l = withLocale(locale)
  return (
    <>
      <section className="section"><div className="wrap">
        <h1 className="sec-title reveal">Other Printing Services</h1>
        <div className="sec-sub reveal">Special Printing &amp; finishing</div>
        <p className="prose wide reveal mt-s">Enhance your packaging with premium finishes including foil stamping, embossing, holographic effects, and anti-counterfeiting features. Our specialty printing and custom print finishing solutions add visual impact, strengthen brand perception, and provide enhanced product security.</p>
        <p className="prose wide reveal mt-s">Other products include, but are not limited to, calendars, envelopes, bags, mouse pads, manuals, etc.</p>
        <nav className="pr-tabs reveal" aria-label="Product categories">
          <A href={l("/products-boxes")}>Color Box Packaging</A>{' '}
          <A href={l("/products-cardboard")}>Packaging Paperboard</A>{' '}
          <A href={l("/products-uv")}>UV Printing</A>{' '}
          <A href={l("/products-other")} className="active">Other Printing</A>
        </nav>
        {solution?.items.length ? (
          <SolutionItems items={solution.items} />
        ) : (
        <div className="pr-grid">
          <article className="pr-card reveal">
            <div className="pr-img"><img src={mediaUrl("/assets/prod-other-calendar.jpg")} alt="Desk Calendar" loading="lazy" /></div>
            <div className="pr-body">
              <h3>Desk Calendar</h3>
              <p>A daily-use publication that keeps your brand on the desk all year &mdash; festival gifting, corporate gifts and promotions.</p>
              <div className="pr-apply"><b>Applications</b>Every industry.</div>
            </div>
          </article>
          <article className="pr-card reveal">
            <div className="pr-img"><img src={mediaUrl("/assets/prod-other-redenvelope.jpg")} alt="Red Envelope" loading="lazy" /></div>
            <div className="pr-body">
              <h3>Red Envelope</h3>
              <p>Great graphic design or hot-foil embossing turns a tradition into a brand moment.</p>
              <div className="pr-apply"><b>Applications</b>Every industry.</div>
            </div>
          </article>
          <article className="pr-card reveal">
            <div className="pr-img"><img src={mediaUrl("/assets/prod-other-bag.jpg")} alt="Hand Bag" loading="lazy" /></div>
            <div className="pr-body">
              <h3>Hand Bag</h3>
              <p>Paper carriers that promote the product and lift the brand on the street.</p>
              <div className="pr-apply"><b>Applications</b>Every industry.</div>
            </div>
          </article>
          <article className="pr-card reveal">
            <div className="pr-img"><img src={mediaUrl("/assets/prod-other-mousepad.jpg")} alt="Mouse Pad" loading="lazy" /></div>
            <div className="pr-body">
              <h3>Mouse Pad</h3>
              <p>UV-printed for high colour saturation and long fade resistance.</p>
              <div className="pr-apply"><b>Applications</b>Every industry.</div>
            </div>
          </article>
          <article className="pr-card reveal">
            <div className="pr-img"><img src={mediaUrl("/assets/prod-other-manual.png")} alt="Instruction &amp; Catalogue" loading="lazy" /></div>
            <div className="pr-body">
              <h3>Instruction &amp; Catalogue</h3>
              <p>Product manuals, spec sheets and catalogues &mdash; function, usage and precautions, clearly printed.</p>
              <div className="pr-apply"><b>Applications</b>Every industry.</div>
            </div>
          </article>
        </div>
        )}
        <div className="faq-cta reveal mt-l">
          <div><h3>Have a spec in mind?</h3><p>Send the brief &mdash; a packaging engineer replies within one business day.</p></div>
          <A href={l("/get-a-quote")} className="btn btn-solid">Get a quote</A>
        </div>
      </div></section>
    </>
  )
}
