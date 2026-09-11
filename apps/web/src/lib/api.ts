import { unstable_rethrow } from 'next/navigation'

import type { Locale } from './i18n'
import { mediaUrl } from './media'

/**
 * 前台的 API 存取層。
 *
 * **沒設 `NEXT_PUBLIC_API_BASE` 就整層停用**，頁面各自渲染原本寫死的 mockup 內容。
 * 這不是暫時的權宜：客戶的內容與中文文案都還沒進 CMS，而公開站已經部署在
 * SWA 上；接了空的資料庫只會讓整站變空白。設了才會改吃 CMS。
 *
 * 這也讓 `verify:markup`（版面驗收閘）在預設建置下仍然成立——
 * 它比對的是 `</header>` 到 `<footer>` 之間的實際輸出，沒有 API 時那段完全沒變。
 */
export const apiBase = (process.env.NEXT_PUBLIC_API_BASE ?? '').replace(/\/$/, '')

export const hasApi = apiBase.length > 0

/**
 * **這一層完全不快取**（2026-09-11）。
 *
 * 原本是 `next: { revalidate: 300, tags: ['cms'] }` 的 ISR，加上後台存檔時打
 * `/api/revalidate` 立刻作廢那個 tag。決定拿掉是因為要的是「後台一存檔、前台重整就是新的」，
 * 而 tag 作廢做不到那個保證的最後一哩：ISR 快取是**每個執行個體各自持有**的，
 * SWA 一旦擴出第二個執行個體，通知只清得到接到請求的那一台，其餘仍等 300 秒——
 * 症狀是「有時候更新有時候沒有」，比穩定慢 5 分鐘還難查。
 *
 * 代價是每一個訪客的每一頁都會打一次 API、進一次 Azure SQL Basic。
 * 流量長起來之後要加快取的話，加在這裡（`next: { revalidate }`），
 * 並且要連同「多執行個體下怎麼作廢」一起解決，不是把舊的 webhook 接回來就好。
 */

type Envelope<T> = { success: boolean; code: string | null; data: T; message: string }

/**
 * 打一支端點。
 *
 * **失敗一律回 null，不拋例外**：API 掛掉時公開站應該退回寫死的內容繼續服務，
 * 而不是整頁 500。錯誤會記在伺服器日誌裡。
 *
 * `unstable_rethrow` 擋的是**誤判**：Next 用丟例外的方式表達控制流——
 * 「這頁用了 no-store，不能預先產生成靜態」的 `DynamicServerError`、
 * `notFound()`、`redirect()` 都會經過這個 catch。沒有它的話，build 期間每一支端點
 * 都會記一行 `[api] ... 取用失敗 DynamicServerError`，而那看起來完全像 API 掛了。
 *
 * （頁面的新鮮度不靠它：2026-09-11 兩種寫法都實測過，no-store 的頁面在
 * 執行期都是每個請求重新渲染。它修的是日誌，不是行為。）
 */
async function fetchApi<T>(path: string): Promise<T | null> {
  if (!hasApi) return null

  try {
    const res = await fetch(`${apiBase}${path}`, { cache: 'no-store' })
    if (!res.ok) {
      console.error(`[api] ${path} → HTTP ${res.status}`)
      return null
    }

    const envelope = (await res.json()) as Envelope<T>
    return envelope.success ? envelope.data : null
  } catch (error) {
    unstable_rethrow(error)
    console.error(`[api] ${path} 取用失敗`, error)
    return null
  }
}

const q = (locale: Locale, extra = '') => `?lang=${locale}${extra}`

// ── SEO（固定頁）──────────────────────────────────────────────────────────
export type Seo = {
  slug: string
  seoTitle: string | null
  seoDescription: string | null
  canonicalUrl: string | null
  ogTitle: string | null
  ogDescription: string | null
  ogImagePath: string | null
  hreflang: Record<string, string>
}

export type PageSeo = {
  pageKey: string
  isIndexable: boolean
  bodyHtml: string | null
  seo: Seo
}

