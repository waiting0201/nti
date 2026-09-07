/**
 * 舊站 301 覆蓋率檢查。
 *
 * 抓 nti-printing.com 的 sitemap（WordPress + All in One SEO 產生的四支子 sitemap），
 * 跟 `apps/web/src/lib/legacy-redirects.ts` 的對照表比對，回報「哪些舊網址還沒有專屬落點」。
 *
 * `--write` 會另外產生兩份：
 * - `apps/web/src/lib/legacy-archive.ts`：**沒有專屬落點的舊網址**，一律導回首頁
 *   （客戶 2026-09-07 決定：舊連結進來找不到就回首頁，不要讓使用者撞 404）
 * - `reference/舊站301對照表.md`：逐條的對照與現況
 *
 * 內容遷移（80+ 篇文章、100 個標籤）做完之後回來重跑：把落點補進 `legacy-redirects.ts`
 * 的 `POSTS`，那幾條就會從「導向首頁」變成專屬落點，這支腳本的數字會跟著動。
 *
 * 用法：
 *   node tools/check-legacy-redirects.mjs          # 只回報
 *   node tools/check-legacy-redirects.mjs --write  # 一併更新上面那兩份
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
console.log(`舊站 ${total} 個網址：專屬落點 ${covered}，導向首頁 ${missing.length}`)
for (const [name, locs] of Object.entries(groups)) {
  const m = missing.filter((r) => r.group === name).length
  console.log(`  ${name.padEnd(9)} 專屬 ${locs.length - m}／${locs.length}`)
}

if (!process.argv.includes('--write')) process.exit(0)

writeFileSync(
  path.join(root, 'apps/web/src/lib/legacy-archive.ts'),
  `/**
 * 舊站上**沒有專屬落點**的網址（${missing.length} 條），一律 301 回首頁。
 *
 * 產生檔，不要手改：\`node tools/check-legacy-redirects.mjs --write\`。
 * 清單來自舊站 sitemap（${new Date().toISOString().slice(0, 10)} 抓取），
 * 決策與代價寫在 \`legacy-redirects.ts\` 的檔頭。
 *
 * 之後把某條的落點補進 \`legacy-redirects.ts\` 的 \`POSTS\`，重跑本腳本，
 * 它就會從這份清單消失——那邊的具體落點永遠優先於這裡的首頁。
 */
export const LEGACY_ARCHIVE: readonly string[] = [
${missing.map((r) => `  ${JSON.stringify(r.from)},`).join('\n')}
]
`,
)
console.log(`已更新 apps/web/src/lib/legacy-archive.ts（${missing.length} 條導向首頁）`)

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

**${total} 條都有去處**：${covered} 條有專屬落點，其餘 ${missing.length} 條（100 個標籤封存頁與
${missing.filter((r) => r.group === 'post').length} 篇文章）依客戶 2026-09-07 決定**一律導回首頁**——舊連結進來不要讓使用者撞 404。

⚠ 導回首頁的那 ${missing.length} 條，Google 會判成 soft 404，**權重不會傳過去**，效果等同 404；
買到的是使用者體驗，不是 SEO。內容遷移（客戶決策 D3／D4：文章全部遷移、標籤逐一對應）做完之後，
把落點補進 \`legacy-redirects.ts\` 的 \`POSTS\`，那幾條就會從「導向首頁」變成真正的 301。
值得優先處理的是 47 篇 Dr.Print 電子報——那是舊站唯一會帶進陌生流量的內容。

⚠ 已對應的 12 篇文章目前指向 mockup 的示範頁 \`/news-*\`。那 12 篇正是舊站同一批文章的英文版
（逐篇比對標題確認），內容遷移把它們搬進 CMS 之後，落點要改成 \`/news/{slug}\`。

⚠ 舊網址帶結尾斜線時會經過兩跳：Next 先 308 去掉斜線，middleware 再 301 到新頁。
Google 對五跳以內的轉址鏈沒有問題，但**新增對照時 key 一律不要帶結尾斜線**。

| 記號 | 意思 |
|---|---|
| ✅ | 有專屬落點 |
| ↩ | 導回首頁（待內容遷移後補上專屬落點） |

${Object.entries(GROUP_TITLE)
  .map(([name, title]) => {
    const list = rows.filter((r) => r.group === name)
    return `## ${title}（專屬落點 ${list.filter((r) => r.to).length}／${list.length}）

| | 舊網址 | 新網址 |
|---|---|---|
${list
      .map(
        (r) =>
          `| ${r.to ? '✅' : '↩'} | \`${r.from || '/'}\` | \`${r.to ?? (r.from.startsWith('/en/') ? '/en' : '/zh')}\` |`,
      )
      .join('\n')}`
  })
  .join('\n\n')}
`

writeFileSync(path.join(root, 'reference/舊站301對照表.md'), doc)
console.log('已更新 reference/舊站301對照表.md')
