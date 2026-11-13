import { Fragment } from 'react'
import { A } from '@/components/A'
import {
  cmsMedia,
  type Banner,
  type Certification,
  type ClientLogo,
  type Faq,
  type FacilityItem,
  type Job,
  type NewsCard,
  type Project,
  type SolutionDetail,
  type SupplierDownload,
  type SupplierNotice,
  type SupplierSpec,
  type Trend,
  type Vlog,
} from '@/lib/api'
import { withLocale, type Locale } from '@/lib/i18n'
import { T } from '@/lib/t'

/**
 * 從 CMS 渲染的內容區塊。
 *
 * **結構、class 與 mockup 逐字相同**，只有資料來源不同——版面是客戶已確認的，
 * 接 API 不是重新詮釋版面的時機（CLAUDE.md 的前端切版原則）。
 *
 * 每個元件都只在「CMS 真的有資料」時才會被用到；沒有時各頁渲染原本寫死的內容，
 * 所以 `verify:markup` 在預設建置下仍然成立。
 */

/** `2026-03-13` → `2026.03.13`（mockup 的日期寫法） */
const dot = (date: string) => date.slice(0, 10).replaceAll('-', '.')

const Arrow = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

const Play = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
)

// ── 04 news ───────────────────────────────────────────────────────────────
export function NewsList({ items, locale }: { items: NewsCard[]; locale: Locale }) {
  const l = withLocale(locale)

  // 第一筆用大卡（mockup 的 news-feature），其餘進格線
  const [feature, ...rest] = items

  return (
    <T locale={locale}>
      {feature && (
        <A href={l(`/news/${feature.slug}`)} className="news-feature reveal mt-l">
          <div className="nf-img">
            <img src={cmsMedia(feature.coverImagePath)} alt={feature.coverAlt} />
          </div>
          <div className="nf-body">
            <span className="news-meta">
              <span className="cat">{feature.categoryName}</span>
              <span className="date">{dot(feature.publishDate)}</span>
            </span>
            <h2>{feature.title}</h2>
            {feature.summary && <p>{feature.summary}</p>}
            <span className="rm">
              Read more <Arrow />
            </span>
          </div>
        </A>
      )}
      <div className="news-grid">
        {rest.map((item, i) => (
          <A key={item.id} href={l(`/news/${item.slug}`)} className="ncard reveal" data-d={String((i % 3) + 1)}>
            <div className="nc-img">
              <img src={cmsMedia(item.coverImagePath)} alt={item.coverAlt} loading="lazy" />
            </div>
            <div className="nc-body">
              <span className="news-meta">
                <span className="cat">{item.categoryName}</span>
                <span className="date">{dot(item.publishDate)}</span>
              </span>
              <h3>{item.title}</h3>
              <span className="rm">
                Read more <Arrow />
              </span>
            </div>
          </A>
        ))}
      </div>
    </T>
  )
}

