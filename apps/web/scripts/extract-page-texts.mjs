/**
 * 產生後台「頁面文字」的清單：開放頁面上每一段可覆寫的文字（依頁面順序、依區塊分組）。
 *
 * 前台的覆寫以「英文原文」為 key（`lib/translate.tsx` 的 `overrides`），跟 `zh.ts` 同一套
 * 正規化，所以清單直接從 mockup 抽——mockup 是英文文案的權威，前台頁面由 build-pages.mjs
 * 機械式承接，兩邊的字面相同。每一筆附上 `zh.ts` 目前的譯文，後台拿來當「現在前台顯示的中文」。
 *
 * 只抽 `</header>` 到 `<footer` 之間：頁面的 `<T overrides>` 只包得到頁面本體，
 * header／footer／浮動鈕的字在這一層改不到，列出來只會讓人以為能改。
 *
 * 用法：node scripts/extract-page-texts.mjs
 * 輸出：apps/admin/src/api/page-texts.generated.ts（**不要手改**；mockup 或 zh.ts 改了就重跑）
 *
 * ⚠ 開放的頁面清單要三邊一致：這裡的 PAGES、`Api/Common/Constants.cs` 的 `PageTextPages`、
 * 以及前台那幾頁的 `<T overrides={page?.texts}>`（build-pages.mjs 產生的頁自動接線，HAND_MAINTAINED 的頁手動接）。
 */
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const mockupDir = path.resolve(root, '../../mockup')
const outFile = path.resolve(root, '../admin/src/api/page-texts.generated.ts')

/**
 * pageKey → mockup 檔名。2026-09-24 起為所有有前台路由的固定頁（原本只有 About Us 五頁）。
 * `green-csr` 沒有路由；`products-*` 四頁不是固定頁（SEO／H1／導言走方案單元 02），都不在這裡。
 */
const PAGES = {
  'home': 'index',
  'about-hub': 'differences',
  'about-difference': 'about-difference',
  'about-benefits': 'about-benefits',
  'about-certifications': 'about-certifications',
  'facility': 'facility',
  'facility-pre-press': 'facility-pre-press',
  'facility-eco-printing': 'facility-eco-printing',
  'facility-post-press': 'facility-post-press',
  'facility-quality': 'facility-quality',
  'facility-tour': 'facility-tour',
  'solutions': 'solutions',
  'projects': 'projects',
  'sustainability-hub': 'green-advantage',
  'green-our-advantage': 'green-our-advantage',
  'green-carbon': 'green-carbon',
  'green-materials': 'green-materials',
  'green-esg': 'green-esg',
  'insights': 'insights',
  'news-list': 'news',
  'green-vlog': 'green-vlog',
  'faq': 'faq',
  'industry-trends': 'industry-trends',
  'careers': 'careers',
  'supplier-area': 'supplier-area',
  'contact': 'contact',
  'get-a-quote': 'get-a-quote',
  'privacy-legal': 'privacy-legal',
}

// 與 extract-i18n.mjs 相同的實體解碼與正規化 —— key 必須和前台 runtime 看到的字面一致
const ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'",
  mdash: '—', ndash: '–', nbsp: ' ', hellip: '…',
  rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“',
  rsaquo: '›', lsaquo: '‹', raquo: '»', laquo: '«',
  trade: '™', reg: '®', copy: '©', times: '×',
  middot: '·', le: '≤', ge: '≥', Uuml: 'Ü', uuml: 'ü',
}
const decode = (s) =>
  s.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
   .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
   .replace(/&([a-zA-Z][a-zA-Z0-9]*);/g, (m, name) => ENTITIES[name] ?? m)
const norm = (s) => decode(s).replace(/\s+/g, ' ').trim()
const translatable = (s) => s.length > 0 && /[A-Za-z]/.test(s)

const zhSrc = readFileSync(path.join(root, 'src/lib/zh.ts'), 'utf8')
const dict = new Function('return ' + zhSrc.slice(zhSrc.indexOf('{'), zhSrc.lastIndexOf('}') + 1))()

