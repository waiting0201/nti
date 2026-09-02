import type { Metadata } from 'next'
import { A } from '@/components/A'
import { mediaUrl } from '@/lib/media'
import { pageMetadata, withLocale, type Locale } from '@/lib/i18n'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata(locale, "/insights", {
    title: "Insights — NTI Printing",
    description: "NTI Printing Insights — company news, Green Vlog videos, FAQ and sustainable packaging industry trends from Taiwan&rsquo;s green printing specialist.",
  })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  const l = withLocale(locale)
  return (
    <>
      <section className="fac-banner"><img src={mediaUrl("/assets/green-tree.jpg")} alt="NTI Printing Insights — sustainable packaging knowledge hub" /></section>
      <section className="section"><div className="wrap">
        <h1 className="sec-title reveal">Insights <span className="ti-slash">/</span> <span className="ti-alt">Knowledge hub</span></h1>
        <div className="sec-sub reveal">Company news, video stories, straight answers and the trends reshaping packaging &mdash; everything we learn about printing green, gathered in one place.</div>
        <div className="vl-grid mt-l">
          <A className="vl-card reveal" href={l("/news")}>
            <span className="vl-thumb"><img src={mediaUrl("/assets/news/global-views-esg-award.jpg")} alt="" loading="lazy" /></span>{' '}
            <span><span className="vl-ep">Latest News</span><h3>Awards, partnerships and green printing milestones</h3></span>
          </A>{' '}
          <A className="vl-card reveal" href={l("/green-vlog")}>
            <span className="vl-thumb"><img src="https://img.youtube.com/vi/plgjH8Jw8pE/hqdefault.jpg" alt="" loading="lazy" /><span className="vl-play"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg></span></span>{' '}
            <span><span className="vl-ep">Green Vlog</span><h3>Watch how low-carbon packaging is actually made</h3></span>
          </A>{' '}
          <A className="vl-card reveal" href={l("/faq")}>
            <span className="vl-thumb"><img src={mediaUrl("/assets/fac-pre-proof.jpg")} alt="" loading="lazy" /></span>{' '}
            <span><span className="vl-ep">FAQ</span><h3>Minimums, lead times, certifications &mdash; answered</h3></span>
          </A>{' '}
          <A className="vl-card reveal" href={l("/industry-trends")}>
            <span className="vl-thumb"><img src={mediaUrl("/assets/sol-patterns.jpg")} alt="" loading="lazy" /></span>{' '}
            <span><span className="vl-ep">Industry Trends</span><h3>Where sustainable packaging is heading next</h3></span>
          </A>
        </div>
      </div></section>
    </>
  )
}
