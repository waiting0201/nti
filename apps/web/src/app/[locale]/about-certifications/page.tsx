import { Fragment, type ReactNode } from 'react'
import type { Metadata } from 'next'
import { T } from '@/lib/t'
import { A } from '@/components/A'
import { CertificationWall, DetailList, PageBanner, PageMidBanner } from '@/components/cms'
import { JsonLd } from '@/components/JsonLd'
import { organizationCredentials } from '@/lib/jsonld'
import { bannerSrc, getCertificationItems, getCertifications, getPage, midBannerSrc, type CertificationListItem } from '@/lib/api'
import { mediaUrl } from '@/lib/media'
import { pageMetadata, withLocale, type Locale } from '@/lib/i18n'

type Props = { params: Promise<{ locale: Locale }> }

// 七個區塊的順序與大標固定（大標中文走 zh.ts，後台「頁面文字」可覆寫）；fallback＝mockup 原文，
// 沒有 mockup 原文的（合作夥伴）是 null，沒接 API 時不輸出
const SECTIONS: { key: CertificationListItem['section']; title: string; fallback: ReactNode }[] = [
  { key: 'management', title: "Management Systems", fallback: (
    <div className="flist mt-s"><p className="fi"><b>ISO&nbsp;9001 &mdash; Quality Management System</b>Demonstrates NTI&rsquo;s commitment to consistent quality, continuous improvement, and customer satisfaction.</p><p className="fi"><b>ISO&nbsp;14001 &mdash; Environmental Management</b>Demonstrates NTI&rsquo;s commitment to reducing environmental impact through responsible management across every stage of production and the product lifecycle.</p><p className="fi"><b>ISO&nbsp;45001 &mdash; Occupational Health &amp; Safety Management</b>Certifies NTI&rsquo;s commitment to maintaining a safe, healthy workplace through effective occupational health and safety management.</p></div>
  ) },
  { key: 'quality', title: "Colour & Print Quality Qualifications", fallback: (
    <div className="flist mt-s"><p className="fi"><b>G7 Master Colorspace</b>Developed by Idealliance, a globally recognized colour calibration methodology based on ISO&nbsp;12647-2, ensuring consistent, accurate colour reproduction across every print run.</p><p className="fi"><b>GMI Professional Printing Certification</b>GMI (Graphic Measures International) verifies packaging suppliers for leading global retailers. NTI has passed GMI certification for Target, Walgreens, Lowe&rsquo;s, The Home Depot, Academy Sports&nbsp;+&nbsp;Outdoors, and CVS Pharmacy.</p></div>
  ) },
  { key: 'material', title: "Paper & Inks", fallback: (
    <div className="flist mt-s"><p className="fi"><b>FSC&trade;-CoC Chain of Custody</b>Guarantees that certified paper materials are sourced from responsibly managed forests and verified throughout the supply chain.</p><p className="fi"><b>MOF Certified</b>NTI uses MOF-certified eco-friendly printing materials and inks, helping clients reduce environmental impact while meeting recognized sustainability and quality standards.</p></div>
  ) },
  { key: 'building', title: "Green Buildings", fallback: (
    <div className="flist mt-s"><p className="fi"><b>EEWH Diamond Green Building</b>Our Tainan headquarters holds Taiwan&rsquo;s highest green building rating, EEWH Diamond, for ecology, energy saving, waste reduction and health. Valid 30&nbsp;April 2024 &ndash; 29&nbsp;April 2029.</p><p className="fi"><b>LEED Gold</b>The same building is also certified LEED Gold under the U.S. Green Building Council&rsquo;s Leadership in Energy and Environmental Design rating system.</p></div>
  ) },
  { key: 'membership', title: "Memberships & Own Marks", fallback: (
    <div className="flist mt-s"><p className="fi"><b>Sedex Member</b>A membership rather than a certification: NTI shares its ethical and responsible sourcing data with customers through Sedex, the global supply-chain transparency platform.</p><p className="fi"><b>NTI Green Printing Certificate</b>Our own mark, not a third-party certification, which clients who meet its conditions of use can print on their packaging as proof of an eco-conscious printing process.</p></div>
  ) },
  { key: 'award', title: "Awards", fallback: (
    <div className="flist mt-s"><p className="fi"><b>National Sustainable Development Award</b>Presented by Taiwan&rsquo;s National Council for Sustainable Development, recognizing NTI&rsquo;s years of work on ESG and low-carbon production.</p><p className="fi"><b>Global Views ESG Award 2026</b>Outstanding Project award in the Low-Carbon Operations, SME category, at the 22nd Global Views ESG Corporate Sustainability Awards.</p><p className="fi"><b>Outstanding Business Award</b>The 13th National Brand Yushan Award for Outstanding Business Award.</p><p className="fi"><b>Smart Building Award</b>Gold Award in the &lsquo;Smart Buildings&rsquo; category at the 7th APEC ESCI (Energy Smart Communities Initiative) Best Practices Awards Program.</p></div>
  ) },
  { key: 'partner', title: "Partnerships", fallback: null },
]

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata(locale, "/about-certifications", {
    title: "Our Certifications — Proof of Quality & Sustainability | NTI Printing",
    description: "FSC CoC, G7 Master Printer, ISO 9001 and ISO 14001 — the certifications behind NTI's printing quality and every audit-ready packaging run.",
  })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  // 後台「頁面文字」的覆寫（單元 15）；沒接 API 或沒改過就是 undefined，照 mockup 原文
  const page = await getPage(locale, 'about-certifications')
  const certs = await getCertifications(locale)
  // 下方七個清單（單元 08b）。沒接 API 是 null → 照 mockup 原文；
  // 有接 API 但某區塊 0 筆 → 那一塊不輸出（客戶刪光獎項＝不要這塊；合作夥伴在填之前也是）
  const listItems = await getCertificationItems(locale)
  const section = (key: CertificationListItem['section']) => listItems?.filter((it) => it.section === key) ?? null
  const l = withLocale(locale)
  // 沒有任何認證填了證號／日期就是 null，不輸出（沒接 API 時版面驗收閘比對的節點序列不受影響）
  const credentials = certs?.length ? organizationCredentials(certs) : null
  return (
    <T locale={locale} overrides={page?.texts}>
      <PageBanner src={bannerSrc(page, "/assets/ref-about-mid2.webp")} alt="NTI Printing headquarters in Tainan, Taiwan" />
      <section className="section subhead"><div className="wrap">
        <div className="crumb reveal"><A href={l("/")}>Home</A><span>&rsaquo;</span><A href={l("/differences")}>About Us</A><span>&rsaquo;</span><b>Our Certifications</b></div>
        <h1 className="sec-title reveal">Our Certifications &mdash; Proof of Quality &amp; Sustainability</h1>
        <div className="sec-sub reveal">Proving our promise through action</div>
        <nav className="pr-tabs reveal" aria-label="Section pages">
          <A href={l("/about-difference")}>The NTI Difference</A>{' '}
          <A href={l("/about-benefits")}>Benefits to Clients</A>{' '}
          <A href={l("/about-certifications")} className="active">Certifications, Partnerships &amp; Awards</A>{' '}
          <A href={l("/facility-tour")}>Factory Tour</A>
        </nav>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <div className="dtitle">Certifications</div>
        <p className="prose wide">NTI has built its reputation on printing quality, and our clients hold us to it. We keep applying for further certification so that every customer gets the same assurance of product quality &mdash; audited by an outside body rather than asserted by us. Alongside the international standards below, we developed the NTI Green Printing Certificate, a mark our clients can display on their packaging as proof of an eco-conscious process.</p>
      </div></section>
      <section className="section certs reveal">{certs?.length ? (
          <>
          <CertificationWall items={certs} locale={locale} />
          {credentials && <JsonLd data={credentials} />}
          </>
        ) : (
        <div className="wrap certgrid">
        <img src={mediaUrl("/assets/cert-green.png")} alt="NTI Green Printing" />
        <img src={mediaUrl("/assets/cert-fsc.png")} alt="FSC certified" className="big" />
        <img src={mediaUrl("/assets/cert-leed.png")} alt="LEED Leadership in Energy and Environmental Design" />
        <img src={mediaUrl("/assets/cert-mof.png")} alt="Mineral Oil Free" />
        <img src={mediaUrl("/assets/cert-esg.png")} alt="ESG Environmental, Social, Governance" />
      </div>
        )}</section>
      {SECTIONS.map((sec, i) => {
        const items = section(sec.key)
        return (
          <Fragment key={sec.key}>
            {(items ? items.length > 0 : sec.fallback !== null) && (
            <section className="section tight"><div className="wrap reveal">
              <div className="dtitle">{sec.title}</div>
              {items ? <DetailList items={items} /> : sec.fallback}
            </div></section>
            )}
            {i === 1 && <PageMidBanner src={midBannerSrc(page, 1, "/assets/ref-about-mid1.webp")} alt="NTI leadership on the pressroom floor" />}
          </Fragment>
        )
      })}
      <section className="section tight"><div className="wrap reveal">
        <p className="prose">Want this applied to your packaging? Send us the brief and we will come back with a spec and a quote.</p>
        <p className="mt-m"><A href={l("/get-a-quote")} className="btn btn-solid">Get a Quote</A></p>
        <p className="mt-m reveal"><A href={l("/facility-tour")} className="blink">Next: Factory Tour</A></p>
      </div></section>
    </T>
  )
}
