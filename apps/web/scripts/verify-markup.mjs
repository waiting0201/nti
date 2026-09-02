/**
 * 版面驗收閘：把 Next 實際輸出的 HTML 與 mockup 的原始 HTML 逐頁比對。
 *
 * 比對的是「瀏覽器看得到的東西」——標籤結構、class、文字、屬性值，
 * 忽略只影響原始碼外觀而不影響渲染的差異（縮排、屬性順序、實體編碼、
 * 區塊標籤之間的換行）。行內標籤之間的空白會另外列為警告，因為那會渲染成空格。
 *
 * 用法：先 `npm run build && npm run start`，另一個終端 `npm run verify:markup`
 */
import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const mockupDir = path.resolve(root, '../../mockup')
const base = process.env.VERIFY_BASE ?? 'http://localhost:3100'
const locale = process.env.VERIFY_LOCALE ?? 'en'

const ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'",
  mdash: '—', ndash: '–', nbsp: ' ', hellip: '…',
  rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“',
  rsaquo: '›', lsaquo: '‹', raquo: '»', laquo: '«',
  trade: '™', reg: '®', copy: '©', times: '×',
  middot: '·', le: '≤', ge: '≥', Uuml: 'Ü', uuml: 'ü',
}

const decode = (s) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-zA-Z][a-zA-Z0-9]*);/g, (m, name) => ENTITIES[name] ?? m)