/** 從 `start`（含）刪到 `end`（不含）；兩端都是 mockup 原始 HTML 的字面 */
const between = (start, end) =>
  new RegExp(start.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[\\s\\S]*?(?=' + end.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')')

/**
 * 前台已改吃 CMS 的區塊（有資料時整塊換成後台單元的內容），這裡的覆寫不會生效，不列入。
 * 對照各頁 page.tsx 的 `xxx?.length ? <CmsBlock/> : (mockup 原文)`。
 */
const CMS_BLOCKS = {
  'home': [
    between('<a class="slide on"', '<button class="sbtn prev"'),     // 輪播（01 home-banner）
    between('<div class="cert-wall reveal"', '</section>'),          // Proof 認證牆（08）
    between('<div class="logo-track">', '</section>'),               // 客戶輪播（09）
  ],
  'about-certifications': [/<section class="section certs reveal">[\s\S]*?<\/section>/],
  'facility-pre-press': [between('<div class="pr-grid">', '</div></section>')],
  'facility-eco-printing': [between('<div class="pr-grid">', '</div></section>')],
  'facility-post-press': [between('<div class="pr-grid">', '</div></section>')],
  'facility-quality': [between('<div class="pr-grid">', '</div></section>')],
  'projects': [between('<div class="filter-row reveal" id="pjFilters">', '<p class="prose wide reveal mt-l">')],
  'news-list': [between('<a href="news-global-views-esg-award.html" class="news-feature', '</div></section>')],
  'green-vlog': [between('<div class="video-frame reveal mt-l">', '</div></section>')],
  'faq': [between('<nav class="faq-nav', '<div class="faq-cta')],
  'industry-trends': [/<section class="section tight"><div class="wrap reveal">\s*<div class="dtitle">Regulation is setting the pace[\s\S]*$/],
  'careers': [between('<div class="faq-list wide reveal mt-s">', '<div class="faq-cta reveal mt-l">')],
  'supplier-area': [
    between('<a href="#" class="notice">', '<h2 class="sa-h mt">'),
    between('<div class="spec-grid">', '<div class="dl-panel'),
    between('<div class="dl-list">', '</section>'),
  ],
}

/**
 * 同理，但只是區塊裡的幾段字（首頁方案卡的標題與短述吃 02 方案單元，副標與圖片 alt 仍是寫死的）。
 */
const CMS_TEXTS = {
  'home': [
    'Color Box Packaging', 'Multiple box-types: besides folding box, we also provide customize box structure design.',
    'Packaging Paperboard', 'Hang tags, blister cards and backcards for retail walls.',
    'UV Printing', 'Printing on special materials, special varnish, anti-counterfeiting and more.',
    'Other Printing', 'Desk calendars, hand bags, red envelopes, mouse pads and manuals.',
  ],
}

/** 開啟這些元素時，下一段文字就是新的區塊名稱（後台用來分組） */
const SECTION_OPEN = /^<(h1|h2)\b|class="[^"]*\b(dtitle|eyebrow)\b/

const out = {}
for (const [pageKey, file] of Object.entries(PAGES)) {
  const raw = readFileSync(path.join(mockupDir, `${file}.html`), 'utf8')
  const start = raw.indexOf('</header>')
  const end = raw.indexOf('<footer')
  if (start < 0 || end < 0) throw new Error(`${file}.html 找不到 </header> 或 <footer`)

  const body = raw.slice(start + '</header>'.length, end)
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '')
  const content = (CMS_BLOCKS[pageKey] ?? []).reduce((html, re) => html.replace(re, ''), body)

  const items = new Map()
  let section = '頁首'
  let nextIsSection = false

  const add = (text, kind) => {
    const key = norm(text)
    if (!translatable(key)) return
    const hit = items.get(key)
    if (hit) { hit.count++; return }
    items.set(key, { en: key, zh: dict[key] ?? null, kind, section, count: 1 })
  }

  for (const [token] of content.matchAll(/<[^>]+>|[^<]+/g)) {
    if (token.startsWith('<')) {
      if (SECTION_OPEN.test(token)) nextIsSection = true
      const alt = /\salt="([^"]*)"/.exec(token)
      if (alt) add(alt[1], 'alt')
      continue
    }
    const key = norm(token)
    if (!translatable(key)) continue
    if (nextIsSection) { section = key; nextIsSection = false }
    add(token, 'text')
  }

  const skip = new Set(CMS_TEXTS[pageKey] ?? [])
  out[pageKey] = { mockup: `${file}.html`, items: [...items.values()].filter((i) => !skip.has(i.en)) }
}

const total = Object.values(out).reduce((n, p) => n + p.items.length, 0)
writeFileSync(
  outFile,
  `/**
 * 後台「頁面文字」的清單：開放覆寫的固定頁上，每一段可改的文字。
 *
 * **由 \`node apps/web/scripts/extract-page-texts.mjs\` 產生，不要手改。**
 * \`en\` 是 mockup 的原文（也是覆寫的 key），\`zh\` 是 apps/web/src/lib/zh.ts 目前的譯文，
 * \`count\` 是同一段原文在該頁出現的次數——覆寫會一起改掉每一處。
 */
export type PageTextItem = {
  en: string
  zh: string | null
  kind: 'text' | 'alt'
  section: string
  count: number
}

export const PAGE_TEXTS: Record<string, { mockup: string; items: PageTextItem[] }> = ${JSON.stringify(out, null, 2)}
`,
)
console.error(`page-texts.generated.ts：${Object.keys(out).length} 頁、${total} 段`)
