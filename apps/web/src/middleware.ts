import { NextResponse, type NextRequest } from 'next/server'
import { defaultLocale, isLocale, locales, type Locale } from '@/lib/i18n'
import { lookupLegacy } from '@/lib/legacy-redirects'
import { ROUTES } from '@/lib/routes'

/** 記住使用者選過的語系。名稱沿用 Next 的慣例，一年後過期 */
const LOCALE_COOKIE = 'NEXT_LOCALE'
const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

/**
 * 沒有語系前綴時要導去哪一個語系。
 *
 * 順序與後端 `Common/LangResolver.cs` 一致：使用者選過的優先，其次 Accept-Language，
 * 都沒有才用預設。差別只在前台的預設是 `en`（客戶的主要客群是國際品牌），
 * 而 API 的預設是 `zh`。
 */
function resolveLocale(req: NextRequest): Locale {
  const saved = req.cookies.get(LOCALE_COOKIE)?.value
  if (saved && isLocale(saved)) return saved

  // "zh-Hant-TW,zh;q=0.9,en;q=0.8" → 依 q 值排序後取第一個我們支援的
  const header = req.headers.get('accept-language')
  if (header) {
    const tags = header
      .split(',')
      .map((part) => {
        const [tag, ...params] = part.trim().split(';')
        const q = params.find((p) => p.startsWith('q='))
        return { tag: tag.toLowerCase(), q: q ? Number(q.slice(2)) : 1 }
      })
      .sort((a, b) => b.q - a.q)

    for (const { tag } of tags) {
      if (tag.startsWith('zh')) return 'zh'
      if (tag.startsWith('en')) return 'en'
    }
  }

  return defaultLocale
}

/**
 * 這條（去掉語系前綴的）路徑是不是站上真的有的頁面。
 *
 * 為什麼路由比對要在 middleware 做，而不是交給 Next 的 `not-found.tsx`：
 * 本專案的 root layout 是 `app/[locale]/layout.tsx`（`<html lang>` 要吃語系），
 * 這種結構下 `[locale]/not-found.tsx` 不會被編成 not-found 邊界，root 的
 * `app/not-found.tsx` 又在 `[locale]` 的 layout 樹之外——兩種放法實測都只得到
 * Next 內建的 `__next_error__` 空殼。詳見 `app/[locale]/404/page.tsx` 的註解。
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

/**
 * `notFoundResponse()` 內部那一次 fetch 的記號。
 *
 * `/{locale}/page-not-found` 本身也不在 `ROUTES` 裡，所以它一樣會被判成「對不到」——
 * 這是刻意的：直接打那個網址也應該拿到 404，否則站上就多了一個回 200 的 soft 404 網址。
 * 但取回頁面的那次 fetch 必須放行，不然會無限遞迴，靠這個標頭區分。
 */
const INTERNAL_404_HEADER = 'x-nti-404-render'

/**
 * 客製化 404：把 `/{locale}/page-not-found` 的 HTML 取回來，用 **404 狀態碼**回給瀏覽器。
 *
 * 為什麼要多這一次 fetch，而不是直接 `NextResponse.rewrite(url, { status: 404 })`：
 * 那個寫法實測會被 Next 攔掉——狀態碼是 404 沒錯，但回的是 Next 內建的
 * `__next_error__` 空殼，rewrite 的目標根本沒被 render。而不帶 status 的 rewrite
 * 又是 200，也就是 soft 404（客戶簡報列為「最不建議」的那一種）。
 *
 * 代價是每個 404 多一次站內請求。`/{locale}/page-not-found` 是預先產生的靜態頁，這次請求
 * 不會打到 API 或資料庫；而且 404 本來就不是熱路徑。
 */
async function notFoundResponse(req: NextRequest, locale: Locale) {
  const page = await fetch(new URL(`/${locale}/page-not-found`, req.url), {
    headers: { [INTERNAL_404_HEADER]: '1' },
  })
  return new NextResponse(await page.text(), {
    status: 404,
    headers: { 'content-type': 'text/html; charset=utf-8' },
  })
}

export async function middleware(req: NextRequest) {
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

  /*
   * 舊站（WordPress，中文在根目錄、英文在 /en/）的網址 → 新站對應頁，301。
   *
   * 必須排在語系判斷**之前**：`/en/products/` 帶著合法的語系前綴，走到下面
   * 會被當成新站路由直接放行而 404；`/products/colorbox/` 則會被補成
   * `/en/products/colorbox` 一樣是 404。對照表與未完成的部分見 lib/legacy-redirects.ts。
   */
  const legacy = lookupLegacy(pathname)
  if (legacy) {
    const url = req.nextUrl.clone()
    url.pathname = legacy
    return NextResponse.redirect(url, 301)
  }

  /*
   * 有語系前綴：照常放行，順便把這個語系記下來。
   * 使用者是從 header 的語系選單過來的，這一步就等於「記住他選了什麼」，
   * 不必在 client 另外寫一段 set-cookie。
   */
  const current = locales.find((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))
  if (current) {
    // 對不到任何路由 → 客製化 404（rewrite，網址列保持使用者打的那一個）。
    // 這一步刻意不寫語系 cookie：使用者沒有真的「造訪」某個語系的頁面。
    if (
      req.headers.get(INTERNAL_404_HEADER) !== '1' &&
      !isKnownRoute(pathname.slice(1 + current.length) || '/')
    ) {
      return notFoundResponse(req, current)
    }

    const res = NextResponse.next()
    if (req.cookies.get(LOCALE_COOKIE)?.value !== current) {
      res.cookies.set(LOCALE_COOKIE, current, {
        path: '/',
        maxAge: LOCALE_COOKIE_MAX_AGE,
        sameSite: 'lax',
      })
    }
    return res
  }

  /** 根路徑與缺語系的路徑：導到使用者選過的／瀏覽器偏好的語系 */
  const locale = resolveLocale(req)
  const url = req.nextUrl.clone()
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`
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