// ── 03 project ────────────────────────────────────────────────────────────
export function ProjectGrid({ items, locale }: { items: Project[]; locale: Locale }) {
  // 篩選鈕由資料裡實際出現的分類產生，不寫死——後台改了分類，前台要跟著動
  const tags = [...new Set(items.map((p) => p.categoryName))]

  return (
    <T locale={locale}>
      <div className="filter-row reveal" id="pjFilters">
        <button className="fbtn active" data-f="All">
          All projects
        </button>
        {tags.map((tag) => (
          <button key={tag} className="fbtn" data-f={tag}>
            {tag}
          </button>
        ))}
      </div>
      <div className="pj-grid" id="pjGrid">
        {items.map((p) => (
          <article key={p.id} className="pj-card reveal" data-tag={p.categoryName}>
            <div className="pj-img">
              <img src={cmsMedia(p.imagePath)} alt={p.imageAlt} />
              <span className="pj-tag">{p.categoryName}</span>
              {p.videoUrl && (
                <span className="pj-play">
                  <Play />
                </span>
              )}
            </div>
            <div className="pj-body">
              <h3>{p.title}</h3>
              {p.summary && <p>{p.summary}</p>}
              {p.statValue && (
                <div className="pj-stat">
                  <b>{p.statValue}</b>
                  <span>{p.statLabel}</span>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </T>
  )
}

// ── 02 solution ───────────────────────────────────────────────────────────
/** 四個方案頁（`/colorbox` 等，以 Solution.Code 取資料）的品項卡。printing-solutions 列表頁是 explorer 互動元件，不走這裡。 */
export function SolutionItems({ items, className = 'pr-grid' }: { items: SolutionDetail['items']; className?: string }) {
  return (
    <div className={className}>
      {items.map((item) => (
        <article key={item.id} className="pr-card reveal">
          <div className="pr-img">
            <img src={cmsMedia(item.imagePath)} alt={item.imageAlt} loading="lazy" />
          </div>
          <div className="pr-body">
            <h3>{item.name}</h3>
            {item.description && <p>{item.description}</p>}
          </div>
        </article>
      ))}
    </div>
  )
}

/**
 * 方案頁開頭的導言（後台 02 的「方案導言」rich text）。
 *
 * mockup 在這裡是一到兩個 `<p className="prose wide reveal mt-s">`，CSS 靠 `.prose+.prose`
 * 排段距，所以把 rich text 拆回同樣的段落，而不是包進一個新的容器（那會需要 mockup 沒有的樣式）。
 * 內容不是單純的段落（清單、標題…）時才整塊放進一個 `.prose` 的 div。
 */
export function SolutionIntro({ html }: { html: string }) {
  const trimmed = html.trim()
  const paras = /^(<p>[\s\S]*?<\/p>\s*)+$/.test(trimmed)
    ? trimmed.split(/<\/p>\s*/).filter(Boolean).map((p) => p.replace(/^<p>/, ''))
    : null

  if (!paras) return <div className="prose wide reveal mt-s" dangerouslySetInnerHTML={{ __html: trimmed }} />
  return (
    <>
      {paras.map((p, i) => (
        <p key={i} className="prose wide reveal mt-s" dangerouslySetInnerHTML={{ __html: p }} />
      ))}
    </>
  )
}

// ── 05 vlog ───────────────────────────────────────────────────────────────
export function VlogGrid({ items }: { items: Vlog[] }) {
  // 主打影片排在最前（API 已用 IsMainFeature DESC 排序），放進頂部大播放器
  const [main, ...rest] = items
  const thumb = (v: Vlog) =>
    v.thumbOverridePath ? cmsMedia(v.thumbOverridePath) : `https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`

  return (
    <>
      {main && (
        <div className="video-frame reveal mt-l">
          <iframe
            src={`https://www.youtube.com/embed/${main.youtubeId}`}
            title={main.title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      )}
      {/* 後台 05 的「說明」：主打影片的顯示在播放器下方，其餘的在燈箱裡（VlogPlayer 從 data-desc 讀） */}
      {main?.description && <p className="prose wide reveal mt-s">{main.description}</p>}
      <div className="vl-grid">
        {rest.map((v) => (
          <A
            key={v.id}
            className="vl-card reveal"
            href={`https://www.youtube.com/watch?v=${v.youtubeId}`}
            target="_blank"
            rel="noopener"
            data-desc={v.description || undefined}
          >
            <span className="vl-thumb">
              <img src={thumb(v)} alt="" loading="lazy" />
              <span className="vl-play">
                <Play />
              </span>
            </span>
            <span>
              <span className="vl-ep">{v.categoryName}</span>
              <h3>{v.title}</h3>
            </span>
          </A>
        ))}
      </div>
    </>
  )
}

// ── 06 faq ────────────────────────────────────────────────────────────────
export function FaqList({ items, children, locale }: { items: Faq[]; children?: React.ReactNode; locale: Locale }) {
  // 分組鈕同樣由資料產生。data-c 兩邊都用分類名稱，FaqFilter 才比對得起來
  const groups = [...new Set(items.map((f) => f.categoryName).filter(Boolean))] as string[]

  return (
    <T locale={locale}>
    <div className="faq-layout">
      <nav className="faq-nav reveal" id="faqNav" aria-label="FAQ categories">
        <button className="active" data-c="All">
          All questions
        </button>
        {groups.map((g) => (
          <button key={g} data-c={g}>
            {g}
          </button>
        ))}
      </nav>
      <div>
        <div className="faq-list reveal">
          {items.map((f, i) => (
            <details key={f.id} className="faq" open={i === 0} data-c={f.categoryName ?? undefined}>
              <summary>
                <span>{f.question}</span>
              </summary>
              {/* AnswerHtml 是後台富文本編輯器產生的，不是使用者輸入 */}
              <div dangerouslySetInnerHTML={{ __html: f.answerHtml }} />
            </details>
          ))}
        </div>
        {children}
      </div>
    </div>
    </T>
  )
}

// ── 07 trend ──────────────────────────────────────────────────────────────
export function TrendSections({ items }: { items: Trend[] }) {
  return (
    <>
      {items.map((t) => (
        <section key={t.id} className="section tight snug">
          <div className="wrap reveal">
            <div className="dtitle">{t.title}</div>
            <div dangerouslySetInnerHTML={{ __html: t.bodyHtml }} />
          </div>
        </section>
      ))}
    </>
  )
}

// ── 08 certification ──────────────────────────────────────────────────────

/**
 * 證號／取得年份／最近稽核的一行字；三個都沒填回 null。
 * 客戶 2026-09-22 的 SEO/GEO 文案要求每項認證附上具體數字——AI 引擎讀不到 logo 圖，只引用文字。
 */
export function credentialLine(c: Certification, locale: Locale): string | null {
  const parts: string[] = []
  if (c.certificateNo) parts.push(locale === 'zh' ? `證號 ${c.certificateNo}` : `No. ${c.certificateNo}`)
  if (c.certifiedDate) parts.push(locale === 'zh' ? `${c.certifiedDate.slice(0, 4)} 年取得` : `Since ${c.certifiedDate.slice(0, 4)}`)
  if (c.lastAuditDate) parts.push(locale === 'zh' ? `最近稽核 ${c.lastAuditDate.slice(0, 7)}` : `Last audited ${c.lastAuditDate.slice(0, 7)}`)
  return parts.length ? parts.join(' · ') : null
}

/**
 * 依後台「認證分類」分組，照 API 回來的順序（分類排序 → 認證排序）。
 * 分類名稱少於兩種（還沒跑 290、或全部同一類）回 `null`，呼叫端照舊平鋪。
 */
function groupByCertCategory(items: Certification[]) {
  if (new Set(items.map((c) => c.categoryName).filter(Boolean)).size < 2) return null
  const groups: { name: string; code: string | null; items: Certification[] }[] = []
  for (const c of items) {
    const name = c.categoryName ?? 'Other'
    const g = groups.find((x) => x.name === name)
    if (g) g.items.push(c)
    else groups.push({ name, code: c.categoryCode, items: [c] })
  }
  return groups
}

/**
 * 認證頁的 logo 牆。客戶 2026-11-11：依分類分組排列（與首頁 Proof 同一套四類），
 * logo 統一放進同尺寸外框（`.cert-group .certgrid img`，見 site.css）。
 */
export function CertificationWall({ items, locale }: { items: Certification[]; locale: Locale }) {
  const groups = groupByCertCategory(items)
  if (!groups) return <CertificationGrid items={items} locale={locale} className="wrap certgrid" />
  return (
    <T locale={locale}>
      <div className="wrap cert-groups">
        {groups.map((g) => (
          <div key={g.name} className="cert-group">
            <h2 className="cert-group-h">{g.name}</h2>
            <CertificationGrid items={g.items} locale={locale} className="certgrid" />
          </div>
        ))}
      </div>
    </T>
  )
}

/**
 * 認證頁「分類大標 → 文字清單 → 該分類的 logo」一組一組往下排（客戶 2026-11-11 截圖）。
 * 文字清單（08b）與 logo（08）共用同一套認證分類，以分類代號對齊；
 * 只有清單或只有 logo 的分類也照樣成組，缺的那半不輸出。
 */
export type CertSectionGroup = {
  code: string
  title: string
  list: { id: number; title: string; description: string | null }[]
  logos: Certification[]
}

export function mergeCertSections(
  list: { categoryId: number; sectionCode: string; sectionTitle: string; id: number; title: string; description: string | null }[],
  certs: Certification[],
): CertSectionGroup[] {
  const groups: CertSectionGroup[] = []
  for (const it of list) {
    let g = groups.find((x) => x.code === it.sectionCode)
    if (!g) groups.push((g = { code: it.sectionCode, title: it.sectionTitle, list: [], logos: [] }))
    g.list.push({ id: it.id, title: it.title, description: it.description })
  }
  // 兩邊都已依分類排序排好：只有 logo 的分類插在前一個 logo 分類之後，維持分類順序
  let prev = -1
  for (const c of certs) {
    // 後台 08 的「認證頁區塊」；沒選就沿用首頁 Proof 分組
    const code = c.pageCategoryCode ?? c.categoryCode ?? '_other'
    let idx = groups.findIndex((x) => x.code === code)
    if (idx < 0) {
      idx = prev + 1
      groups.splice(idx, 0, { code, title: (c.pageCategoryCode ? c.pageCategoryName : c.categoryName) ?? 'Other', list: [], logos: [] })
    }
    groups[idx].logos.push(c)
    prev = idx
  }
  return groups
}

export function CertSection({ group, locale }: { group: CertSectionGroup; locale: Locale }) {
  return (
    <section className="section tight"><div className="wrap reveal">
      <div className="dtitle">{group.title}</div>
      {group.list.length > 0 && <DetailList items={group.list} />}
      {group.logos.length > 0 && (
        <div className="cert-group mt-m"><CertificationGrid items={group.logos} locale={locale} className="certgrid start" /></div>
      )}
    </div></section>
  )
}

function CertificationGrid({ items, locale, className }: { items: Certification[]; locale: Locale; className: string }) {
  return (
    <div className={className}>
      {items.map((c) => {
        const logo = c.linkUrl ? (
          <A href={c.linkUrl} target="_blank" rel="noopener">
            <img src={cmsMedia(c.logoPath)} alt={c.logoAlt} />
          </A>
        ) : (
          <img src={cmsMedia(c.logoPath)} alt={c.logoAlt} />
        )
        const line = credentialLine(c, locale)
        // 沒有證號與日期就照原本只放 logo（與 mockup 相同）；有才包一層 figure 加說明。
        // 樣式就地寫：site.css 是 mockup 的原檔，mockup 沒有這個元素
        return line ? (
          <figure key={c.id} style={{ margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            {logo}
            <figcaption style={{ fontSize: 12, lineHeight: 1.4, opacity: 0.75, textAlign: 'center', maxWidth: 200 }}>
              <b style={{ display: 'block' }}>{c.name}</b>
              {line}
            </figcaption>
          </figure>
        ) : (
          <Fragment key={c.id}>{logo}</Fragment>
        )
      })}
    </div>
  )
}

// ── 15 頁面頂部橫幅 ──────────────────────────────────────────────────────
/** 緊接 header 的那張大圖。`src` 由 `bannerSrc()` 決定，`null`＝後台沒傳圖，整個區塊不出現 */
export function PageBanner({ src, alt }: { src: string | null; alt: string }) {
  if (!src) return null
  return <section className="fac-banner"><img src={src} alt={alt} /></section>
}

/**
 * 頁面中段的大圖（後台單元 15「中段橫幅 n」）。`src` 由 `midBannerSrc()` 決定，`null`＝後台清空了，整個區塊不出現。
 * 外框照 mockup 原樣：大多是 `<section class="fac-banner reveal">`，少數頁是 `<div>`／別的 class（`as`、`className`）
 */
export function PageMidBanner({ src, alt, loading, as: Tag = 'section', className = 'fac-banner reveal' }: {
  src: string | null
  alt: string
  loading?: 'lazy'
  as?: 'section' | 'div'
  className?: string
}) {
  if (!src) return null
  return <Tag className={className}><img src={src} alt={alt} loading={loading} /></Tag>
}

// ── 01 home-banner ────────────────────────────────────────────────────────
export function HeroSlides({ items, locale }: { items: Banner[]; locale: Locale }) {
  const l = withLocale(locale)

  // 站內連結要補語系前綴，外部連結原樣；沒填連結就不是連結（HeroSlider 只認 .slide）
  const href = (b: Banner) =>
    !b.linkUrl ? '#' : /^https?:\/\//.test(b.linkUrl) ? b.linkUrl : l(b.linkUrl)

  return (
    <>
      {items.map((b, i) => (
        <A
          key={b.id}
          className={i === 0 ? 'slide on' : 'slide'}
          href={href(b)}
          {...(b.openInNewTab ? { target: '_blank', rel: 'noopener' } : {})}
        >
          {/*
            第一張是首頁 LCP，搶先下載。其餘疊在同一位置以 opacity 切換，loading="lazy" 無效
            （瀏覽器認定它們在視窗內），所以先不給 src：HeroSlider 等頁面 load 完才補上，
            第一次換頁在 5.5 秒後，來得及。沒有 JS 時輪播本來就不會動，只看得到第一張。
          */}
          {/*
            手機圖（後台 01「手機圖」，4:5）：有傳就在 ≤600px 換成它，沒傳沿用桌機圖。
            <picture> 設 display:contents，`.hero .slide img` 的滿版樣式才照樣套得到 img。
            延後載入的那幾張，source 也只先帶 data-srcset（HeroSlider 一起補）。
          */}
          {!b.imagePathMobile ? (
            i === 0 ? (
              <img src={cmsMedia(b.imagePath)} alt={b.imageAlt} fetchPriority="high" />
            ) : (
              <img data-src={cmsMedia(b.imagePath)} alt={b.imageAlt} />
            )
          ) : (
            <picture style={{ display: 'contents' }}>
              {i === 0 ? (
                <source media="(max-width:600px)" srcSet={cmsMedia(b.imagePathMobile)} />
              ) : (
                <source media="(max-width:600px)" data-srcset={cmsMedia(b.imagePathMobile)} />
              )}
              {i === 0 ? (
                <img src={cmsMedia(b.imagePath)} alt={b.imageAlt} fetchPriority="high" />
              ) : (
                <img data-src={cmsMedia(b.imagePath)} alt={b.imageAlt} />
              )}
            </picture>
          )}
        </A>
      ))}
    </>
  )
}

// 首頁 Proof 三張分類卡：品質管理／環境永續／社會責任·安全。
type ProofCategory = 'quality' | 'eco' | 'safety' | 'building' | 'other'

const PROOF_CATEGORY_META: Record<ProofCategory, { title: string; iconClass: string }> = {
  quality: { title: 'Quality Management', iconClass: 'proof-ic--quality' },
  eco: { title: 'Environmental Sustainability', iconClass: 'proof-ic--eco' },
  safety: { title: 'Social Responsibility & Safety', iconClass: 'proof-ic--safety' },
  building: { title: 'Green Building', iconClass: 'proof-ic--eco' },
  other: { title: 'Other Certifications', iconClass: 'proof-ic--quality' },
}

// 分組 → 卡片圖示。後台沒有選圖示的欄位，而客戶自建的分類代碼是 section-* 這種沒有語意的值，
// 所以先看分類名稱（中英都認），對不上再看 290 建的三個代碼，都不是才用 other 的通用圖示。
// 客戶 2026-11-11：「環境管理與溫室氣體盤查」「雙綠建築認證」原本都落到 other（打勾），要換成專屬圖示。
const PROOF_KEYWORDS: [ProofCategory, RegExp][] = [
  ['building', /building|leed|eewh|建築/i],
  ['eco', /environment|ghg|carbon|climate|sustainab|環境|溫室|碳|永續/i],
  ['safety', /supply|social|safety|responsib|complian|供應|責任|安全|合規/i],
  ['quality', /quality|colou?r|品質|色彩|色彩管理/i],
]
function proofKind(code: string | null, name: string): ProofCategory {
  for (const [kind, re] of PROOF_KEYWORDS) if (re.test(name)) return kind
  return code === 'quality' || code === 'eco' || code === 'safety' ? code : 'other'
}

// 還沒跑 290、14 張認證都在同一個分類時的備援：
// 依檔名對照品質／環境／社會責任三類。對不上的一律進 other，不能讓認證憑空消失。
const PROOF_LOGO_CATEGORY: Record<string, ProofCategory> = {
  'cert-g7.png': 'quality',
  'cert-iso9001.png': 'quality',
  'cert-gmi.png': 'quality',
  'cert-fsc.png': 'eco',
  'cert-iso14001.png': 'eco',
  'cert-co2neutral.png': 'eco',
  'cert-green.png': 'eco',
  'cert-greenbuilding.png': 'eco',
  'cert-mof.png': 'eco',
  'cert-iso45001.png': 'safety',
  'cert-sedex.png': 'safety',
  'cert-leed-gold.png': 'safety',
  'cert-esg.png': 'safety',
  'cert-esci.png': 'safety',
}

// 同一批檔案在卡片內的補償尺寸 class——原始素材留白比例不一，見 home.css 的 .proof-logos 註解。
const PROOF_LOGO_SIZE_CLASS: Record<string, string> = {
  'cert-fsc.png': 'pad-lg',
  'cert-green.png': 'pad-md',
  'cert-esg.png': 'pad-sm',
  'cert-sedex.png': 'wide',
  'cert-esci.png': 'lockup',
}

const basename = (path: string) => path.split('/').pop() ?? path

const PROOF_ICONS: Record<ProofCategory, React.ReactNode> = {
  quality: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8.5" r="5.5" />
      <path d="m9 8.5 2 2 3.5-3.5" />
      <path d="M8.3 13.2 6.5 21l5.5-3 5.5 3-1.8-7.8" />
    </svg>
  ),
  eco: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 19c-1-7 2-13 14-14 1 11-4 15-14 14Z" />
      <path d="M5.5 18.5 14 10" />
    </svg>
  ),
  safety: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3.5 18.5 6v5.5c0 5-2.8 8-6.5 9.5-3.7-1.5-6.5-4.5-6.5-9.5V6Z" />
      <path d="m9 12 2 2 4-4.5" />
    </svg>
  ),
  building: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 21h19" />
      <path d="M4.5 21V9.5L10 6v15" />
      <path d="M10 21V11h7v10" />
      <path d="M7 11.5v.01M7 14.5v.01M7 17.5v.01M13.5 14v.01M13.5 17.5v.01" />
      <path d="M15.5 7.5C15.5 4.4 17.6 2.5 21 2.5c0 3.4-1.9 5.5-5 5.5" />
      <path d="M15.5 8 18.5 5" />
    </svg>
  ),
  other: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8" />
      <path d="m9 12 2 2 4-4.5" />
    </svg>
  ),
}

/**
 * 首頁 Proof 認證牆：外層 `.cert-wall` 在頁面上，這裡輸出三張分類卡
 * （結構需與 page.tsx 的 fallback 分支一致，見那邊的硬寫版本）。
 *
 * 分組規則：`categoryName` 若真的有兩種以上不同值，就照它分組（後台 08 的「分組」，
 * 卡片標題＝分組名稱，圖示依分組代碼）；否則（290 之前：14 筆同一分類或未分類）
 * 退回用 logoPath 檔名對照表分三類，對不上的一律進最後一組，不遺漏任何一筆。
 * 卡片內那行文字用各認證的簡稱，空的才用全名。
 */
export function CertificationLogos({ items, locale }: { items: Certification[]; locale: Locale }) {
  const distinctNamed = new Set(items.map((c) => c.categoryName).filter(Boolean))

  type Group = { key: string; title: string; iconClass: string; icon: React.ReactNode; items: Certification[] }
  let groups: Group[]

  if (distinctNamed.size >= 2) {
    const order: string[] = []
    const byName = new Map<string, Certification[]>()
    const codeOf = new Map<string, string | null>()
    for (const c of items) {
      const key = c.categoryName ?? 'Other'
      if (!byName.has(key)) {
        byName.set(key, [])
        order.push(key)
        codeOf.set(key, c.categoryCode)
      }
      byName.get(key)!.push(c)
    }
    groups = order.map((name) => {
      const kind = proofKind(codeOf.get(name) ?? null, name)
      return {
        key: name,
        title: name,
        iconClass: PROOF_CATEGORY_META[kind].iconClass,
        icon: PROOF_ICONS[kind],
        items: byName.get(name)!,
      }
    })
  } else {
    const byKey = new Map<ProofCategory, Certification[]>()
    for (const c of items) {
      const key = PROOF_LOGO_CATEGORY[basename(c.logoPath)] ?? 'other'
      if (!byKey.has(key)) byKey.set(key, [])
      byKey.get(key)!.push(c)
    }
    groups = (['quality', 'eco', 'safety', 'other'] as ProofCategory[])
      .filter((k) => byKey.has(k))
      .map((k) => ({
        key: k,
        title: PROOF_CATEGORY_META[k].title,
        iconClass: PROOF_CATEGORY_META[k].iconClass,
        icon: PROOF_ICONS[k],
        items: byKey.get(k)!,
      }))
  }

  return (
    <T locale={locale}>
      {groups.map((g) => (
        <article key={g.key} className="proof-card">
          <span className={`proof-ic ${g.iconClass}`} aria-hidden="true">
            {g.icon}
          </span>
          <h3>{g.title}</h3>
          <p>{g.items.map((c) => c.shortName || c.name).join(locale === 'zh' ? '、' : ', ')}</p>
          <div className="proof-logos">
            {g.items.map((c) => (
              <img
                key={c.id}
                className={PROOF_LOGO_SIZE_CLASS[basename(c.logoPath)]}
                src={cmsMedia(c.logoPath)}
                alt={c.logoAlt}
                loading="lazy"
              />
            ))}
          </div>
        </article>
      ))}
    </T>
  )
}

/**
 * 認證頁的「標題＋說明」清單（mockup 的 `.flist > .fi`）。資料已經是該語系的內容，
 * 不經過 `<T>`——否則標題剛好等於字典裡某個英文 key 時會被換掉。
 */
/**
 * 認證頁的一個清單區塊（單元 08b）：大標＝區塊分類的名稱，已是該語系的字——
 * 放在元件裡就不會被 `<T>` 的字典替換碰到（同 DetailList）。
 */
export function DetailSection({ title, items }: { title: string; items: { id: number; title: string; description: string | null }[] }) {
  return (
    <section className="section tight"><div className="wrap reveal">
      <div className="dtitle">{title}</div>
      <DetailList items={items} />
    </div></section>
  )
}

export function DetailList({ items }: { items: { id: number; title: string; description: string | null }[] }) {
  return (
    <div className="flist mt-s">
      {items.map((it) => (
        <p key={it.id} className="fi">
          <b>{it.title}</b>
          {it.description}
        </p>
      ))}
    </div>
  )
}

/**
 * 後台驅動的資料表（mockup 的 `.mtable`）：碳效率頁績效表（三欄）、ESG 頁永續目標（兩欄）。
 * 列的內容已經是該語系的資料，不經過字典（`<T>` 進不了元件內部，跟 DetailList 同理）；
 * 表頭是固定字，由呼叫端用 `tr()` 翻好再傳進來。
 */
export function DataTable({ head, rows, className = 'mtable' }: {
  head: string[]
  rows: { id: number; cells: string[] }[]
  className?: string
}) {
  return (
    <table className={className}>
      <thead><tr>{head.map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.id}>{r.cells.map((c, i) => <td key={i}>{c}</td>)}</tr>
        ))}
      </tbody>
    </table>
  )
}

