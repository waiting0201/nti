/**
 * 人才招募只有中文版（客戶 2026-11-05 決定英文版移除；同日改為中文保留站內頁，
 * 職缺清單最下方的「更多訊息」才外連 104 的公司頁）。
 *
 * - 頁尾：中文顯示「人才招募」連到站內 `/careers`，英文不顯示（components/SiteFooter.tsx）
 * - `/en/careers` 回 404（middleware.ts）
 * - sitemap 與 hreflang 只列中文（app/sitemap.ts、lib/i18n.ts 的 pageMetadata）
 * - 「更多訊息」連結在 `app/[locale]/careers/page.tsx`
 */
export const CAREERS_104_URL = 'https://www.104.com.tw/company/afcnm08?jobsource=index_s_cs'

/** 只有中文版的路由：英文版 404，sitemap 與 hreflang 只列中文 */
export const ZH_ONLY_ROUTES: readonly string[] = ['/careers']
