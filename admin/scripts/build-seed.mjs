/**
 * 產生後台 mock 的種子資料 → src/api/seed.generated.ts
 *
 * 兩個來源，都是專案裡既有的權威檔案，不憑空捏內容：
 *   db/seed/*.sql   分類、29 筆固定頁、4 筆方案 —— 與正式資料庫種子同一份
 *   mockup/*.html   新聞、案例、FAQ、認證、客戶、設備、職缺… —— 客戶定案的實際內容
 *
 * 目的是讓後台一打開就是「這個站真正的內容」，客戶驗收時看得懂自己在改什麼。
 * 之後接上 /api/v1/admin/* 就不再需要這份種子。
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const repo = path.resolve(root, '..')
const mockup = path.join(repo, 'mockup')
const dbSeed = path.join(repo, 'db/seed')

const read = (p) => readFileSync(p, 'utf8')
const readMockup = (f) => read(path.join(mockup, f))

/** HTML 實體 → 文字（種子資料存純文字，顯示時再交給 React escape） */
const ENT = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  mdash: '—', ndash: '–', hellip: '…', rsquo: '’', lsquo: '‘',
  rdquo: '”', ldquo: '“', times: '×', middot: '·', trade: '™',
  reg: '®', copy: '©', Uuml: 'Ü', uuml: 'ü', le: '≤', ge: '≥',
  rsaquo: '›', laquo: '«', raquo: '»',
}
const decode = (s) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&([a-zA-Z][a-zA-Z0-9]*);/g, (m, n) => ENT[n] ?? m)
const text = (s) => decode(String(s).replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ').trim()
const asset = (src) => '/' + String(src).replace(/^assets\//, 'assets/')

/* ── db/seed：分類 ─────────────────────────────────────── */
function categories() {
  const sql = read(path.join(dbSeed, '120_category.sql'))
  const re = /\('(\w+)','([\w-]+)',\s*(\d+),\s*N'([^']*)',\s*N'([^']*)'\)/g
  const rows = []
  let m
  while ((m = re.exec(sql))) {
    rows.push({
      id: `${m[1]}:${m[2]}`,
      categoryType: m[1],
      code: m[2],
      sortOrder: +m[3],
      isActive: true,
      i18n: { zh: { name: m[4] }, en: { name: m[5] } },
    })
  }
  return rows
}

/* ── db/seed：29 筆固定頁 ──────────────────────────────── */
function pages() {
  const sql = read(path.join(dbSeed, '140_page.sql'))
  const re = /\(\s*(\d+),'([\w-]+)',\s*N'([^']*)',\s*(\d),(\d),N'([^']*)'\)/g
  const rows = []
  let m
  while ((m = re.exec(sql))) {
    rows.push({
      id: m[1],
      pageKey: m[2],
      path: m[3],
      hasRichBody: m[4] === '1',
      isIndexable: m[5] === '1',
      sortOrder: +m[1],
      i18n: {
        zh: { slug: m[6], seoTitle: '', metaDescription: '' },
        en: { slug: m[6], seoTitle: '', metaDescription: '' },
      },
    })
  }
  return rows
}

/* ── db/seed + mockup：4 筆方案與其品項卡 ──────────────── */
function solutions() {
  const sql = read(path.join(dbSeed, '150_solution.sql'))
  const flat = sql.replace(/\s+/g, ' ')
  const re =
    /\((\d+),'([\w-]+)',\s*(\d+),\s*N'([^']*)',\s*N'([^']*)',\s*N'([^']*)',\s*N'([^']*)',\s*N'([^']*)',\s*N'([^']*)',\s*N'([^']*)'\)/g
  const rows = []
  let m
  while ((m = re.exec(flat))) {
    rows.push({
      id: m[1],
      code: m[2],
      sortOrder: +m[3],
      isPublished: true,
      cover: `/assets/prod-${m[2] === 'boxes' ? 'box-gluing' : m[2] === 'cardboard' ? 'card-hangtag' : m[2] === 'uv' ? 'uv-print' : 'other-bag'}.jpg`,
      i18n: {
        zh: { slug: m[4], name: m[5], h1: m[7], coverAlt: m[9], seoTitle: m[7], metaDescription: '' },
        en: { slug: m[4], name: m[6], h1: m[8], coverAlt: m[10], seoTitle: m[8], metaDescription: '' },
      },
    })
  }

  // 品項卡：mockup/solutions.html 的 SETS 常數
  const js = readMockup('solutions.html')
  const items = []
  const setRe = /(\w+):\{apps:'([^']*)',items:\[([\s\S]*?)\]\}/g
  let s
  while ((s = setRe.exec(js))) {
    const solutionCode = s[1]
    const itemRe = /\{src:'([^']*)',name:'([^']*)',cap:'([^']*)'\}/g
    let i
    let order = 0
    while ((i = itemRe.exec(s[3]))) {
      order += 10
      items.push({
        id: `${solutionCode}-${order}`,
        parentId: rows.find((r) => r.code === solutionCode)?.id ?? solutionCode,
        sortOrder: order,
        isPublished: true,
        image: asset(i[1]),
        i18n: {
          zh: { name: decode(i[2]), description: decode(i[3]), alt: decode(i[2]) },
          en: { name: decode(i[2]), description: decode(i[3]), alt: decode(i[2]) },
        },
      })
    }
  }
  return { rows, items }
}

