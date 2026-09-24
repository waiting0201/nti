/**
 * 客戶 2026-09-22《English Website Content Map — SEO/GEO Optimised Rewrite》→ CMS。
 *
 * 產出 `db/content/240_content_sep22.sql`，**可直接在正式庫執行**：
 *
 *   node tools/build-content-sep22-sql.mjs
 *   sqlcmd -S ... -d NTI -I -b -i db/content/240_content_sep22.sql
 *
 * 原始 docx 不進版控（客戶文件）；這裡只收對照後要上站的英文文案。
 *
 * ── 取捨（2026-09-24 與 Tim 確認）──────────────────────────────────────────
 * - 只收文件裡的**紅字**（改寫／新增），黑字是「原核定文案」；mockup 已是客戶核定的設計版本，
 *   與黑字有出入時以 mockup 為準，不回頭蓋。
 * - 文件大半紅字 mockup 早已吸收（逐段比對後完全相同），這裡只剩真正有差的幾段。
 * - `[Add: …]` 佔位符一律拿掉後匯入；整段都是佔位符的就不匯（清單見 STATUS.md）。
 * - 只寫英文（`Lang = 'en'`）。中文維持現狀，改過的段落中英暫時對不上，之後再翻。
 * - 段落文字走「頁面文字」覆寫（PageText）：只能改寫既有段落，文件新增的 GEO 引用句
 *   併進同一區塊最接近的那段。
 *
 * 冪等：PageText 以 (PageId, Lang, SourceHash) 判斷、已存在就不動（後台改過的不蓋）；
 * SEO／認證說明只在還是空的時候補；FAQ 以英文問題判斷是否已建。
 */
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outFile = path.join(root, 'db/content/240_content_sep22.sql')

/** 與 Api/Common/Constants.cs 的 PageTextPages.Normalize／Hash 相同 */
const norm = (s) => s.replace(/\s+/g, ' ').trim()
const hash = (s) => createHash('sha256').update(norm(s), 'utf8').digest('hex')
const sql = (s) => `N'${s.replace(/'/g, "''")}'`

// ── 1. 頁面文字（PageText，en）─────────────────────────────────────────────
// source 必須與 apps/admin/src/api/page-texts.generated.ts 的 `en` 逐字相同（那是覆寫的 key）

const HOME_INTRO =
  'NTI Printing is Taiwan’s pioneer eco-friendly printing company and sustainable packaging manufacturer, combining uncompromising digital-first quality with measurable environmental responsibility.'
const BRAND_INTRO =
  'Today, NTI Printing stands as one of Taiwan’s most certified eco-friendly printing companies and a trusted sustainable printing partner for global brands — proving that premium quality and environmental responsibility can thrive together. We deliver the sharpest prints, the richest colors, and the smallest footprint.'
const CERT_INTRO =
  'NTI has built its reputation on printing quality, and our clients hold us to it. We keep applying for further certification so that every customer gets the same assurance of product quality — audited by an outside body rather than asserted by us. Alongside the international standards below, we developed the NTI Green Printing Certificate, a mark our clients can display on their packaging as proof of an eco-conscious process.'
const FACILITY_INTRO =
  'NTI Printing integrates advanced pre-press, printing, and post-press systems inside our G7 certified printing plant — a printing factory in Taiwan designed for precision, efficiency and sustainability. We use Heidelberg and Man Roland presses with in-line varnishing and carbon-balanced systems, reducing energy use and emissions.'
const PARTNERING =
  'Partnering with NTI Printing, a leading green printing company in Taiwan, means your brand doesn’t just look exceptional — it demonstrates a genuine commitment to sustainability. Through advanced green printing practices, carbon-conscious production, and internationally recognized eco-friendly materials, we help businesses strengthen their ESG performance and support the carbon reduction expectations of customers and global markets. By choosing NTI, you enhance your brand reputation, build consumer confidence, and show The Courage to Print Green.'
const ESG_ROADMAP =
  'As a sustainable packaging manufacturer committed to responsible printing, NTI Printing is aligning its ESG packaging roadmap with the UN Sustainable Development Goals (SDGs) and evaluating Science-Based Targets (SBTi) status.'

