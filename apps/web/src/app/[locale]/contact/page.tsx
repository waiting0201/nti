import type { Metadata } from 'next'
import { T } from '@/lib/t'
import { A } from '@/components/A'
import { PageForm } from '@/components/behaviors/PageForm'
import { pageMetadata, withLocale, type Locale } from '@/lib/i18n'
import { getSettingMap, telHref } from '@/lib/site-settings'

/**
 * 這一頁的公司資訊改吃網站設定（後台單元 21）。
 *
 * 沒接 CMS、或某個 key 客戶還沒填，就照渲染下面寫死的 mockup 內容——這一頁在
 * `verify:markup` 的比對範圍內，預設建置必須與 mockup 逐字相同。
 *
 * ⚠ `generateMetadata()` 的 description 仍是寫死的：那段在頁面渲染之前就要決定，
 * 而且是 SEO 文案不是聯絡資訊（後台單元 20 才是改它的地方）。客戶改了電話，
 * 頁面上會變、搜尋結果的摘要不會——這是已知的，不是漏接。
 */

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata(locale, "/contact", {
    title: "Contact Us — NTI Printing",
    description: "Contact NTI Printing in Tainan, Taiwan. Phone +886 6 261 1358, service@nti-printing.com, Mon–Fri 08:30–17:30. Factory visits by appointment.",
  })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  const l = withLocale(locale)
  const settings = await getSettingMap(locale)

  const address = settings?.['company.address']
  const phone = settings?.['company.phone']
  const email = settings?.['company.email']
  const hours = settings?.['company.hours']
  const map = settings?.['company.map_embed']

  return (
    <T locale={locale}>
      <section className="section"><div className="wrap">
        <h1 className="sec-title reveal">Contact Us</h1>
        <div className="form-grid mt-l">
          <div className="info-stack reveal">
            <div className="info-card">
              <span className="info-ic"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg></span>
              <div><h3>Tainan Plant &amp; Office</h3><p>{address ?? 'No. 29, Gongye 6th Rd., Annan Dist., Tainan City 709, Taiwan'}</p></div>
            </div>
            <div className="info-card">
              <span className="info-ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8.1 9.6a16 16 0 0 0 6 6l1.1-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2Z" /></svg></span>
              <div><h3>Phone &amp; Email</h3><p><A href={phone ? telHref(phone) : "tel:+88662611358"}>{phone ?? '+886 6 261 1358'}</A><br /><A href={`mailto:${email ?? 'service@nti-printing.com'}`}>{email ?? 'service@nti-printing.com'}</A></p></div>
            </div>
            <div className="info-card">
              <span className="info-ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg></span>
              <div><h3>Business Hours</h3><p>{hours ?? 'Mon\u2013Fri 08:30\u201317:30 (GMT+8)'}<br />Factory visits by appointment</p></div>
            </div>
            <div className="map-frame"><iframe src={map ?? "https://www.google.com/maps?q=No.+29,+Gongye+6th+Rd.,+Annan+Dist.,+Tainan+City+709,+Taiwan&output=embed"} title="NTI Printing — Tainan plant location" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe></div>
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
                <label className="field">Name *<input required name="name" type="text" placeholder="Your name" /></label>{' '}
                <label className="field">Email *<input required name="email" type="email" placeholder="you@company.com" /></label>{' '}
                <label className="field">Company<input name="company" type="text" placeholder="Company name" /></label>{' '}
                <label className="field">Phone<input name="phone" type="tel" placeholder="+886 &hellip;" /></label>
              </div>
              <label className="field">Message *<textarea required name="message" rows={6} placeholder="How can we help?"></textarea></label>{' '}
              <label className="fcheck"><input required name="consent" type="checkbox" /><span>I agree to the processing of my data per the <A href={l("/privacy-legal")}>Privacy &amp; Legal</A> policy.</span></label>{' '}
              <button type="submit" className="btn btn-solid" style={{ alignSelf: "flex-start" }}>Send message <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M13 6l6 6-6 6" /></svg></button>
            </form>
          </div>
        </div>
      </div></section>
      <PageForm />
    </T>
  )
}