/* ── mockup：首頁 Banner ───────────────────────────────── */
function homeBanners() {
  const html = readMockup('index.html')
  const hero = html.slice(html.indexOf('<section class="hero"'), html.indexOf('</section>', html.indexOf('<section class="hero"')))
  const re = /<a class="slide[^"]*" href="([^"]+)"><img src="([^"]+)" alt="([^"]*)"/g
  const rows = []
  let m
  let order = 0
  while ((m = re.exec(hero))) {
    order += 10
    rows.push({
      id: String(order),
      sortOrder: order,
      isPublished: true,
      imageDesktop: asset(m[2]),
      imageMobile: '',
      linkUrl: '/' + m[1].replace(/\.html$/, '').replace(/^index$/, ''),
      newWindow: false,
      i18n: { zh: { alt: decode(m[3]) }, en: { alt: decode(m[3]) } },
    })
  }
  return rows
}

/* ── mockup：最新消息（首篇 + 卡片） ───────────────────── */
function news() {
  const html = readMockup('news.html')
  const rows = []
  const push = (href, img, cat, date, title, summary, order) => {
    rows.push({
      id: href.replace(/\.html$/, ''),
      sortOrder: order,
      isPublished: true,
      categoryId: `News:${catCode(cat)}`,
      publishDate: date.replace(/\./g, '-'),
      cover: asset(img),
      featured: order === 10,
      i18n: {
        zh: { title: decode(title), summary: decode(summary), body: detailBody(href) || `<p>${decode(summary)}</p>`, coverAlt: decode(title), slug: href.replace(/^news-|\.html$/g, ''), seoTitle: decode(title), metaDescription: decode(summary).slice(0, 160), ogImageAlt: decode(title) },
        en: { title: decode(title), summary: decode(summary), body: detailBody(href) || `<p>${decode(summary)}</p>`, coverAlt: decode(title), slug: href.replace(/^news-|\.html$/g, ''), seoTitle: decode(title), metaDescription: decode(summary).slice(0, 160), ogImageAlt: decode(title) },
      },
    })
  }

  // 首篇大卡
  const feat = /<a href="([^"]+)" class="news-feature[^"]*"[\s\S]*?<img src="([^"]+)"[\s\S]*?<span class="cat">([^<]*)<\/span><span class="date">([^<]*)<\/span><\/span>\s*<h2>([\s\S]*?)<\/h2>\s*<p>([\s\S]*?)<\/p>/.exec(html)
  let order = 0
  if (feat) {
    order += 10
    push(feat[1], feat[2], text(feat[3]), text(feat[4]), text(feat[5]), text(feat[6]), order)
  }
  const cardRe =
    /<a href="([^"]+)" class="ncard[^"]*"[^>]*>\s*<div class="nc-img"><img src="([^"]+)"[\s\S]*?<span class="cat">([^<]*)<\/span><span class="date">([^<]*)<\/span><\/span>\s*<h3>([\s\S]*?)<\/h3>(?:\s*<p>([\s\S]*?)<\/p>)?/g
  let m
  while ((m = cardRe.exec(html))) {
    order += 10
    push(m[1], m[2], text(m[3]), text(m[4]), text(m[5]), m[6] ? text(m[6]) : detailLead(m[1]), order)
  }
  return rows
}

