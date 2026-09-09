/**
 * 舊站 301 對照表。
 *
 * 舊站 nti-printing.com 是 WordPress + WPML：**中文在根目錄、英文在 `/en/`**。
 * 新站是 `/zh/*` 與 `/en/*`，路徑幾乎全部不同 —— 不轉址的話舊網址累積的外部連結
 * 與索引會整批變成 404。
 *
 * 這份表的來源是**舊站自己的 sitemap**（2026-09-07 抓取：46 個頁面、82 篇文章、
 * 2 個分類、100 個標籤），不是憑印象列的。對應依據見
 * `reference/現有網站盤點與內容遷移.md` §3 的遷移地圖與 `reference/舊站301對照表.md`。
 *
 * 這裡列的是**有專屬落點**的 59 條。其餘 170 條（100 個 `/tag/*` 封存頁與 70 篇文章）
 * 在 `legacy-archive.ts`（產生檔），依客戶 2026-09-07 決定**一律 301 回首頁**：
 * 舊連結進來不要讓使用者撞 404。
 *
 * ⚠ 那 170 條買到的是使用者體驗，**不是 SEO**：內容不對等的轉址會被 Google 判成
 * soft 404，權重與 404 一樣傳不過去。內容遷移做完之後把落點補進下面的 `POSTS`，
 * 重跑 `node tools/check-legacy-redirects.mjs --write`，那幾條就會從首頁改成真正的
 * 一對一 301（具體落點永遠優先於 archive 的首頁）。優先順序見 docs/05 §3。
 *
 * 舊網址與新網址相同的（`/en/contact/` → `/en/contact`）兩邊都不列——middleware 本來就會放行。
 *
 * 逐條現況在 `reference/舊站301對照表.md`。
 */

import { LEGACY_ARCHIVE } from './legacy-archive'

/** 一列對照：`zh` 是舊站中文網址、`en` 是 WPML 的英文版（沒有就省略） */
type Legacy = { zh?: string; en?: string; to: string }

/**
 * 舊站的 100 個 `/tag/*` 封存頁。
 *
 * 內容遷移的決策 D4 是「全部保留標籤體系並逐一 301 對應」，落點就是新站的標籤封存頁
 * `/news/tag/{slug}`（後台單元 25，路由在 `app/[locale]/news/tag/[slug]`）。
 * 在這一版之前，這 100 條全部落在 `legacy-archive.ts` 導回首頁——那是 soft 404，
 * 權重一點都傳不過去（代價寫在本檔檔頭）。
 *
 * 舊標籤是同義詞氾濫的（綠色印刷／環保印刷／永續印刷／綠色印刷工廠指同一件事），
 * 所以是**多對一**：100 個舊標籤收斂到 17 個新標籤。收斂的理由見
 * `Api/Data/Seed/SeedData.cs` 的 `Tags`。
 *
 * ⚠ 舊標籤都在中文站的根目錄底下（`/tag/*`），WPML 沒有產英文版，所以只有 `zh`。
 * 舊 slug 有中文（`/tag/企業社會責任`），瀏覽器送 percent-encoding 過來，
 * `lookupLegacy()` 會先解碼再查（見該函式）。
 */