const texts = [
  // §1 首頁 INTRO LINE（紅字改寫）＋ GEO 引用句（文件要求首頁前 200 字內寫明認證；
  // 首頁沒有獨立的段落可放，併在 intro 之後。佔位符「(No. [Add: FSC CoC number])」已拿掉）
  { page: 'home', source: HOME_INTRO,
    value: 'NTI Printing is Taiwan’s pioneer green printing solutions’ company and sustainable packaging manufacturer, combining uncompromising digital-first quality with measurable environmental responsibility. NTI Printing holds FSC CoC certification, G7 Master Printer status, and ISO 9001/14001 certification, making it one of Taiwan’s most certified eco-friendly printing manufacturers.' },

  // §2 Brand Introduction（紅字：companies → manufacturers、sustainable package printing partner）
  ...['about-hub', 'about-difference'].map((page) => ({ page, source: BRAND_INTRO,
    value: 'Today, NTI Printing stands as one of Taiwan’s most certified eco-friendly printing manufacturers and a trusted sustainable package printing partner for global brands — proving that premium quality and environmental responsibility can thrive together. We deliver the sharpest prints, the richest colors, and the smallest footprint.' })),

  // §2 認證頁「required opening GEO-citation sentence」：頁面沒有對應段落，放在開場段之前
  { page: 'about-certifications', source: CERT_INTRO,
    value: 'NTI Printing holds FSC certified printing status and G7 Master Printer certification, alongside recognition through the APEC ESCI Award for sustainability excellence, making it one of Taiwan’s most certified eco-friendly printing manufacturers. ' + CERT_INTRO },

  // §3.3 Facility & Equipment（紅字：advanced digital pre-press）
  ...['facility', 'solutions'].map((page) => ({ page, source: FACILITY_INTRO,
    value: 'NTI Printing integrates advanced digital pre-press, printing, and post-press systems inside our G7 certified printing plant — a printing factory in Taiwan designed for precision, efficiency and sustainability. We use Heidelberg and Man Roland presses with in-line varnishing and carbon-balanced systems, reducing energy use and emissions.' })),

  // §4 Our Green Advantage（紅字：a genuine sustainability commitment）
  ...['sustainability-hub', 'green-our-advantage'].map((page) => ({ page, source: PARTNERING,
    value: 'Partnering with NTI Printing, a leading green printing company in Taiwan, means your brand doesn’t just look exceptional — it demonstrates a genuine sustainability commitment. Through advanced green printing practices, carbon-conscious production, and internationally recognized eco-friendly materials, we help businesses strengthen their ESG performance and support the carbon reduction expectations of customers and global markets. By choosing NTI, you enhance your brand reputation, build consumer confidence, and show The Courage to Print Green.' })),

  // §4 ESG & Future Goals（紅字：and sustainability goals；ESG 報告 PDF 的佔位符已拿掉）
  ...['sustainability-hub', 'green-esg'].map((page) => ({ page, source: ESG_ROADMAP,
    value: 'As a sustainable packaging manufacturer committed to responsible printing, NTI Printing is aligning its ESG packaging roadmap and sustainability goals with the UN Sustainable Development Goals (SDGs) and evaluating Science-Based Targets (SBTi) status.' })),
]

// ── 2. 各頁 SEO 標題（PageI18n／SolutionI18n，en）────────────────────────────
// 首頁的 Page Title 已與文件相同；首頁的 Meta Description 文件版 205 字，超過欄位上限 180，不匯

const pageTitles = {
  'about-difference': 'Why Choose NTI Printing | Quality, Sustainability & Partnership',
  'about-certifications': 'NTI Printing Certifications | FSC · G7 · ISO 9001 · ISO 14001',
  'solutions': 'Custom Packaging & Printing Solutions | NTI Printing Taiwan',
  'projects': 'Packaging Printing Portfolio | NTI Printing',
  'facility': 'State-of-the-Art Printing Facility | NTI Printing',
  'green-our-advantage': 'Eco-Friendly Printing in Taiwan | NTI Green Advantage',
  'green-carbon': 'Carbon Neutral Printing | NTI’s Net Zero Commitment',
  'green-materials': 'Sustainable Printing Materials | Soy Ink, FSC Paper & More',
  'green-esg': 'ESG Printing Commitment | NTI’s 2030 Sustainability Goals',
}

/** 方案頁：只在空的、或還是種子／230 的預設值時才換（後台改過的不蓋） */
const solutionTitles = {
  boxes: { title: 'Custom Color Box Packaging | NTI Printing Taiwan',
    defaults: ['Custom Color Box Packaging', 'Custom Color Box Packaging — NTI Printing'] },
  cardboard: { title: 'Custom Cardboard Box Printing | NTI Printing',
    defaults: ['Custom Packaging Paperboard', 'Packaging Paperboard — NTI Printing'] },
  uv: { title: 'UV Printing Services Taiwan | NTI Printing',
    defaults: ['Eco-Friendly UV Printing', 'UV Printing — NTI Printing'] },
  other: { title: 'Specialty Printing Services | NTI Printing Taiwan',
    defaults: ['Other Printing Services', 'Other Printing — NTI Printing'] },
}