/** 卡片沒有摘要欄，取該篇內頁的第一段導言當摘要 */
function detailLead(href) {
  try {
    const detail = readMockup(href)
    const paras = [...detail.matchAll(/<p class="prose[^"]*">([\s\S]*?)<\/p>/g)].map((x) => text(x[1]))
    return paras[0] ?? ''
  } catch {
    return ''
  }
}

/** 內頁全部段落 → 內文 HTML */
function detailBody(href) {
  try {
    const detail = readMockup(href)
    const paras = [...detail.matchAll(/<p class="prose[^"]*">([\s\S]*?)<\/p>/g)].map((x) => text(x[1]))
    return paras.map((t) => `<p>${t}</p>`).join('')
  } catch {
    return ''
  }
}

const NEWS_CAT = { ESG: 'esg', Awards: 'awards', Partnership: 'partnership', Sustainability: 'sustainability', Events: 'event', Event: 'event' }
const catCode = (label) => NEWS_CAT[label] ?? 'esg'

/* ── mockup：案例實績 ──────────────────────────────────── */
function projects() {
  const html = readMockup('projects.html')
  const re =
    /<article class="pj-card[^"]*" data-tag="([^"]*)">\s*<div class="pj-img"><img src="([^"]+)"[\s\S]*?<h3>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>(?:\s*<div class="pj-stat"><b>([^<]*)<\/b><span>([^<]*)<\/span>)?/g
  const rows = []
  let m
  let order = 0
  while ((m = re.exec(html))) {
    order += 10
    const tag = text(m[1])
    rows.push({
      id: String(order),
      sortOrder: order,
      isPublished: true,
      categoryId: `Project:${tag.toLowerCase()}`,
      image: asset(m[2]),
      videoUrl: '',
      statValue: m[5] ? text(m[5]) : '',
      i18n: {
        zh: { title: text(m[3]), description: text(m[4]), alt: text(m[3]), statLabel: m[6] ? text(m[6]) : '' },
        en: { title: text(m[3]), description: text(m[4]), alt: text(m[3]), statLabel: m[6] ? text(m[6]) : '' },
      },
    })
  }
  return rows
}

/* ── mockup：details.faq 結構（FAQ 與職缺共用） ─────────── */
function detailsList(file, keys) {
  const html = readMockup(file)
  const re = /<details class="faq"[^>]*?(?:data-c="([^"]*)")?[^>]*>\s*<summary><span>([\s\S]*?)<\/span><\/summary>\s*<p>([\s\S]*?)<\/p>/g
  const rows = []
  let m
  let order = 0
  while ((m = re.exec(html))) {
    order += 10
    const zh = { [keys.title]: text(m[2]), [keys.body]: `<p>${text(m[3])}</p>` }
    rows.push({
      id: String(order),
      sortOrder: order,
      isPublished: true,
      ...(m[1] ? { categoryId: `${keys.categoryType}:${m[1].toLowerCase()}` } : {}),
      i18n: { zh: { ...zh }, en: { ...zh } },
    })
  }
  return rows
}

