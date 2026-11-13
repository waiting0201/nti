import { NextResponse, type NextRequest } from 'next/server'
import { PREFIXLESS_LOCALE, localePath, locales, type Locale } from '@/lib/i18n'
import { lookupLegacy } from '@/lib/legacy-redirects'
import { RENAMED_SLUGS } from '@/lib/renamed-slugs'
import { ROUTES } from '@/lib/routes'
import { ZH_ONLY_ROUTES } from '@/lib/careers'

/** 與 lib/api.ts 同一個來源；middleware 跑在 Edge runtime，不引那個檔（它帶著 react 的 cache()） */
const API_BASE = (process.env.NEXT_PUBLIC_API_BASE ?? '').replace(/\/$/, '')

/** 路徑整理成 `Redirect.FromPath` 的寫法：解碼、小寫、不帶結尾斜線（與 lookupLegacy 相同） */
function redirectKey(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, '') || '/'
  try {
    return decodeURIComponent(trimmed).toLowerCase()
  } catch {
    return trimmed.toLowerCase()
  }
}

type CmsRedirect = { toPath: string; statusCode: number }

/**
 * 問後台的轉址表（單元 16，`GET /redirects/lookup`）。
 *
 * 回傳三種：
 * - 物件：有一條啟用中的對照 → 照它轉（API 同時把命中次數加一）
 * - `null`：資料庫明確說沒有（沒建、已停用或已刪除）→ **不轉**，內建的舊站對照表也不救
 * - `undefined`：沒接 API、逾時或失敗 → 呼叫端退回內建的舊站對照表
 *
 * 「接上了就以資料庫為準」是刻意的：內建表若在查不到時補位，後台停用或刪掉的轉址
 * 會繼續生效，等於那個單元改了沒用（2026-11-13 稽核 A1）。代價是正式庫必須先匯入
 * `db/content/210_legacy_redirects.sql`，否則舊站網址會整批 404。
 *
 * **不是每個請求都查**：只有「內建表認得的舊站網址」與「對不到任何路由、即將回 404」
 * 兩種情況才打，站上真的有的頁面不經過這裡——所以後台不能拿它把一個現存的頁面轉走。
 */
async function lookupCmsRedirect(pathname: string): Promise<CmsRedirect | null | undefined> {
  if (!API_BASE) return undefined
  try {
    const res = await fetch(`${API_BASE}/redirects/lookup?path=${encodeURIComponent(redirectKey(pathname))}`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(1500),
    })
    if (!res.ok) return undefined
    const body = (await res.json()) as { success: boolean; data: CmsRedirect | null }
    return body.success ? body.data : undefined
  } catch {
    return undefined
  }
}

