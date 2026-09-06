/**
 * 從 mockup 抽出所有「使用者看得到的英文字串」，列出 src/lib/zh.ts 還沒翻的部分。
 *
 * mockup 是英文文案的權威來源（CLAUDE.md），前台頁面由 build-pages.mjs 機械式承接，
 * 所以字典的 key 直接以 mockup 的文字為準；比對前兩邊都做同樣的空白正規化。
 *
 * 用法：
 *   node scripts/extract-i18n.mjs            # 只印還沒翻的（給翻譯用）
 *   node scripts/extract-i18n.mjs --all      # 印全部
 *   node scripts/extract-i18n.mjs --stale    # 印字典裡 mockup 已經沒有的 key
 *   node scripts/extract-i18n.mjs --client   # 依 client component 用到的字，重產 src/lib/zh-client.ts
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const mockupDir = path.resolve(root, '../../mockup')

const ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'",
  mdash: '—', ndash: '–', nbsp: ' ', hellip: '…',
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

/** 只有標點、數字或空字串的節點不必翻 */
const translatable = (s) => s.length > 0 && /[A-Za-z]/.test(s)

const found = new Map() // key → 出現在哪些頁

const add = (s, file) => {
  const k = norm(s)
  if (!translatable(k)) return
  if (!found.has(k)) found.set(k, new Set())
  found.get(k).add(file)
}

for (const file of readdirSync(mockupDir).filter((f) => f.endsWith('.html')).sort()) {
  const raw = readFileSync(path.join(mockupDir, file), 'utf8')

  // <head>：title 與 meta description（generateMetadata 用得到）
  const title = /<title>([\s\S]*?)<\/title>/.exec(raw)
  if (title) add(title[1], file)
  const desc = /<meta\s+name="description"\s+content="([^"]*)"/.exec(raw)
  if (desc) add(desc[1], file)

  const bodyMatch = /<body[^>]*>([\s\S]*)<\/body>/.exec(raw)
  if (!bodyMatch) continue
  let body = bodyMatch[1].replace(/<!--[\s\S]*?-->/g, '')

  // inline script：mockup 的互動元件把文案寫在 JS 陣列裡（已移植成 behaviors/*.tsx）
  for (const m of body.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)) {
    for (const q of m[1].matchAll(/(?:name|cap|apps|label|title)\s*:\s*'((?:[^'\\]|\\.)*)'/g)) {
      add(q[1].replace(/\\'/g, "'"), file)
    }
  }
  body = body.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '')

  // 屬性
  for (const m of body.matchAll(/\s(?:alt|title|placeholder|aria-label)="([^"]*)"/g)) add(m[1], file)

  // 文字節點
  for (const t of body.split(/<[^>]+>/)) add(t, file)
}

let dict = {}
try {
  const src = readFileSync(path.join(root, 'src/lib/zh.ts'), 'utf8')
  // zh.ts 是純資料檔（一個物件字面值），直接取出來即可
  const objText = src.slice(src.indexOf('{'), src.lastIndexOf('}') + 1)
  dict = new Function('return ' + objText)()
} catch {
  dict = {}
}

const mode = process.argv[2] ?? ''
const keys = [...found.keys()]
if (mode === '--stale') {
  const gone = Object.keys(dict).filter((k) => !found.has(k))
  console.error(`字典多出 ${gone.length} 筆 mockup 已無對應的 key`)
  gone.forEach((k) => console.log(JSON.stringify(k)))
} else {
  const list = mode === '--all' ? keys : keys.filter((k) => !dict[k])
  console.error(`mockup 可翻譯字串 ${keys.length} 筆，字典已有 ${keys.filter((k) => dict[k]).length} 筆，輸出 ${list.length} 筆`)
  list.forEach((k) => console.log(JSON.stringify(k)))
}

/**
 * `--client`：重新產生 `src/lib/zh-client.ts`。
 *
 * header 與兩個 explorer 是 client component，若讓它們吃完整字典，1000 筆會被打進
 * client bundle。這裡掃這幾個檔案裡出現的英文字面，只把它們用得到的那幾十筆抄過去，
 * 內容一律取自 `zh.ts`，因此兩邊不會漂移。
 */
function buildClientDict() {
  const sources = [
    'src/components/SiteHeader.tsx',
    'src/components/behaviors/FacilityExplorer.tsx',
    'src/components/behaviors/ProductShowcase.tsx',
  ]
  const used = new Set()
  for (const rel of sources) {
    const src = readFileSync(path.join(root, rel), 'utf8')
    // 字串字面值（'...' / "..."）與 JSX 文字節點都掃，再與字典取交集
    for (const m of src.matchAll(/'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"/g)) {
      const raw = (m[1] ?? m[2]).replace(/\\'/g, "'")
      if (dict[norm(raw)]) used.add(norm(raw))
    }
    for (const m of src.matchAll(/>([^<>{}]+)</g)) {
      const k = norm(m[1])
      if (dict[k]) used.add(k)
    }
  }
  const keys = [...used].sort()
  const body = keys.map((k) => '  ' + JSON.stringify(k) + ': ' + JSON.stringify(dict[k]) + ',').join('\n')
  writeFileSync(
    path.join(root, 'src/lib/zh-client.ts'),
    `/**
 * \`zh.ts\` 的精簡子集，只給 client component 用（header 與兩個 explorer）。
 *
 * **由 \`node scripts/extract-i18n.mjs --client\` 產生，不要手改。**
 * 分成兩份純粹是為了不要把整本字典打進 client bundle，理由見 \`lib/translate.tsx\`。
 */
export const ZH_CLIENT: Record<string, string> = {
${body}
}
`,
  )
  console.error(`zh-client.ts 已重產：${keys.length} 筆`)
}

if (mode === '--client') buildClientDict()
