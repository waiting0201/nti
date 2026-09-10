#!/usr/bin/env node
/**
 * 把 21 網站設定的值匯入 CMS。
 *
 * 來源：apps/admin/src/api/settings.generated.ts —— 由 `pnpm --filter admin seed`
 * 自 mockup/*.html 與 apps/web/src/lib/zh.ts 產生，也就是後台 demo 正在顯示的那一份。
 * 兩邊同一份是重點：先前 demo 上的設定是手寫的、資料庫那 15 個 key 卻是 NULL，
 * 客戶在 demo 驗收過的公司資訊，正式站一個字都不會出現。
 *
 * 產出 `db/content/220_site_setting.sql`：
 *   - 只補「還沒填」的 key（ValueZh 與 ValueEn 皆為 NULL），不覆蓋後台改過的值
 *   - 空字串的 key 直接不寫（傳真、社群、密件副本）——留 NULL 才是「待客戶提供」，
 *     寫成空字串會讓後台分不出「客戶清空了」與「從來沒填」
 *
 * 為什麼不寫成 EF 的 HasData：這是**編輯內容**，不是 schema 種子。進 Migration 之後
 * 客戶在後台改一個字，下次部署就會被 HasData 蓋回去（見 db/content/README.md）。
 *
 * 用法：
 *   node tools/build-settings-sql.mjs
 *   sqlcmd -S ... -d NTI -I -b -i db/content/220_site_setting.sql
 */
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const valuesFile = path.join(root, 'apps/admin/src/api/settings.generated.ts')
const seedFile = path.join(root, 'Api/Data/Seed/SeedData.cs')

/**
 * settings.generated.ts 是純資料檔（一個 JSON 字面值），直接取出來即可。
 * 起點從 `= {` 之後算，不能只找第一個 `{`——型別註記裡就有一個。
 */
const src = readFileSync(valuesFile, 'utf8')
const decl = src.slice(src.indexOf('SETTING_VALUES'))
const VALUES = JSON.parse(decl.slice(decl.indexOf('= {') + 2, decl.lastIndexOf('}') + 1))

/**
 * key 與多語旗標一律讀後端種子，不在這裡抄第三份。
 *
 * 旗標決定值要怎麼寫：多語的 key 分別寫 ValueZh／ValueEn，單語的 key 兩欄寫同一個值
 * （後台儲存與 SiteSettingReadService 都是這樣看待單語 key 的）。抄一份在這裡遲早會
 * 與後端岔開，而岔開的症狀是英文站冒出中文——畫面上不會有任何錯誤。
 */
const cs = readFileSync(seedFile, 'utf8')
const at = cs.indexOf('SiteSettings =')
if (at < 0) fail('讀不到 Api/Data/Seed/SeedData.cs 的 SiteSettings 種子')
const block = cs.slice(at, cs.indexOf('];', at))

const LOCALIZED = new Map()
for (const m of block.matchAll(/SettingKey\s*=\s*"([^"]+)"[^}]*?IsLocalized\s*=\s*(true|false)/g)) {
  LOCALIZED.set(m[1], m[2] === 'true')
}
if (LOCALIZED.size === 0) fail('解析不出 SeedData.cs 的 SiteSettings 種子，格式可能變了')

function fail(msg) {
  console.error(`✗ ${msg}`)
  process.exit(1)
}

/* 兩份 key 必須完全一致——少一個是 demo 上填了正式站沒有，多一個是存檔會被整批擋下 */
const missing = [...LOCALIZED.keys()].filter((k) => !(k in VALUES))
const extra = Object.keys(VALUES).filter((k) => !LOCALIZED.has(k))
if (missing.length) fail(`settings.generated.ts 少了後端有的 key：${missing.join('、')}`)
if (extra.length) fail(`settings.generated.ts 多了後端沒有的 key：${extra.join('、')}`)

/** SQL 字串字面值。單引號成雙，一律加 N 前綴（欄位是 NVARCHAR）。 */
const q = (v) => `N'${String(v).replaceAll("'", "''")}'`

