import type { Metadata } from 'next'
import { T } from '@/lib/t'
import { A } from '@/components/A'
import { siteUrl, withLocale, type Locale } from '@/lib/i18n'

/**
 * 客製化 404（客戶 2026-09-08 SEO 會議：「客製化 404 頁面（最推薦）」）。
 *
 * 這是一條**正常的路由**，不是 Next 的 `not-found.tsx` 邊界。派給它的是
 * `middleware.ts`：對不到 `ROUTES` 的網址在那裡被
 * `NextResponse.rewrite(url, { status: 404 })` 導到這頁——網址列保持使用者原本打的
 * 那一個（rewrite 不是 redirect），狀態碼是真的 404。
 *
 * ⚠️ 為什麼不用 `not-found.tsx`：本專案的 root layout 是
 * `app/[locale]/layout.tsx`（`<html lang>` 要吃語系）。Next 在這種結構下，
 * `[locale]/not-found.tsx` 不會被編成 not-found 邊界，而 root 的
 * `app/not-found.tsx` 又在 `[locale]` 的 layout 樹之外 —— 兩種放法實測都只會
 * 得到 Next 內建的 `__next_error__` 空殼（沒有 header／footer／樣式）。
 * 要讓 `not-found.tsx` 正常運作就得把 `<html>` 搬到 root layout，代價是
 * `<html lang>` 只能寫死或改吃 `headers()`（後者會讓 88 個頁面從 SSG 掉成動態）。
 * 用一條真實路由 + middleware 帶狀態碼，兩樣都不必犧牲。
 *
 * ⚠️ 狀態碼不能省。直接 200 回這個畫面就是 soft 404，Google 會判「重新導向但
 * 內容不符」，跟轉址回首頁一樣不傳權重 —— 正是客戶那份簡報列為「最不建議」的做法。
 */
type Props = { params: Promise<{ locale: Locale }> }

export const metadata: Metadata = {
  title: 'Page Not Found — NTI Printing',
  // 404 頁本身不該被收錄，但連結要讓爬蟲跟著走回站內
  robots: { index: false, follow: true },
  alternates: { canonical: `${siteUrl}/en/page-not-found` },
}

/** 舊網址最可能指向的區塊——404 的價值在於把人接回這些地方 */
const LINKS = [
  ['/solutions', 'Solutions'],
  ['/products-boxes', 'Color Box Packaging'],
  ['/facility', 'Facilities & Equipment'],
  ['/green-advantage', 'Our Green Advantage'],
  ['/projects', 'Projects'],
  ['/news', 'News'],
  ['/contact', 'Contact Us'],
] as const

export default async function Page({ params }: Props) {
  const { locale } = await params
  const l = withLocale(locale)

  return (
    <T locale={locale}>
      <section className="section">
        <div className="wrap" style={{ textAlign: 'center', maxWidth: 760 }}>
          <div
            className="eyebrow"
            style={{ fontSize: 'clamp(3.5rem, 12vw, 6rem)', lineHeight: 1, color: 'var(--green)' }}
          >
            404
          </div>
          <h1 className="sec-title">This page has moved or no longer exists</h1>
          <div className="sec-sub">
            The link may be out of date, or the page may have been renamed when we rebuilt the site.
            The sections below cover what the old address most likely pointed at.
          </div>

          <div
            style={{
              display: 'flex',
              gap: '.8rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              margin: '2rem 0 2.6rem',
            }}
          >
            <A className="btn btn-solid" href={l('/')}>
              Back to Home
            </A>
            <A className="btn btn-out" href={l('/get-a-quote')}>
              Get a Quote
            </A>
          </div>

          <div className="sec-sub" style={{ marginBottom: '.9rem' }}>
            Or go straight to:
          </div>
          <div
            style={{ display: 'flex', gap: '.5rem 1.4rem', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            {LINKS.map(([path, label]) => (
              <A key={path} href={l(path)} style={{ color: 'var(--green)', fontWeight: 700 }}>
                {label}
              </A>
            ))}
          </div>
        </div>
      </section>
    </T>
  )
}
