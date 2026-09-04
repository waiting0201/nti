/**
 * 路由 ↔ 固定頁 pageKey 對照（docs/08 §6.4 的 29 筆）。
 *
 * 兩邊的命名不同源：路由沿用 mockup 的檔名（客戶已確認的版本），
 * pageKey 是 docs/08 定的固定頁代號。`db/seed/140_page.sql` 的 `RouteTemplate`
 * 當時標明是提案值（「02-frontend 尚未定案路由」），實際路由就是這裡這一份。
 *
 * 對不上的兩邊都有，不是遺漏：
 *
 * - **路由有、pageKey 沒有**：`/differences`、`/green-advantage`（mockup 的兩個
 *   替代版頁面）、`/products-*`（SEO 來自 `SolutionI18n`）、`/news-*`（來自 `NewsI18n`）
 * - **pageKey 有、路由沒有**：`about-hub`、`sustainability-hub`（IA 有這兩層但
 *   mockup 沒有對應頁）、`green-csr`（預留，待客戶確認）
 *
 * 沒有對應 pageKey 的頁面就用各頁寫死的 metadata，不會因此少掉 title。
 */
export const PAGE_KEY_BY_PATH: Record<string, string> = {
  '/': 'home',

  '/about-difference': 'about-difference',
  '/about-benefits': 'about-benefits',
  '/about-certifications': 'about-certifications',

  '/facility': 'facility',
  '/facility-pre-press': 'facility-pre-press',
  '/facility-eco-printing': 'facility-eco-printing',
  '/facility-post-press': 'facility-post-press',
  '/facility-quality': 'facility-quality',
  '/facility-tour': 'facility-tour',

  '/solutions': 'solutions',
  '/projects': 'projects',

  '/green-our-advantage': 'green-our-advantage',
  '/green-carbon': 'green-carbon',
  '/green-materials': 'green-materials',
  '/green-esg': 'green-esg',

  '/insights': 'insights',
  '/news': 'news-list',
  '/green-vlog': 'green-vlog',
  '/faq': 'faq',
  '/industry-trends': 'industry-trends',

  '/careers': 'careers',
  '/supplier-area': 'supplier-area',
  '/contact': 'contact',
  '/get-a-quote': 'get-a-quote',
  '/privacy-legal': 'privacy-legal',
}
