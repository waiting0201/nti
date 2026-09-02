import type { Metadata } from 'next'
import { A } from '@/components/A'
import { PageForm } from '@/components/behaviors/PageForm'
import { pageMetadata, withLocale, type Locale } from '@/lib/i18n'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata(locale, "/contact", {
    title: "Contact Us — NTI Printing",
  })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  const l = withLocale(locale)
  return (
    <>
      <section className="section"><div className="wrap">
        <h1 className="sec-title reveal">Contact Us</h1>
        <div className="form-grid mt-l">
          <div className="info-stack reveal">
            <div className="info-card">
              <span className="info-ic"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg></span>
              <div><h3>Taichung Plant &amp; Office</h3><p>No. 18, Aly. 56, Ln. 192, Sec. 1, Dongshan Rd., Beitun Dist., Taichung 406, Taiwan</p></div>
            </div>
            <div className="info-card">
              <span className="info-ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8.1 9.6a16 16 0 0 0 6 6l1.1-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2Z" /></svg></span>
              <div><h3>Phone &amp; Email</h3><p><A href="tel:+886424366659">+886 4 2436 6659</A><br /><A href="mailto:service@nti-printing.com">service@nti-printing.com</A></p></div>
            </div>
            <div className="info-card">
              <span className="info-ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg></span>
              <div><h3>Business Hours</h3><p>Mon&ndash;Fri 08:30&ndash;17:30 (GMT+8)<br />Factory visits by appointment</p></div>
            </div>
            <div className="map-frame"><iframe src="https://www.google.com/maps?q=No.+18,+Aly.+56,+Ln.+192,+Sec.+1,+Dongshan+Rd.,+Beitun+Dist.,+Taichung+406,+Taiwan&output=embed" title="NTI Printing — Taichung plant location" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe></div>
          </div>
          <div>
            <div className="form-success" id="pgOk" hidden>
              <span className="ok"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="m5 13 4 4L19 7" /></svg></span>
              <h3>Message sent</h3>
              <p>Thank you &mdash; we will get back to you within one business day.</p>
              <button id="pgReset" type="button">Send another message</button>
            </div>
            <form className="form-card reveal" id="pgForm">
              <h2 style={{ fontSize: "1.25rem", fontWeight: "800", color: "var(--grey)" }}>Send us a message</h2>
              <div className="f2col">
                <label className="field">Name *<input required type="text" placeholder="Your name" /></label>{' '}
                <label className="field">Email *<input required type="email" placeholder="you@company.com" /></label>{' '}
                <label className="field">Company<input type="text" placeholder="Company name" /></label>{' '}
                <label className="field">Phone<input type="tel" placeholder="+886 &hellip;" /></label>
              </div>
              <label className="field">Message *<textarea required rows={6} placeholder="How can we help?"></textarea></label>{' '}
              <label className="fcheck"><input required type="checkbox" /><span>I agree to the processing of my data per the <A href={l("/privacy-legal")}>Privacy &amp; Legal</A> policy.</span></label>{' '}
              <button type="submit" className="btn btn-solid" style={{ alignSelf: "flex-start" }}>Send message <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M13 6l6 6-6 6" /></svg></button>
            </form>
          </div>
        </div>
      </div></section>
      <PageForm />
    </>
  )
}