const TAGS: Legacy[] = [
  { zh: '/tag/綠色印刷', to: '/news/tag/green-printing' },
  { zh: '/tag/環保印刷', to: '/news/tag/green-printing' },
  { zh: '/tag/永續印刷', to: '/news/tag/green-printing' },
  { zh: '/tag/綠色印刷工廠', to: '/news/tag/green-printing' },
  { zh: '/tag/南台彩藝-綠色印刷工廠', to: '/news/tag/green-printing' },
  { zh: '/tag/地球友善', to: '/news/tag/green-printing' },
  { zh: '/tag/永續製造', to: '/news/tag/green-printing' },
  { zh: '/tag/低碳印刷', to: '/news/tag/low-carbon' },
  { zh: '/tag/低碳營運', to: '/news/tag/low-carbon' },
  { zh: '/tag/減碳', to: '/news/tag/low-carbon' },
  { zh: '/tag/淨零轉型', to: '/news/tag/low-carbon' },
  { zh: '/tag/台南永續印刷-ai-數位轉型', to: '/news/tag/low-carbon' },
  { zh: '/tag/碳足跡', to: '/news/tag/carbon-footprint' },
  { zh: '/tag/碳中和', to: '/news/tag/carbon-footprint' },
  { zh: '/tag/碳權', to: '/news/tag/carbon-footprint' },
  { zh: '/tag/碳交易', to: '/news/tag/carbon-footprint' },
  { zh: '/tag/碳權交易', to: '/news/tag/carbon-footprint' },
  { zh: '/tag/carbon-neutral', to: '/news/tag/carbon-footprint' },
  { zh: '/tag/carbon-permit', to: '/news/tag/carbon-footprint' },
  { zh: '/tag/carbon-tax', to: '/news/tag/carbon-footprint' },
  { zh: '/tag/esg', to: '/news/tag/esg' },
  { zh: '/tag/esg教育', to: '/news/tag/esg' },
  { zh: '/tag/csr', to: '/news/tag/csr' },
  { zh: '/tag/企業社會責任', to: '/news/tag/csr' },
  { zh: '/tag/何謂csr？', to: '/news/tag/csr' },
  { zh: '/tag/取之社會用之社會', to: '/news/tag/csr' },
  { zh: '/tag/社會與企業間的共生共存', to: '/news/tag/csr' },
  { zh: '/tag/綠建築', to: '/news/tag/green-building' },
  { zh: '/tag/leed', to: '/news/tag/green-building' },
  { zh: '/tag/eewh', to: '/news/tag/green-building' },
  { zh: '/tag/台灣鑽石級綠建築', to: '/news/tag/green-building' },
  { zh: '/tag/美國綠建築黃金級認證', to: '/news/tag/green-building' },
  { zh: '/tag/green-supply-chain', to: '/news/tag/green-supply-chain' },
  { zh: '/tag/gsc', to: '/news/tag/green-supply-chain' },
  { zh: '/tag/綠色供應鏈', to: '/news/tag/green-supply-chain' },
  { zh: '/tag/倉存管理', to: '/news/tag/green-supply-chain' },
  { zh: '/tag/永續包裝', to: '/news/tag/sustainable-packaging' },
  { zh: '/tag/綠色包裝', to: '/news/tag/sustainable-packaging' },
  { zh: '/tag/包裝材質', to: '/news/tag/sustainable-packaging' },
  { zh: '/tag/紙張包材', to: '/news/tag/sustainable-packaging' },
  { zh: '/tag/搖籃到搖籃', to: '/news/tag/sustainable-packaging' },
  { zh: '/tag/包裝設計', to: '/news/tag/packaging-design' },
  { zh: '/tag/包裝結構設計', to: '/news/tag/packaging-design' },
  { zh: '/tag/包裝彩盒', to: '/news/tag/packaging-design' },
  { zh: '/tag/彩盒印刷', to: '/news/tag/packaging-design' },
  { zh: '/tag/紙盒印刷', to: '/news/tag/packaging-design' },
  { zh: '/tag/金箔銀箔紙張包裝', to: '/news/tag/packaging-design' },
  { zh: '/tag/數位印刷', to: '/news/tag/digital-printing' },
  { zh: '/tag/少量印刷', to: '/news/tag/digital-printing' },
  { zh: '/tag/客製化印刷', to: '/news/tag/digital-printing' },
  { zh: '/tag/獨立版', to: '/news/tag/digital-printing' },
  { zh: '/tag/拼版印刷', to: '/news/tag/digital-printing' },
  { zh: '/tag/節省時間', to: '/news/tag/digital-printing' },
  { zh: '/tag/rfid', to: '/news/tag/variable-data-printing' },
  { zh: '/tag/rfid技術', to: '/news/tag/variable-data-printing' },
  { zh: '/tag/動物紙模型', to: '/news/tag/paper-craft' },
  { zh: '/tag/紙模型桌遊', to: '/news/tag/paper-craft' },
  { zh: '/tag/紙袋印刷', to: '/news/tag/paper-craft' },
  { zh: '/tag/保育類動物', to: '/news/tag/conservation' },
  { zh: '/tag/石虎', to: '/news/tag/conservation' },
  { zh: '/tag/黑熊', to: '/news/tag/conservation' },
  { zh: '/tag/明日動物', to: '/news/tag/conservation' },
  { zh: '/tag/海洋保育', to: '/news/tag/conservation' },
  { zh: '/tag/小虎鯨救援隊', to: '/news/tag/conservation' },
  { zh: '/tag/永續環境', to: '/news/tag/conservation' },
  { zh: '/tag/防災教育', to: '/news/tag/disaster-education' },
  { zh: '/tag/永續獎', to: '/news/tag/awards' },
  { zh: '/tag/遠見esg企業永續獎', to: '/news/tag/awards' },
  { zh: '/tag/國際認證', to: '/news/tag/awards' },
  { zh: '/tag/印刷認證', to: '/news/tag/awards' },
  { zh: '/tag/g7', to: '/news/tag/awards' },
  { zh: '/tag/gmi', to: '/news/tag/awards' },
  { zh: '/tag/競爭力', to: '/news/tag/awards' },
  { zh: '/tag/天下雜誌', to: '/news/tag/media-coverage' },
  { zh: '/tag/文策院', to: '/news/tag/partnership' },
  { zh: '/tag/夥伴', to: '/news/tag/partnership' },
  { zh: '/tag/永續交流會', to: '/news/tag/partnership' },

  /*
   * 這幾個舊標籤在新的 17 個裡沒有對應主題（多半是單篇專用的長尾詞），
   * 轉到內容最相近的頁面而不是硬塞一個標籤——那會做出名不副實的封存頁。
   */
  { zh: '/tag/桌曆', to: '/products-other' },
  { zh: '/tag/桌曆印刷', to: '/products-other' },
  { zh: '/tag/桌曆設計', to: '/products-other' },
  { zh: '/tag/設計桌曆', to: '/products-other' },
  { zh: '/tag/抽卡式桌曆', to: '/products-other' },
  { zh: '/tag/2024龍年桌曆', to: '/products-other' },
  { zh: '/tag/年曆', to: '/products-other' },
  { zh: '/tag/報價單', to: '/get-a-quote' },
  { zh: '/tag/印刷工藝', to: '/facility' },
  { zh: '/tag/印刷機', to: '/facility' },
  { zh: '/tag/平版印刷', to: '/facility' },
  { zh: '/tag/高品質印刷', to: '/facility' },
  { zh: '/tag/合板', to: '/products-cardboard' },
  { zh: '/tag/合板印刷', to: '/products-cardboard' },
  { zh: '/tag/包裝印刷', to: '/solutions' },
  { zh: '/tag/packaging-and-printing', to: '/solutions' },
  { zh: '/tag/南台彩藝', to: '/differences' },
  { zh: '/tag/減輕工業汙水', to: '/green-materials' },

  // 這四個是同一批新年桌曆活動的標籤（舊站掛在桌曆文章上），比照上面的「桌曆」
  { zh: '/tag/2024', to: '/products-other' },
  { zh: '/tag/2024happynewyear', to: '/products-other' },
  { zh: '/tag/happy-new-year', to: '/products-other' },
  { zh: '/tag/新年快樂', to: '/products-other' },

  // 唯一沒有落點的是 `/tag/美國`：舊站拿它標「美國通路／美國認證」兩類不相干的文章，
  // 對到任何一頁都名不副實，維持 legacy-archive 的首頁轉址（客戶 2026-09-07 的決定）。
]

