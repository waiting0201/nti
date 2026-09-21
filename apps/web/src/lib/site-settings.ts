import { getSiteSettings } from './api'
import type { Locale } from './i18n'

/** key → 值。只放**有值**的 key：後台把欄位清空的意思是「不要顯示」，不是「顯示空白」。 */
export type SiteSettingMap = Record<string, string>

/**
 * 網站設定（後台單元 21）。
 *
 * 回傳 `null` 代表**沒有 CMS 可問**——沒設 `NEXT_PUBLIC_API_BASE`、端點掛了、或回應不是
 * 成功信封。這時呼叫端要照渲染 mockup 寫死的內容，`verify:markup` 才會繼續成立
 * （與 `components/cms.tsx` 同一條原則：接 API 不是重新詮釋版面的時機）。
 *
 * 回傳物件代表**問到了**，缺的 key 就是客戶還沒填。兩者要分得開：
 * 「沒接 CMS」與「接了但客戶留空」對社群圖示是相反的行為——前者照 mockup 顯示三個
 * `href="#"`，後者要一個都不顯示（後台那三個欄位的提示就是「留空則前台不顯示該圖示」）。
 *
 * Mail 群組的收件者由後端在 SQL 裡就排除掉，不會出現在這份 map（04-api §3.1）。
 */
export async function getSettingMap(locale: Locale): Promise<SiteSettingMap | null> {
  const rows = await getSiteSettings(locale)
  if (!rows) return null

  const map: SiteSettingMap = {}
  for (const row of rows) if (row.value) map[row.settingKey] = row.value
  return map
}

/**
 * 電話的 `tel:` 連結。
 *
 * 顯示用的號碼帶空白（`+886 6 261 1358`），撥號用的不能帶——只留數字與開頭的 `+`。
 * 客戶在後台改成別的寫法（括號、破折號）也照樣算得出來，不必再改一次程式。
 */
export function telHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, '')
  return `tel:${digits}`
}

/**
 * `company.map_embed` → 真的能放進 `<iframe src>` 的網址。
 *
 * 後台那欄的提示是「點『分享 → 嵌入地圖』，**整段貼進來或只貼網址都可以**」，
 * 所以這個值有三種長相，前台都得認得：
 *
 * 1. 純網址 —— 種子給的就是這種
 * 2. Google 直接複製的整段 `<iframe src="…" …></iframe>` 片段
 * 3. 分享面板的 `/maps/place/…` 連結 —— 那種網址本身擋 iframe，要補 `output=embed`
 *
 * 第 2 種若原樣塞進 `src`，瀏覽器會把整段 HTML 當成相對路徑去請求，聯絡頁左下角
 * 就變成一個載入自家網域的空白框（線上就是這個症狀）。
 *
 * 認不出來（不是 https、不是 Google 地圖）一律回 `undefined`，讓呼叫端落回 mockup
 * 寫死的那張圖——寧可顯示台南廠的預設地圖，也不要一個空白或被擋掉的框。
 */
export function mapEmbedSrc(value: string | undefined): string | undefined {
  if (!value) return undefined

  const snippet = value.match(/<iframe\b[^>]*?\ssrc\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i)
  const candidate = unescapeHtml((snippet ? (snippet[1] ?? snippet[2] ?? snippet[3] ?? '') : value).trim())

  let url: URL
  try {
    url = new URL(candidate)
  } catch {
    return undefined
  }
  if (url.protocol !== 'https:') return undefined
  // google.com / www.google.com / maps.google.com.tw …；短網址（maps.app.goo.gl）嵌不進來，不收
  if (!/^(?:www\.|maps\.)?google\.[a-z]{2,3}(?:\.[a-z]{2})?$/.test(url.hostname)) return undefined
  if (!url.pathname.startsWith('/maps')) return undefined

  if (!url.pathname.startsWith('/maps/embed') && !url.searchParams.has('output')) {
    url.searchParams.set('output', 'embed')
  }
  return url.href
}

/**
 * 只還原貼上片段會帶到的那幾個實體（`&amp;` 放最後，不然會把 `&amp;quot;` 解兩次）。
 * 這裡的輸出只會進 `new URL()` 做驗證，不會變成 HTML，所以不需要完整的 decoder。
 */
function unescapeHtml(s: string): string {
  return s
    .replace(/&quot;/g, '"')
    .replace(/&(?:apos|#0?39);/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
}
