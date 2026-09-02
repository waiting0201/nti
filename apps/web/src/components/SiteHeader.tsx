'use client'

import { Fragment } from 'react'
import { usePathname } from 'next/navigation'
import { A } from './A'
import { NAV_ACTIVE } from './nav-active'
import { splitLocale, withLocale, type Locale } from '@/lib/i18n'
import { mediaUrl } from '@/lib/media'

const Caret = () => (
  <svg className="ca" viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m1 1 5 5 5-5" />
  </svg>
)

const FlagEN = () => (
  <svg className="flag" viewBox="0 0 18 13" aria-hidden="true">
    <rect width="18" height="13" fill="#012169" />
    <path d="M0 0 18 13M18 0 0 13" stroke="#fff" strokeWidth="2.6" />
    <path d="M0 0 18 13M18 0 0 13" stroke="#C8102E" strokeWidth="1" />
    <path d="M9 0v13M0 6.5h18" stroke="#fff" strokeWidth="4.3" />
    <path d="M9 0v13M0 6.5h18" stroke="#C8102E" strokeWidth="2.6" />
  </svg>
)

const FlagZH = () => (
  <svg className="flag" viewBox="0 0 18 13" aria-hidden="true">
    <rect width="18" height="13" fill="#FE0000" />
    <rect width="9" height="6.5" fill="#000095" />
    <polygon
      fill="#fff"
      points="4.33,1.96 4.50,0.90 4.67,1.96 5.00,2.05 5.68,1.21 5.29,2.22 5.53,2.46 6.54,2.08 5.70,2.75 5.79,3.08 6.85,3.25 5.79,3.42 5.70,3.75 6.54,4.42 5.53,4.04 5.29,4.28 5.68,5.29 5.00,4.45 4.67,4.54 4.50,5.60 4.33,4.54 4.00,4.45 3.33,5.29 3.71,4.28 3.47,4.04 2.46,4.42 3.30,3.75 3.21,3.42 2.15,3.25 3.21,3.08 3.30,2.75 2.46,2.07 3.47,2.46 3.71,2.22 3.32,1.21 4.00,2.05"
    />
    <circle cx="4.5" cy="3.25" r="1.05" fill="#000095" />
    <circle cx="4.5" cy="3.25" r=".85" fill="#fff" />
  </svg>
)

type SubItem = { key: string; href: string; label: React.ReactNode }
type MenuItem = { key: string; href: string; label: string; sub: SubItem[] }

const MENU: MenuItem[] = [
  {
    key: 'differences',
    href: '/differences',
    label: 'About Us',
    sub: [
      { key: 'about-difference', href: '/about-difference', label: 'The NTI Difference' },
      { key: 'about-benefits', href: '/about-benefits', label: 'Benefits to Clients' },
      {
        key: 'about-certifications',
        href: '/about-certifications',
        label: <>Certifications, Partnerships &amp; Awards</>,
      },
      { key: 'facility', href: '/facility', label: <>Facilities &amp; Equipment</> },
    ],
  },
  {
    key: 'solutions',
    href: '/solutions',
    label: 'Solutions',
    sub: [
      { key: 'products-boxes', href: '/products-boxes', label: 'Color Box Packaging' },
      { key: 'products-cardboard', href: '/products-cardboard', label: 'Packaging Paperboard' },
      { key: 'products-uv', href: '/products-uv', label: 'UV Printing' },
      { key: 'products-other', href: '/products-other', label: 'Other Printing' },
    ],
  },
  {
    key: 'projects',
    href: '/projects',
    label: 'Projects',
    sub: [
      { key: 'projects#industries', href: '/projects#industries', label: 'Industries / Applications' },
      { key: 'projects#cases', href: '/projects#cases', label: <>Case Studies &amp; Photos</> },
    ],
  },
  {
    key: 'green-advantage',
    href: '/green-advantage',
    label: 'Sustainability',
    sub: [
      { key: 'green-our-advantage', href: '/green-our-advantage', label: 'Our Green Advantages' },
      { key: 'green-carbon', href: '/green-carbon', label: 'Carbon Efficiency' },
      { key: 'green-materials', href: '/green-materials', label: 'ECO Materials' },
      { key: 'green-esg', href: '/green-esg', label: <>ESG &amp; Future Goals</> },
    ],
  },
  {
    key: 'insights',
    href: '/insights',
    label: 'Insights',
    sub: [
      { key: 'news', href: '/news', label: 'Latest News' },
      { key: 'green-vlog', href: '/green-vlog', label: 'Green Vlog' },
      { key: 'faq', href: '/faq', label: 'FAQ' },
      { key: 'industry-trends', href: '/industry-trends', label: 'Industry Trends' },
    ],
  },
]

export function SiteHeader() {
  const pathname = usePathname() ?? '/'
  const { locale, path } = splitLocale(pathname)
  const l = withLocale(locale)
  const slug = path.replace(/^\/|\/$/g, '')
  const [activeTop, activeSub] = NAV_ACTIVE[slug] ?? []

  const other: Locale = locale === 'en' ? 'zh' : 'en'
  const otherHref = `/${other}${path === '/' ? '' : path}`
  const selfHref = `/${locale}${path === '/' ? '' : path}`

  return (
    <header id="hdr">
      <div className="wrap nav">
        <A href={l('/')} className="brand" aria-label="NTI Printing home">
          <img className="logo-img" src={mediaUrl('/assets/logo.svg')} alt="NTI Printing" />
        </A>
        <nav className="menu">
          {MENU.map((mi) => (
            <div className="mi" key={mi.key}>
              <A href={l(mi.href)} className={mi.key === activeTop ? 'active' : undefined}>
                {mi.label} <Caret />
              </A>
              <div className="sub-menu">
                {/* mockup 的下拉項之間有換行空白，會渲染成一個空格 —— 原樣保留 */}
                {mi.sub.map((s, i) => (
                  <Fragment key={s.key}>
                    {i > 0 && ' '}
                    <A href={l(s.href)} className={s.key === activeSub ? 'active' : undefined}>
                      {s.label}
                    </A>
                  </Fragment>
                ))}
              </div>
            </div>
          ))}
        </nav>
        <div className="htools">
          <div className="lang">
            <button className="lang-btn" aria-haspopup="true" aria-expanded="false">
              {locale === 'en' ? <FlagEN /> : <FlagZH />}
              {locale === 'en' ? 'EN' : '中文'} <Caret />
            </button>
            <div className="lang-menu">
              <A href={locale === 'en' ? selfHref : otherHref} className={locale === 'en' ? 'active' : undefined}>
                <FlagEN />
                English
              </A>
              <A href={locale === 'zh' ? selfHref : otherHref} className={locale === 'zh' ? 'active' : undefined}>
                <FlagZH />
                中文
              </A>
            </div>
          </div>
          <span className="icn" aria-label="Search">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </span>{' '}
          <button className="burger" aria-label="Menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  )
}