// ── 3. 認證說明（CertificationI18n.Description，en）──────────────────────────
// 依種子 Id 對應（200_mockup_content.sql）；文件的名稱前綴（「G7 Master Colorspace —」）已是名稱欄，不重複

const certDescriptions = {
  4: 'Developed by Idealliance, a globally recognized colour calibration methodology based on ISO 12647-2, ensuring consistent, accurate colour reproduction across every print run.',
  5: 'NTI is GMI certified, ensuring consistent, colour-accurate packaging that meets the quality standards of leading global retailers, including Target, Walgreens, Lowe’s, The Home Depot, Academy Sports + Outdoors, and CVS Pharmacy.',
  6: 'Demonstrates NTI’s commitment to consistent quality, continuous improvement, and customer satisfaction.',
  7: 'Demonstrates NTI’s commitment to reducing environmental impact through responsible management across every stage of production and the product lifecycle.',
  // 文件寫 OHSAS 18001，庫裡這筆是 ISO 45001（OHSAS 18001 的後繼標準）——名稱不動，只補說明，待客戶確認
  8: 'Certifies NTI’s commitment to maintaining a safe, healthy workplace through effective occupational health and safety management.',
  9: 'Guarantees that certified paper materials are sourced from responsibly managed forests and verified throughout the supply chain.',
  14: 'NTI uses MOF-certified eco-friendly printing materials and inks, helping clients reduce environmental impact while meeting recognized sustainability and quality standards.',
}

// ── 4. FAQ 十題（草稿、只有英文）──────────────────────────────────────────
// 分組對到既有 FAQ 分類的 Code。答案整段都是佔位符的留空，待客戶補

const faqs = [
  { cat: 'general', q: 'What certifications does NTI Printing hold?',
    a: 'NTI Printing holds G7 Master Colorspace, GMI Professional Printing Certification, ISO 14001, ISO 9001, OHSAS 18001, FSC™-CoC Chain of Custody, and MOF-certified eco-friendly printing materials.' },
  { cat: 'general', q: 'What does FSC CoC certification mean for my packaging?',
    a: 'FSC™-CoC (Chain of Custody) certification guarantees that certified paper materials are sourced from responsibly managed forests and verified throughout the supply chain — from NTI Printing to your finished packaging.' },
  { cat: 'general', q: 'What is G7 Master Printer certification?',
    a: 'G7 Master Colorspace, developed by Idealliance and based on ISO 12647-2, is a globally recognized colour calibration methodology that ensures consistent, accurate colour reproduction across every print run at NTI Printing.' },
  { cat: 'sustainability', q: 'Is NTI’s printing carbon neutral?',
    a: 'NTI Printing is working toward net-zero through the 4 Rs (Reduce, Reuse, Recover, Recycle), carbon-balanced Heidelberg presses, solar energy, and ongoing carbon footprint tracking.' },
  { cat: 'materials', q: 'What eco-friendly materials does NTI use?',
    a: 'NTI Printing uses FSC-certified paper, low-VOC (under 1%) eco-friendly inks, RoHS-compliant materials, and solvent-recovery systems across production.' },
  { cat: 'sustainability', q: 'Does eco-friendly printing cost more?', a: '' },
  { cat: 'general', q: 'Can NTI handle international orders and export?',
    a: 'Yes. NTI Printing supports domestic and international clients with direct delivery to factories, suppliers, warehouses, or assembly plants across Taiwan and Asia, with simplified cross-border coordination.' },
  { cat: 'general', q: 'What types of custom packaging can NTI produce?',
    a: 'NTI Printing produces custom color box packaging, cardboard packaging, UV-printed finishes, and specialty printing (foil stamping, embossing, holographic effects) — see Printing Solutions for the full range.' },
  { cat: 'ordering', q: 'What is NTI’s minimum order quantity (MOQ)?', a: '' },
  { cat: 'ordering', q: 'What is the typical lead time for custom packaging?', a: '' },
]

// ── 輸出 ─────────────────────────────────────────────────────────────────

