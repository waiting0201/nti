import type { Metadata } from 'next'
import { A } from '@/components/A'
import { mediaUrl } from '@/lib/media'
import { pageMetadata, withLocale, type Locale } from '@/lib/i18n'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata(locale, "/products-uv", {
    title: "UV Printing — NTI Printing",
  })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  const l = withLocale(locale)
  return (
    <>
      <section className="section"><div className="wrap">
        <h1 className="sec-title reveal">UV Printing</h1>
        <div className="sec-sub reveal">Print on the materials ordinary ink can&rsquo;t touch.</div>
        <p className="prose wide reveal mt-s">UV printing delivers vibrant, durable graphics on plastics, metal foils, coated paperboards, and other non-absorbent materials. Its instant curing process speeds up production, improves print quality, and supports premium finishes, specialty coatings, and anti-counterfeiting applications &mdash; one reason NTI Printing is a trusted source for UV coating printing in Taiwan.</p>
        <nav className="pr-tabs reveal" aria-label="Product categories">
          <A href={l("/products-boxes")}>Color Box Packaging</A>{' '}
          <A href={l("/products-cardboard")}>Packaging Paperboard</A>{' '}
          <A href={l("/products-uv")} className="active">UV Printing</A>{' '}
          <A href={l("/products-other")}>Other Printing</A>
        </nav>
        <div className="pr-grid two">
          <article className="pr-card reveal">
            <div className="pr-img"><img src={mediaUrl("/assets/prod-uv-print.jpg")} alt="UV Printing" loading="lazy" /></div>
            <div className="pr-body">
              <h3>UV Printing</h3>
              <p>Lithographic printing cured instantly by UV &mdash; runs on plastics and glossy boards where ink will not air-dry: PE, PVC and PP films, metal foil and other non-absorbent materials. Post-press can start immediately, with no back-print, cutting production time and cost.</p>
              <div className="pr-apply"><b>Applications</b>Food, electronics, pharma, beauty and luxury goods &mdash; face-mask boxes, 3C packaging, cookie boxes, medical supplies coffee boxes and more.</div>
            </div>
          </article>
          <article className="pr-card reveal">
            <div className="pr-img"><img src={mediaUrl("/assets/prod-uv-special.jpg")} alt="Special Printing" loading="lazy" /></div>
            <div className="pr-body">
              <h3>Special Printing</h3>
              <p>Foil embossing and logical-light embossment developed for anti-counterfeiting and standout product finishes.</p>
              <div className="pr-apply"><b>Applications</b>Food, electronics, pharma, beauty and luxury goods &mdash; face-mask boxes, 3C packaging, cookie boxes, medical supplies medical beauty packaging and more.</div>
            </div>
          </article>
        </div>
        <div className="faq-cta reveal mt-l">
          <div><h3>Have a spec in mind?</h3><p>Send the brief &mdash; a packaging engineer replies within one business day.</p></div>
          <A href={l("/get-a-quote")} className="btn btn-solid">Get a quote</A>
        </div>
      </div></section>
    </>
  )
}
