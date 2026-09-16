import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/i18n'

/**
 * 正式上線前一律 noindex。
 *
 * 站台在 SWA 上是公開可達的（`*.azurestaticapps.net`），而規劃的上線時間是 2026-11。
 * 中間這段若被搜尋引擎收錄，之後換到正式網域會留下一批指向 azurestaticapps.net
 * 的舊索引，得再花力氣清。所以**預設擋全站**，要開放收錄必須在該次 build 明確設
 * `NEXT_PUBLIC_ALLOW_INDEXING=1`。
 */
const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === '1'

/**
 * AI 訓練語料的爬蟲是否放行。預設放行，要擋才設 `NEXT_PUBLIC_ALLOW_AI_TRAINING=0`。
 *
 * 與「擷取以供即時回答」是兩件事，見下方 AI_RETRIEVAL_BOTS / AI_TRAINING_BOTS 的說明。
 * 客戶若只對「被拿去訓練」有疑慮，關掉這個旗標即可，不會傷到 GEO。
 */
const allowAiTraining = process.env.NEXT_PUBLIC_ALLOW_AI_TRAINING !== '0'

/**
 * 後台與公開站同域（`public/admin`）。`index.html` 的 meta noindex 只擋索引、不擋爬取，
 * 所以 robots.txt 要明確擋掉。
 *
 * ⚠️ robots.txt 的比對規則是「爬蟲只讀最符合自己的那一組，讀到了就不看 `*`」。
 * 因此**每個具名群組都必須自己重寫一次這條 disallow**，否則一加具名群組，
 * 該爬蟲就從 `*` 的保護裡掉出來、`/admin/` 變成可爬。
 */
const DISALLOW = ['/admin/']

/**
 * 擷取／即時回答類：使用者問問題時去抓內容、並在回答裡附上出處連結。
 * 這是 GEO（06-geo）要的曝光來源，擋掉等於放棄被 AI 引用，一律放行。
 */
const AI_RETRIEVAL_BOTS = [
  'OAI-SearchBot', // ChatGPT 搜尋索引
  'ChatGPT-User', // 使用者在 ChatGPT 貼網址時的現場抓取
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
]

/**
 * 訓練語料類：抓去做模型訓練，不直接帶來引用曝光。
 *
 * `Google-Extended` 與 `Applebot-Extended` 是**純粹的訓練 opt-out token**，
 * 不影響 Google／Apple 的搜尋索引——擋它們不會掉搜尋排名，這點常被誤解。
 */
const AI_TRAINING_BOTS = [
  'GPTBot',
  'ClaudeBot',
  'CCBot',
  'Google-Extended',
  'Applebot-Extended',
]

export default function robots(): MetadataRoute.Robots {
  if (!allowIndexing) {
    return { rules: { userAgent: '*', disallow: '/' } }
  }

  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: DISALLOW },
      { userAgent: AI_RETRIEVAL_BOTS, allow: '/', disallow: DISALLOW },
      allowAiTraining
        ? { userAgent: AI_TRAINING_BOTS, allow: '/', disallow: DISALLOW }
        : { userAgent: AI_TRAINING_BOTS, disallow: '/' },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
