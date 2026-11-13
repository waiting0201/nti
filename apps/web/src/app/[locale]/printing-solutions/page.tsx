import type { Metadata } from 'next'
import { T } from '@/lib/t'
import { bannerSrc, cmsMedia, getPage, getSolutionByCode, midBannerSrc } from '@/lib/api'
import { PageBanner, PageMidBanner } from '@/components/cms'
import { A } from '@/components/A'
import { mediaUrl } from '@/lib/media'
import { ProductShowcase, type ShowcaseItem } from '@/components/behaviors/ProductShowcase'
import { pageMetadata, withLocale, type Locale } from '@/lib/i18n'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata(locale, "/printing-solutions", {
    title: "Custom Packaging & Printing Solutions | NTI Printing Taiwan",
    description: "Custom packaging boxes and printing solutions from NTI Taiwan: material selection, structural design, printing, finishing and technical support.",
  })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  // 後台「頁面文字」的覆寫（單元 15）；沒接 API 或沒改過就是 undefined，照 mockup 原文
  const page = await getPage(locale, "solutions")
  const l = withLocale(locale)
  // Products 輪播：圖／名稱／說明取自後台「02 解決方案 › 品項卡」（與四個產品頁同一份）。
  // 沒接 API、或某個方案一張品項卡都沒有時，該方案照 mockup 寫死的內容（ProductShowcase 的 SETS）
  const codes = ['boxes', 'cardboard', 'uv', 'other'] as const
  const solutions = await Promise.all(codes.map((c) => getSolutionByCode(locale, c)))
  const cmsSets: Partial<Record<string, ShowcaseItem[]>> = {}
  // 接了 CMS 而方案已下架、或一張上架的品項卡都沒有：那個分頁不顯示（不退回 mockup 的示範品項）。
  // 沒接 API（null）才照 ProductShowcase 裡寫死的 SETS
  const hidden: string[] = []
  codes.forEach((c, i) => {
    const solution = solutions[i]
    if (solution === null) return
    const items = solution ? solution.items : []
    if (items.length) cmsSets[c] = items.map((it) => ({ src: cmsMedia(it.imagePath), name: it.name, cap: it.description ?? '' }))
    else hidden.push(c)
  })
  const visible = codes.filter((c) => !hidden.includes(c))
  // 一開始顯示的是第一個看得到的分頁；它不是 boxes 時（boxes 被下架）由 ProductShowcase 掛載後補上 Applications 那行
  const firstCode = visible[0]
  const first = firstCode ? cmsSets[firstCode]?.[0] : undefined
  const firstCount = firstCode ? cmsSets[firstCode]?.length : undefined
  const tab = (code: string) => (code === firstCode ? 'active' : undefined)
  return (
    <T locale={locale} overrides={page?.texts}>
      <PageBanner src={bannerSrc(page, "/assets/ref-sol-banner.webp")} alt="NTI custom printed packaging solutions" />
      <section className="section"><div className="wrap">
        <div className="crumb reveal"><A href={l("/")}>Home</A><span>&rsaquo;</span><b>Solutions</b></div>
        <h1 className="sec-title reveal">Custom Packaging &amp; Printing Solutions</h1>
        <h3 className="fac-sub reveal mt-s">Tailored Printing. Sustainable Design.</h3>
        <p className="prose wide reveal mt-s">NTI provides complete custom packaging boxes and packaging printing solutions, from material recommendation and selection to structural design, printing techniques, finishing, and technical support. We help brands create custom boxes and packaging that perform beautifully, strengthen their brand, and support a more sustainable future.</p>
        <div className="flist reveal mt-s"><p className="fi"><b>Structural Design</b>Optimized packaging that reduces material use and waste.</p><p className="fi"><b>Pre-Press</b>Digital CTP technology improves quality while reducing pollution.</p><p className="fi"><b>Printing</b>Energy-efficient production with lower waste and emissions.</p><p className="fi"><b>Post-Press</b>Automated die-cutting, folder-gluing, window patching and laminating, with finishing methods confirmed to each project&rsquo;s specifications.</p></div>
        {visible.length > 0 && (
        <div className="mt-l"><div className="explorer fac-explorer reveal">
          <div className="ex-left">
            <h4 className="ga-h">Products</h4>
            <div className="ex-list fac-list tight">
              {visible.includes('boxes') && <><A href="#" className={tab('boxes')} data-set="boxes">Color Box Packaging</A>{' '}</>}
              {visible.includes('cardboard') && <><A href="#" className={tab('cardboard')} data-set="cardboard">Packaging Paperboard</A>{' '}</>}
              {visible.includes('uv') && <><A href="#" className={tab('uv')} data-set="uv">UV Printing</A>{' '}</>}
              {visible.includes('other') && <A href="#" className={tab('other')} data-set="other">Other Printing</A>}
            </div>
            <h4 className="ga-h ps-applications">Applications</h4>
            <p className="ps-apps-text" id="psApps">Food | Electronics | Beauty | Medical | Luxury | Consumer Goods</p>
          </div>
          <div className="ps-mediawrap">
            <div className="ex-media">
              <button className="ex-arrow" id="psPrev" aria-label="Previous"><svg width="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="m15 18-6-6 6-6" /></svg></button>
              <div className="ex-frame ps-frame"><img id="psImg" src={first ? first.src : mediaUrl("/assets/prod-box-gluing.jpg")} alt={first ? first.name : "Gluing box"} /></div>
              <button className="ex-arrow" id="psNext" aria-label="Next"><svg width="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="m9 18 6-6-6-6" /></svg></button>
            </div>
            <p className="fac-cap" id="psName">{first ? first.name : "Gluing Box"} <span className="fac-count">1 / {firstCount ?? 6}</span></p>
            <p className="ps-cap" id="psCap">{first ? first.cap : "The most common box type — top and bottom open, easy to assemble, and suited to lighter products."}</p>
          </div>
        </div></div>
        )}
      </div></section>
      <section className="section"><div className="wrap">
        <h2 className="sec-title reveal">Projects</h2>
        <h3 className="fac-sub reveal mt-s">Real Projects. Real Impact.</h3>
      </div>
      <PageMidBanner src={midBannerSrc(page, 1, "/assets/ref-sol-projects.webp")} alt="Range of NTI sustainably printed product packaging" as="div" className="fac-banner reveal mt-m" />
      <div className="wrap">
        <p className="prose wide reveal mt-m">From packaging to promotional materials, NTI collaborates with brands across industries to deliver sustainable, high-quality results &mdash; explore our custom box portfolio and packaging case study highlights below. Each project reflects our commitment to innovation, precision, and environmental responsibility.</p>
        <div className="dtitle reveal mt-m">Industries / Applications</div>
        <div className="flist chips reveal mt-s"><p className="fi">Food &amp; Beverage</p><p className="fi">Electronics</p><p className="fi">Beauty &amp; Skincare</p><p className="fi">Medical &amp; Healthcare</p><p className="fi">Luxury &amp; Gift Packaging</p><p className="fi">Hardware &amp; Hand Tools</p><p className="fi">Automotive</p><p className="fi">Publishing &amp; Stationery</p><p className="fi">Home &amp; Lifestyle</p><p className="fi">Industrial &amp; Consumer Goods</p></div>
        <p className="prose wide reveal mt-m">Explore how global brands trust NTI to print greener &mdash; without compromise.</p>
        <p className="mt-m reveal"><A href={l("/printing-projects")} className="tour-more">View more projects<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M13 6l6 6-6 6" /></svg></A></p>
      </div>
      </section>
      <ProductShowcase cms={cmsSets} overrides={page?.texts} />
    </T>
  )
}
