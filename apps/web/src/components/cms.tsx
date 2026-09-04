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
    <>
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
    </>
  )
}

// ── 03 project ────────────────────────────────────────────────────────────
export function ProjectGrid({ items }: { items: Project[] }) {
  // 篩選鈕由資料裡實際出現的分類產生，不寫死——後台改了分類，前台要跟著動
  const tags = [...new Set(items.map((p) => p.categoryName))]

  return (
    <>
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
    </>
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
export function FaqList({ items, children }: { items: Faq[]; children?: React.ReactNode }) {
  // 分組鈕同樣由資料產生。data-c 兩邊都用分類名稱，FaqFilter 才比對得起來
  const groups = [...new Set(items.map((f) => f.categoryName).filter(Boolean))] as string[]

  return (
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

/** 首頁 Proof 認證牆：外層 `.cert-wall` 在頁面上，這裡只出 logo。 */
export function CertificationLogos({ items }: { items: Certification[] }) {
  return (
    <>
      {items.map((c) => (
        <img key={c.id} src={cmsMedia(c.logoPath)} alt={c.logoAlt} />
      ))}
    </>
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