/** 固定頁：舊站的資訊架構 → 新站頁面 */
const PAGES: Legacy[] = [
  { zh: '/home/vision', en: '/en/home/vision', to: '/about-difference' },
  { zh: '/home/recognition', en: '/en/home/recognition', to: '/about-certifications' },
  { zh: '/home/factory', en: '/en/home/factory-tour', to: '/facility-tour' },
  { zh: '/home/green-printing', en: '/en/home/green-printing', to: '/green-our-advantage' },

  // 舊站的 CSR 三支柱（環境／員工／社區）新站沒有獨立頁，全部收在 ESG
  // （`green-csr` 是預留的 pageKey，客戶確認後可以再細分，見 lib/pages.ts）
  { zh: '/home/csr', en: '/en/home/csr', to: '/green-esg' },
  { zh: '/home/csr/environment', en: '/en/home/csr/environmental-sustainability', to: '/green-esg' },
  { zh: '/home/csr/employees', en: '/en/home/csr/employee-development', to: '/green-esg' },
  { zh: '/home/csr/community', en: '/en/home/csr/make-contribution-to-the-community', to: '/green-esg' },

  { zh: '/home/news', en: '/en/home/news', to: '/news' },
  { zh: '/category/news', to: '/news' },

  { zh: '/products', en: '/en/products', to: '/solutions' },
  { zh: '/products/colorbox', en: '/en/products/packaging-boxes', to: '/products-boxes' },
  { zh: '/products/cards', en: '/en/products/包裝紙卡', to: '/products-cardboard' },
  { zh: '/products/uv-printing', en: '/en/products/uv-printing', to: '/products-uv' },
  { zh: '/products/other-printing', en: '/en/products/other-printing', to: '/products-other' },

  { zh: '/production', en: '/en/production-equipment', to: '/facility' },
  { zh: '/production/prepress', en: '/en/production-equipment/pre-press-equipment', to: '/facility-pre-press' },
  { zh: '/production/printing-equipment', en: '/en/production-equipment/printing-environmental-friendly', to: '/facility-eco-printing' },
  { zh: '/production/postpress', en: '/en/production-equipment/post-press-finishing', to: '/facility-post-press' },
  { zh: '/production/quality-check', en: '/en/production-equipment/quality-inspection', to: '/facility-quality' },

  // ⚠ 舊站有「HP Indigo 數位包裝印刷」專頁，新站沒有對應頁（盤點 §4.2 的待補項）。
  // 暫時指到最接近的環保印刷，補了專頁要改這一列。
  { zh: '/production/hp-indigo-digital-printing', to: '/facility-eco-printing' },

  // 電子報 Dr.Print → 綠色部落格（盤點 §3）。舊站英文版的網址是中文 slug
  { zh: '/drprint', en: '/en/電子報', to: '/green-vlog' },
  { zh: '/category/電子報', to: '/green-vlog' },

  // 舊站有 /contact/ 與 /en/contactus/ 兩個聯絡頁；新站只有一個
  { zh: '/contact', en: '/en/contactus', to: '/contact' },
]

