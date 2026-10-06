import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { FloatingPanel } from '@/components/FloatingPanel'
import { SiteChrome } from '@/components/SiteChrome'
import { JsonLd } from '@/components/JsonLd'
import { BreadcrumbJsonLd } from '@/components/BreadcrumbJsonLd'
import { htmlLang, isLocale, locales, siteUrl } from '@/lib/i18n'
import { siteGraph } from '@/lib/jsonld'
import '../globals.css'

const FONTS_CSS =
  'https://fonts.googleapis.com/css2?family=Mulish:ital,wght@0,400;0,500;0,600;0,700;0,800;1,600&family=Noto+Sans+TC:wght@300;400;500;600;700&display=swap'

// 腳本跑的時候 CSS 可能已經載完（快取命中），load 事件就不會再來，所以先看 sheet
const FONTS_SWAP =
  "(function(l){if(!l)return;var on=function(){l.media='all'};l.sheet?on():l.addEventListener('load',on)})(document.getElementById('gfonts'))"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  return (
    <html lang={htmlLang[locale]}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/*
          字型 CSS 不擋渲染（2026-10-06，手機 Lighthouse 量到擋 1.9 秒）：先以 media="print" 載入，
          載完才切成 all。字型本來就是 display=swap，差別只在系統字先出現的那一瞬間。
          不改用 next/font：globals.css 是 mockup 原檔、寫死 "Mulish"／"Noto Sans TC"，
          而 Noto Sans TC 自架會在部署包塞進上百個切片，SWA Free 有 250MB 上限。
        */}
        {/* media 會被 FONTS_SWAP 改掉，水合時跟伺服器輸出對不上是預期的 */}
        <link id="gfonts" href={FONTS_CSS} rel="stylesheet" media="print" suppressHydrationWarning />
        <script dangerouslySetInnerHTML={{ __html: FONTS_SWAP }} />
        <noscript>
          <link href={FONTS_CSS} rel="stylesheet" />
        </noscript>
      </head>
      <body>
        <SiteHeader />
        {children}
        <SiteFooter locale={locale} />
        <FloatingPanel locale={locale} />
        <SiteChrome />
        {/*
          結構化資料放在 body 末端（footer 之後）—— 版面驗收閘比對的是
          `</header>` 到 `<footer>` 之間，那個區間不能多出節點。見 components/JsonLd.tsx
        */}
        <JsonLd data={siteGraph(locale)} />
        <BreadcrumbJsonLd />
      </body>
    </html>
  )
}
