/**
 * 把 middleware 的舊站對照表轉成後台單元 16 的資料。
 *
 * 來源是 `apps/web/src/lib/legacy-redirects.ts`（＋產生檔 `legacy-archive.ts`）——
 * 也就是前台 middleware 現在真正在用的那份，不是另外抄一份。抄第二份的下場是
 * 兩邊慢慢分岔，而分岔的症狀（某條舊網址在正式站會轉、在後台看不到）沒有人會發現。
 *
 * 產生兩份：
 *   db/content/210_legacy_redirects.csv  —— 後台單元 16「⬆ 匯入 CSV」直接吃這份
 *   db/content/210_legacy_redirects.sql  —— 交付建置用，已存在的 FromPath 不覆蓋
 *
 * ⚠ SQL 刻意「有就跳過」而不是覆蓋：這張表**客戶可以編輯**，重跑一次就把客戶調整過的
 * 落點蓋回來，等於默默毀掉他的工作。要整批更新請走後台的 CSV 匯入（那條路徑是覆蓋，
 * 而且會留操作紀錄）。
 *
 * 用法：node tools/build-redirect-sql.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => readFileSync(path.join(root, p), 'utf8')

/* ── 解析對照表 ────────────────────────────────────────────
   legacy-redirects.ts 是 TS，Node 不能直接 import，沿用
   check-legacy-redirects.mjs 的作法：用正則把 { zh/en, to } 撈出來。 */
const src = read('apps/web/src/lib/legacy-redirects.ts')

const specific = new Map()
for (const m of src.matchAll(/\{[^{}]*?\bto:\s*'([^']+)'[^{}]*?\}/g)) {
  const to = m[1]
  const zh = /\bzh:\s*'([^']+)'/.exec(m[0])?.[1]
  const en = /\ben:\s*'([^']+)'/.exec(m[0])?.[1]
  if (zh) specific.set(zh.toLowerCase(), `/zh${to}`)
  if (en) specific.set(en.toLowerCase(), `/en${to}`)
}
if (specific.size < 30) throw new Error(`對照表只解析到 ${specific.size} 列，格式可能變了`)

// 沒有專屬落點的 → 該語系首頁（與 legacy-redirects.ts 的 archive 同一條規則）
const archiveSrc = read('apps/web/src/lib/legacy-archive.ts')
const archive = new Map(
  [...archiveSrc.matchAll(/"([^"]+)"/g)]
    .map((m) => m[1])
    .map((p) => [p.toLowerCase(), p.startsWith('/en/') ? '/en' : '/zh']),
)

// 展開順序＝優先順序，與 middleware 一致：專屬落點蓋掉 archive 的首頁
const map = new Map([...archive, ...specific])

/* ── 檢查（單元 16 規格：轉址鏈與迴圈要擋下）───────────────── */
const problems = []
for (const [from, to] of map) {
  if (!from.startsWith('/')) problems.push(`舊網址沒有前導斜線：${from}`)
  if (from.endsWith('/')) problems.push(`舊網址帶結尾斜線：${from}`)
  if (from !== from.toLowerCase()) problems.push(`舊網址不是小寫：${from}`)
  if (from.includes(',') || to.includes(',')) problems.push(`含逗號，CSV 會被切錯：${from}`)
  if (from === to) problems.push(`轉到自己：${from}`)
  if (map.has(to)) problems.push(`轉址鏈：${from} → ${to} → ${map.get(to)}`)
}
if (problems.length) {
  console.error('產生中止，對照表有問題：')
  for (const p of problems) console.error(`  ✗ ${p}`)
  process.exit(1)
}

const rows = [...map].sort(([a], [b]) => a.localeCompare(b))
const toHome = rows.filter(([, to]) => to === '/zh' || to === '/en').length

/* ── CSV（欄位順序＝ AdminPageHandler.ImportAsync 讀的順序）── */
const csv = ['fromPath,toPath,statusCode,isActive,hitCount']
for (const [from, to] of rows) csv.push(`${from},${to},301,1,0`)
writeFileSync(path.join(root, 'db/content/210_legacy_redirects.csv'), csv.join('\n') + '\n')

/* ── SQL ──────────────────────────────────────────────────── */
const sql = [`/* =============================================================================
   210_legacy_redirects.sql  —  舊站 ${rows.length} 條網址的 301 對照（後台單元 16）
   =============================================================================
   由 tools/build-redirect-sql.mjs 產生，**請勿手改**（重新產生：node tools/build-redirect-sql.mjs）。

   來源：apps/web/src/lib/legacy-redirects.ts —— 前台 middleware 正在用的同一份對照，
   清單本身來自舊站 nti-printing.com 自己的 sitemap（2026-09-07 抓取）。

   ${rows.length} 條中 ${rows.length - toHome} 條有專屬落點，${toHome} 條導回該語系首頁
   （客戶 2026-09-07 決定：舊連結進來不要撞 404）。⚠ 導回首頁的那些 Google 會判成
   soft 404，權重傳不過去；內容遷移做完要逐條補上專屬落點。

   冪等，但**已存在的 FromPath 一律不動**：這張表客戶可以在後台編輯，覆蓋等於
   把他調整過的落點默默改掉。要整批更新請走後台單元 16 的 CSV 匯入
   （db/content/210_legacy_redirects.csv，那條路徑才是覆蓋，而且會留操作紀錄）。
   ============================================================================= */
SET NOCOUNT ON;
SET XACT_ABORT ON;
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

BEGIN TRAN;
`]
for (const [from, to] of rows) {
  sql.push(`IF NOT EXISTS (SELECT 1 FROM dbo.Redirect WHERE FromPath = N'${from.replace(/'/g, "''")}')
    INSERT dbo.Redirect (FromPath, ToPath, StatusCode, IsActive) VALUES (N'${from.replace(/'/g, "''")}', N'${to.replace(/'/g, "''")}', 301, 1);`)
}
sql.push(`
COMMIT;
GO

SELECT COUNT(*) AS Redirect筆數 FROM dbo.Redirect WHERE IsDeleted = 0;
GO`)
writeFileSync(path.join(root, 'db/content/210_legacy_redirects.sql'), sql.join('\n') + '\n')

console.log(`舊站對照 ${rows.length} 條：專屬落點 ${rows.length - toHome}，導回首頁 ${toHome}`)
console.log('  db/content/210_legacy_redirects.csv（後台匯入用）')
console.log('  db/content/210_legacy_redirects.sql（交付建置用）')
