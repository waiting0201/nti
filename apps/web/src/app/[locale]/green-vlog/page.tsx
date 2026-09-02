import type { Metadata } from 'next'
import { A } from '@/components/A'
import { pageMetadata, type Locale } from '@/lib/i18n'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata(locale, "/green-vlog", {
    title: "Green Vlog — NTI Printing",
  })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  return (
    <>
      <section className="section"><div className="wrap">
        <h1 className="sec-title reveal">Green Vlog <span className="ti-slash">/</span> <span className="ti-alt">Green knowledge hub</span></h1>
        <div className="sec-sub reveal">Explore practical insights, industry trends, and sustainable packaging and eco friendly printing solutions that help brands build a greener future.</div>
        <div className="video-frame reveal mt-l">
          <iframe src="https://www.youtube.com/embed/plgjH8Jw8pE" title="The Perfect Partner for Packaging Printing — NTI Printing" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
        </div>
        <div className="vl-grid">
          <A className="vl-card reveal" href="https://www.youtube.com/watch?v=XbpMQ6oZV88" target="_blank" rel="noopener">
            <span className="vl-thumb"><img src="https://img.youtube.com/vi/XbpMQ6oZV88/hqdefault.jpg" alt="" loading="lazy" /><span className="vl-play"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg></span></span>{' '}
            <span><span className="vl-ep">Sustainability</span><h3>Nature and Sustainability</h3></span>
          </A>{' '}
          <A className="vl-card reveal" href="https://www.youtube.com/watch?v=vECuYIiFSSM" target="_blank" rel="noopener">
            <span className="vl-thumb"><img src="https://img.youtube.com/vi/vECuYIiFSSM/hqdefault.jpg" alt="" loading="lazy" /><span className="vl-play"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg></span></span>{' '}
            <span><span className="vl-ep">Low-carbon production</span><h3>Integrated Low-Carbon Production</h3></span>
          </A>{' '}
          <A className="vl-card reveal" href="https://www.youtube.com/watch?v=Hc_WJwWZQSo" target="_blank" rel="noopener">
            <span className="vl-thumb"><img src="https://img.youtube.com/vi/Hc_WJwWZQSo/hqdefault.jpg" alt="" loading="lazy" /><span className="vl-play"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg></span></span>{' '}
            <span><span className="vl-ep">Awards</span><h3>2024 SME Benchmark Enterprise Award</h3></span>
          </A>
        </div>
      </div></section>
    </>
  )
}
