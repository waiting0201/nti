import type { Locale } from './i18n'

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
 * ISR 重新驗證秒數。與 API 回應的 `s-maxage=300` 對齊——
 * 兩邊不一致的話，內容改了之後前台要等的時間會是兩者的最大值，很難解釋。
 */
const REVALIDATE = 300

/** 低頻異動（設定、分類）。API 那邊也是 3600。 */
const REVALIDATE_STATIC = 3600

type Envelope<T> = { success: boolean; code: string | null; data: T; message: string }

/**
 * 打一支端點。
 *
 * **失敗一律回 null，不拋例外**：API 掛掉時公開站應該退回寫死的內容繼續服務，
 * 而不是整頁 500。錯誤會記在伺服器日誌裡。
 */
async function fetchApi<T>(path: string, revalidate = REVALIDATE): Promise<T | null> {
  if (!hasApi) return null

  try {
    const res = await fetch(`${apiBase}${path}`, { next: { revalidate } })
    if (!res.ok) {
      console.error(`[api] ${path} → HTTP ${res.status}`)
      return null
    }

    const envelope = (await res.json()) as Envelope<T>
    return envelope.success ? envelope.data : null
  } catch (error) {
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

export type NewsDetail = Omit<NewsCard, 'isFeaturedHome'> & { bodyHtml: string; seo: Seo }

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
  requireLogin: boolean
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
 * 兩支都有 ISR 快取，實際上不會多打一次網路。
 */
export async function getSolutionByCode(locale: Locale, code: string) {
  const list = await getSolutions(locale)
  const match = list?.find((s) => s.code === code)
  return match ? await getSolution(locale, match.slug) : null
}
export const getProjects       = (l: Locale) => fetchApi<Project[]>(`/projects${q(l)}`)
export const getNews           = (l: Locale) => fetchApi<NewsCard[]>(`/news${q(l)}`)
export const getNewsItem       = (l: Locale, slug: string) => fetchApi<NewsDetail>(`/news/${slug}${q(l)}`)
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
  fetchApi<Category[]>(`/categories${q(l, `&type=${type}`)}`, REVALIDATE_STATIC)

export const getSiteSettings = (l: Locale) =>
  fetchApi<SiteSetting[]>(`/site-settings${q(l)}`, REVALIDATE_STATIC)

/**
 * CMS 上傳的圖片存的是 Blob 相對路徑，而 media 容器是 private——
 * 一律走後端的代理路由取檔（`/files/media/*`）。
 *
 * mockup 的素材是另一回事：它們在公開的 `assets` 容器，走 `mediaUrl()`。
 */
export function cmsMedia(path: string | null | undefined): string {
  if (!path) return ''
  if (/^(https?:)?\/\//.test(path)) return path
  return `${apiBase}/files/media/${path.replace(/^\/+/, '')}`
}
