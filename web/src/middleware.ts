import { NextResponse, type NextRequest } from 'next/server'
import { defaultLocale, locales } from '@/lib/i18n'

/** 根路徑與缺語系的路徑，一律導到預設語系 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const hasLocale = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))
  if (hasLocale) return NextResponse.next()

  const url = req.nextUrl.clone()
  url.pathname = `/${defaultLocale}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next|assets|favicon.ico|robots.txt|sitemap.xml).*)'],
}
