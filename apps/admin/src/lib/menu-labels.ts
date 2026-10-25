/**
 * 15 頁面設定與 SEO 清單的「前台選單名稱」欄：pageKey → 前台 header 選單上顯示的中英文字。
 *
 * 英文抄自 `apps/web/src/components/SiteHeader.tsx` 的 MENU，中文抄自 `apps/web/src/lib/zh.ts`
 * 同一句英文的翻譯 —— 兩邊改了這裡要跟著改。選單上沒有自己一項的頁（首頁、工廠子頁、
 * 綠色 CSR、職涯、聯絡、詢價、供應商、隱私權）不列，清單顯示「—」。
 */
export const MENU_LABEL: Record<string, { zh: string; en: string }> = {
  'about-hub': { zh: '關於我們', en: 'About Us' },
  'about-difference': { zh: '南台彩藝的差異', en: 'The NTI Difference' },
  'about-benefits': { zh: '客戶效益', en: 'Benefits to Clients' },
  'about-certifications': { zh: '品質認證與永續實踐', en: 'Certifications, Partnerships & Awards' },
  facility: { zh: '設備與廠房', en: 'Facilities & Equipment' },
  solutions: { zh: '客製化解決方案', en: 'Solutions' },
  projects: { zh: '實績案例', en: 'Projects' },
  'sustainability-hub': { zh: '綠色永續', en: 'Sustainability' },
  'green-our-advantage': { zh: '綠色優勢', en: 'Our Green Advantages' },
  'green-carbon': { zh: '碳效率', en: 'Carbon Efficiency' },
  'green-materials': { zh: '環保材料', en: 'ECO Materials' },
  'green-esg': { zh: 'ESG 與永續目標', en: 'ESG & Future Goals' },
  insights: { zh: '知識中心', en: 'Insights' },
  'news-list': { zh: '最新消息', en: 'Latest News' },
  'green-vlog': { zh: '綠色 Vlog', en: 'Green Vlog' },
  faq: { zh: '常見問題', en: 'FAQ' },
  'industry-trends': { zh: '產業趨勢', en: 'Industry Trends' },
}