/* ── mockup：產業趨勢 ──────────────────────────────────── */
function trends() {
  const html = readMockup('industry-trends.html')
  const re = /<div class="dtitle[^"]*">([\s\S]*?)<\/div>\s*<p class="prose[^"]*">([\s\S]*?)<\/p>/g
  const rows = []
  let m
  let order = 0
  while ((m = re.exec(html))) {
    order += 10
    const t = text(m[1])
    const b = `<p>${text(m[2])}</p>`
    rows.push({ id: String(order), sortOrder: order, isPublished: true, i18n: { zh: { title: t, body: b }, en: { title: t, body: b } } })
  }
  return rows
}

/* ── mockup：認證牆 ────────────────────────────────────── */
function certifications() {
  const html = readMockup('index.html')
  const proof = html.indexOf('id="proof"')
  const wall = html.slice(proof, html.indexOf('</section>', proof))
  const re = /<img[^>]*src="([^"]+)"[^>]*alt="([^"]*)"/g
  const rows = []
  let m
  let order = 0
  while ((m = re.exec(wall))) {
    order += 10
    const name = decode(m[2]) || path.basename(m[1]).replace(/^cert-|\.\w+$/g, '')
    rows.push({
      id: String(order),
      sortOrder: order,
      isPublished: true,
      categoryId: 'Certification:certification',
      logo: asset(m[1]),
      linkUrl: '',
      showOnHome: true,
      i18n: { zh: { name, alt: name, description: '' }, en: { name, alt: name, description: '' } },
    })
  }
  return rows
}

/* ── mockup：客戶 Logo（輪播為求無縫會重複一次，只取第一組） ── */
function clients() {
  const html = readMockup('index.html')
  const first = html.indexOf('class="logo-set"', html.indexOf('id="brands"'))
  const set = html.slice(first, html.indexOf('</div>', first))
  const re = /<img[^>]*src="([^"]+)"[^>]*alt="([^"]*)"/g
  const rows = []
  let m
  let order = 0
  while ((m = re.exec(set))) {
    order += 10
    rows.push({
      id: String(order),
      sortOrder: order,
      isPublished: true,
      name: decode(m[2]) || path.basename(m[1]).replace(/^client-|\.\w+$/g, ''),
      logo: asset(m[1]),
      linkUrl: '',
    })
  }
  return rows
}

/* ── mockup：設備卡（facility.html 的 SETS 常數） ───────── */
function facilities() {
  const js = readMockup('facility.html')
  const catByKey = { pre: 'pre-press', eco: 'eco-printing', post: 'post-press', qc: 'quality', tour: 'tour' }
  const rows = []
  const setRe = /(pre|eco|post|qc|tour):\[([\s\S]*?)\]/g
  let s
  let order = 0
  while ((s = setRe.exec(js))) {
    const itemRe = /\{src:'([^']*)',cap:'([^']*)'(?:,fit:'[^']*')?\}/g
    let i
    while ((i = itemRe.exec(s[2]))) {
      order += 10
      const name = decode(i[2])
      rows.push({
        id: String(order),
        sortOrder: order,
        isPublished: true,
        categoryId: `Facility:${catByKey[s[1]]}`,
        image: asset(i[1]),
        i18n: { zh: { name, alt: name, description: '' }, en: { name, alt: name, description: '' } },
      })
    }
  }
  return rows
}

/* ── mockup：Green Vlog ────────────────────────────────── */
function vlogs() {
  const html = readMockup('green-vlog.html')
  const rows = []
  let order = 0
  const add = (id, title, ep, isHero) => {
    order += 10
    const cat = /low.?carbon/i.test(ep) ? 'low-carbon' : /award/i.test(ep) ? 'awards' : 'sustainability'
    rows.push({
      id,
      sortOrder: order,
      isPublished: true,
      youtubeId: id,
      categoryId: `Vlog:${cat}`,
      thumbOverride: '',
      isHero,
      i18n: { zh: { title, description: ep, thumbAlt: title }, en: { title, description: ep, thumbAlt: title } },
    })
  }
  // 頁面主打影片（iframe，title 屬性即標題）
  const hero = /youtube\.com\/embed\/([\w-]+)"\s+title="([^"]*)"/.exec(html)
  if (hero) add(hero[1], text(hero[2]), 'Sustainability', true)
  const cardRe = /<a class="vl-card[^"]*" href="https:\/\/www\.youtube\.com\/watch\?v=([\w-]+)"[\s\S]*?<span class="vl-ep">([^<]*)<\/span><h3>([\s\S]*?)<\/h3>/g
  let m
  while ((m = cardRe.exec(html))) add(m[1], text(m[3]), text(m[2]), false)
  return rows
}

/* ── mockup：供應商公告與規格 ─────────────────────────── */
function supplierNotices() {
  const html = readMockup('supplier-area.html')
  const re = /<span class="nd">([^<]*)<\/span><span class="nt">([^<]*)<\/span><span class="ns">([^<]*)<\/span>/g
  const rows = []
  let m
  let order = 0
  while ((m = re.exec(html))) {
    order += 10
    const title = text(m[3])
    rows.push({
      id: String(order),
      sortOrder: order,
      isPublished: true,
      noticeDate: text(m[1]).replace(/\./g, '-'),
      categoryId: `SupplierNotice:${(text(m[2]) || 'policy').toLowerCase()}`,
      attachment: '',
      i18n: { zh: { title, body: `<p>${title}</p>` }, en: { title, body: `<p>${title}</p>` } },
    })
  }
  return rows
}

function supplierSpecs() {
  const html = readMockup('supplier-area.html')
  const start = html.indexOf('class="spec-grid"')
  const chunk = html.slice(start, html.indexOf('<footer'))
  const re = /<div class="spec"><h3>([\s\S]*?)<\/h3><p>([\s\S]*?)<\/p>/g
  const rows = []
  let m
  let order = 0
  while ((m = re.exec(chunk))) {
    order += 10
    const title = text(m[1])
    const desc = text(m[2])
    rows.push({ id: String(order), sortOrder: order, isPublished: true, i18n: { zh: { title, description: desc }, en: { title, description: desc } } })
  }
  return rows
}

/* ── 組裝輸出 ─────────────────────────────────────────── */
const sol = solutions()
const seed = {
  category: categories(),
  page: pages(),
  solution: sol.rows,
  'solution-item': sol.items,
  'home-banner': homeBanners(),
  news: news(),
  project: projects(),
  faq: detailsList('faq.html', { title: 'question', body: 'answer', categoryType: 'Faq' }),
  job: detailsList('careers.html', { title: 'title', body: 'body', categoryType: '' }).map((r) => {
    const { categoryId, ...rest } = r
    void categoryId
    return { ...rest, i18n: { zh: { ...r.i18n.zh, location: '台南廠' }, en: { ...r.i18n.en, location: 'Tainan plant' } } }
  }),
  trend: trends(),
  certification: certifications(),
  client: clients(),
  facility: facilities(),
  vlog: vlogs(),
  'supplier-notice': supplierNotices(),
  'supplier-spec': supplierSpecs(),
}

const counts = Object.entries(seed).map(([k, v]) => `${k}=${v.length}`).join('  ')
mkdirSync(path.join(root, 'src/api'), { recursive: true })
writeFileSync(
  path.join(root, 'src/api/seed.generated.ts'),
  `/* 由 scripts/build-seed.mjs 自 db/seed/*.sql 與 mockup/*.html 產生 —— 請勿手改。
   重新產生：npm run seed
   筆數：${counts} */
import type { Row } from './types'

export const SEED: Record<string, Row[]> = ${JSON.stringify(seed, null, 2)} as unknown as Record<string, Row[]>
`,
)
console.log('已產生 src/api/seed.generated.ts')
console.log(counts)
