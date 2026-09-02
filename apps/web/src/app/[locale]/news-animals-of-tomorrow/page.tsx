import type { Metadata } from 'next'
import { A } from '@/components/A'
import { pageMetadata, withLocale, type Locale } from '@/lib/i18n'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata(locale, "/news-animals-of-tomorrow", {
    title: "Speaking up for the leopard cat: NTI joins the Animals of Tomorrow exhibition — NTI Printing",
  })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  const l = withLocale(locale)
  return (
    <>
      <section className="section subhead"><div className="wrap">
        <div className="crumb reveal"><A href={l("/")}>Home</A><span>&rsaquo;</span><A href={l("/insights")}>Insights</A><span>&rsaquo;</span><A href={l("/news")}>Latest News</A><span>&rsaquo;</span><b>Exhibition</b></div>
        <span className="news-meta reveal"><span className="cat">Exhibition</span><span className="date">2025.05.09</span></span>
        <h1 className="sec-title reveal">Speaking up for the leopard cat: NTI joins the Animals of Tomorrow exhibition</h1>
        <div className="sec-sub reveal">NTI joined 72 Design on the Animals of Tomorrow paper-model exhibition, supporting conservation of the Formosan black bear and the leopard cat through FSC-certified paper and HP Indigo digital printing.</div>
        <div className="artimg reveal mt-l"><img src="/assets/news/animals-of-tomorrow.jpg" alt="Speaking up for the leopard cat: NTI joins the Animals of Tomorrow exhibition" /></div>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <div className="dtitle">Life on paper, design with care</div>
        <p className="prose wide mt-s">The exhibition focuses on endangered species. NTI and 72 Design co-created interactive paper-model installations built around the Formosan black bear and the leopard cat, produced with variable printing and no plate-making &mdash; which in practice means a lower-carbon, lower-waste process, creative work that also teaches, and the flexibility of digital printing across small, varied runs.</p>
        <div className="dtitle mt-l">Details</div>
        <p className="prose wide mt-s"><b>Venue.</b> SPACE MOOR, Keelung.</p>
        <p className="prose wide mt-s"><b>Dates.</b> Through 25 May 2025, 12:00&ndash;19:00, free entry.</p>
        <p className="prose wide mt-s">The work was covered by Yahoo News, China Times, InTime and INNEWS, and an exhibition film is available on YouTube.</p>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <p><A href={l("/news")} className="btn btn-out">&laquo; All news</A></p>
        <p className="mt-m"><A href={l("/news-green-drive-seminar")} className="blink">Newer: Green Drive × Digital Innovation seminar wraps up</A></p>
        <p className="mt-m"><A href={l("/news-gentle-wild-paper-bags")} className="blink">Older: Gentle Wild paper bags: a different animal on every bag</A></p>
      </div></section>
    </>
  )
}
