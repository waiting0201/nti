/**
 * 15 頁面設定與 SEO 清單的「前台名稱」欄：pageKey → 前台顯示這一頁的中英文字。
 *
 * 優先取 header 選單（`apps/web/src/components/SiteHeader.tsx` 的 MENU）；選單上沒有自己一項的頁，
 * 改取頁尾（`SiteFooter.tsx`）或該頁麵包屑（mockup 的 `.crumb` 最後一節），`from` 記出處，清單上會標示。
 * 中文一律是 `apps/web/src/lib/zh.ts` 同一句英文的翻譯 —— 前台改字時這裡要跟著改。
 */
export type LabelSource = 'menu' | 'footer' | 'crumb' | 'reserved'

export const LABEL_SOURCE: Record<LabelSource, string> = {
  menu: '',
  footer: '頁尾',
  crumb: '麵包屑',
  reserved: '預留頁，前台未上線',
}

export const MENU_LABEL: Record<string, { zh: string; en: string; from?: LabelSource }> = {
  home: { zh: '首頁', en: 'Home', from: 'crumb' },
  'about-hub': { zh: '關於我們', en: 'About Us' },
  'about-difference': { zh: '南台彩藝的差異', en: 'The NTI Difference' },
  'about-benefits': { zh: '客戶效益', en: 'Benefits to Clients' },
  'about-certifications': { zh: '品質認證與永續實踐', en: 'Certifications, Partnerships & Awards' },
  facility: { zh: '設備與廠房', en: 'Facilities & Equipment' },
  'facility-pre-press': { zh: '製版設備', en: 'Prepress Equipment', from: 'crumb' },
  'facility-eco-printing': { zh: '環保印刷', en: 'Environmentally Friendly Printing', from: 'crumb' },
  'facility-post-press': { zh: '印後加工', en: 'Post-Press Processing', from: 'crumb' },
  'facility-quality': { zh: '品質檢驗', en: 'Quality Inspection', from: 'crumb' },
  'facility-tour': { zh: '工廠導覽', en: 'Factory Tour', from: 'crumb' },
  solutions: { zh: '客製化解決方案', en: 'Solutions' },
  projects: { zh: '實績案例', en: 'Projects' },
  'sustainability-hub': { zh: '綠色永續', en: 'Sustainability' },
  'green-our-advantage': { zh: '綠色優勢', en: 'Our Green Advantages' },
  'green-carbon': { zh: '碳效率', en: 'Carbon Efficiency' },
  'green-materials': { zh: '環保材料', en: 'ECO Materials' },
  'green-esg': { zh: 'ESG 與永續目標', en: 'ESG & Future Goals' },
  // mockup 沒有這一頁，名稱沿用後台說明裡的稱呼
  'green-csr': { zh: '綠色 CSR', en: 'Green CSR', from: 'reserved' },
  insights: { zh: '知識中心', en: 'Insights' },
  'news-list': { zh: '最新消息', en: 'Latest News' },
  'green-vlog': { zh: '綠色 Vlog', en: 'Green Vlog' },
  faq: { zh: '常見問題', en: 'FAQ' },
  'industry-trends': { zh: '產業趨勢', en: 'Industry Trends' },
  careers: { zh: '人才招募', en: 'Careers', from: 'footer' },
  'supplier-area': { zh: '供應商專區', en: 'Supplier Area', from: 'footer' },
  contact: { zh: '聯絡我們', en: 'Contact Us', from: 'crumb' },
  'get-a-quote': { zh: '索取報價', en: 'Get a Quote', from: 'footer' },
  'privacy-legal': { zh: '隱私權與法律聲明', en: 'Privacy & Legal', from: 'footer' },
}
