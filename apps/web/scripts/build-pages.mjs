/**
 * 一次性 codegen：把 mockup/*.html 的頁面主體（</header> 到 <footer> 之間）
 * 機械式轉成 src/app/[locale]/<slug>/page.tsx。
 *
 * 目的是「版面一模一樣」——不重寫結構、不換 class、不動文案，
 * 只做 HTML→JSX 的語法轉換與連結／素材路徑的重寫。
 * 重跑會覆蓋既有頁面；之後若改為手動維護頁面內容，請停用本腳本。
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const mockupDir = path.resolve(root, '../../mockup')
const appDir = path.join(root, 'src/app/[locale]')

/** HTML 屬性 → JSX 屬性 */
const ATTR_MAP = {
  class: 'className',
  for: 'htmlFor',
  tabindex: 'tabIndex',
  colspan: 'colSpan',
  rowspan: 'rowSpan',
  maxlength: 'maxLength',
  minlength: 'minLength',
  readonly: 'readOnly',
  novalidate: 'noValidate',
  autocomplete: 'autoComplete',
  autofocus: 'autoFocus',
  allowfullscreen: 'allowFullScreen',
  referrerpolicy: 'referrerPolicy',
  frameborder: 'frameBorder',
  srcset: 'srcSet',
  playsinline: 'playsInline',
  autoplay: 'autoPlay',
  crossorigin: 'crossOrigin',
  enctype: 'encType',
  usemap: 'useMap',
  contenteditable: 'contentEditable',
  spellcheck: 'spellCheck',
  // SVG
  'stroke-width': 'strokeWidth',
  'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin',
  'stroke-dasharray': 'strokeDasharray',
  'stroke-dashoffset': 'strokeDashoffset',
  'stroke-opacity': 'strokeOpacity',
  'fill-rule': 'fillRule',
  'fill-opacity': 'fillOpacity',
  'clip-rule': 'clipRule',
  'clip-path': 'clipPath',
  'stop-color': 'stopColor',
  'stop-opacity': 'stopOpacity',
  'text-anchor': 'textAnchor',
  'font-family': 'fontFamily',
  'font-size': 'fontSize',
  'font-weight': 'fontWeight',
  viewbox: 'viewBox',
  preserveaspectratio: 'preserveAspectRatio',
}

/** React 型別要求數值的屬性 */
const NUMERIC = new Set(['rows', 'cols', 'size', 'span', 'start', 'maxLength', 'minLength', 'tabIndex', 'colSpan', 'rowSpan'])

const VOID = new Set([
  'img', 'br', 'hr', 'input', 'meta', 'link', 'source', 'area',
  'base', 'col', 'embed', 'param', 'track', 'wbr',
])

/** 行內元素：兩個行內標籤間的換行空白，HTML 會收斂成一個空格，JSX 卻整段吃掉 */
const INLINE = new Set([
  'a', 'span', 'b', 'i', 'em', 'strong', 'small', 'sub', 'sup', 'u', 's',
  'svg', 'img', 'button', 'label', 'input', 'select', 'textarea', 'code', 'abbr', 'time', 'br',
])

