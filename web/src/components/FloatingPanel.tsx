import { A } from './A'
import { withLocale, type Locale } from '@/lib/i18n'

export function FloatingPanel({ locale }: { locale: Locale }) {
  const l = withLocale(locale)
  return (
    <>
      <div className="fab hide" id="fab">
        <div className="fab-head">
          <b>Have the courage to print green</b>
          <span>Let your journey begin</span>{' '}
          <button className="fab-close" id="fabClose" aria-label="Close">
            <svg width="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <A href={l('/get-a-quote')} className="fab-row">
          <span className="fab-ic">
            <svg width="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6M9 13h6M9 17h4" />
            </svg>
          </span>
          <span>
            <b>Get a Quote</b>
            <span>Get started</span>
          </span>
        </A>{' '}
        <A href={l('/contact')} className="fab-row">
          <span className="fab-ic">
            <svg width="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-4-1L3 20l1.1-4.9a8.4 8.4 0 0 1-1-4A8.5 8.5 0 0 1 21 11.5Z" />
            </svg>
          </span>
          <span>
            <b>Contact</b>
            <span>Connect with us</span>
          </span>
        </A>
      </div>
      <button className="fab-reopen show" id="fabReopen" aria-label="Open quote panel">
        <svg width="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>
    </>
  )
}
