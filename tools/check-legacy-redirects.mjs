/**
 * 舊站 301 覆蓋率檢查。
 *
 * 抓 nti-printing.com 的 sitemap（WordPress + All in One SEO 產生的四支子 sitemap），
 * 跟 `apps/web/src/lib/legacy-redirects.ts` 的對照表比對，回報「還有哪些舊網址沒有落點」，
 * 並重新產生 `reference/舊站301對照表.md`。
 *
 * 用法：
 *   node tools/check-legacy-redirects.mjs          # 只回報
 *   node tools/check-legacy-redirects.mjs --write  # 一併更新 reference/ 的對照表
 *
 * 內容遷移（80+ 篇文章、100 個標籤）做完之後回來重跑，就知道還差多少。
 */
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OLD_SITE = 'https://nti-printing.com'
const SITEMAPS = ['page', 'post', 'category', 'post_tag']

/** 從 legacy-redirects.ts 撈出對照表（那支是 TS，Node 不能直接 import） */
function loadMap() {
  const src = readFileSync(path.join(root, 'apps/web/src/lib/legacy-redirects.ts'), 'utf8')
  const map = new Map()
  for (const m of src.matchAll(/\{[^{}]*?\bto:\s*'([^']+)'[^{}]*?\}/g)) {
    const row = m[0]
    const to = m[1]
    const zh = /\bzh:\s*'([^']+)'/.exec(row)?.[1]
    const en = /\ben:\s*'([^']+)'/.exec(row)?.[1]
    if (zh) map.set(zh, '/zh' + to)
    if (en) map.set(en, '/en' + to)
  }
  if (map.size < 30) throw new Error(`對照表只解析到 ${map.size} 列，格式可能變了`)
  return map
}

async function fetchLocs(name) {
  const res = await fetch(`${OLD_SITE}/${name}-sitemap.xml`)
  if (!res.ok) throw new Error(`${name}-sitemap.xml → HTTP ${res.status}`)
  const xml = await res.text()
  return [...xml.matchAll(/<loc><!\[CDATA\[(.*?)\]\]><\/loc>/g)]
    .map((m) => decodeURIComponent(m[1].replace(OLD_SITE, '')).replace(/\/+$/, ''))
    .filter((p) => p !== '')
}

const map = loadMap()
const groups = {}
for (const name of SITEMAPS) groups[name] = await fetchLocs(name)

/** 舊網址與新網址相同的不需要轉址，middleware 本來就會放行 */
const IDENTITY = new Set(['/en', '/en/contact'])
const isIdentity = (p) => IDENTITY.has(p)

const rows = []
let covered = 0
let total = 0
for (const [name, locs] of Object.entries(groups)) {
  for (const p of locs.sort()) {
    total++
    const to = map.get(p.toLowerCase()) ?? (isIdentity(p) ? p + '（免轉址）' : null)
    if (to) covered++
    rows.push({ group: name, from: p, to })
  }
}

const missing = rows.filter((r) => !r.to)
console.log(`舊站 ${total} 個網址：已對應 ${covered}，未對應 ${missing.length}`)
for (const [name, locs] of Object.entries(groups)) {
  const m = missing.filter((r) => r.group === name).length
  console.log(`  ${name.padEnd(9)} ${locs.length - m}/${locs.length}`)
}

if (!process.argv.includes('--write')) process.exit(0)

const GROUP_TITLE = {
  page: '固定頁（page-sitemap.xml）',
  post: '文章（post-sitemap.xml）',
  category: '分類封存（category-sitemap.xml）',
  post_tag: '標籤封存（post_tag-sitemap.xml）',
}

const doc = `# 舊站 301 對照表

> 舊站：**https://nti-printing.com/**（WordPress + WPML，中文在根目錄、英文在 \`/en/\`）
> 來源：舊站 sitemap，${new Date().toISOString().slice(0, 10)} 抓取，共 **${total}** 個網址
> 實作：[\`apps/web/src/lib/legacy-redirects.ts\`](../apps/web/src/lib/legacy-redirects.ts)，由 middleware 發 301
> 重新產生：\`node tools/check-legacy-redirects.mjs --write\`

**目前覆蓋 ${covered}／${total}。** 未對應的是 100 個標籤封存頁與 ${missing.filter((r) => r.group === 'post').length} 篇文章——
新站的 CMS 還沒有這些內容，也還沒有標籤體系，硬指到列表頁會被 Google 判成 soft 404
（比 404 更難查）。內容遷移（客戶決策 D3／D4：文章全部遷移、標籤逐一對應）做完之後，
把落點補進 \`legacy-redirects.ts\` 的 \`POSTS\`，再重跑上面那支腳本確認歸零。

⚠ 已對應的 12 篇文章目前指向 mockup 的示範頁 \`/news-*\`。那 12 篇正是舊站同一批文章的英文版
（逐篇比對標題確認），內容遷移把它們搬進 CMS 之後，落點要改成 \`/news/{slug}\`。

⚠ 舊網址帶結尾斜線時會經過兩跳：Next 先 308 去掉斜線，middleware 再 301 到新頁。
Google 對五跳以內的轉址鏈沒有問題，但**新增對照時 key 一律不要帶結尾斜線**。

| 記號 | 意思 |
|---|---|
| ✅ | 已有落點 |
| ⬜ | 待內容遷移 |

${Object.entries(GROUP_TITLE)
  .map(([name, title]) => {
    const list = rows.filter((r) => r.group === name)
    return `## ${title}（${list.filter((r) => r.to).length}／${list.length}）

| | 舊網址 | 新網址 |
|---|---|---|
${list.map((r) => `| ${r.to ? '✅' : '⬜'} | \`${r.from || '/'}\` | ${r.to ? `\`${r.to}\`` : '—' } |`).join('\n')}`
  })
  .join('\n\n')}
`

writeFileSync(path.join(root, 'reference/舊站301對照表.md'), doc)
console.log('已更新 reference/舊站301對照表.md')
