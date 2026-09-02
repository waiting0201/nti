import type { Metadata } from 'next'
import { pageMetadata, type Locale } from '@/lib/i18n'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata(locale, "/privacy-legal", {
    title: "Privacy & Legal — NTI Printing",
  })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  return (
    <>
      <section className="section"><div className="wrap"><div className="legal-wrap">
        <h1 className="sec-title reveal">Privacy &amp; Legal</h1>
        <p className="legal-meta reveal mt-s">Last updated: July 2026 &middot; Placeholder copy &mdash; final terms to be supplied by legal counsel</p>
        <div className="legal reveal">
          <section><h2>1. Data We Collect</h2><p>Placeholder copy — describes the personal data collected through quote requests, contact forms, member registration and supplier submissions: name, company, email, phone, and files you upload. Formal wording to be supplied by legal counsel.</p></section>
          <section><h2>2. How We Use Your Data</h2><p>Placeholder copy — data is used to respond to enquiries, prepare quotations, fulfil orders, manage supplier relationships and, with consent, send service updates. It is never sold to third parties.</p></section>
          <section><h2>3. Cookies &amp; Analytics</h2><p>Placeholder copy — the site uses essential cookies for language preference and session management, plus privacy-respecting analytics to improve content. You can disable non-essential cookies in your browser.</p></section>
          <section><h2>4. Data Retention &amp; Security</h2><p>Placeholder copy — personal data is retained only as long as needed for the stated purpose or as required by law, stored on access-controlled systems hosted in Azure with encryption in transit and at rest.</p></section>
          <section><h2>5. Your Rights</h2><p>Placeholder copy — under Taiwan&rsquo;s Personal Data Protection Act you may request access, correction or deletion of your data at any time by contacting service@nti-printing.com.</p></section>
          <section><h2>6. Legal Notices</h2><p>Placeholder copy — all content, trademarks and brand imagery on this site belong to NTI Printing Co., Ltd. Reproduction without written permission is prohibited. Governing law: Republic of China (Taiwan).</p></section>
        </div>
      </div></div></section>
    </>
  )
}