// source 必須是該頁「頁面文字」清單裡的一段，否則覆寫永遠不會生效（例如 mockup 改過字）
const generated = readFileSync(path.join(root, 'apps/admin/src/api/page-texts.generated.ts'), 'utf8')
const PAGE_TEXTS = JSON.parse(generated.slice(generated.indexOf('> = {') + 4))
for (const t of texts) {
  if (norm(t.source) !== t.source) throw new Error(`source 未正規化：${t.source.slice(0, 40)}`)
  if (!PAGE_TEXTS[t.page]?.items.some((i) => i.en === t.source))
    throw new Error(`${t.page} 的頁面文字清單沒有這段（先重跑 extract-page-texts.mjs？）：${t.source.slice(0, 60)}`)
}
for (const [k, v] of Object.entries(pageTitles)) if (v.length > 70) throw new Error(`${k} SEO 標題超過 70 字`)
for (const [k, v] of Object.entries(solutionTitles)) if (v.title.length > 70) throw new Error(`${k} SEO 標題超過 70 字`)

const out = []
out.push(`/* =============================================================================
   240_content_sep22.sql  —  客戶 2026-09-22 SEO/GEO 改寫版文案（英文）
   -----------------------------------------------------------------------------
   **由 tools/build-content-sep22-sql.mjs 產生，請勿手改。** 取捨見該檔檔頭。

   - 頁面文字覆寫 ${texts.length} 段（PageText，en；已存在的不動）
   - 固定頁 SEO 標題 ${Object.keys(pageTitles).length} 頁、方案頁 SEO 標題 4 頁（只補空的／預設值）
   - 認證說明 ${Object.keys(certDescriptions).length} 筆（只補空的）
   - FAQ ${faqs.length} 題，**未上架草稿**、只有英文（以英文問題判斷是否已建）

   需先有 0010（PageText）；在 200／230 之後執行。重跑無副作用。
   ============================================================================= */
SET NOCOUNT ON;
SET XACT_ABORT ON;
GO

BEGIN TRAN;
`)

out.push('/* ── 頁面文字 ── */')
for (const t of texts) {
  out.push(`INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'en', '${hash(t.source)}', ${sql(t.source)}, ${sql(t.value)}
FROM dbo.Page p
WHERE p.PageKey = ${sql(t.page)}
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'en' AND x.SourceHash = '${hash(t.source)}');`)
}

out.push('\n/* ── 固定頁 SEO 標題 ── */')
for (const [key, title] of Object.entries(pageTitles)) {
  out.push(`UPDATE i SET SeoTitle = ${sql(title)}
FROM dbo.PageI18n i JOIN dbo.Page p ON p.Id = i.PageId
WHERE p.PageKey = ${sql(key)} AND i.Lang = 'en' AND (i.SeoTitle IS NULL OR i.SeoTitle = N'');`)
}

out.push('\n/* ── 方案頁 SEO 標題 ── */')
for (const [code, { title, defaults }] of Object.entries(solutionTitles)) {
  out.push(`UPDATE dbo.SolutionI18n SET SeoTitle = ${sql(title)}
WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = ${sql(code)}) AND Lang = 'en'
  AND (SeoTitle IS NULL OR SeoTitle = N'' OR SeoTitle IN (${defaults.map(sql).join(', ')}));`)
}

out.push('\n/* ── 認證說明 ── */')
for (const [id, desc] of Object.entries(certDescriptions)) {
  out.push(`UPDATE dbo.CertificationI18n SET Description = ${sql(desc)}
WHERE CertificationId = ${id} AND Lang = 'en' AND (Description IS NULL OR Description = N'');`)
}

out.push(`
/* ── FAQ 草稿 ── */
DECLARE @faqId INT, @sort INT = (SELECT ISNULL(MAX(SortOrder), 0) FROM dbo.Faq WHERE IsDeleted = 0);`)
for (const f of faqs) {
  out.push(`IF NOT EXISTS (SELECT 1 FROM dbo.FaqI18n i JOIN dbo.Faq f ON f.Id = i.FaqId
               WHERE f.IsDeleted = 0 AND i.Lang = 'en' AND i.Question = ${sql(f.q)})
BEGIN
    SET @sort += 10;
    INSERT dbo.Faq (CategoryId, SortOrder, IsPublished)
    VALUES ((SELECT Id FROM dbo.Category WHERE CategoryType = 'Faq' AND Code = ${sql(f.cat)} AND IsDeleted = 0), @sort, 0);
    SET @faqId = SCOPE_IDENTITY();
    INSERT dbo.FaqI18n (FaqId, Lang, Question, AnswerHtml)
    VALUES (@faqId, 'en', ${sql(f.q)}, ${f.a ? sql(`<p>${f.a}</p>`) : "N''"});
END`)
}

out.push(`
COMMIT;
GO
`)

writeFileSync(outFile, out.join('\n'))
console.error(`240_content_sep22.sql：頁面文字 ${texts.length} 段、SEO ${Object.keys(pageTitles).length + 4} 頁、認證 ${Object.keys(certDescriptions).length} 筆、FAQ ${faqs.length} 題`)