/** 圖片欄位存相對路徑，不含開頭的斜線（docs/08 §2.6，與 200_mockup_content.sql 一致） */
const asset = (v) => String(v).replace(/^\//, '')

const rows = []
const blank = []

for (const [key, value] of Object.entries(VALUES)) {
  const localized = LOCALIZED.get(key)
  const zh = typeof value === 'string' ? value : value.zh
  const en = typeof value === 'string' ? value : value.en

  if (!zh && !en) {
    blank.push(key)
    continue
  }

  const isImage = key.endsWith('_image')
  rows.push({
    key,
    zh: q(isImage ? asset(zh) : zh),
    // 單語 key 兩欄同值：後台按下儲存時就是這樣寫的，種子也要長一樣
    en: q(isImage ? asset(localized ? en : zh) : localized ? en : zh),
  })
}

const out = []
const w = (s = '') => out.push(s)

w(`/* =============================================================================
   220_site_setting.sql  —  21 網站設定的值（${rows.length} 個 key）
   =============================================================================
   由 tools/build-settings-sql.mjs 產生，**請勿手改**（重新產生：node tools/build-settings-sql.mjs）。

   來源：apps/admin/src/api/settings.generated.ts —— 由 mockup 的 HTML 與
   apps/web/src/lib/zh.ts 抽出，與後台 demo 顯示的是同一份值。

   db/seed/130_site_setting.sql（＝ EF 的 HasData）只建 key 與型別、值留 NULL；
   這支補上 mockup 已經有的那些值，客戶才不用把公司資訊重打一遍。

   ⚠ 仍待客戶提供、刻意留 NULL 的 ${blank.length} 個：${blank.join('、')}
     （後台對社群網址的提示是「留空則前台不顯示該圖示」，所以留 NULL 是有意義的狀態，
      不是漏掉。）
   ⚠ 中文值是初稿：來源是 apps/web/src/lib/zh.ts，與 200_mockup_content.sql 同一個
     狀態——**上線前必須由客戶校閱**。公司中文名沒有客戶提供的依據，刻意不編，
     中英兩欄都放英文法定名稱。

   冪等，且**已經填過的 key 一律不動**：這張表客戶會在後台改，覆蓋等於把他填的值
   默默改掉。要重新匯入請先在後台清空該欄位，或直接在後台改。
   ============================================================================= */
SET NOCOUNT ON;
SET XACT_ABORT ON;
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

/* key 對不上就整支停下來：這支若默默跳過幾個 key，症狀是前台少一段公司資訊，
   而少的那段長得像「客戶還沒填」。 */
DECLARE @missing NVARCHAR(MAX) = (
    SELECT STRING_AGG(k.SettingKey, N'、')
    FROM (VALUES
${rows.map((r) => `        (${q(r.key)})`).join(',\n')}
    ) k (SettingKey)
    WHERE NOT EXISTS (SELECT 1 FROM dbo.SiteSetting s WHERE s.SettingKey = k.SettingKey)
);
IF @missing IS NOT NULL
    THROW 50220, N'SiteSetting 沒有這些 key，請先跑 db/seed/130_site_setting.sql 或 EF Migration', 1;
GO

BEGIN TRAN;
`)

for (const r of rows) {
  w(`UPDATE dbo.SiteSetting SET ValueZh = ${r.zh}, ValueEn = ${r.en}, UpdatedAt = SYSUTCDATETIME()
 WHERE SettingKey = ${q(r.key)} AND ValueZh IS NULL AND ValueEn IS NULL;`)
}

w(`
COMMIT;
GO

SELECT COUNT(*) AS 已填設定筆數 FROM dbo.SiteSetting WHERE ValueZh IS NOT NULL OR ValueEn IS NOT NULL;
GO
`)

const sql = out.join('\n')

/* T-SQL 的區塊註解**會巢狀**：註解裡寫一個 `mockup/*.html`，那個 `/*` 就開了一層
   永遠不會關的註解，整支腳本從那裡開始被吃掉，訊息只有一句「Missing end comment mark」。
   踩過一次，改成產生時就擋下來。 */
if (/\S\/\*/.test(sql)) fail('產出的 SQL 裡有 `/*` 黏在文字中間，T-SQL 會把它當巢狀註解的開頭——請改掉註解裡的寫法')

const outFile = path.join(root, 'db/content/220_site_setting.sql')
writeFileSync(outFile, sql)
console.log(`已產生 db/content/220_site_setting.sql（填 ${rows.length} 個 key，留 NULL ${blank.length} 個：${blank.join('、')}）`)