/** mockup 相對連結 → 站內路由（不含語系前綴） */
function toRoute(href) {
  const m = /^([\w-]+)\.html(#.*)?$/.exec(href)
  if (!m) return null
  const [, name, hash = ''] = m
  return name === 'index' ? (hash ? '/' + hash : '/') : `/${name}${hash}`
}

function styleToObject(css) {
  const props = css
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((decl) => {
      const i = decl.indexOf(':')
      const rawName = decl.slice(0, i).trim()
      const value = decl.slice(i + 1).trim()
      const name = rawName.startsWith('--')
        ? `'${rawName}'`
        : rawName.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
      return `${name}: ${JSON.stringify(value)}`
    })
  return `{{ ${props.join(', ')} }}`
}

function parseAttrs(str) {
  const out = []
  const re = /([:@a-zA-Z_][\w:.\-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g
  let m
  while ((m = re.exec(str))) {
    const value = m[2] !== undefined ? m[2] : m[3] !== undefined ? m[3] : m[4]
    out.push([m[1], value])
  }
  return out
}

function convertTag(tagName, attrStr, selfClosing, ctx) {
  const parts = []
  for (const [rawName, value] of parseAttrs(attrStr)) {
    const lower = rawName.toLowerCase()
    const name =
      ATTR_MAP[lower] ??
      (lower.startsWith('data-') || lower.startsWith('aria-') ? lower : rawName)

    if (value === undefined) {
      parts.push(name) // 布林屬性：hidden / open / required …
      continue
    }
    if (name === 'style') {
      parts.push('style=' + styleToObject(value))
      continue
    }
    if (name === 'href') {
      const route = toRoute(value)
      if (route !== null) {
        ctx.usesLocale = true
        parts.push('href={l(' + JSON.stringify(route) + ')}')
      } else if (value.startsWith('assets/')) {
        parts.push('href="/' + value + '"')
      } else {
        parts.push('href=' + JSON.stringify(value))
      }
      continue
    }
    if (name === 'src' || name === 'data-img') {
      parts.push(name + '="' + (value.startsWith('assets/') ? '/' + value : value) + '"')
      continue
    }
    if (NUMERIC.has(name) && /^\d+$/.test(value)) {
      parts.push(name + '={' + value + '}')
      continue
    }
    parts.push(name + '="' + value + '"')
  }

  const jsxName = tagName === 'a' ? 'A' : tagName
  if (jsxName === 'A') ctx.usesA = true
  const close = VOID.has(tagName) || selfClosing ? ' />' : '>'
  return '<' + jsxName + (parts.length ? ' ' + parts.join(' ') : '') + close
}

/** 把一段 HTML 轉成 JSX（保留原始換行與縮排） */
function htmlToJsx(html, ctx) {
  html = html.replace(/<!--([\s\S]*?)-->/g, (_, c) => '{/*' + c.replace(/\*\//g, '*\\/') + '*/}')

  const tokens = []
  const tagRe = /<(\/?)([a-zA-Z][\w-]*)((?:"[^"]*"|'[^']*'|[^>"'])*?)(\/?)>/g
  let last = 0
  let m
  while ((m = tagRe.exec(html))) {
    if (m.index > last) tokens.push({ type: 'text', value: html.slice(last, m.index) })
    tokens.push({
      type: 'tag',
      closing: m[1] === '/',
      name: m[2],
      attrs: m[3],
      selfClosing: m[4] === '/',
    })
    last = m.index + m[0].length
  }
  if (last < html.length) tokens.push({ type: 'text', value: html.slice(last) })

  const SPACE = "{' '}"
  const out = []
  tokens.forEach((t, i) => {
    if (t.type === 'tag') {
      out.push(
        t.closing
          ? '</' + (t.name === 'a' ? 'A' : t.name) + '>'
          : convertTag(t.name, t.attrs, t.selfClosing, ctx),
      )
      return
    }
    if (/^\s*$/.test(t.value) && t.value.includes('\n')) {
      const prev = tokens[i - 1]
      const next = tokens[i + 1]
      const side = (tok, closing) =>
        tok && tok.type === 'tag' && tok.closing === closing && INLINE.has(tok.name)
      if (side(prev, true) && side(next, false)) {
        out.push(SPACE + t.value)
        return
      }
    }
    out.push(t.value)
  })
  return out.join('')
}

/** 每頁需要的行為元件（對照 mockup 各頁 inline script） */
const BEHAVIORS = {
  index: [['HeroSlider', '@/components/behaviors/HeroSlider']],
  facility: [['FacilityExplorer', '@/components/behaviors/FacilityExplorer']],
  solutions: [['ProductShowcase', '@/components/behaviors/ProductShowcase']],
  faq: [['FaqFilter', '@/components/behaviors/FaqFilter']],
  projects: [['ProjectFilter', '@/components/behaviors/ProjectFilter']],
  contact: [['PageForm', '@/components/behaviors/PageForm']],
  'get-a-quote': [['PageForm', '@/components/behaviors/PageForm']],
}

function extract(html) {
  const headEnd = html.indexOf('</header>') + '</header>'.length
  const footStart = html.indexOf('<footer')
  if (headEnd < 9 || footStart < 0) throw new Error('找不到 header/footer 邊界')
  const title = /<title>([\s\S]*?)<\/title>/.exec(html)?.[1].trim() ?? ''
  const desc = /<meta\s+name="description"\s+content="([\s\S]*?)"\s*\/?>/.exec(html)?.[1].trim()
  return {
    title,
    desc,
    body: html.slice(headEnd, footStart).replace(/^\n/, '').replace(/\s+$/, ''),
  }
}

const files = readdirSync(mockupDir).filter((f) => f.endsWith('.html')).sort()
let count = 0
for (const file of files) {
  const slug = file.replace(/\.html$/, '')
  const isHome = slug === 'index'
  const routePath = isHome ? '/' : '/' + slug
  const { title, desc, body } = extract(readFileSync(path.join(mockupDir, file), 'utf8'))

  const ctx = { usesA: false, usesLocale: false }
  const jsx = htmlToJsx(body, ctx)
    .split('\n')
    .map((line) => (line.trim() ? '      ' + line : line))
    .join('\n')

  const behaviors = BEHAVIORS[slug] ?? []
  const imports = [
    "import type { Metadata } from 'next'",
    ...(ctx.usesA ? ["import { A } from '@/components/A'"] : []),
    ...behaviors.map(([name, from]) => `import { ${name} } from '${from}'`),
    ctx.usesLocale
      ? "import { pageMetadata, withLocale, type Locale } from '@/lib/i18n'"
      : "import { pageMetadata, type Locale } from '@/lib/i18n'",
    ...(isHome ? ["import '../home.css'"] : []),
  ].join('\n')

  const metaLiteral = [
    'title: ' + JSON.stringify(title),
    ...(desc ? ['description: ' + JSON.stringify(desc)] : []),
  ].join(',\n    ')

  const localeLine = ctx.usesLocale ? '  const l = withLocale(locale)\n' : ''
  const behaviorTags = behaviors.length
    ? behaviors.map(([name]) => '      <' + name + ' />').join('\n') + '\n'
    : ''

  const src = `${imports}

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata(locale, ${JSON.stringify(routePath)}, {
    ${metaLiteral},
  })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
${localeLine}  return (
    <>
${jsx}
${behaviorTags}    </>
  )
}
`

  const dir = isHome ? appDir : path.join(appDir, slug)
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  writeFileSync(path.join(dir, 'page.tsx'), src)
  count++
}
console.log(`已產生 ${count} 個頁面 → ${appDir}`)
