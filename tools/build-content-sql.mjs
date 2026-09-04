#!/usr/bin/env node
/**
 * 把 mockup 的頁面內容匯入 CMS。
 *
 * 來源兩份，都不是憑空捏的：
 *   apps/admin/src/api/seed.generated.ts   由 `pnpm --filter admin seed` 自 mockup/*.html 抽出，
 *                                          是客戶已確認版本的實際內容（英文）
 *   tools/content-zh.mjs                   繁體中文翻譯（**初稿，待客戶校閱**）
 *
 * 產出 `db/content/200_mockup_content.sql`：冪等的 MERGE，重跑不會產生重複。
 *
 * 為什麼不寫成 EF 的 HasData：這是**編輯內容**，不是 schema 種子。進 Migration 之後
 * 客戶在後台改一個字，下次部署就會被 HasData 蓋回去。內容一次匯入，之後歸 CMS 管。
 *
 * 用法：
 *   node tools/build-content-sql.mjs
 *   sqlcmd -S ... -d NTI -I -b -i db/content/200_mockup_content.sql
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { ZH } from './content-zh.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const seedFile = path.join(root, 'apps/admin/src/api/seed.generated.ts')

// seed.generated.ts 是 TS 模組，但內容就是一個 JSON 字面值——直接取出來解析
const src = readFileSync(seedFile, 'utf8')
const SEED = JSON.parse(src.slice(src.indexOf('{', src.indexOf('SEED')), src.lastIndexOf('}') + 1))

/** SQL 字串字面值。單引號成雙，一律加 N 前綴（欄位是 NVARCHAR）。 */
const q = (v) => (v === null || v === undefined || v === '' ? 'NULL' : `N'${String(v).replaceAll("'", "''")}'`)

/**
 * 欄位長度上限（docs/08 §2.7 的 SEO 欄位組與各表 DDL）。
 *
 * SEO 欄位超長時**留空而不是截斷**：截斷會產生一句沒寫完的標題直接送進搜尋結果，
 * 而 NULL 的語意是「後台還沒填」，前台會沿用頁面自己的標題。超長的清單會列在
 * 產生器的輸出裡，讓編輯知道哪幾筆要補一個夠短的 SEO 標題。
 */
const MAX_LEN = {
  SeoTitle: 70,
  SeoDescription: 180,
  OgTitle: 90,
  OgDescription: 200,
}

const overflow = []

/** 依欄位上限處理過長的值。 */
function fit(column, value, context) {
  const max = MAX_LEN[column]
  if (!max || !value || String(value).length <= max) return q(value)

  overflow.push(`${context}｜${column} ${String(value).length}/${max} 字元`)
  return 'NULL'
}
const bit = (v) => (v ? '1' : '0')
const int = (v) => (v === null || v === undefined || v === '' ? 'NULL' : String(Number(v)))

/** 取某一列的 zh 值；沒翻到就退回英文（不讓欄位變空的） */
const zh = (unit, id, field, en) => ZH[unit]?.[id]?.[field] ?? en

