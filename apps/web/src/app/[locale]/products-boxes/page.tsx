import type { Metadata } from 'next'
import { A } from '@/components/A'
import { pageMetadata, withLocale, type Locale } from '@/lib/i18n'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata(locale, "/products-boxes", {
    title: "Custom Color Box Packaging — NTI Printing",
  })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  const l = withLocale(locale)
  return (
    <>
      <section className="section"><div className="wrap">
        <h1 className="sec-title reveal">Custom Color Box Packaging</h1>
        <div className="sec-sub reveal">Package material printing with structure design, inside and out.</div>
        <p className="prose wide reveal mt-s">Explore NTI&rsquo;s full range of custom color box packaging and color box printing options below:</p>
        <nav className="pr-tabs reveal" aria-label="Product categories">
          <A href={l("/products-boxes")} className="active">Color Box Packaging</A>{' '}
          <A href={l("/products-cardboard")}>Packaging Paperboard</A>{' '}
          <A href={l("/products-uv")}>UV Printing</A>{' '}
          <A href={l("/products-other")}>Other Printing</A>
        </nav>
        <div className="pr-grid">
          <article className="pr-card reveal">
            <div className="pr-img"><img src="/assets/prod-box-gluing.jpg" alt="Gluing Box" loading="lazy" /></div>
            <div className="pr-body">
              <h3>Gluing Box</h3>
              <p>Simple top-and-bottom design, easy to assemble, ideal for lightweight products.</p>
              <div className="pr-apply"><b>Applications</b>Food, electronics, pharma, beauty and luxury goods &mdash; face-mask boxes, 3C packaging, cookie boxes, medical supplies and more.</div>
            </div>
          </article>
          <article className="pr-card reveal">
            <div className="pr-img"><img src="/assets/prod-box-bottom.jpg" alt="Bottom Gluing Box" loading="lazy" /></div>
            <div className="pr-body">
              <h3>Bottom Gluing Box</h3>
              <p>Reinforced bottom for heavier items, strong and secure.</p>
              <div className="pr-apply"><b>Applications</b>Food, electronics, pharma, beauty and luxury goods &mdash; face-mask boxes, 3C packaging, cookie boxes, medical supplies and more.</div>
            </div>
          </article>
          <article className="pr-card reveal">
            <div className="pr-img"><img src="/assets/prod-box-insert.jpg" alt="Insert Bottom Box" loading="lazy" /></div>
            <div className="pr-body">
              <h3>Insert Bottom Box</h3>
              <p>Four-latch cross structure for durability and easy assembly.</p>
              <div className="pr-apply"><b>Applications</b>Food, electronics, pharma and beauty &mdash; medical beauty products, 3C electronics, coffee packaging and more.</div>
            </div>
          </article>
          <article className="pr-card reveal">
            <div className="pr-img"><img src="/assets/prod-box-handcarry.jpg" alt="Hand-Carry Box" loading="lazy" /></div>
            <div className="pr-body">
              <h3>Hand-Carry Box</h3>
              <p>Built-in handle for convenience and reduced use of extra bags.</p>
              <div className="pr-apply"><b>Applications</b>Food &mdash; festival gift boxes, fruit gift boxes, cake and takeaway boxes, health drinks and more.</div>
            </div>
          </article>
          <article className="pr-card reveal">
            <div className="pr-img"><img src="/assets/prod-box-topbottom.jpg" alt="Top &amp; Bottom Box" loading="lazy" /></div>
            <div className="pr-body">
              <h3>Top &amp; Bottom Box</h3>
              <p>Premium two-piece box, elegant and perfect for gift packaging.</p>
              <div className="pr-apply"><b>Applications</b>Food &mdash; festival gift boxes, fruit gift boxes, cake boxes, pudding boxes and more.</div>
            </div>
          </article>
          <article className="pr-card reveal">
            <div className="pr-img"><img src="/assets/prod-box-special.jpg" alt="Special Package" loading="lazy" /></div>
            <div className="pr-body">
              <h3>Special Package</h3>
              <p>Fully customized designs and material suggestions for unique needs.</p>
              <div className="pr-apply"><b>Applications</b>Food, electronics, pharma, beauty and luxury &mdash; chocolate and cookie boxes, nougat, pineapple cakes, kraft boxes and more.</div>
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