// ── 09 client ─────────────────────────────────────────────────────────────
/**
 * `duplicate`：輪播為了無縫循環放的第二份（外層 aria-hidden），連結不該再被 Tab 到一次。
 * 有填「連結」（後台 09）的 logo 才包成連結；沒填就照 mockup 只放圖。
 */
export function ClientLogos({ items, duplicate = false }: { items: ClientLogo[]; duplicate?: boolean }) {
  return (
    <>
      {items.map((c) => {
        const img = <img src={cmsMedia(c.logoPath)} alt={c.name} loading="lazy" />
        return c.linkUrl ? (
          <a key={c.id} href={c.linkUrl} target="_blank" rel="noopener noreferrer" tabIndex={duplicate ? -1 : undefined}>
            {img}
          </a>
        ) : (
          <Fragment key={c.id}>{img}</Fragment>
        )
      })}
    </>
  )
}

// ── 10 facility ───────────────────────────────────────────────────────────
export function FacilityGrid({ items }: { items: FacilityItem[] }) {
  return (
    <div className="pr-grid">
      {items.map((f) => (
        <article key={f.id} className="pr-card reveal">
          <div className="pr-img">
            <img src={cmsMedia(f.imagePath)} alt={f.imageAlt} loading="lazy" />
          </div>
          <div className="pr-body">
            <h3>{f.name}</h3>
            {f.description && <p>{f.description}</p>}
          </div>
        </article>
      ))}
    </div>
  )
}

