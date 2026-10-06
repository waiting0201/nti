/**
 * 新站自己改過名的網址：舊 slug → 新 slug（不含語系前綴），middleware 依此 301。
 *
 * 2026-10-06 依客戶《SEO 驗收檢核表》「網頁優化」分頁更名：拿掉 `products-` 前綴、
 * 頂層頁加上 `printing-` 關鍵字。這些舊網址沒上過正式站，但預覽站的連結已經給客戶與
 * 協作者看過，轉址是為了讓那些連結不要撞 404。
 *
 * 跟舊站 301（`legacy-redirects.ts`）是兩回事：那份處理的是 WordPress 舊站的網址，
 * 這份處理的是新站前後兩版的網址。再改名時在這裡加一列，不要改掉舊的那一列，
 * 並且把已經指向舊 slug 的列一併改成最終落點（避免轉兩次）。
 */
export const RENAMED_SLUGS: Record<string, string> = {
  '/solutions': '/printing-solutions',
  '/products-boxes': '/colorbox',
  '/products-cardboard': '/cardboard',
  '/products-uv': '/uv-printing',
  '/products-other': '/other-printing',
  '/projects': '/printing-projects',
  '/green-vlog': '/blog',
  '/industry-trends': '/printing-trends',
}
