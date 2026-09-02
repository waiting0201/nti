import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { FloatingPanel } from '@/components/FloatingPanel'
import { SiteChrome } from '@/components/SiteChrome'
import { htmlLang, isLocale, locales, siteUrl } from '@/lib/i18n'
import '../globals.css'

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
        <link
          href="https://fonts.googleapis.com/css2?family=Mulish:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,600&family=Noto+Sans+TC:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SiteHeader />
        {children}
        <SiteFooter locale={locale} />
        <FloatingPanel locale={locale} />
        <SiteChrome />
      </body>
    </html>
  )
}
