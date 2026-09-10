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