/** mockup 的相對連結 → 正式站路由 */
function rewriteHref(v) {
  const m = /^([\w-]+)\.html(#.*)?$/.exec(v)
  if (m) {
    const [, name, hash = ''] = m
    return name === 'index' ? `/${locale}${hash}` : `/${locale}/${name}${hash}`
  }
  if (v.startsWith('assets/')) return '/' + v
  return v
}

const VOID = new Set(['img', 'br', 'hr', 'input', 'meta', 'link', 'source', 'area', 'base', 'col', 'embed', 'param', 'track', 'wbr'])

/** 把 HTML 打散成 token（標籤／文字），順便正規化 */
function tokenize(html, { fromMockup }) {
  html = html.replace(/<!--[\s\S]*?-->/g, '')
  const tokens = []
  const tagRe = /<(\/?)([a-zA-Z][\w-]*)((?:"[^"]*"|'[^']*'|[^>"'])*?)(\/?)>/g
  let last = 0
  let m
  const pushText = (t) => {
    const text = decode(t).replace(/\s+/g, ' ')
    tokens.push({ type: 'text', value: text })
  }
  while ((m = tagRe.exec(html))) {
    if (m.index > last) pushText(html.slice(last, m.index))
    const name = m[2].toLowerCase()
    const attrs = []
    const re = /([:@a-zA-Z_][\w:.\-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g
    let a
    while ((a = re.exec(m[3]))) {
      let key = a[1].toLowerCase()
      let value = a[2] ?? a[3] ?? a[4] ?? ''
      if (key === 'href') value = fromMockup ? rewriteHref(value) : value
      if ((key === 'src' || key === 'data-img') && fromMockup && value.startsWith('assets/')) value = '/' + value
      attrs.push(key + '=' + decode(value).replace(/\s+/g, ' ').trim())
    }
    attrs.sort()
    tokens.push({ type: 'tag', closing: m[1] === '/', name, sig: (m[1] === '/' ? '/' : '') + name + '[' + attrs.join(' ') + ']' })
    // mockup 把 SVG 子元素寫成 <path />，React SSR 只對 void 元素自閉合，
    // 兩者產生的 DOM 相同 —— 這裡補一個結束標籤讓序列對齊
    if (m[4] === '/' && !VOID.has(name)) {
      tokens.push({ type: 'tag', closing: true, name, sig: '/' + name + '[]' })
    }
    last = m.index + m[0].length
  }
  if (last < html.length) pushText(html.slice(last))
  return tokens
}

const INLINE = new Set(['a', 'span', 'b', 'i', 'em', 'strong', 'small', 'sub', 'sup', 'u', 's', 'svg', 'img', 'button', 'label', 'input', 'select', 'textarea', 'code', 'abbr', 'time', 'br'])

/** 產生比對用序列：文字空白收斂、標籤間的純空白視情形保留 */
function sequence(tokens) {
  const out = []
  tokens.forEach((t, i) => {
    if (t.type === 'tag') {
      out.push(t.sig)
      return
    }
    if (t.value.trim() === '') {
      // 純空白：只有在兩側都是行內標籤時才會渲染成空格
      const prev = tokens[i - 1]
      const next = tokens[i + 1]
      const inline = (tok, closing) => tok && tok.type === 'tag' && tok.closing === closing && INLINE.has(tok.name)
      if (t.value !== '' && inline(prev, true) && inline(next, false)) out.push('␠')
      return
    }
    out.push('"' + t.value.trim() + '"')
    // 文字節點兩端的空白在行內語境仍有意義
    if (/^\s/.test(t.value)) out[out.length - 1] = '␠' + out[out.length - 1]
    if (/\s$/.test(t.value)) out[out.length - 1] = out[out.length - 1] + '␠'
  })
  return out
}

function slice(html) {
  const start = html.indexOf('</header>') + '</header>'.length
  const end = html.indexOf('<footer')
  return html.slice(start, end)
}

/** header／footer／浮動鈕：共用元件是手寫的，逐頁比對才能驗證 active 狀態 */
function chromeParts(html) {
  const header = html.slice(html.indexOf('<header'), html.indexOf('</header>') + 9)
  const footer = html.slice(html.indexOf('<footer'), html.indexOf('</footer>') + 9)
  const fabStart = html.indexOf('<div class="fab')
  const fabEnd = html.indexOf('</button>', html.indexOf('class="fab-reopen'))
  const fab = fabStart < 0 ? '' : html.slice(fabStart, fabEnd + 9)
  // 語系切換在正式站是真的：選單指向 /en /zh（mockup 是 href="#" 佔位），
  // 按鈕的旗標與文字也隨當前語系變動。這兩處是刻意的差異，排除比對。
  const dropLang = (s) =>
    s
      .replace(/<div class="lang-menu">[\s\S]*?<\/div>/, '')
      .replace(/<button class="lang-btn"[\s\S]*?<\/button>/, '')
  return { header: dropLang(header), footer, fab }
}

/**
 * 已知且不影響渲染的差異：mockup 自身不一致之處。
 * index.html 的 fab-head 寫成多行，`</b>` 與 `<span>` 之間多一個換行空白；
 * 其餘 43 頁寫在同一行。`.fab-head b{display:block}`，該空白不會被渲染，
 * 共用元件採用 43 頁的寫法。
 */
const ACCEPTED = [
  { file: 'index.html', part: 'fab', between: ['/b[]', 'span['] },
  // 同理：index.html 的 .fab-row 內兩個 span 分行寫，其餘 43 頁同一行。
  // `.fab-row{display:flex}`，純空白文字節點不會成為 flex item，不影響版面。
  { file: 'index.html', part: 'fab', between: ['/span[]', 'span['] },
]

function applyAccepted(seq, file, part) {
  const rules = ACCEPTED.filter((r) => r.file === file && r.part === part)
  if (!rules.length) return seq
  return seq.filter((tok, i) => {
    if (tok !== '\u2420') return true
    return !rules.some(
      (r) => seq[i - 1] === r.between[0] && (seq[i + 1] ?? '').startsWith(r.between[1]),
    )
  })
}

const files = readdirSync(mockupDir).filter((f) => f.endsWith('.html')).sort()
let failed = 0

for (const file of files) {
  const slug = file.replace(/\.html$/, '')
  const url = slug === 'index' ? `${base}/${locale}` : `${base}/${locale}/${slug}`
  const res = await fetch(url)
  if (!res.ok) {
    console.log(`✗ ${slug.padEnd(44)} HTTP ${res.status}`)
    failed++
    continue
  }
  const live = await res.text()
  const mockupHtml = readFileSync(path.join(mockupDir, file), 'utf8')
  const mc = chromeParts(mockupHtml)
  const lc = chromeParts(live)
  const chromeDiffs = []
  for (const part of ['header', 'footer', 'fab']) {
    const e = applyAccepted(sequence(tokenize(mc[part], { fromMockup: true })), file, part)
    const a = sequence(tokenize(lc[part], { fromMockup: false }))
    const i = e.findIndex((v, k) => v !== a[k])
    if (i !== -1 || e.length !== a.length) {
      const at = i === -1 ? Math.min(e.length, a.length) : i
      chromeDiffs.push(`${part} 第 ${at} 節點：mockup ${e[at] ?? '(無)'} / next ${a[at] ?? '(無)'}`)
    }
  }

  const expected = sequence(tokenize(slice(mockupHtml), { fromMockup: true }))
  const actual = sequence(tokenize(slice(live), { fromMockup: false }))

  let firstDiff = -1
  for (let i = 0; i < Math.max(expected.length, actual.length); i++) {
    if (expected[i] !== actual[i]) {
      firstDiff = i
      break
    }
  }
  if (firstDiff === -1 && !chromeDiffs.length) {
    console.log(`✓ ${slug.padEnd(44)} ${expected.length} nodes`)
  } else if (firstDiff === -1) {
    failed++
    console.log(`✗ ${slug.padEnd(44)} 內文一致，但共用元件不同：`)
    chromeDiffs.forEach((d) => console.log('     ' + d))
  } else {
    failed++
    console.log(`✗ ${slug.padEnd(44)} 第 ${firstDiff} 個節點起不同（共 mockup ${expected.length} / next ${actual.length}）`)
    const from = Math.max(0, firstDiff - 2)
    for (let i = from; i < Math.min(firstDiff + 3, Math.max(expected.length, actual.length)); i++) {
      const mark = i === firstDiff ? '  >>' : '    '
      console.log(`${mark} [${i}] mockup: ${expected[i] ?? '(無)'}`)
      console.log(`${mark}      next  : ${actual[i] ?? '(無)'}`)
    }
    chromeDiffs.forEach((d) => console.log('     共用元件：' + d))
  }
}

console.log(failed ? `\n${failed} 頁有差異` : `\n全部 ${files.length} 頁與 mockup 一致`)
process.exit(failed ? 1 : 0)
