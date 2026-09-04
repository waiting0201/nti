import type { Metadata } from 'next'
import { A } from '@/components/A'
import { NewsList } from '@/components/cms'
import { getNews } from '@/lib/api'
import { mediaUrl } from '@/lib/media'
import { pageMetadata, withLocale, type Locale } from '@/lib/i18n'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata(locale, "/news", {
    title: "News — NTI Printing",
  })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  const news = await getNews(locale)
  const l = withLocale(locale)
  return (
    <>
      <section className="fac-banner"><img src={mediaUrl("/assets/diff-grid.jpg")} alt="NTI Printing news — sustainably printed packaging patterns" /></section>
      <section className="section"><div className="wrap">
        <h1 className="sec-title reveal">News <span className="ti-slash">/</span> <span className="ti-alt">Latest news &amp; insights</span></h1>
        <div className="sec-sub reveal">Stay connected with NTI Printing&rsquo;s latest green printing innovations, sustainable packaging initiatives, company news, and industry achievements.</div>
        {news?.length ? (
          <NewsList items={news} locale={locale} />
        ) : (
        <>
        <A href={l("/news-global-views-esg-award")} className="news-feature reveal mt-l">
          <div className="nf-img"><img src={mediaUrl("/assets/news/global-views-esg-award.jpg")} alt="NTI wins a 2026 Global Views ESG Award for low-carbon operations" /></div>
          <div className="nf-body">
            <span className="news-meta"><span className="cat">Awards</span><span className="date">2026.06.30</span></span>
            <h2>NTI wins a 2026 Global Views ESG Award for low-carbon operations</h2>
            <p>The 22nd Global Views ESG Corporate Sustainability Awards were held on 7 May at the Shangri-La Far Eastern Plaza Hotel, Taipei. NTI took the Outstanding Project award in the Low-Carbon Operations, SME category.</p>
            <span className="rm">Read more <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
          </div>
        </A>
        <div className="news-grid">
          <A href={l("/news-firefighter-boardgame")} className="ncard reveal" data-d="1">
            <div className="nc-img"><img src={mediaUrl("/assets/news/firefighter-boardgame.jpg")} alt="" loading="lazy" /></div>
            <div className="nc-body">
              <span className="news-meta"><span className="cat">ESG</span><span className="date">2026.03.13</span></span>
              <h3>NTI donates a paper-model board game promoting disaster-prevention education</h3>
              <span className="rm">Read more <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
            </div>
          </A>{' '}
          <A href={l("/news-national-sustainable-development-award")} className="ncard reveal" data-d="2">
            <div className="nc-img"><img src={mediaUrl("/assets/news/national-sustainable-development-award.jpg")} alt="" loading="lazy" /></div>
            <div className="nc-body">
              <span className="news-meta"><span className="cat">Awards</span><span className="date">2026.03.09</span></span>
              <h3>NTI receives the National Sustainable Development Award</h3>
              <span className="rm">Read more <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
            </div>
          </A>{' '}
          <A href={l("/news-taicca-partnership")} className="ncard reveal" data-d="3">
            <div className="nc-img"><img src={mediaUrl("/assets/news/taicca-partnership.jpg")} alt="" loading="lazy" /></div>
            <div className="nc-body">
              <span className="news-meta"><span className="cat">Partnership</span><span className="date">2025.11.13</span></span>
              <h3>NTI signs an ESG for Culture letter of intent with TAICCA</h3>
              <span className="rm">Read more <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
            </div>
          </A>{' '}
          <A href={l("/news-green-printing-digital-innovation")} className="ncard reveal" data-d="1">
            <div className="nc-img"><img src={mediaUrl("/assets/news/green-printing-digital-innovation.jpg")} alt="" loading="lazy" /></div>
            <div className="nc-body">
              <span className="news-meta"><span className="cat">Sustainability</span><span className="date">2025.09.16</span></span>
              <h3>Green printing and digital innovation at NTI Tainan</h3>
              <span className="rm">Read more <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
            </div>
          </A>{' '}
          <A href={l("/news-green-drive-seminar")} className="ncard reveal" data-d="2">
            <div className="nc-img"><img src={mediaUrl("/assets/news/green-drive-seminar.jpg")} alt="" loading="lazy" /></div>
            <div className="nc-body">
              <span className="news-meta"><span className="cat">Event</span><span className="date">2025.07.01</span></span>
              <h3>Green Drive × Digital Innovation seminar wraps up</h3>
              <span className="rm">Read more <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
            </div>
          </A>{' '}
          <A href={l("/news-animals-of-tomorrow")} className="ncard reveal" data-d="3">
            <div className="nc-img"><img src={mediaUrl("/assets/news/animals-of-tomorrow.jpg")} alt="" loading="lazy" /></div>
            <div className="nc-body">
              <span className="news-meta"><span className="cat">Exhibition</span><span className="date">2025.05.09</span></span>
              <h3>Speaking up for the leopard cat: NTI joins the Animals of Tomorrow exhibition</h3>
              <span className="rm">Read more <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
            </div>
          </A>{' '}
          <A href={l("/news-gentle-wild-paper-bags")} className="ncard reveal" data-d="1">
            <div className="nc-img"><img src={mediaUrl("/assets/news/gentle-wild-paper-bags.png")} alt="" loading="lazy" /></div>
            <div className="nc-body">
              <span className="news-meta"><span className="cat">Digital Printing</span><span className="date">2025.04.18</span></span>
              <h3>Gentle Wild paper bags: a different animal on every bag</h3>
              <span className="rm">Read more <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
            </div>
          </A>{' '}
          <A href={l("/news-hp-variable-data-printing")} className="ncard reveal" data-d="2">
            <div className="nc-img"><img src={mediaUrl("/assets/news/hp-variable-data-printing.jpg")} alt="" loading="lazy" /></div>
            <div className="nc-body">
              <span className="news-meta"><span className="cat">Digital Printing</span><span className="date">2025.03.21</span></span>
              <h3>HP variable data printing: small runs that still stand out</h3>
              <span className="rm">Read more <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
            </div>
          </A>{' '}
          <A href={l("/news-sme-investment-benchmark")} className="ncard reveal" data-d="3">
            <div className="nc-img"><img src={mediaUrl("/assets/news/sme-investment-benchmark.jpg")} alt="" loading="lazy" /></div>
            <div className="nc-body">
              <span className="news-meta"><span className="cat">Awards</span><span className="date">2025.01.15</span></span>
              <h3>Named a benchmark enterprise in the SME Accelerated Investment Programme</h3>
              <span className="rm">Read more <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
            </div>
          </A>{' '}
          <A href={l("/news-commonwealth-interview")} className="ncard reveal" data-d="1">
            <div className="nc-img"><img src={mediaUrl("/assets/news/commonwealth-interview.jpg")} alt="" loading="lazy" /></div>
            <div className="nc-body">
              <span className="news-meta"><span className="cat">Media</span><span className="date">2024.11.11</span></span>
              <h3>NTI interviewed by CommonWealth Magazine</h3>
              <span className="rm">Read more <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
            </div>
          </A>{' '}
          <A href={l("/news-low-carbon-production-film")} className="ncard reveal" data-d="2">
            <div className="nc-img"><img src={mediaUrl("/assets/news/low-carbon-production-film.jpg")} alt="" loading="lazy" /></div>
            <div className="nc-body">
              <span className="news-meta"><span className="cat">Sustainability</span><span className="date">2024.08.09</span></span>
              <h3>Our integrated low-carbon production model &mdash; company film</h3>
              <span className="rm">Read more <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
            </div>
          </A>
        </div>
        </>
        )}
      </div></section>
    </>
  )
}