export const getPage = (locale: Locale, pageKey: string) =>
  fetchApi<PageSeo>(`/pages/${pageKey}${q(locale)}`)

// ── 內容 ──────────────────────────────────────────────────────────────────
export type HomeContent = {
  banners: Banner[]
  solutions: SolutionCard[]
  certifications: Certification[]
  clients: ClientLogo[]
  featuredNews: NewsCard[]
}

export type Banner = {
  id: number
  imagePath: string
  imagePathMobile: string | null
  mediaType: string
  videoPath: string | null
  linkUrl: string | null
  openInNewTab: boolean
  imageAlt: string
}

export type SolutionCard = {
  id: number
  code: string
  coverImagePath: string
  name: string
  h1: string
  summary: string | null
  coverAlt: string
  slug: string
}

export type SolutionDetail = SolutionCard & {
  introHtml: string | null
  seo: Seo
  items: { id: number; imagePath: string; name: string; description: string | null; imageAlt: string }[]
}

export type NewsCard = {
  id: number
  categoryCode: string
  categoryName: string
  publishDate: string
  coverImagePath: string
  isFeaturedHome: boolean
  title: string
  summary: string | null
  coverAlt: string
  slug: string
}

/**
 * 消息標籤（後台單元 25）。`slug` 不分語系、`name` 分語系，
 * 所以 `/zh/news/tag/esg` 與 `/en/news/tag/esg` 是同一個 slug、不同的顯示名。
 */
export type Tag = {
  id: number
  slug: string
  name: string
  /** 只有標籤清單／單筆端點有值；消息詳細頁帶出來的標籤不算篇數 */
  newsCount: number
}

export type NewsDetail = Omit<NewsCard, 'isFeaturedHome'> & {
  bodyHtml: string
  tags: Tag[]
  seo: Seo
}

export type Project = {
  id: number
  categoryCode: string
  categoryName: string
  imagePath: string
  videoUrl: string | null
  statValue: string | null
  title: string
  summary: string | null
  statLabel: string | null
  imageAlt: string
}

export type Vlog = {
  id: number
  categoryName: string
  youtubeId: string
  thumbOverridePath: string | null
  isMainFeature: boolean
  title: string
  description: string | null
}

export type Faq = {
  id: number
  categoryId: number | null
  categoryCode: string | null
  categoryName: string | null
  question: string
  answerHtml: string
}

export type Trend = { id: number; title: string; bodyHtml: string }

export type Certification = {
  id: number
  categoryName: string | null
  logoPath: string
  linkUrl: string | null
  showOnHome: boolean
  name: string
  description: string | null
  logoAlt: string
}

export type ClientLogo = { id: number; name: string; logoPath: string; linkUrl: string | null }

export type FacilityItem = {
  id: number
  categoryCode: string
  categoryName: string
  imagePath: string
  name: string
  description: string | null
  imageAlt: string
}

export type Job = { id: number; title: string; location: string | null; descriptionHtml: string }

export type SupplierNotice = {
  id: number
  categoryName: string
  noticeDate: string
  attachmentPath: string | null
  title: string
  bodyHtml: string | null
}

export type SupplierSpec = { id: number; title: string; description: string }

export type SupplierDownload = {
  id: number
  filePath: string
  fileExt: string
  fileSizeBytes: number
  downloadCount: number
  name: string
}

export type Category = { id: number; categoryType: string; code: string; name: string }

export type SiteSetting = { settingKey: string; groupName: string; valueType: string; value: string | null }

export const getHome           = (l: Locale) => fetchApi<HomeContent>(`/content/home${q(l)}`)
export const getSolutions      = (l: Locale) => fetchApi<SolutionCard[]>(`/solutions${q(l)}`)
export const getSolution       = (l: Locale, slug: string) => fetchApi<SolutionDetail>(`/solutions/${slug}${q(l)}`)

