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
/** `/products-{code}` 四頁的品項卡。solutions 列表頁是 explorer 互動元件，不走這裡。 */
export function SolutionItems({ items }: { items: SolutionDetail['items'] }) {
  return (
    <div className="pr-grid">
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
      <div className="vl-grid">
        {rest.map((v) => (
          <A
            key={v.id}
            className="vl-card reveal"
            href={`https://www.youtube.com/watch?v=${v.youtubeId}`}
            target="_blank"
            rel="noopener"
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
        <section key={t.id} className="section tight">
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
export function CertificationWall({ items }: { items: Certification[] }) {
  return (
    <div className="wrap certgrid">
      {items.map((c) =>
        c.linkUrl ? (
          <A key={c.id} href={c.linkUrl} target="_blank" rel="noopener">
            <img src={cmsMedia(c.logoPath)} alt={c.logoAlt} />
          </A>
        ) : (
          <img key={c.id} src={cmsMedia(c.logoPath)} alt={c.logoAlt} />
        ),
      )}
    </div>
  )
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
          <img src={cmsMedia(b.imagePath)} alt={b.imageAlt} />
        </A>
      ))}
    </>
  )
}

// 首頁 Proof 三張分類卡：品質管理／環境永續／社會責任·安全。
type ProofCategory = 'quality' | 'eco' | 'safety' | 'other'

const PROOF_CATEGORY_META: Record<ProofCategory, { title: string; iconClass: string }> = {
  quality: { title: 'Quality Management', iconClass: 'proof-ic--quality' },
  eco: { title: 'Environmental Sustainability', iconClass: 'proof-ic--eco' },
  safety: { title: 'Social Responsibility & Safety', iconClass: 'proof-ic--safety' },
  other: { title: 'Other Certifications', iconClass: 'proof-ic--quality' },
}

// 現況種子把 14 張認證都塞進同一個分類，categoryName 派不上用場時的備援：
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
 * 分組規則：`categoryName` 若真的有兩種以上不同值，就照它分組（後台已把認證分好類）；
 * 否則（現況：14 筆同一分類或未分類）退回用 logoPath 檔名對照表分三類，
 * 對不上的一律進最後一組，不遺漏任何一筆。
 */
export function CertificationLogos({ items, locale }: { items: Certification[]; locale: Locale }) {
  const distinctNamed = new Set(items.map((c) => c.categoryName).filter(Boolean))

  type Group = { key: string; title: string; iconClass: string; icon: React.ReactNode; items: Certification[] }
  let groups: Group[]

  if (distinctNamed.size >= 2) {
    const order: string[] = []
    const byName = new Map<string, Certification[]>()
    for (const c of items) {
      const key = c.categoryName ?? 'Other'
      if (!byName.has(key)) {
        byName.set(key, [])
        order.push(key)
      }
      byName.get(key)!.push(c)
    }
    groups = order.map((name) => ({
      key: name,
      title: name,
      iconClass: 'proof-ic--quality',
      icon: PROOF_ICONS.quality,
      items: byName.get(name)!,
    }))
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
          <p>{g.items.map((c) => c.name).join(', ')}</p>
          <div className="proof-logos">
            {g.items.map((c) => (
              <img
                key={c.id}
                className={PROOF_LOGO_SIZE_CLASS[basename(c.logoPath)]}
                src={cmsMedia(c.logoPath)}
                alt={c.logoAlt}
              />
            ))}
          </div>
        </article>
      ))}
    </T>
  )
}

// ── 09 client ─────────────────────────────────────────────────────────────
export function ClientLogos({ items }: { items: ClientLogo[] }) {
  return (
    <>
      {items.map((c) => (
        <img key={c.id} src={cmsMedia(c.logoPath)} alt={c.name} loading="lazy" />
      ))}
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
export function JobList({ items }: { items: Job[] }) {
  return (
    <div className="faq-list reveal mt-s">
      {items.map((j, i) => (
        <details key={j.id} className="faq" open={i === 0}>
          <summary>
            <span>
              {j.title}
              {j.location ? ` — ${j.location}` : ''}
            </span>
          </summary>
          <div dangerouslySetInnerHTML={{ __html: j.descriptionHtml }} />
        </details>
      ))}
    </div>
  )
}

// ── 12／13／14 供應商專區 ─────────────────────────────────────────────────
export function SupplierNotices({ items }: { items: SupplierNotice[] }) {
  return (
    <div>
      {items.map((n) => (
        <A key={n.id} href={n.attachmentPath ? cmsMedia(n.attachmentPath) : '#'} className="notice">
          <span className="nd">{dot(n.noticeDate)}</span>
          <span className="nt">{n.categoryName}</span>
          <span className="ns">{n.title}</span>
        </A>
      ))}
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
        <A key={d.id} href={cmsMedia(d.filePath)} className="dl-item">
          <span className="dl-type">{d.fileExt.toUpperCase()}</span>
          <span className="dl-name">{d.name}</span>
          <span className="dl-size">{size(d.fileSizeBytes)}</span>
        </A>
      ))}
    </div>
  )
}
