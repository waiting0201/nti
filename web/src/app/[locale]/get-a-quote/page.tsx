import type { Metadata } from 'next'
import { A } from '@/components/A'
import { PageForm } from '@/components/behaviors/PageForm'
import { pageMetadata, withLocale, type Locale } from '@/lib/i18n'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata(locale, "/get-a-quote", {
    title: "Get a Quote — NTI Printing",
  })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  const l = withLocale(locale)
  return (
    <>
      <section className="section"><div className="wrap form-grid">
        <div className="form-side">
          <h1 className="sec-title reveal">Get a Quote</h1>
          <p className="prose reveal mt-s">Tell us what the package must do. A packaging engineer &mdash; not a bot &mdash; replies within one business day with routes and rough numbers.</p>
          <div className="fsteps reveal">
            <div className="fstep"><b>1</b>Send the brief &mdash; dieline optional</div>
            <div className="fstep"><b>2</b>We propose structure, material &amp; process</div>
            <div className="fstep"><b>3</b>Quote with carbon estimate included</div>
          </div>
        </div>
        <div>
          <div className="form-success" id="pgOk" hidden>
            <span className="ok"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="m5 13 4 4L19 7" /></svg></span>
            <h3>Request received</h3>
            <p>Thank you &mdash; our team will reply within one business day. A copy of your request has been sent to your email.</p>
            <button id="pgReset" type="button">Submit another request</button>
          </div>
          <form className="form-card reveal" id="pgForm">
            <div>
              <div className="flegend">1 &middot; Contact</div>
              <div className="f2col">
                <label className="field">Full name *<input required type="text" placeholder="Jane Chen" /></label>{' '}
                <label className="field">Company *<input required type="text" placeholder="Brand Co., Ltd." /></label>{' '}
                <label className="field">Email *<input required type="email" placeholder="jane@brand.com" /></label>{' '}
                <label className="field">Phone<input type="tel" placeholder="+886 &hellip;" /></label>
              </div>
            </div>
            <div>
              <div className="flegend">2 &middot; Project</div>
              <div className="f2col">
                <label className="field">Product type *<select required><option value="">Select&hellip;</option><option>Color Box Packaging</option><option>Packaging Paperboard</option><option>UV Printing</option><option>Other Printing</option></select></label>{' '}
                <label className="field">Industry<select><option value="">Select&hellip;</option><option>Food &amp; Beverage</option><option>Electronics</option><option>Beauty &amp; Skincare</option><option>Medical &amp; Healthcare</option><option>Luxury &amp; Gift Packaging</option><option>Hardware &amp; Hand Tools</option><option>Automotive</option><option>Publishing &amp; Stationery</option><option>Home &amp; Lifestyle</option><option>Industrial &amp; Consumer Goods</option></select></label>{' '}
                <label className="field">Quantity *<input required type="text" placeholder="e.g. 10,000" /></label>{' '}
                <label className="field">Size (L&times;W&times;H mm)<input type="text" placeholder="e.g. 220 &times; 160 &times; 60" /></label>{' '}
                <label className="field">Material preference<select><option value="">No preference &mdash; advise me</option><option>FSC&trade;-certified board</option><option>Recycled board</option><option>Kraft</option><option>Specialty / metallized</option></select></label>{' '}
                <label className="field">Target date<input type="date" /></label>
              </div>
              <label className="fcheck" style={{ marginTop: "18px", fontSize: ".88rem", color: "var(--grey)", fontWeight: "700" }}><input type="checkbox" /><span>Include a per-order carbon estimate</span></label>
            </div>
            <div>
              <div className="flegend">3 &middot; Details</div>
              <label className="field">Describe the requirement *<textarea required rows={5} placeholder="What must this package do? Food contact, export market, shelf finish, compliance&hellip;"></textarea></label>
              <div className="fupload"><b>Attach files</b> &mdash; dieline, artwork or reference photos (PDF/AI/PSD/JPG/PNG/ZIP, &le; 20 MB each, up to 5 files)</div>
            </div>
            <div className="ffoot">
              <label className="fcheck"><input required type="checkbox" /><span>I agree to the processing of my data per the <A href={l("/privacy-legal")}>Privacy &amp; Legal</A> policy.</span></label>{' '}
              <button type="submit" className="btn btn-solid">Submit request <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M13 6l6 6-6 6" /></svg></button>
            </div>
          </form>
        </div>
      </div></section>
      <PageForm />
    </>
  )
}