/** 轉到後台填的落點：站內路徑換 pathname，完整網址（https://…）原樣轉出去 */
function redirectTo(req: NextRequest, hit: CmsRedirect) {
  const status = hit.statusCode === 302 || hit.statusCode === 308 ? hit.statusCode : 301
  if (/^https?:\/\//i.test(hit.toPath)) return NextResponse.redirect(hit.toPath, status)
  const url = req.nextUrl.clone()
  const [path, query = ''] = hit.toPath.split('?')
  url.pathname = path
  url.search = query ? `?${query}` : ''
  return NextResponse.redirect(url, status)
}

/**
 * 這條（去掉語系前綴的）路徑是不是站上真的有的頁面。
 *
 * 為什麼路由比對要在 middleware 做，而不是交給 Next 的 `not-found.tsx`：
 * 本專案的 root layout 是 `app/[locale]/layout.tsx`（`<html lang>` 要吃語系），
 * 這種結構下 `[locale]/not-found.tsx` 不會被編成 not-found 邊界，root 的
 * `app/not-found.tsx` 又在 `[locale]` 的 layout 樹之外——兩種放法實測都只得到
 * Next 內建的 `__next_error__` 空殼。詳見 `app/[locale]/page-not-found/page.tsx` 的註解。
 *
 * `ROUTES` 是 `scripts/build-pages.mjs` 從 mockup 產生的 44 條，與 sitemap 同一份來源。
 *
 * ⚠️ 消息詳細頁 `/news/{slug}` 的 slug 在 CMS 裡，middleware 查不到（Edge runtime，
 * 不打 API），所以整個前綴一律放行，由 `news/[slug]/page.tsx` 自己 `notFound()`。
 * 那條路徑的 404 畫面會是 Next 的空殼——狀態碼仍然正確，只是沒有站台版型。
 */
function isKnownRoute(path: string): boolean {
  const clean = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path
  return clean === '/' || ROUTES.includes(clean) || clean.startsWith('/news/')
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  /*
   * Route handler（`app/api/*`）直接放行。目前一支都沒有——`/api/revalidate`
   * 隨著 ISR 一起拿掉了（見 lib/api.ts）——但這條留著：route handler 沒有副檔名，
   * matcher 擋不掉，落到下面就會被當成中文頁 rewrite 到 /zh/api/xxx，
   * 而那不是任何路由，呼叫端永遠拿到 404，症狀完全不指向這裡。
   */
  if (pathname.startsWith('/api/')) return NextResponse.next()

  /*
   * 後台是 public/admin/ 底下的 SPA（BrowserRouter，basename="/admin/"），
   * 它的深層網址在伺服器上沒有對應檔案 —— 直接放行的話會走到下面被當成中文頁，
   * 變成 /zh/admin/u/news 而 404（在後台按 F5 就會遇到）。
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

  /*
   * 舊站（WordPress，中文在根目錄、英文在 /en/）的網址 → 新站對應頁，301。
   *
   * 必須排在語系判斷**之前**：`/en/products/` 帶著合法的語系前綴，走到下面
   * 會被當成新站路由直接放行而 404；`/products/colorbox/` 則會被補成
   * `/en/products/colorbox` 一樣是 404。對照表與未完成的部分見 lib/legacy-redirects.ts。
   */
  const legacy = lookupLegacy(pathname)
  if (legacy) {
    // 接了 CMS 就以後台的轉址表為準（可改落點、改 302、停用、刪除）；問不到才用內建的這一條
    const cms = await lookupCmsRedirect(pathname)
    if (cms) return redirectTo(req, cms)
    if (cms === undefined) {
      const url = req.nextUrl.clone()
      url.pathname = legacy
      return NextResponse.redirect(url, 301)
    }
    // cms === null：後台把這條停用或刪掉了 → 不轉，往下當一般路徑處理（多半是 404）
  }

  /*
   * 舊的 `/zh/*`（2026-10-06 之前中文帶前綴）→ 301 到無前綴的網址。
   * 已分享出去的連結、後台與 DB 裡還沒改到的落點都靠這一條接住。
   */
  if (pathname === `/${PREFIXLESS_LOCALE}` || pathname.startsWith(`/${PREFIXLESS_LOCALE}/`)) {
    // 順便套用改名表，`/zh/solutions` 一次到 `/printing-solutions`，不走兩跳
    const stripped = pathname.slice(1 + PREFIXLESS_LOCALE.length).replace(/\/$/, '') || '/'
    const url = req.nextUrl.clone()
    url.pathname = RENAMED_SLUGS[stripped] ?? stripped
    return NextResponse.redirect(url, 301)
  }

  /*
   * 其餘的語系前綴（`/en`）照常放行；沒有前綴的就是中文，rewrite 給 `[locale]=zh`。
   *
   * 根目錄 `/` 固定是中文，**不**依瀏覽器語言自動導向（2026-10-06 客戶決定）：
   * Googlebot 不帶 Accept-Language，自動導向會讓兩個語系的首頁互相搶，
   * 英文版靠 hreflang 與 header 的語系選單過去。
   */
  const prefixed = locales.find(
    (l) => l !== PREFIXLESS_LOCALE && (pathname === `/${l}` || pathname.startsWith(`/${l}/`)),
  )
  const current: Locale = prefixed ?? PREFIXLESS_LOCALE
  const rest = (prefixed ? pathname.slice(1 + prefixed.length) : pathname).replace(/\/$/, '') || '/'

  /*
   * 只有中文版的頁（lib/careers.ts 的 ZH_ONLY_ROUTES，目前是人才招募）：英文版回 404。
   * `ROUTES` 與 mockup 裡的 `/careers` 留著不刪——刪了 build-pages 下次產生又會長回來。
   */
  if (ZH_ONLY_ROUTES.includes(rest) && current !== 'zh') {
    const notFound = req.nextUrl.clone()
    notFound.pathname = `/${current}/page-not-found`
    return NextResponse.rewrite(notFound, { status: 404 })
  }

  /*
   * mockup 的 12 篇示範消息（`/news-*`，寫死在前台的靜態頁）：接了 CMS 之後 301 到同一篇的
   * CMS 版 `/news/{slug}`。那 12 篇已由 `db/content/200_mockup_content.sql` 匯進後台
   * （英文 slug＝檔名去掉 `news-`，中文再加 `-zh`），兩個網址並存的話，後台改稿或下架的只有
   * CMS 那一份，寫死的這一份照樣在線上、也在 sitemap 裡。
   * 後台之後改了 slug 或把文章下架：前者由消息頁自己的「舊 slug → 新 slug」接住，後者就是 404——
   * 下架的文章本來就不該看得到。沒接 CMS 時不轉，這 12 頁仍是消息列表的落點。
   */
  if (API_BASE && rest.startsWith('/news-') && ROUTES.includes(rest)) {
    const url = req.nextUrl.clone()
    url.pathname = localePath(current, `/news/${rest.slice('/news-'.length)}${current === 'zh' ? '-zh' : ''}`)
    return NextResponse.redirect(url, 301)
  }

  /** 新站自己改過名的頁（見 lib/renamed-slugs.ts）：301 到新網址，錨點由瀏覽器保留 */
  const renamed = RENAMED_SLUGS[rest]
  if (renamed) {
    const url = req.nextUrl.clone()
    url.pathname = localePath(current, renamed)
    return NextResponse.redirect(url, 301)
  }

  /*
   * 對不到任何路由 → 客製化 404。
   *
   * `rewrite` 讓網址列維持使用者打的那一個（不是轉址），`status: 404` 讓它是**真的**
   * 404 而不是 soft 404。
   *
   * `/{locale}/page-not-found` 本身也不在 `ROUTES` 裡，所以直接打那個網址一樣拿到 404
   * （rewrite 到它自己）——這是刻意的，否則站上就多了一個回 200 的 soft 404 網址。
   * rewrite 不會重跑 middleware，不會遞迴。
   */
  if (!isKnownRoute(rest)) {
    // 回 404 之前先問後台：客戶自己新增的轉址（不在內建舊站表裡的）靠這一條生效
    const cms = legacy ? null : await lookupCmsRedirect(pathname)
    if (cms) return redirectTo(req, cms)

    const notFound = req.nextUrl.clone()
    notFound.pathname = `/${current}/page-not-found`
    return NextResponse.rewrite(notFound, { status: 404 })
  }

  if (prefixed) return NextResponse.next()

  const url = req.nextUrl.clone()
  url.pathname = `/${PREFIXLESS_LOCALE}${pathname === '/' ? '' : pathname}`
  return NextResponse.rewrite(url)
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
