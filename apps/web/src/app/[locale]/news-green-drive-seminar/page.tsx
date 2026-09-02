import type { Metadata } from 'next'
import { A } from '@/components/A'
import { pageMetadata, withLocale, type Locale } from '@/lib/i18n'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata(locale, "/news-green-drive-seminar", {
    title: "Green Drive × Digital Innovation seminar wraps up — NTI Printing",
  })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  const l = withLocale(locale)
  return (
    <>
      <section className="section subhead"><div className="wrap">
        <div className="crumb reveal"><A href={l("/")}>Home</A><span>&rsaquo;</span><A href={l("/insights")}>Insights</A><span>&rsaquo;</span><A href={l("/news")}>Latest News</A><span>&rsaquo;</span><b>Event</b></div>
        <span className="news-meta reveal"><span className="cat">Event</span><span className="date">2025.07.01</span></span>
        <h1 className="sec-title reveal">Green Drive × Digital Innovation seminar wraps up</h1>
        <div className="sec-sub reveal">NTI&rsquo;s Green Drive × Digital Innovation seminar closed on 26 June 2025 &mdash; a day focused on low-carbon process, digital transformation and sustainable brands.</div>
        <div className="artimg reveal mt-l"><img src="/assets/news/green-drive-seminar.jpg" alt="Green Drive × Digital Innovation seminar wraps up" /></div>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <div className="dtitle">On the programme</div>
        <p className="prose wide mt-s">HP&rsquo;s Asia-Pacific brand manager on global trends in digital transformation.</p>
        <p className="prose wide mt-s">Practical application of green supply chains and digital packaging processes.</p>
        <p className="prose wide mt-s">A live equipment tour with open discussion, connecting the design side with the brand side.</p>
        <p className="prose wide mt-s">A networking dinner opening up cross-sector collaboration.</p>
        <p className="prose wide mt-s">The seminar was less an information exchange than a working session on where the industry goes next. NTI will keep putting eco-friendly packaging into practice and accelerating its adoption of digital transformation technology, helping clients build sustainable brands with more resilience and more competitive edge.</p>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <p><A href={l("/news")} className="btn btn-out">&laquo; All news</A></p>
        <p className="mt-m"><A href={l("/news-green-printing-digital-innovation")} className="blink">Newer: Green printing and digital innovation at NTI Tainan</A></p>
        <p className="mt-m"><A href={l("/news-animals-of-tomorrow")} className="blink">Older: Speaking up for the leopard cat: NTI joins the Animals of Tomorrow exhibition</A></p>
      </div></section>
    </>
  )
}
