import { unstable_cache } from 'next/cache'
import { unstable_rethrow } from 'next/navigation'

/**
 * YouTube 影片的公開資訊，給 `VideoObject` 用。
 *
 * `VideoObject` 的必填欄位 `uploadDate` 與建議欄位 `duration`，CMS 與 mockup 都沒有——
 * 這些是 YouTube 那端的事實，所以去影片自己的觀看頁讀它的 microdata
 * （`<meta itemprop="uploadDate|duration|name|description">`）。不用 Data API：那要金鑰與配額，
 * 而我們只需要四個欄位。
 *
 * 觀看頁約 1.3MB，不能交給 fetch 快取（每支影片吃掉一整份 HTML，還會撞 2MB 上限）。
 * 外層用 `unstable_cache` 只存解析後的那幾個字，一天更新一次；頁面本身仍是 no-store。
 *
 * 讀不到（逾時、YouTube 改版、影片下架）就回 null，呼叫端整段不發——寧缺勿編。
 */
export type YoutubeMeta = {
  name: string
  description: string | null
  uploadDate: string
  duration: string | null
}

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", '#39': "'" }
const decode = (s: string) =>
  s.replace(/&(#?\w+);/g, (m, n: string) =>
    ENTITIES[n] ?? (n.startsWith('#') ? String.fromCodePoint(Number(n.slice(1))) : m),
  )

/** 第一個符合的 itemprop——頁面後段還有頻道的 `name`，影片本身的排在最前 */
const itemprop = (html: string, prop: string) => {
  const m = new RegExp(`<meta itemprop="${prop}" content="([^"]*)"`).exec(html)
  return m ? decode(m[1]) : null
}

/** 失敗一律 throw：`unstable_cache` 不存例外，一次逾時才不會被記住一整天 */
async function fetchYoutubeMeta(id: string): Promise<YoutubeMeta> {
  const res = await fetch(`https://www.youtube.com/watch?v=${id}`, {
    cache: 'no-store',
    headers: { 'accept-language': 'en' },
    signal: AbortSignal.timeout(5000),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const html = await res.text()
  const name = itemprop(html, 'name')
  const uploadDate = itemprop(html, 'uploadDate')
  if (!name || !uploadDate) throw new Error('觀看頁沒有 name／uploadDate')
  return {
    name,
    description: itemprop(html, 'description'),
    uploadDate,
    duration: itemprop(html, 'duration'),
  }
}

export const isYoutubeId = (id: string | null | undefined): id is string => !!id && /^[\w-]{6,20}$/.test(id)

export async function getYoutubeMeta(id: string): Promise<YoutubeMeta | null> {
  if (!isYoutubeId(id)) return null
  try {
    return await unstable_cache(() => fetchYoutubeMeta(id), ['youtube-meta', id], { revalidate: 86400 })()
  } catch (error) {
    unstable_rethrow(error)
    console.error(`[youtube] ${id} 取用失敗`, error)
    return null
  }
}
