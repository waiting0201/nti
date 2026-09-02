import type { Metadata } from 'next'
import { A } from '@/components/A'
import { mediaUrl } from '@/lib/media'
import { pageMetadata, withLocale, type Locale } from '@/lib/i18n'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata(locale, "/news-global-views-esg-award", {
    title: "NTI wins a 2026 Global Views ESG Award for low-carbon operations — NTI Printing",
  })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  const l = withLocale(locale)
  return (
    <>
      <section className="section subhead"><div className="wrap">
        <div className="crumb reveal"><A href={l("/")}>Home</A><span>&rsaquo;</span><A href={l("/insights")}>Insights</A><span>&rsaquo;</span><A href={l("/news")}>Latest News</A><span>&rsaquo;</span><b>Awards</b></div>
        <span className="news-meta reveal"><span className="cat">Awards</span><span className="date">2026.06.30</span></span>
        <h1 className="sec-title reveal">NTI wins a 2026 Global Views ESG Award for low-carbon operations</h1>
        <div className="sec-sub reveal">The 22nd Global Views ESG Corporate Sustainability Awards were held on 7 May at the Shangri-La Far Eastern Plaza Hotel, Taipei. NTI took the Outstanding Project award in the Low-Carbon Operations, SME category.</div>
        <div className="artimg reveal mt-l"><img src={mediaUrl("/assets/news/global-views-esg-award.jpg")} alt="NTI wins a 2026 Global Views ESG Award for low-carbon operations" /></div>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <p className="prose wide mt-s">The ceremony was hosted by Global Views Magazine, with Minister of Environment Peng Chi-Ming among the guests, marking the progress Taiwanese companies have made on sustainable transition.</p>
        <p className="prose wide mt-s">The Global Views ESG award is one of Taiwan&rsquo;s longest-running and most representative sustainability prizes. This year 142 companies entered 239 projects; only 57 companies and 81 entries won. NTI was among the small number of winners also featured in an interview and in the ceremony film.</p>
        <div className="dtitle mt-l">Years of work, now visible</div>
        <p className="prose wide mt-s">NTI has invested consistently in green printing, green packaging, smart logistics, low-carbon materials and printing technology. From a factory holding both LEED Gold and EEWH Diamond green building certification, through to green electricity, smart process management, low-carbon supply-chain collaboration and process-level carbon reduction, the aim has been to move sustainability out of the mission statement and into every process, every service and every pack.</p>
        <p className="prose wide mt-s">Low carbon is not only a corporate responsibility &mdash; it is competitiveness. For packaging printing, sustainability is not just using less energy and emitting less carbon; it is integrating design, materials, process and management so clients get packaging that delivers on quality, efficiency and environmental value at the same time.</p>
        <div className="dtitle mt-l">From the factory floor into education and culture</div>
        <p className="prose wide mt-s">Alongside low-carbon operations, NTI has been building an ESG paper-craft cultural education programme, combining green printing with creative content partners on work that promotes ecological conservation, disaster-prevention education and marine conservation &mdash; extending sustainability from manufacturing into education, culture and public participation.</p>
        <p className="prose wide mt-s">At the ceremony, Global Views founder Professor Charles Kao &mdash; on his 90th birthday &mdash; said that however ESG evolves, it comes down to one thing: doing things right. Driving ESG takes more than equipment and systems; it takes every colleague building on it in daily work.</p>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <p><A href={l("/news")} className="btn btn-out">&laquo; All news</A></p>
        <p className="mt-m"><A href={l("/news-firefighter-boardgame")} className="blink">Older: NTI donates a paper-model board game promoting disaster-prevention education</A></p>
      </div></section>
    </>
  )
}
