import type { Metadata } from 'next'
import { A } from '@/components/A'
import { mediaUrl } from '@/lib/media'
import { pageMetadata, withLocale, type Locale } from '@/lib/i18n'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata(locale, "/products-cardboard", {
    title: "Packaging Paperboard — NTI Printing",
  })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  const l = withLocale(locale)
  return (
    <>
      <section className="section"><div className="wrap">
        <h1 className="sec-title reveal">Packaging Paperboard</h1>
        <div className="sec-sub reveal">Paper hang tags &amp; backcards for blister packages.</div>
        <p className="prose wide reveal mt-s">NTI Printing produces custom cardboard packaging and printed cardboard boxes for retail, industrial, and consumer applications, including:</p>
        <nav className="pr-tabs reveal" aria-label="Product categories">
          <A href={l("/products-boxes")}>Color Box Packaging</A>{' '}
          <A href={l("/products-cardboard")} className="active">Packaging Paperboard</A>{' '}
          <A href={l("/products-uv")}>UV Printing</A>{' '}
          <A href={l("/products-other")}>Other Printing</A>
        </nav>
        <div className="pr-grid">
          <article className="pr-card reveal">
            <div className="pr-img"><img src={mediaUrl("/assets/prod-card-hangtag.jpg")} alt="Paper Hang Tags &amp; Blister Back Cards" loading="lazy" /></div>
            <div className="pr-body">
              <h3>Paper Hang Tags &amp; Blister Back Cards</h3>
              <p>Custom-printed paper hang tags and blister back cards designed to enhance product presentation while providing clear product information and strong retail impact.</p>
              <div className="pr-apply"><b>Applications</b>Hand tools, hardware, electronic components, automotive parts, and a wide range of consumer products.</div>
            </div>
          </article>
          <article className="pr-card reveal">
            <div className="pr-img"><img src={mediaUrl("/assets/prod-card-blister.jpg")} alt="Blister Card Packaging" loading="lazy" /></div>
            <div className="pr-body">
              <h3>Blister Card Packaging</h3>
              <p>Blister card packaging combines two printed paperboards with a clear plastic blister to provide secure product protection, excellent visibility, and strong retail presentation.</p>
              <div className="pr-apply"><b>Applications</b>Electronics, electrical appliances, hardware and hand tools.</div>
            </div>
          </article>
          <article className="pr-card reveal">
            <div className="pr-img"><img src={mediaUrl("/assets/prod-card-hangtag.jpg")} alt="Multi-Panel Hang Tags" loading="lazy" /></div>
            <div className="pr-body">
              <h3>Multi-Panel Hang Tags</h3>
              <p>Multi-panel hang tags provide additional space for product information, branding, and multilingual content while maintaining a compact retail presentation.</p>
              <div className="pr-apply"><b>Applications</b>Electronics, electrical products, hardware, hand tools, and industrial applications.</div>
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
