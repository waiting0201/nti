import { Fragment } from 'react'
import { A } from './A'
import { T } from '@/lib/t'
import { withLocale, type Locale } from '@/lib/i18n'
import { mediaUrl } from '@/lib/media'
import { getSettingMap, telHref } from '@/lib/site-settings'

/**
 * 四個社群圖示。路徑與尺寸逐字取自 mockup，只有 `href` 改成吃網站設定。
 */
const SOCIAL = [
  {
    key: 'social.facebook',
    label: 'Facebook',
    size: 16,
    path: 'M14 9h3V6h-3a4 4 0 0 0-4 4v2H8v3h2v6h3v-6h3l1-3h-4v-2a1 1 0 0 1 1-1Z',
  },
  {
    key: 'social.instagram',
    label: 'Instagram',
    size: 15,
    path: 'M12 2.2c3.2 0 3.6 0 4.8.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8C2.4 3.9 3.9 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2ZM12 0C8.7 0 8.3 0 7.1.1 2.7.3.3 2.7.1 7.1 0 8.3 0 8.7 0 12s0 3.7.1 4.9c.2 4.4 2.6 6.8 7 7 1.2.1 1.6.1 4.9.1s3.7 0 4.9-.1c4.4-.2 6.8-2.6 7-7 .1-1.2.1-1.6.1-4.9s0-3.7-.1-4.9c-.2-4.4-2.6-6.8-7-7C15.7 0 15.3 0 12 0Zm0 5.8a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.4-11.8a1.4 1.4 0 1 0 0 2.9 1.4 1.4 0 0 0 0-2.9Z',
  },
  {
    key: 'social.youtube',
    label: 'YouTube',
    size: 17,
    path: 'M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12c0 2 .17 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.33-1.9.5-3.8.5-5.8s-.17-3.9-.5-5.8ZM9.6 15.6V8.4L15.8 12l-6.2 3.6Z',
  },
  {
    // 客戶 2026-11-11 加回 LinkedIn（排在 YouTube 後面）
    key: 'social.linkedin',
    label: 'LinkedIn',
    size: 15,
    path: 'M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.5h4V21H3V9.5Zm6.5 0h3.8v1.6h.06c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.65 4.77 6.1V21h-4v-5.2c0-1.24-.02-2.84-1.73-2.84-1.73 0-2 1.35-2 2.75V21h-4V9.5Z',
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

  // 公司電話與地址：吃網站設定（後台「公司資訊」），沒接 CMS 時照 mockup／contact 頁的值
  const phone = settings?.['company.phone'] ?? '+886 6 261 1358'
  const address =
    settings?.['company.address']?.replace(/\s*\n\s*/g, ' ') ??
    'No. 29, Gongye 6th Rd., Annan Dist., Tainan City 709, Taiwan'

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
            <A href={l('/printing-solutions')}>Solutions</A>{' '}
            <A href={l('/printing-projects')}>Projects</A>
            {locale === 'zh' && (
              <>
                {' '}
                <A href={l('/careers')}>Careers</A>
              </>
            )}
          </div>
          <div className="fcol">
            <span className="ftitle">Supplier Area</span>{' '}
            <A href={l('/supplier-area')}>Supplier Announcement</A>{' '}
            <A href={l('/supplier-area')}>Specifications &amp; Requirements</A>{' '}
            <A href={l('/supplier-area')}>Download Area</A>
          </div>
          <div className="fcol">
            <span className="ftitle">Get in Touch</span>{' '}
            <a href={telHref(phone)}>{phone}</a>{' '}
            <span className="faddr">{address}</span>{' '}
            <A href={l('/contact')}>Contact</A>{' '}
            <A href={l('/get-a-quote')} className="fcta">
              Get a Quote{' '}
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
