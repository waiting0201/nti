/**
 * 人才招募只有中文版，而且直接外連 104 的公司頁（客戶 2026-11-05 決定）；英文版移除。
 *
 * - 頁尾：中文顯示「人才招募」外連這裡，英文不顯示（components/SiteFooter.tsx）
 * - `/careers`：中文 301 到這裡、`/en/careers` 回 404（middleware.ts）
 * - sitemap 不列 `/careers`（app/sitemap.ts）
 */
export const CAREERS_104_URL = 'https://www.104.com.tw/company/afcnm08?jobsource=index_s_cs'

/** 站內已不再提供、但 mockup 與 ROUTES 仍保留的路由（sitemap 與驗收閘要跳過） */
export const RETIRED_ROUTES: readonly string[] = ['/careers']
