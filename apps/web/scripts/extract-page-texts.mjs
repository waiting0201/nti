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
 * 以及前台那幾頁的 `<T overrides={page?.texts}>`。
 */
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const mockupDir = path.resolve(root, '../../mockup')
const outFile = path.resolve(root, '../admin/src/api/page-texts.generated.ts')

/** pageKey → mockup 檔名（About Us 五頁，2026-09-24） */
const PAGES = {
  'about-hub': 'differences',
  'about-difference': 'about-difference',
  'about-benefits': 'about-benefits',
  'about-certifications': 'about-certifications',
  'facility-tour': 'facility-tour',
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

/**
 * 前台已改吃 CMS 的區塊（有資料時整塊換成後台單元的內容），這裡的覆寫不會生效，不列入。
 * 目前只有 about-certifications 的認證牆（單元 08）；differences 頁尾那一排仍是寫死的，照列。
 */
const CMS_BLOCKS = {
  'about-certifications': [/<section class="section certs reveal">[\s\S]*?<\/section>/],
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

  out[pageKey] = { mockup: `${file}.html`, items: [...items.values()] }
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