/** mockup 的素材路徑（`/assets/...`）原樣存進 DB。它們在公開的 assets 容器。 */
const asset = (p) => (p ? String(p).replace(/^\//, '') : null)

const out = []
const w = (s = '') => out.push(s)

w(`/* =============================================================================
   200_mockup_content.sql  —  mockup 頁面內容匯入 CMS
   =============================================================================
   由 tools/build-content-sql.mjs 產生，**請勿手改**（重新產生：node tools/build-content-sql.mjs）。

   內容來源：mockup 目錄下的頁面（客戶已確認的設計版本）
   中文來源：tools/content-zh.mjs —— ⚠ **機器翻譯初稿，上線前必須由客戶校閱**

   冪等：每一段都先查再插，重跑不會產生重複；已存在的列會更新文字欄位。
   執行後 db/verify/verify-ef.sql 的結構斷言不受影響（本檔只動內容表）。

   ⚠ 兩個沒有憑據、刻意未翻譯的專有名詞（見 content-zh.mjs 的說明）：
      公司中文名（保留 NTI）、董事長中文姓名（用「鄭董事長」）。
   ============================================================================= */
SET NOCOUNT ON;
SET XACT_ABORT ON;
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

BEGIN TRAN;
`)

/**
 * mockup 的篩選標籤 → db/seed 的分類代號。
 *
 * projects 頁的篩選鈕（Food／Pharma／Retail／ESG）是設計稿的示範標籤，
 * 與 docs/08 §6.2 定的專案分類（食品／醫藥／美妝／電子／禮品／其他）不是同一套。
 * 只有這兩個對不上，其餘 5 個單元的分類都逐字相符。
 *
 * 這裡對應到最接近的既有分類，而不是新增兩筆 —— 新增會讓
 * db/verify 的「Category = 44」斷言失準，而分類本來就是客戶可以自己在後台加的。
 * 若客戶確認要保留 ESG／Retail 這兩個標籤，在後台新增分類後改這張表即可。
 */
const CATEGORY_ALIAS = {
  'Project:retail': 'Project:gift',   // 節慶禮盒 → 禮品
  'Project:esg': 'Project:other',     // 單一材質改版、大豆油墨出貨箱 → 其他
}

const aliased = []

/** 分類的自然鍵是 (CategoryType, Code)；seed 的 categoryId 長得像 "News:esg" */
const catLookup = (ref) => {
  if (!ref) return 'NULL'

  const mapped = CATEGORY_ALIAS[ref]
  if (mapped && !aliased.includes(`${ref} → ${mapped}`)) aliased.push(`${ref} → ${mapped}`)

  const [type, code] = String(mapped ?? ref).split(':')
  return `(SELECT Id FROM dbo.Category WHERE CategoryType = '${type}' AND Code = '${code}')`
}

/**
 * 產生一個「主表 + i18n 側表」的匯入段落。
 *
 * @param unit     seed 的單元代號（同時是 ZH 的 key）
 * @param table    主表名
 * @param i18nTable  i18n 側表名
 * @param fkColumn i18n 指向主表的欄位名
 * @param naturalKey 用來判斷「已存在」的欄位與取值函式
 * @param columns  主表欄位 → 取值函式
 * @param i18nColumns i18n 欄位 → [seed 欄位名, 取值函式]
 */
function section({ unit, table, i18nTable, fkColumn, naturalKey, columns, i18nColumns, order }) {
  const rows = SEED[unit]
  if (!rows?.length) return

  w(`/* ── ${unit} → ${table}（${rows.length} 筆）──────────────────────────── */`)

  for (const row of rows) {
    const keyValue = naturalKey.value(row)
    const where = `${naturalKey.column} = ${keyValue}`

    const cols = Object.keys(columns)
    const vals = cols.map((c) => columns[c](row))

    w(`IF NOT EXISTS (SELECT 1 FROM dbo.${table} WHERE ${where})`)
    w(`    INSERT dbo.${table} (${cols.join(', ')}) VALUES (${vals.join(', ')});`)

    for (const lang of ['zh', 'en']) {
      const i18n = row.i18n?.[lang]
      if (!i18n) continue

      const pairs = Object.entries(i18nColumns).map(([col, [field, transform]]) => {
        const en = row.i18n?.en?.[field]
        const raw = lang === 'zh' ? zh(unit, row.id, field, en) : en
        return [col, transform ? transform(raw, row, lang) : fit(col, raw, `${unit}/${row.id} [${lang}]`)]
      })

      const id = `(SELECT Id FROM dbo.${table} WHERE ${where})`
      const set = pairs.map(([c, v]) => `${c} = ${v}`).join(', ')

      w(`IF NOT EXISTS (SELECT 1 FROM dbo.${i18nTable} WHERE ${fkColumn} = ${id} AND Lang = '${lang}')`)
      w(`    INSERT dbo.${i18nTable} (${fkColumn}, Lang, ${pairs.map(([c]) => c).join(', ')})`)
      w(`    VALUES (${id}, '${lang}', ${pairs.map(([, v]) => v).join(', ')});`)
      w(`ELSE`)
      w(`    UPDATE dbo.${i18nTable} SET ${set} WHERE ${fkColumn} = ${id} AND Lang = '${lang}';`)
    }
    w()
  }
  w('GO')
  w()
}

// ── 01 home-banner ────────────────────────────────────────────────────────
section({
  unit: 'home-banner', table: 'HomeBanner', i18nTable: 'HomeBannerI18n', fkColumn: 'HomeBannerId',
  naturalKey: { column: 'ImagePath', value: (r) => q(asset(r.imageDesktop)) },
  columns: {
    ImagePath: (r) => q(asset(r.imageDesktop)),
    ImagePathMobile: (r) => q(asset(r.imageMobile)),
    MediaType: () => `'image'`,
    LinkUrl: (r) => q(r.linkUrl),
    OpenInNewTab: (r) => bit(r.newWindow),
    SortOrder: (r) => int(r.sortOrder),
    IsPublished: (r) => bit(r.isPublished),
  },
  i18nColumns: { ImageAlt: ['alt'] },
})

// ── 02 solution：四筆固定方案已由種子建立，這裡只補內容 ────────────────────
w(`/* ── solution → Solution（4 筆已由 EF 種子建立，這裡補封面與文案）────── */`)
for (const row of SEED.solution) {
  const where = `Code = ${q(row.code)}`
  // 種子把四筆方案設為未上架（「素材與文案到位後由後台上架」）——
  // 這支腳本補的就是素材與文案，所以一併上架
  w(`UPDATE dbo.Solution SET CoverImagePath = ${q(asset(row.cover))}, IsPublished = 1 WHERE ${where};`)
  for (const lang of ['zh', 'en']) {
    const en = row.i18n.en
    const v = (f, col) => fit(col ?? f, lang === 'zh' ? zh('solution', row.id, f, en[f]) : en[f], `solution/${row.code} [${lang}]`)
    w(`UPDATE dbo.SolutionI18n SET Name = ${v('name')}, H1 = ${v('h1')}, CoverAlt = ${v('coverAlt')}, Slug = ${v('slug')}, SeoTitle = ${v('seoTitle', 'SeoTitle')}`)
    w(`WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE ${where}) AND Lang = '${lang}';`)
  }
  w()
}
w('GO')
w()

// ── 02 solution-item ──────────────────────────────────────────────────────
section({
  unit: 'solution-item', table: 'SolutionItem', i18nTable: 'SolutionItemI18n', fkColumn: 'SolutionItemId',
  naturalKey: { column: 'ImagePath', value: (r) => q(asset(r.image)) },
  columns: {
    SolutionId: (r) => `(SELECT Id FROM dbo.Solution WHERE Code = ${q(SEED.solution.find((s) => s.id === r.parentId)?.code)})`,
    ImagePath: (r) => q(asset(r.image)),
    SortOrder: (r) => int(r.sortOrder),
    IsPublished: (r) => bit(r.isPublished),
  },
  i18nColumns: { Name: ['name'], Description: ['description'], ImageAlt: ['alt'] },
})

// ── 03 project ────────────────────────────────────────────────────────────
section({
  unit: 'project', table: 'Project', i18nTable: 'ProjectI18n', fkColumn: 'ProjectId',
  naturalKey: { column: 'ImagePath', value: (r) => q(asset(r.image)) },
  columns: {
    CategoryId: (r) => catLookup(r.categoryId),
    ImagePath: (r) => q(asset(r.image)),
    VideoUrl: (r) => q(r.videoUrl),
    StatValue: (r) => q(r.statValue),
    SortOrder: (r) => int(r.sortOrder),
    IsPublished: (r) => bit(r.isPublished),
  },
  i18nColumns: { Title: ['title'], Summary: ['description'], StatLabel: ['statLabel'], ImageAlt: ['alt'] },
})

// ── 04 news ───────────────────────────────────────────────────────────────
section({
  unit: 'news', table: 'News', i18nTable: 'NewsI18n', fkColumn: 'NewsId',
  naturalKey: { column: 'CoverImagePath', value: (r) => q(asset(r.cover)) },
  columns: {
    CategoryId: (r) => catLookup(r.categoryId),
    PublishDate: (r) => q(r.publishDate),
    CoverImagePath: (r) => q(asset(r.cover)),
    IsFeaturedHome: (r) => bit(r.featured),
    IsPublished: (r) => bit(r.isPublished),
  },
  i18nColumns: {
    Title: ['title'], Summary: ['summary'], BodyHtml: ['body'],
    CoverAlt: ['coverAlt'], Slug: ['slug'], SeoTitle: ['seoTitle'],
  },
})

// ── 05 vlog ───────────────────────────────────────────────────────────────
section({
  unit: 'vlog', table: 'Vlog', i18nTable: 'VlogI18n', fkColumn: 'VlogId',
  naturalKey: { column: 'YoutubeId', value: (r) => q(r.youtubeId) },
  columns: {
    CategoryId: (r) => catLookup(r.categoryId),
    YoutubeId: (r) => q(r.youtubeId),
    ThumbOverridePath: (r) => q(asset(r.thumbOverride)),
    IsMainFeature: (r) => bit(r.isHero),
    SortOrder: (r) => int(r.sortOrder),
    IsPublished: (r) => bit(r.isPublished),
  },
  // VlogI18n 沒有 alt 欄位（docs/08 §4.6），thumbAlt 存不進去——見 admin 的 mapping.ts
  i18nColumns: { Title: ['title'], Description: ['description'] },
})

// ── 06 faq ────────────────────────────────────────────────────────────────
section({
  unit: 'faq', table: 'Faq', i18nTable: 'FaqI18n', fkColumn: 'FaqId',
  naturalKey: { column: 'SortOrder', value: (r) => int(r.sortOrder) },
  columns: { SortOrder: (r) => int(r.sortOrder), IsPublished: (r) => bit(r.isPublished) },
  i18nColumns: { Question: ['question'], AnswerHtml: ['answer'] },
})

// ── 07 trend ──────────────────────────────────────────────────────────────
section({
  unit: 'trend', table: 'IndustryTrend', i18nTable: 'IndustryTrendI18n', fkColumn: 'IndustryTrendId',
  naturalKey: { column: 'SortOrder', value: (r) => int(r.sortOrder) },
  columns: { SortOrder: (r) => int(r.sortOrder), IsPublished: (r) => bit(r.isPublished) },
  i18nColumns: { Title: ['title'], BodyHtml: ['body'] },
})

// ── 08 certification ──────────────────────────────────────────────────────
section({
  unit: 'certification', table: 'Certification', i18nTable: 'CertificationI18n', fkColumn: 'CertificationId',
  naturalKey: { column: 'LogoPath', value: (r) => q(asset(r.logo)) },
  columns: {
    CategoryId: (r) => catLookup(r.categoryId),
    LogoPath: (r) => q(asset(r.logo)),
    LinkUrl: (r) => q(r.linkUrl),
    ShowOnHome: (r) => bit(r.showOnHome),
    SortOrder: (r) => int(r.sortOrder),
    IsPublished: (r) => bit(r.isPublished),
  },
  i18nColumns: { Name: ['name'], Description: ['description'], LogoAlt: ['alt'] },
})

// ── 09 client：品牌名不翻譯，無 i18n 側表 ─────────────────────────────────
w(`/* ── client → ClientLogo（${SEED.client.length} 筆，無 i18n 側表）──────────── */`)
for (const row of SEED.client) {
  const where = `LogoPath = ${q(asset(row.logo))}`
  w(`IF NOT EXISTS (SELECT 1 FROM dbo.ClientLogo WHERE ${where})`)
  w(`    INSERT dbo.ClientLogo (Name, LogoPath, LinkUrl, SortOrder, IsPublished)`)
  w(`    VALUES (${q(row.name)}, ${q(asset(row.logo))}, ${q(row.linkUrl)}, ${int(row.sortOrder)}, ${bit(row.isPublished)});`)
}
w('GO')
w()

// ── 10 facility ───────────────────────────────────────────────────────────
section({
  unit: 'facility', table: 'FacilityItem', i18nTable: 'FacilityItemI18n', fkColumn: 'FacilityItemId',
  naturalKey: { column: 'ImagePath', value: (r) => q(asset(r.image)) },
  columns: {
    CategoryId: (r) => catLookup(r.categoryId),
    ImagePath: (r) => q(asset(r.image)),
    SortOrder: (r) => int(r.sortOrder),
    IsPublished: (r) => bit(r.isPublished),
  },
  i18nColumns: { Name: ['name'], Description: ['description'], ImageAlt: ['alt'] },
})

// ── 11 job ────────────────────────────────────────────────────────────────
section({
  unit: 'job', table: 'JobPosting', i18nTable: 'JobPostingI18n', fkColumn: 'JobPostingId',
  naturalKey: { column: 'SortOrder', value: (r) => int(r.sortOrder) },
  columns: { SortOrder: (r) => int(r.sortOrder), IsPublished: (r) => bit(r.isPublished) },
  i18nColumns: { Title: ['title'], Location: ['location'], DescriptionHtml: ['body'] },
})

// ── 12 supplier-notice ────────────────────────────────────────────────────
section({
  unit: 'supplier-notice', table: 'SupplierNotice', i18nTable: 'SupplierNoticeI18n', fkColumn: 'SupplierNoticeId',
  naturalKey: { column: 'NoticeDate', value: (r) => q(r.noticeDate) },
  columns: {
    CategoryId: (r) => catLookup(r.categoryId),
    NoticeDate: (r) => q(r.noticeDate),
    AttachmentPath: (r) => q(asset(r.attachment)),
    IsPublished: (r) => bit(r.isPublished),
  },
  i18nColumns: { Title: ['title'], BodyHtml: ['body'] },
})

// ── 13 supplier-spec ──────────────────────────────────────────────────────
section({
  unit: 'supplier-spec', table: 'SupplierSpec', i18nTable: 'SupplierSpecI18n', fkColumn: 'SupplierSpecId',
  naturalKey: { column: 'SortOrder', value: (r) => int(r.sortOrder) },
  columns: { SortOrder: (r) => int(r.sortOrder), IsPublished: (r) => bit(r.isPublished) },
  i18nColumns: { Title: ['title'], Description: ['description'] },
})

w('COMMIT;')
w(`PRINT N'mockup 內容已匯入。';`)
w('GO')

const outFile = path.join(root, 'db/content/200_mockup_content.sql')
mkdirSync(path.dirname(outFile), { recursive: true })
writeFileSync(outFile, out.join('\n'))

const counts = Object.entries(SEED)
  .filter(([k]) => !['category', 'page'].includes(k))
  .map(([k, v]) => `${k}=${v.length}`)
console.log(`已產生 ${path.relative(root, outFile)}`)
console.log(`  ${counts.join('  ')}`)

if (overflow.length) {
  console.log('\n⚠ SEO 欄位超過長度上限，已留空（前台會沿用頁面自己的標題）：')
  for (const o of overflow) console.log(`    ${o}`)
  console.log('  請在後台為這幾筆補一個夠短的 SEO 標題。')
}

if (aliased.length) {
  console.log('\n⚠ mockup 的標籤在 db/seed 的分類裡沒有對應，已改對到最接近的：')
  for (const a of aliased) console.log(`    ${a}`)
  console.log('  客戶若要保留原標籤，請在後台新增分類後修改 CATEGORY_ALIAS。')
}
