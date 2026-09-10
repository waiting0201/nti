import { Fragment } from 'react'
import { A } from './A'
import { T } from '@/lib/t'
import { withLocale, type Locale } from '@/lib/i18n'
import { mediaUrl } from '@/lib/media'
import { getSettingMap } from '@/lib/site-settings'

/**
 * 三個社群圖示。路徑與尺寸逐字取自 mockup，只有 `href` 改成吃網站設定。
 */
const SOCIAL = [
  {
    key: 'social.facebook',
    label: 'Facebook',
    size: 16,
    path: 'M14 9h3V6h-3a4 4 0 0 0-4 4v2H8v3h2v6h3v-6h3l1-3h-4v-2a1 1 0 0 1 1-1Z',
  },
  {
    key: 'social.linkedin',
    label: 'LinkedIn',
    size: 15,
    path: 'M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.5 8h4V24h-4V8Zm7.5 0h3.8v2.2h.05c.53-1 1.83-2.2 3.77-2.2 4.03 0 4.78 2.65 4.78 6.1V24h-4v-8.5c0-2-.04-4.6-2.8-4.6-2.8 0-3.23 2.2-3.23 4.45V24H8V8Z',
  },
  {
    key: 'social.youtube',
    label: 'YouTube',
    size: 17,
    path: 'M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12c0 2 .17 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.33-1.9.5-3.8.5-5.8s-.17-3.9-.5-5.8ZM9.6 15.6V8.4L15.8 12l-6.2 3.6Z',
  },
] as const

export async function SiteFooter({ locale }: { locale: Locale }) {
  const l = withLocale(locale)
  const settings = await getSettingMap(locale)

  /**
   * 沒接 CMS 就照 mockup 顯示三個 `href="#"`；接上了就只顯示客戶填了網址的那幾個
   * （後台欄位的提示：「留空則前台不顯示該圖示」）。目前三個社群欄位都還是空的，
   * 所以正式站接上之後這一排會是空的——那是設定的狀態，不是漏渲染。
   */
  const social = settings ? SOCIAL.filter((item) => settings[item.key]) : SOCIAL

  return (
    <T locale={locale}>
    <footer>
      <div className="wrap">
        <div className="fgrid">
          <div className="fbrand">
            <A href={l('/')} className="brand" aria-label="NTI Printing home">
              <img className="logo-img" src={mediaUrl('/assets/logo-white.svg')} alt="NTI Printing" />
            </A>
            <p>The Courage to Print Green — sustainable packaging printing from Tainan, Taiwan.</p>
            <div className="fsocial">
              {social.map((item, i) => {
                const href = settings?.[item.key]
                return (
                  <Fragment key={item.key}>
                    {i > 0 && ' '}
                    <a
                      href={href ?? '#'}
                      aria-label={item.label}
                      {...(href ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      <svg width={item.size} height={item.size} viewBox="0 0 24 24" fill="currentColor">
                        <path d={item.path} />
                      </svg>
                    </a>
                  </Fragment>
                )
              })}
            </div>
          </div>
          <div className="fcol">
            <span className="ftitle">Company</span>{' '}
            <A href={l('/differences')}>About Us</A>{' '}
            <A href={l('/solutions')}>Solutions</A>{' '}
            <A href={l('/projects')}>Projects</A>{' '}
            <A href={l('/careers')}>Careers</A>{' '}
            <A href={l('/privacy-legal')}>Privacy &amp; Legal</A>
          </div>
          <div className="fcol">
            <span className="ftitle">Supplier Area</span>{' '}
            <A href={l('/supplier-area')}>Supplier Announcement</A>{' '}
            <A href={l('/supplier-area')}>Specifications &amp; Requirements</A>{' '}
            <A href={l('/supplier-area')}>Download Area</A>
          </div>
          <div className="fcol">
            <span className="ftitle">Get in Touch</span>{' '}
            <A href={l('/get-a-quote')}>Get a Quote</A>{' '}
            <A href={l('/get-a-quote')} className="fcta">
              Start Your Project{' '}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </A>
          </div>
        </div>
        <div className="fbot">
          <span>© 2026 NTI Printing Co., Ltd.</span>{' '}
          <span className="sp"></span>{' '}
          <A href={l('/privacy-legal')}>Privacy &amp; Legal</A>
        </div>
      </div>
    </footer>
    </T>
  )
}
