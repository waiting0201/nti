import { NextResponse, type NextRequest } from 'next/server'
import { defaultLocale, locales } from '@/lib/i18n'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  /*
   * 後台是 public/admin/ 底下的 SPA（BrowserRouter，basename="/admin/"），
   * 它的深層網址在伺服器上沒有對應檔案 —— 直接放行的話會走到下面被補上語系前綴，
   * 變成 /en/admin/u/news 而 404（在後台按 F5 就會遇到）。
   *
   * 而且這件事只能在 middleware 做：`[locale]` 是動態段、什麼都吃，`/admin/news`
   * 會先被 `/[locale]/news` 接走（locale="admin"）在 layout 裡 notFound()，
   * next.config.ts 的 fallback rewrite 根本輪不到。middleware 排在路由比對之前。
   *
   * 資產（有副檔名）不會進到這裡，matcher 已經排除。
   */
  /*
   * 裸的 /admin 先導到 /admin/ —— 後台只有一個正規網址，帶斜線的那個。
   * 少了這一步，SPA 的 basename 比對會落空而 render 出一片空白（見
   * apps/admin/src/main.tsx 的註解），而且 HTML／JS 都是 200，看起來像壞掉的白畫面。
   * 後台自己也已改成兩種寫法都吃，這裡再導一次是為了網址本身的一致性。
   */
  if (pathname === '/admin') {
    const url = req.nextUrl.clone()
    url.pathname = '/admin/'
    return NextResponse.redirect(url)
  }

  if (pathname.startsWith('/admin/')) {
    return NextResponse.rewrite(new URL('/admin/index.html', req.url))
  }

  /** 根路徑與缺語系的路徑，一律導到預設語系 */
  const hasLocale = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))
  if (hasLocale) return NextResponse.next()

  const url = req.nextUrl.clone()
  url.pathname = `/${defaultLocale}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  /*
   * 比對所有路徑，但排除：
   * - .swa      Azure Static Web Apps 的部署驗證路徑（/.swa/health.html）。
   *             ⚠️ 不可拿掉：SWA 會請求該路徑確認站台起得來，被 middleware 導向
   *             就會判定部署失敗，而錯誤訊息不會指向這裡。
   * - _next     框架資產
   * - 靜態檔    有副檔名的一律放行（/assets/*、/admin/static/*、robots.txt…）
   */
  matcher: ['/((?!\\.swa|_next/static|_next/image|favicon\\.ico|.*\\.[\\w]+$).*)'],
}
