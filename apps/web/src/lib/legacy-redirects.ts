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
 * **三種情況刻意不列**：
 * 1. 舊網址與新網址相同的（`/en/contact/` → `/en/contact`）——middleware 本來就會放行
 * 2. 100 個 `/tag/*` 封存頁——新站沒有標籤體系，D4 的「逐一 301」要等內容遷移
 *    決定落點（全部對到 `/news` 會被 Google 判為 soft 404，比 404 更糟）
 * 3. 其餘 70 篇文章——新站的 CMS 消息還沒匯入這些內容，沒有可指的網址
 *
 * 待辦清單（含建議落點）在 `reference/舊站301對照表.md`，內容遷移做完要回來補完這裡。
 */

/** 一列對照：`zh` 是舊站中文網址、`en` 是 WPML 的英文版（沒有就省略） */
type Legacy = { zh?: string; en?: string; to: string }

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

export const LEGACY_REDIRECTS: Record<string, string> = {
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
