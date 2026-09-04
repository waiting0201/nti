import type { Metadata } from 'next'
import { A } from '@/components/A'
import { FaqList } from '@/components/cms'
import { getFaqs } from '@/lib/api'
import { FaqFilter } from '@/components/behaviors/FaqFilter'
import { pageMetadata, withLocale, type Locale } from '@/lib/i18n'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata(locale, "/faq", {
    title: "FAQ — NTI Printing",
  })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  const l = withLocale(locale)

  // CMS 有內容就用 CMS 的，沒有就是下面寫死的 mockup 內容（見 lib/api.ts）
  const faqs = await getFaqs(locale)

  const faqCta = (
    <div className="faq-cta reveal">
      <div><h3>Didn&rsquo;t find your answer?</h3><p>Our team replies within one business day.</p></div>
      <A href={l("/contact")} className="btn btn-solid">Contact us</A>
    </div>
  )

  return (
    <>
      <section className="section"><div className="wrap">
        <h1 className="sec-title reveal">FAQ <span className="ti-slash">/</span> <span className="ti-alt">Your questions answered</span></h1>
        <div className="sec-sub reveal">Find answers to common questions about green printing, packaging, certifications, sustainability, and working with NTI.</div>
        {faqs?.length ? (
          <FaqList items={faqs}>{faqCta}</FaqList>
        ) : (
        <div className="faq-layout">
          <nav className="faq-nav reveal" id="faqNav" aria-label="FAQ categories">
            <button className="active" data-c="All">All questions</button>{' '}
            <button data-c="Certifications">Certifications</button>{' '}
            <button data-c="Sustainability">Sustainability</button>{' '}
            <button data-c="Services">Services &amp; Process</button>{' '}
            <button data-c="International">International</button>
          </nav>
          <div>
        <div className="faq-list reveal">
          <details className="faq" open data-c="Services"><summary><span>What is your minimum order quantity?</span></summary><p>It depends on the process. Offset color boxes typically start around 1,000 units; short-run and pilot production can go lower on our digital and UV lines. Tell us the quantity you actually need — we will spec the most economical route rather than force a minimum.</p></details>
          <details className="faq" data-c="Certifications"><summary><span>Can you handle food-grade and pharma packaging requirements?</span></summary><p>Yes. We run migration-safe, low-odor ink systems for food contact, and GMP-aligned inspection with batch traceability for pharmaceutical cartons. Compliance documentation is prepared together with the job.</p></details>
          <details className="faq" data-c="Services"><summary><span>What files do you need to start a quote?</span></summary><p>A dieline (AI/PDF) if you have one, artwork in PDF/X, and your target quantity, board and finish. No dieline yet? Send product dimensions and we will propose a structure.</p></details>
          <details className="faq" data-c="Sustainability"><summary><span>How do you calculate the carbon footprint of my order?</span></summary><p>We meter energy, board, ink and waste at each production stage against our audited baseline, then allocate to your order by run. You receive a per-order figure your ESG team can cite, with methodology notes.</p></details>
          <details className="faq" data-c="Sustainability"><summary><span>Which eco materials can you print on?</span></summary><p>FSC™-certified virgin and recycled boards, kraft, and specialty recycled stocks. We replace plastic lamination with recyclable coatings wherever the spec allows.</p></details>
          <details className="faq" data-c="Services"><summary><span>What are typical lead times?</span></summary><p>Standard color box orders run 10–15 working days from artwork approval; repeat orders are faster. Complex finishing adds time — we commit dates from real machine capacity, and keep them.</p></details>
          <details className="faq" data-c="Services"><summary><span>Do you support structural design and prototyping?</span></summary><p>Yes. Our pre-press team provides dielines, white samples and printed mockups, plus drop and transit testing for shipping structures before mass production.</p></details>
          <details className="faq" data-c="International"><summary><span>Can international clients work with you?</span></summary><p>Absolutely — a large share of our output ships to Japan, the EU and North America. We handle export cartons, documentation and freight coordination from the Tainan plant.</p></details>
        </div>
        {faqCta}
          </div>
        </div>
        )}
      </div></section>
      <FaqFilter />
    </>
  )
}
