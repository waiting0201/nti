#!/usr/bin/env node
/**
 * 四個固定方案（單元 02）的頁面文案：H1、首頁卡片短述、方案頁導言、SEO 標題與描述。
 *
 * 2026-09-24 前台把這幾個欄位接上之後（/products-* 四頁與首頁方案卡），資料庫裡的值
 * 就會直接出現在正式站。而資料庫裡的是早期的提案值——H1 與 mockup 不一致（uv 是
 * 「Eco-Friendly UV Printing」、mockup 是「UV Printing」）、SEO 標題少了「— NTI Printing」、
 * 短述與導言是 NULL。這支把它們補成與 mockup 逐字相同，接上之後畫面不變。
 *
 * 來源：英文逐字取自 apps/web 的 products-*.html 對應頁（mockup 的 h1、第一段 .prose、
 * <title>、meta description）與首頁方案卡；中文取自 apps/web/src/lib/zh.ts，
 * 字典還沒翻的（幾條 meta description）不寫，前台照舊顯示英文原文。
 *
 * 產出 `db/content/230_solution_copy.sql`，**可直接在正式庫執行**：
 *   - 每個欄位只在「還是空的」或「還是當初種子寫的提案值」時才補，後台改過的一律不動
 *   - 重跑無副作用
 *
 * 用法：
 *   node tools/build-solution-copy-sql.mjs
 *   sqlcmd -S ... -d NTI -I -b -i db/content/230_solution_copy.sql
 */
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outFile = path.join(root, 'db/content/230_solution_copy.sql')

const zhSrc = readFileSync(path.join(root, 'apps/web/src/lib/zh.ts'), 'utf8')
const ZH = new Function('return ' + zhSrc.slice(zhSrc.indexOf('{'), zhSrc.lastIndexOf('}') + 1))()
const zh = (s) => ZH[s.replace(/\s+/g, ' ').trim()] ?? null

/**
 * mockup 的英文（逐字）。`seed` 是 db/content/200 早期寫進去的提案值：
 * 資料庫裡還是這個值，就代表後台沒人動過，可以放心換掉。
 */
const SOLUTIONS = {
  boxes: {
    h1: 'Custom Color Box Packaging',
    title: 'Custom Color Box Packaging — NTI Printing',
    desc: 'Custom color box packaging from NTI: tuck-top, reinforced-bottom, rigid and specialty structures, printed and finished to retail standard in Taiwan.',
    summary: 'Multiple box-types: besides folding box, we also provide customize box structure design.',
    intro: ['Explore NTI’s full range of custom color box packaging and color box printing options below:'],
    seed: { en: { h1: 'Custom Color Box Packaging', title: 'Custom Color Box Packaging' }, zh: { h1: '客製化彩盒包裝', title: '客製化彩盒包裝' } },
  },
  cardboard: {
    h1: 'Packaging Paperboard',
    title: 'Packaging Paperboard — NTI Printing',
    desc: 'Custom cardboard packaging and printed cardboard boxes for retail and industrial use, including paper hang tags, blister back cards and multi-panel tags.',
    summary: 'Hang tags, blister cards and backcards for retail walls.',
    intro: ['NTI Printing produces custom cardboard packaging and printed cardboard boxes for retail, industrial, and consumer applications, including:'],
    seed: { en: { h1: 'Custom Packaging Paperboard', title: 'Custom Packaging Paperboard' }, zh: { h1: '客製化包裝紙板', title: '客製化包裝紙板' } },
  },
  uv: {
    h1: 'UV Printing',
    title: 'UV Printing — NTI Printing',
    desc: 'UV printing on plastics, metal foils and coated paperboards. Instant curing delivers vibrant, durable graphics on non-absorbent materials, faster.',
    summary: 'Printing on special materials, special varnish, anti-counterfeiting and more.',
    intro: ['UV printing delivers vibrant, durable graphics on plastics, metal foils, coated paperboards, and other non-absorbent materials. Its instant curing process speeds up production, improves print quality, and supports premium finishes, specialty coatings, and anti-counterfeiting applications — one reason NTI Printing is a trusted source for UV coating printing in Taiwan.'],
    seed: { en: { h1: 'Eco-Friendly UV Printing', title: 'Eco-Friendly UV Printing' }, zh: { h1: '環保 UV 印刷', title: '環保 UV 印刷' } },
  },
  other: {
    h1: 'Other Printing Services',
    title: 'Other Printing Services — NTI Printing',
    desc: 'Specialty printing and custom print finishing from NTI — foil stamping, embossing, holographic and anti-counterfeiting effects, plus calendars and bags.',
    summary: 'Desk calendars, hand bags, red envelopes, mouse pads and manuals.',
    intro: [
      'Enhance your packaging with premium finishes including foil stamping, embossing, holographic effects, and anti-counterfeiting features. Our specialty printing and custom print finishing solutions add visual impact, strengthen brand perception, and provide enhanced product security.',
      'Other products include, but are not limited to, calendars, envelopes, bags, mouse pads, manuals, etc.',
    ],
    seed: { en: { h1: 'Other Printing Services', title: 'Other Printing Services' }, zh: { h1: '其他印刷服務', title: '其他印刷服務' } },
  },
}

const LIMITS = { SeoTitle: 70, SeoDescription: 180, Summary: 300 }
const esc = (s) => s.replace(/'/g, "''")
const html = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')

let body = ''
let count = 0
for (const [code, v] of Object.entries(SOLUTIONS)) {
  for (const lang of ['zh', 'en']) {
    const t = lang === 'en' ? (s) => s : zh
    const paras = v.intro.map(t)
    const cols = {
      H1: [t(v.h1), v.seed[lang].h1],
      Summary: [t(v.summary), null],
      IntroHtml: [paras.every(Boolean) ? paras.map((p) => `<p>${html(p)}</p>`).join('') : null, null],
      SeoTitle: [t(v.title), v.seed[lang].title],
      SeoDescription: [t(v.desc), null],
    }

    body += `\n/* ${code} · ${lang} */\n`
    for (const [col, [value, seedValue]] of Object.entries(cols)) {
      if (value == null) {
        body += `-- ${col}：字典沒有中文，不寫（前台顯示英文原文）\n`
        continue
      }
      if (LIMITS[col] && value.length > LIMITS[col]) throw new Error(`${code} ${lang} ${col} 超過 ${LIMITS[col]} 字`)

      const untouched = seedValue == null
        ? `(${col} IS NULL OR ${col} = N'')`
        : `(${col} IS NULL OR ${col} = N'' OR ${col} = N'${esc(seedValue)}')`
      body += `UPDATE dbo.SolutionI18n SET ${col} = N'${esc(value)}'
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = N'${code}') AND Lang = '${lang}'
  AND ${untouched};
`
      count++
    }
  }
}

writeFileSync(
  outFile,
  `/* =============================================================================
   230_solution_copy.sql  —  四個方案的 H1／短述／導言／SEO（與 mockup 逐字相同）
   -----------------------------------------------------------------------------
   **由 tools/build-solution-copy-sql.mjs 產生，請勿手改。**

   前台 2026-09-24 起讀這幾個欄位（/products-* 四頁、首頁方案卡）。每個欄位只在
   「還是空的」或「還是早期種子的提案值」時才補，後台改過的不會被蓋掉——可直接在正式庫執行，
   重跑無副作用。
   ============================================================================= */
SET NOCOUNT ON;
SET XACT_ABORT ON;
GO

BEGIN TRAN;
${body}
COMMIT;
GO
`,
)
console.error(`230_solution_copy.sql：${count} 個欄位更新`)