// ── 11 job ────────────────────────────────────────────────────────────────
export function JobList({ items, locale }: { items: Job[]; locale: Locale }) {
  // 後台 11 的「地點」接在職稱後面（mockup 的寫法：`Offset Press Operator — Tainan plant`）；
  // 職稱裡已經寫了同一個地點就不重複
  const heading = (j: Job) =>
    j.location && !j.title.includes(j.location) ? `${j.title}${locale === 'zh' ? ' —— ' : ' — '}${j.location}` : j.title
  return (
    <div className="faq-list wide reveal mt-s">
      {items.map((j, i) => (
        <details key={j.id} className="faq" open={i === 0}>
          <summary><span>{heading(j)}</span></summary>
          <div dangerouslySetInnerHTML={{ __html: j.descriptionHtml }} />
        </details>
      ))}
    </div>
  )
}

// ── 12／13／14 供應商專區 ─────────────────────────────────────────────────
/**
 * 公告列。mockup 是一排連結；後台 12 的「內文」（必填）原本沒有地方顯示，只有附件能點。
 * 現在：有內文的公告改成可展開的 <details>，內文在列的下方，附件變成內文底下的下載連結；
 * 沒有內文的維持原樣（有附件連附件，沒有就是不可點的一列）。
 * 展開區的樣式就地寫——site.css 是 mockup 的原檔，mockup 沒有這個元素。
 */