/**
 * 以固定代號取方案（`boxes`／`cardboard`／`uv`／`other`）。
 *
 * 前台的 `/products-{code}` 四頁是照代號來的，但 API 的詳細頁吃 slug——
 * slug 是可翻譯欄位（中英可不同），代號才是穩定的。先查清單再取詳細，
 * 所以這四頁每次渲染會打兩支端點——沒有快取之後那是兩趟真的網路往返。
 */
export async function getSolutionByCode(locale: Locale, code: string) {
  const list = await getSolutions(locale)
  const match = list?.find((s) => s.code === code)
  return match ? await getSolution(locale, match.slug) : null
}
export const getProjects       = (l: Locale) => fetchApi<Project[]>(`/projects${q(l)}`)
export const getNews           = (l: Locale) => fetchApi<NewsCard[]>(`/news${q(l)}`)
export const getNewsItem       = (l: Locale, slug: string) => fetchApi<NewsDetail>(`/news/${slug}${q(l)}`)

// ── 標籤（單元 25）──────────────────────────────────────────────────────────
// 後端只回「有已上架消息」的標籤，所以清單與封存頁都不會出現空標籤（見 TagReadService）
export const getTags           = (l: Locale) => fetchApi<Tag[]>(`/tags${q(l)}`)
export const getTag            = (l: Locale, slug: string) => fetchApi<Tag>(`/tags/${slug}${q(l)}`)
export const getNewsByTag      = (l: Locale, slug: string) =>
  fetchApi<NewsCard[]>(`/news${q(l, `&tag=${encodeURIComponent(slug)}`)}`)
export const getVlogs          = (l: Locale) => fetchApi<Vlog[]>(`/green-vlog${q(l)}`)
export const getFaqs           = (l: Locale) => fetchApi<Faq[]>(`/faq${q(l)}`)
export const getTrends         = (l: Locale) => fetchApi<Trend[]>(`/industry-trends${q(l)}`)
export const getCertifications = (l: Locale) => fetchApi<Certification[]>(`/certifications${q(l)}`)
export const getClients        = (l: Locale) => fetchApi<ClientLogo[]>('/clients')
export const getJobs           = (l: Locale) => fetchApi<Job[]>(`/careers${q(l)}`)

export const getFacility = (l: Locale, group?: string) =>
  fetchApi<FacilityItem[]>(`/facility${q(l, group ? `&group=${group}` : '')}`)

export const getSupplierNotices   = (l: Locale) => fetchApi<SupplierNotice[]>(`/supplier/notices${q(l)}`)
export const getSupplierSpecs     = (l: Locale) => fetchApi<SupplierSpec[]>(`/supplier/specs${q(l)}`)
export const getSupplierDownloads = (l: Locale) => fetchApi<SupplierDownload[]>(`/supplier/downloads${q(l)}`)

export const getCategories = (l: Locale, type: string) =>
  fetchApi<Category[]>(`/categories${q(l, `&type=${type}`)}`)

export const getSiteSettings = (l: Locale) =>
  fetchApi<SiteSetting[]>(`/site-settings${q(l)}`)

/**
 * CMS 上傳的圖片存的是 Blob 相對路徑，而 media 容器是 private——
 * 一律走後端的代理路由取檔（`/files/media/*`）。
 *
 * 例外是 `assets/...`：**種子內容**（`db/content/`）引用的是 mockup 的素材，
 * 那批檔案在公開的 `assets` 容器（`tools/upload-assets.sh` 上傳），不在 media 裡。
 * 照代理路由送會 404——media 容器只裝後台上傳的檔案。改走 `mediaUrl()` 直連公開容器，
 * 順便省下把 62MB 素材逐張穿過 Function 的流量與延遲。
 *
 * 客戶日後在後台換圖，新檔會存成 `2026/09/{guid}.webp`，自然落回下面的代理分支。
 */
export function cmsMedia(path: string | null | undefined): string {
  if (!path) return ''
  if (/^(https?:)?\/\//.test(path)) return path

  const rel = path.replace(/^\/+/, '')
  if (rel.startsWith('assets/')) return mediaUrl('/' + rel)

  return `${apiBase}/files/media/${rel}`
}
