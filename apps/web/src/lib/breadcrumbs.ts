/**
 * 各頁的麵包屑，由 scripts/build-pages.mjs 從 mockup 的 `.crumb` 產生。
 *
 * 只收**畫面上真的有麵包屑**的頁面（43／44 頁）——BreadcrumbList
 * 結構化資料必須對得上可見內容，替沒有麵包屑的頁面憑空生一條是違反 Google 規範的。
 * 中文在產生時就查好 zh.ts（查不到落回英文），執行期不需要字典。
 */
export type Crumb = { en: string; zh: string; path?: string }

export const BREADCRUMBS: Record<string, Crumb[]> = {
  "/about-benefits": [
    {"en":"Home","zh":"首頁","path":"/"},
    {"en":"About Us","zh":"關於我們","path":"/differences"},
    {"en":"Benefits to Clients","zh":"客戶得到的效益"},
  ],
  "/about-certifications": [
    {"en":"Home","zh":"首頁","path":"/"},
    {"en":"About Us","zh":"關於我們","path":"/differences"},
    {"en":"Our Certifications","zh":"我們的認證"},
  ],
  "/about-difference": [
    {"en":"Home","zh":"首頁","path":"/"},
    {"en":"About Us","zh":"關於我們","path":"/differences"},
    {"en":"The NTI Difference","zh":"NTI 的與眾不同"},
  ],
  "/careers": [
    {"en":"Home","zh":"首頁","path":"/"},
    {"en":"Careers","zh":"人才招募"},
  ],
  "/contact": [
    {"en":"Home","zh":"首頁","path":"/"},
    {"en":"Contact Us","zh":"聯絡我們"},
  ],
  "/differences": [
    {"en":"Home","zh":"首頁","path":"/"},
    {"en":"About Us","zh":"關於我們"},
  ],
  "/facility-eco-printing": [
    {"en":"Home","zh":"首頁","path":"/"},
    {"en":"About Us","zh":"關於我們","path":"/differences"},
    {"en":"Facilities & Equipment","zh":"設備與廠房","path":"/facility"},
    {"en":"Environmentally Friendly Printing","zh":"環保印刷"},
  ],
  "/facility-post-press": [
    {"en":"Home","zh":"首頁","path":"/"},
    {"en":"About Us","zh":"關於我們","path":"/differences"},
    {"en":"Facilities & Equipment","zh":"設備與廠房","path":"/facility"},
    {"en":"Post-Press Processing","zh":"印後加工"},
  ],
  "/facility-pre-press": [
    {"en":"Home","zh":"首頁","path":"/"},
    {"en":"About Us","zh":"關於我們","path":"/differences"},
    {"en":"Facilities & Equipment","zh":"設備與廠房","path":"/facility"},
    {"en":"Prepress Equipment","zh":"製版設備"},
  ],
  "/facility-quality": [
    {"en":"Home","zh":"首頁","path":"/"},
    {"en":"About Us","zh":"關於我們","path":"/differences"},
    {"en":"Facilities & Equipment","zh":"設備與廠房","path":"/facility"},
    {"en":"Quality Inspection","zh":"品質檢驗"},
  ],
  "/facility-tour": [
    {"en":"Home","zh":"首頁","path":"/"},
    {"en":"About Us","zh":"關於我們","path":"/differences"},
    {"en":"Facilities & Equipment","zh":"設備與廠房","path":"/facility"},
    {"en":"Factory Tour","zh":"工廠導覽"},
  ],
  "/facility": [
    {"en":"Home","zh":"首頁","path":"/"},
    {"en":"About Us","zh":"關於我們","path":"/differences"},
    {"en":"Facilities & Equipment","zh":"設備與廠房"},
  ],
  "/faq": [
    {"en":"Home","zh":"首頁","path":"/"},
    {"en":"Insights","zh":"洞察","path":"/insights"},
    {"en":"FAQ","zh":"常見問題"},
  ],
  "/get-a-quote": [
    {"en":"Home","zh":"首頁","path":"/"},
    {"en":"Get a Quote","zh":"索取報價"},
  ],
  "/green-advantage": [
    {"en":"Home","zh":"首頁","path":"/"},
    {"en":"Sustainability","zh":"永續"},
  ],
  "/green-carbon": [
    {"en":"Home","zh":"首頁","path":"/"},
    {"en":"Sustainability","zh":"永續","path":"/green-advantage"},
    {"en":"Carbon Efficiency","zh":"碳效率"},
  ],
  "/green-esg": [
    {"en":"Home","zh":"首頁","path":"/"},
    {"en":"Sustainability","zh":"永續","path":"/green-advantage"},
    {"en":"ESG & Future Goals","zh":"ESG 與未來目標"},
  ],
  "/green-materials": [
    {"en":"Home","zh":"首頁","path":"/"},
    {"en":"Sustainability","zh":"永續","path":"/green-advantage"},
    {"en":"ECO Materials","zh":"環保材料"},
  ],
  "/green-our-advantage": [
    {"en":"Home","zh":"首頁","path":"/"},
    {"en":"Sustainability","zh":"永續","path":"/green-advantage"},
    {"en":"Our Green Advantages","zh":"我們的綠色優勢"},
  ],
  "/green-vlog": [
    {"en":"Home","zh":"首頁","path":"/"},
    {"en":"Insights","zh":"洞察","path":"/insights"},
    {"en":"Green Vlog","zh":"綠色 Vlog"},
  ],
  "/industry-trends": [
    {"en":"Home","zh":"首頁","path":"/"},
    {"en":"Insights","zh":"洞察","path":"/insights"},
    {"en":"Industry Trends","zh":"產業趨勢"},
  ],
  "/insights": [
    {"en":"Home","zh":"首頁","path":"/"},
    {"en":"Insights","zh":"洞察"},
  ],
  "/news-animals-of-tomorrow": [
    {"en":"Home","zh":"首頁","path":"/"},
    {"en":"Insights","zh":"洞察","path":"/insights"},
    {"en":"Latest News","zh":"最新消息","path":"/news"},
    {"en":"Exhibition","zh":"展覽"},
  ],
  "/news-commonwealth-interview": [
    {"en":"Home","zh":"首頁","path":"/"},
    {"en":"Insights","zh":"洞察","path":"/insights"},
    {"en":"Latest News","zh":"最新消息","path":"/news"},
    {"en":"Media","zh":"媒體"},
  ],
  "/news-firefighter-boardgame": [
    {"en":"Home","zh":"首頁","path":"/"},
    {"en":"Insights","zh":"洞察","path":"/insights"},
    {"en":"Latest News","zh":"最新消息","path":"/news"},
    {"en":"ESG","zh":"ESG"},
  ],
  "/news-gentle-wild-paper-bags": [
    {"en":"Home","zh":"首頁","path":"/"},
    {"en":"Insights","zh":"洞察","path":"/insights"},
    {"en":"Latest News","zh":"最新消息","path":"/news"},
    {"en":"Digital Printing","zh":"數位印刷"},
  ],
  "/news-global-views-esg-award": [
    {"en":"Home","zh":"首頁","path":"/"},
    {"en":"Insights","zh":"洞察","path":"/insights"},
    {"en":"Latest News","zh":"最新消息","path":"/news"},
    {"en":"Awards","zh":"獲獎肯定"},
  ],
  "/news-green-drive-seminar": [
    {"en":"Home","zh":"首頁","path":"/"},
    {"en":"Insights","zh":"洞察","path":"/insights"},
    {"en":"Latest News","zh":"最新消息","path":"/news"},
    {"en":"Event","zh":"活動"},
  ],
  "/news-green-printing-digital-innovation": [
    {"en":"Home","zh":"首頁","path":"/"},
    {"en":"Insights","zh":"洞察","path":"/insights"},
    {"en":"Latest News","zh":"最新消息","path":"/news"},
    {"en":"Sustainability","zh":"永續"},
  ],
  "/news-hp-variable-data-printing": [
    {"en":"Home","zh":"首頁","path":"/"},
    {"en":"Insights","zh":"洞察","path":"/insights"},
    {"en":"Latest News","zh":"最新消息","path":"/news"},
    {"en":"Digital Printing","zh":"數位印刷"},
  ],
  "/news-low-carbon-production-film": [
    {"en":"Home","zh":"首頁","path":"/"},
    {"en":"Insights","zh":"洞察","path":"/insights"},
    {"en":"Latest News","zh":"最新消息","path":"/news"},
    {"en":"Sustainability","zh":"永續"},
  ],
  "/news-national-sustainable-development-award": [
    {"en":"Home","zh":"首頁","path":"/"},
    {"en":"Insights","zh":"洞察","path":"/insights"},
    {"en":"Latest News","zh":"最新消息","path":"/news"},
    {"en":"Awards","zh":"獲獎肯定"},
  ],
  "/news-sme-investment-benchmark": [
    {"en":"Home","zh":"首頁","path":"/"},
    {"en":"Insights","zh":"洞察","path":"/insights"},
    {"en":"Latest News","zh":"最新消息","path":"/news"},
    {"en":"Awards","zh":"獲獎肯定"},
  ],
  "/news-taicca-partnership": [
    {"en":"Home","zh":"首頁","path":"/"},
    {"en":"Insights","zh":"洞察","path":"/insights"},
    {"en":"Latest News","zh":"最新消息","path":"/news"},
    {"en":"Partnership","zh":"合作夥伴"},
  ],
  "/news": [
    {"en":"Home","zh":"首頁","path":"/"},
    {"en":"Insights","zh":"洞察","path":"/insights"},
    {"en":"Latest News","zh":"最新消息"},
  ],
  "/privacy-legal": [
    {"en":"Home","zh":"首頁","path":"/"},
    {"en":"Privacy & Legal","zh":"隱私權與法律聲明"},
  ],
  "/products-boxes": [
    {"en":"Home","zh":"首頁","path":"/"},
    {"en":"Solutions","zh":"解決方案","path":"/solutions"},
    {"en":"Color Box Packaging","zh":"彩盒包裝"},
  ],
  "/products-cardboard": [
    {"en":"Home","zh":"首頁","path":"/"},
    {"en":"Solutions","zh":"解決方案","path":"/solutions"},
    {"en":"Packaging Paperboard","zh":"包裝紙板"},
  ],
  "/products-other": [
    {"en":"Home","zh":"首頁","path":"/"},
    {"en":"Solutions","zh":"解決方案","path":"/solutions"},
    {"en":"Other Printing","zh":"其他印刷"},
  ],
  "/products-uv": [
    {"en":"Home","zh":"首頁","path":"/"},
    {"en":"Solutions","zh":"解決方案","path":"/solutions"},
    {"en":"UV Printing","zh":"UV 印刷"},
  ],
  "/projects": [
    {"en":"Home","zh":"首頁","path":"/"},
    {"en":"Projects","zh":"實績案例"},
  ],
  "/solutions": [
    {"en":"Home","zh":"首頁","path":"/"},
    {"en":"Solutions","zh":"解決方案"},
  ],
  "/supplier-area": [
    {"en":"Home","zh":"首頁","path":"/"},
    {"en":"Supplier Area","zh":"供應商專區"},
  ],
}