export function SupplierNotices({ items, locale }: { items: SupplierNotice[]; locale: Locale }) {
  const row = (n: SupplierNotice) => (
    <>
      <span className="nd">{dot(n.noticeDate)}</span>
      <span className="nt">{n.categoryName}</span>
      <span className="ns">{n.title}</span>
    </>
  )
  return (
    <div>
      {items.map((n) =>
        n.bodyHtml?.trim() ? (
          <details key={n.id}>
            <summary className="notice" style={{ cursor: 'pointer', listStyle: 'none' }}>{row(n)}</summary>
            <div style={{ padding: '14px 6px 20px', borderBottom: '1px solid var(--line)', fontSize: '.9rem', lineHeight: 1.7 }}>
              {/* BodyHtml 是後台富文本編輯器產生的，不是使用者輸入 */}
              <div dangerouslySetInnerHTML={{ __html: n.bodyHtml }} />
              {n.attachmentPath && (
                <p style={{ marginTop: 10 }}>
                  <A href={cmsMedia(n.attachmentPath)} className="tour-more">{locale === 'zh' ? '下載附件' : 'Download attachment'}</A>
                </p>
              )}
            </div>
          </details>
        ) : n.attachmentPath ? (
          <A key={n.id} href={cmsMedia(n.attachmentPath)} className="notice">{row(n)}</A>
        ) : (
          <div key={n.id} className="notice">{row(n)}</div>
        ),
      )}
    </div>
  )
}

export function SupplierSpecs({ items }: { items: SupplierSpec[] }) {
  return (
    <div className="spec-grid">
      {items.map((s) => (
        <div key={s.id} className="spec">
          <h3>{s.title}</h3>
          <p>{s.description}</p>
        </div>
      ))}
    </div>
  )
}

export function SupplierDownloads({ items }: { items: SupplierDownload[] }) {
  const size = (bytes: number) =>
    bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`

  return (
    <div className="dl-list">
      {items.map((d) => (
        // data-hit：DownloadHit（behaviors）點擊時回報一次下載，後台 14 的「下載次數」才會動
        <A key={d.id} href={cmsMedia(d.filePath)} className="dl-item" data-hit={d.id}>
          <span className="dl-type">{d.fileExt.toUpperCase()}</span>
          <span className="dl-name">{d.name}</span>
          <span className="dl-size">{size(d.fileSizeBytes)}</span>
        </A>
      ))}
    </div>
  )
}