/**
 * 文章：mockup 那 12 篇示範消息其實就是舊站這 12 篇的英文版
 * （逐篇比對標題確認過），所以新站已經有可指的網址。
 *
 * ⚠ 指的是 mockup 那 12 個靜態頁 `/news-*`。內容遷移把它們搬進 CMS 之後，
 * 落點要改成 CMS 的 `/news/{slug}`。
 */
const POSTS: Legacy[] = [
  { zh: '/sustainable-design-animal-exhibition', to: '/news-animals-of-tomorrow' },
  { zh: '/ntiprinting-commonwealth-magazine', to: '/news-commonwealth-interview' },
  { zh: '/news-firefighter-paper-boardgame', to: '/news-firefighter-boardgame' },
  { zh: '/paper-bag', to: '/news-gentle-wild-paper-bags' },
  { zh: '/南台彩藝榮獲2026《遠見》esg企業永續獎，以低碳營運', to: '/news-global-views-esg-award' },
  { zh: '/「綠色電動-x-數位創新」研討會落幕：esg趨勢與永續', to: '/news-green-drive-seminar' },
  { zh: '/green-printing-digital-innovation', to: '/news-green-printing-digital-innovation' },
  { zh: '/hp-數位印刷變動圖文，少量也能出眾！', to: '/news-hp-variable-data-printing' },
  { zh: '/we-utilize-an-integrated-low-carbon-production-model', to: '/news-low-carbon-production-film' },
  { zh: '/nti-national-sustainable-development-award', to: '/news-national-sustainable-development-award' },
  { zh: '/榮獲-中小企業加速投資行動方案-標竿企業', to: '/news-sme-investment-benchmark' },
  { zh: '/esg-for-culture', to: '/news-taicca-partnership' },
]

/**
 * 攤平成 `舊路徑 → 新路徑`（都不帶結尾斜線，key 一律小寫）。
 *
 * 舊站的中文網址落在**中文站**、`/en/` 的落在英文站——把繁中的讀者丟到英文頁
 * 等於白轉一次。使用者之後自己切語系會被 cookie 記住（middleware 的 `NEXT_LOCALE`）。
 */
function flatten(rows: Legacy[]): Record<string, string> {
  const map: Record<string, string> = {}
  for (const { zh, en, to } of rows) {
    if (zh) map[zh.toLowerCase()] = `/zh${to}`
    if (en) map[en.toLowerCase()] = `/en${to}`
  }
  return map
}

/**
 * 沒有專屬落點的舊網址 → 該語系的首頁。
 * 舊站中文在根目錄、英文在 `/en/`，前綴決定回哪一邊的首頁。
 */
const archive = Object.fromEntries(
  LEGACY_ARCHIVE.map((p) => [p.toLowerCase(), p.startsWith('/en/') ? '/en' : '/zh']),
)

// 展開順序＝優先順序：有專屬落點的會蓋掉 archive 的首頁
export const LEGACY_REDIRECTS: Record<string, string> = {
  ...archive,
  ...flatten(TAGS),
  ...flatten(PAGES),
  ...flatten(POSTS),
}

/**
 * 查一條舊網址。
 *
 * 舊站有一批中文 slug（`/en/電子報/`、`/products/包裝紙卡/`），瀏覽器送來的是
 * percent-encoding，所以解碼後再查；解不開就用原字串（壞掉的編碼不該讓 middleware 爆掉）。
 */
export function lookupLegacy(pathname: string): string | null {
  const trimmed = pathname.replace(/\/+$/, '')
  if (!trimmed) return null

  let key = trimmed
  try {
    key = decodeURIComponent(trimmed)
  } catch {
    // 保留原字串
  }
  return LEGACY_REDIRECTS[key.toLowerCase()] ?? null
}
