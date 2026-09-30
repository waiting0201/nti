/**
 * 客戶 2026-09-30《官網中文文案 — SEO / GEO 關鍵字優化翻譯版》→ CMS（只寫 zh）。
 *
 * 產出 `db/content/250_content_zh_sep30.sql`，**可直接在正式庫執行**：
 *
 *   node tools/build-content-zh-sep30-sql.mjs
 *   sqlcmd -S ... -d NTI -I -b -i db/content/250_content_zh_sep30.sql
 *
 * 原始 docx（NTI_Website_Content_ZH_Sep30.docx，Subkarma 依 09-22 英文版翻譯）不進版控；
 * 這裡只收對照後要上站的中文。
 *
 * ── 取捨 ─────────────────────────────────────────────────────────────────
 * - 文件是 09-22 英文內容地圖的逐段翻譯，所以對照的 key 仍是 mockup 的英文原文
 *   （頁面文字覆寫的 key），不是 240 改寫後的英文。
 * - 客戶的中文稿第一次給出公司中文名「南台彩藝」與口號譯法「勇於綠色印刷」；
 *   只有這裡覆寫到的段落會換，其餘仍是 zh.ts 的初稿（「NTI」「勇於印綠」）。
 * - 「［請提供：…］」佔位符一律拿掉；整段都是佔位符的不匯（碳排數字句、ESG 報告連結、
 *   成本／MOQ／交期三題 FAQ 的答案）。
 * - 頁面文字只能改寫既有段落。文件裡 mockup 沒有對應段落的（首頁三段式標語與導覽卡、
 *   綠色優勢四頁共用引言、綠色印刷認證標章兩段、聯絡我們副標、多摺頁吊卡）不匯。
 * - 英文原文沒有對應的細節（如文件把一張設備卡拆成多點、原文只有一句）不硬塞，維持現狀。
 *
 * 冪等：PageText 以 (PageId, Lang, SourceHash) 判斷、已存在就不動（後台改過的不蓋）；
 * SEO／認證說明只在空的、或還是英文複本時補；方案導言與品項只在還是 200／230 寫進去的初稿時換；
 * FAQ 只替 240 建的草稿補中文（以英文問題找）。
 */
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outFile = path.join(root, 'db/content/250_content_zh_sep30.sql')

/** 與 Api/Common/Constants.cs 的 PageTextPages.Normalize／Hash 相同 */
const norm = (s) => s.replace(/\s+/g, ' ').trim()
const hash = (s) => createHash('sha256').update(norm(s), 'utf8').digest('hex')
const sql = (s) => `N'${s.replace(/'/g, "''")}'`

const generated = readFileSync(path.join(root, 'apps/admin/src/api/page-texts.generated.ts'), 'utf8')
const PAGE_TEXTS = JSON.parse(generated.slice(generated.indexOf('> = {') + 4))

// ── 1. 頁面文字（PageText，zh）─────────────────────────────────────────────
// key 是 mockup 英文原文；套用到每一個出現這段原文的開放頁（表單頁除外）

const SKIP_PAGES = new Set(['get-a-quote', 'contact', 'careers', 'privacy-legal', 'supplier-area'])

const GEO_HOME = '南台彩藝持有 FSC 產銷監管鏈認證、G7 Master Printer 認證，以及 ISO 9001/14001 認證，是台灣認證數量最多的環保印刷廠之一。'
const GEO_CERT = '南台彩藝持有FSC認證印刷資格與G7 Master Printer認證，並設立獨家的綠色印刷認證標章，加上曾榮獲APEC ESCI獎項的永續卓越表現肯定，是台灣認證數量最多的環保印刷製造商之一。'

const dict = {
  // §1 首頁
  'Taiwan’s Sustainable Packaging & Printing Leader': '台灣永續包裝與印刷領導品牌',
  'The Courage to Print Green': '勇於綠色印刷', // 文件註明「建議譯法，請客戶確認」
  'NTI Printing is Taiwan’s pioneer eco-friendly printing company and sustainable packaging manufacturer, combining uncompromising digital-first quality with measurable environmental responsibility.':
    '南台彩藝是台灣綠色印刷解決方案的先驅者與永續包裝製造商，結合數位優先的極致品質與可量化的環境責任。' + GEO_HOME,
  'Trusted by leading domestic and international brands.': '深受國內外領導品牌信賴。',

  // §2 NTI 差異優勢
  'The NTI Difference': 'NTI差異優勢',
  'The NTI Difference — Where Sustainability Meets Uncompromising Quality': 'NTI差異優勢——永續與極致品質的交會點',
  'Beyond Ink. A mindset of sustainability.': '超越油墨，是一種永續思維。',
  'Today, NTI Printing stands as one of Taiwan’s most certified eco-friendly printing companies and a trusted sustainable printing partner for global brands — proving that premium quality and environmental responsibility can thrive together. We deliver the sharpest prints, the richest colors, and the smallest footprint.':
    '如今，南台彩藝已是台灣認證數量最多的環保印刷公司之一，提供環保包裝與綠色包裝解決方案，並以綠色印刷技術服務全球品牌——證明卓越品質與環境責任能夠並存。我們交付最銳利的印刷成果、最豐富的色彩，以及最小的環境足跡。',
  'NTI. The Courage to Print Green.': '南台彩藝。勇於綠色印刷。',
  'Since 1968': '始於1968年',
  'Benefits to Clients': '對客戶的好處',
  'Why Global Brands Choose NTI': '為何全球品牌選擇南台彩藝',
  'NTI helps global brands create premium, sustainable packaging and custom packaging boxes that protect products, strengthen brand value, and reduce environmental impact. Combining world-class printing with advanced digital technology and responsible manufacturing, we support domestic and international clients with complete packaging solutions, efficient supply chain coordination, and direct global delivery.':
    '作為客製化印刷夥伴與B2B包裝供應商，南台彩藝協助全球品牌打造能保護產品、強化品牌價值並降低環境衝擊的永續包裝與客製化包裝盒。結合世界級印刷技術、先進數位技術與負責任的製造流程，我們為國內外客戶提供完整的包裝解決方案、高效的供應鏈協調，以及直送全球的服務。',
  'Sustainable packaging that meets international environmental standards.': '符合國際環保標準的永續包裝。',
  'Direct delivery to factories, suppliers, warehouses, or assembly plants.': '直送工廠、供應商、倉庫或組裝廠。',
  'Simplified coordination across Taiwan and Asia.': '簡化台灣與亞洲間的協調流程。',
  'Reduced handling, transportation, and packaging waste.': '減少搬運、運輸與包裝廢棄物。',
  'Faster production and shorter supply chain lead times.': '更快的生產速度與更短的供應鏈交期。',
  'Premium print quality with reliable global logistics.': '頂級印刷品質搭配可靠的全球物流。',
  'One trusted partner from design to final delivery.': '從設計到最終交付，始終如一的信賴夥伴。',
  'Certifications, Partnerships & Awards': '認證、合作夥伴與獎項',
  'Proving our promise through action': '用行動證明我們的承諾',
  // about-hub 認證區塊的開場句，內容與首頁 GEO 句相同（FSC CoC／G7／ISO 9001/14001）
  'NTI Printing holds FSC CoC certification, G7 Master Printer status, and ISO 9001/14001 certification, making it one of Taiwan’s most certified eco-friendly printing manufacturers.': GEO_HOME,
  'Green printing is more than a process — it is the way we do business. Every decision, from the materials we select to the equipment we invest in, is guided by our commitment to sustainability. Through energy-efficient production, low-emission inks, wastewater recycling, solvent recovery, solar energy, and ongoing carbon footprint reduction, NTI proves that exceptional printing and environmental responsibility can thrive together.':
    '綠色印刷不只是一套流程——它是我們的經營之道。從選用的材料到投資的設備，每個決策都以永續承諾為指引。透過節能生產、低排放油墨、廢水回收、溶劑回收、太陽能與持續的碳足跡減量，南台彩藝證明卓越印刷與環境責任可以並存。',
  'That’s The Courage to Print Green.': '這就是勇於綠色印刷。',
  'At NTI Printing, ESG begins with people. Our state-of-the-art, fully air-conditioned facility is designed to provide a safe, comfortable, and inspiring workplace for every member of our team. From modern offices and efficient production floors to staff restaurants, library, dormitories, and shared spaces, we continually invest in the wellbeing of both our local and international employees. By creating an environment where people can thrive, we build a stronger culture, deliver better quality, and support a more sustainable future as a trusted sustainable packaging manufacturer in Taiwan.':
    '在南台彩藝，ESG從「人」開始。我們先進、全空調的廠區，致力於為團隊每一位成員打造安全、舒適且充滿啟發的工作環境。從現代化辦公空間、高效生產樓層，到員工餐廳、圖書館、宿舍與共享空間，我們持續投資於本地與國際員工的福祉。透過打造一個讓人才能夠成長的環境，我們建立更堅實的企業文化、交付更好的品質，並作為台灣值得信賴的永續包裝製造商，支持更永續的未來。',

  // §2 認證
  'Our Certifications': '我們的認證',
  'Our Certifications — Proof of Quality & Sustainability': '我們的認證——品質與永續的證明',
  'Developed by Idealliance, a globally recognized colour calibration methodology based on ISO 12647-2, ensuring consistent, accurate colour reproduction across every print run.':
    '由Idealliance開發、以ISO 12647-2為基礎的全球公認色彩校正方法，確保每一次印刷都能呈現一致且精準的色彩重現。',
  'NTI is GMI certified, ensuring consistent, colour-accurate packaging that meets the quality standards of leading global retailers, including Target, Walgreens, Lowe’s, The Home Depot, Academy Sports + Outdoors, and CVS Pharmacy.':
    '南台彩藝通過GMI認證，確保包裝色彩一致且符合Target、Walgreens、Lowe’s、The Home Depot、Academy Sports + Outdoors、CVS Pharmacy等全球零售商的品質標準。',
  'FSC™-CoC Chain of Custody': 'FSC™產銷監管鏈認證',
  'Guarantees that certified paper materials are sourced from responsibly managed forests and verified throughout the supply chain.':
    '確保通過認證的紙材來自負責任管理的森林，並在整個供應鏈中受到驗證。',
  'ISO 14001 — Environmental Management': 'ISO 14001環境管理系統',
  'Demonstrates NTI’s commitment to reducing environmental impact through responsible management across every stage of production and the product lifecycle.':
    '展現南台彩藝在生產與產品生命週期各階段，透過負責任管理降低環境衝擊的承諾。',
  'ISO 9001 — Quality Management System': 'ISO 9001品質管理系統',
  'Demonstrates NTI’s commitment to consistent quality, continuous improvement, and customer satisfaction.':
    '展現南台彩藝對一致品質、持續改善與客戶滿意度的承諾。',
  'OHSAS 18001 — Occupational Health & Safety Management': 'OHSAS 18001職業健康與安全管理',
  'Certifies NTI’s commitment to maintaining a safe, healthy workplace through effective occupational health and safety management.':
    '證明南台彩藝致力於透過有效的職業健康與安全管理，維持安全健康的工作環境。',
  'MOF Certified': 'MOF環保認證',
  'NTI uses MOF-certified eco-friendly printing materials and inks, helping clients reduce environmental impact while meeting recognized sustainability and quality standards.':
    '南台彩藝使用MOF認證的環保印刷材料與油墨，協助客戶在符合公認永續與品質標準的同時降低環境衝擊。',
  'Awards': '獲獎紀錄',
  'The 13th National Brand Yushan Award for Outstanding Business Award.': '第13屆國家品牌玉山獎傑出企業獎。',
  'Gold Award in the ‘Smart Buildings’ category at the 7th APEC ESCI (Energy Smart Communities Initiative) Best Practices Awards Program.':
    '第7屆APEC ESCI（Energy Smart Communities Initiative）最佳實務獎「智慧建築」類別金獎。',

  // §3 印刷解決方案
  'NTI provides complete custom packaging boxes and packaging printing solutions, from material recommendation and selection to structural design, printing techniques, finishing, and technical support. We help brands create custom boxes and packaging that perform beautifully, strengthen their brand, and support a more sustainable future.':
    '南台彩藝提供從材料建議與選擇、結構設計、印刷技術、後加工到技術支援的完整客製化包裝盒與包裝印刷解決方案。我們協助品牌打造外觀出色、強化品牌形象，並支持更永續未來的客製化紙盒與包裝。',
  'Optimized packaging that reduces material use and waste.': '優化包裝以減少材料使用與浪費。',
  'Pre-Press': '印前',
  'Digital CTP technology improves quality while reducing pollution.': '數位CTP技術在提升品質的同時降低污染。',
  'Energy-efficient production with lower waste and emissions.': '節能生產，降低廢棄物與排放。',
  'Food | Electronics | Beauty | Medical | Luxury | Consumer Goods': '食品｜電子｜美妝｜醫療｜精品｜消費性商品',

  // §3.2 專案案例
  'Projects': '專案案例',
  'Real Projects. Real Impact.': '真實專案，真實成果。',
  'From packaging to promotional materials, NTI collaborates with brands across industries to deliver sustainable, high-quality results — explore our custom box portfolio and packaging case study highlights below. Each project reflects our commitment to innovation, precision, and environmental responsibility.':
    '從包裝到促銷材料，南台彩藝與各產業品牌合作，交付永續且高品質的成果——探索我們的印刷案例與包裝設計案例精選，見證每個專案背後的創新、精準與環境責任。',
  'Industries / Applications': '我們服務的產業',
  'Electronics': '電子產品',
  'Beauty & Skincare': '美妝與保養品',
  'Medical & Healthcare': '醫療與健康照護',
  'Luxury & Gift Packaging': '精品與禮品包裝',
  'Home & Lifestyle': '居家與生活風格',
  'Industrial & Consumer Goods': '工業與消費性商品',
  'Explore how global brands trust NTI to print greener — without compromise.': '探索全球品牌如何信賴南台彩藝——印得更綠，毫不妥協。',

  // §3.3 設備與廠房
  'Where Technology Meets Sustainability': '科技與永續的交會點',
  'NTI Printing integrates advanced pre-press, printing, and post-press systems inside our G7 certified printing plant — a printing factory in Taiwan designed for precision, efficiency and sustainability. We use Heidelberg and Man Roland presses with in-line varnishing and carbon-balanced systems, reducing energy use and emissions.':
    '南台彩藝在通過G7認證的印刷廠內，整合先進的數位印前、印刷與印後系統——這是一座專為精準、效率與永續設計的台灣印刷廠。我們使用海德堡與曼羅蘭印刷機，搭配連線上光與碳平衡系統，降低能源使用與排放。',
  'Prepress Equipment': '印前設備',
  'Environmentally Friendly Printing': '環保印刷流程',
  'NTI Printing utilizes the world’s most advanced prepress output software, integrated with a CTP (Computer-to-Plate) direct plate-making system. Coupled with a precise plate production control process, this ensures that the printing dots are accurately rendered, achieving faithful color reproduction in the final print.':
    '南台彩藝採用全球最先進的數位印前輸出軟體，結合CTP（電腦直接製版）系統。搭配精準的製版流程控管，確保網點精確呈現，達成最終印刷成品忠實的色彩重現。',
  'In-house CTP system for faster turnaround and reduced transport.': '內部CTP系統，縮短交期並降低運輸成本。',
  'Daily and weekly dot calibration for color precision.': '每日與每週網點校正，確保色彩精準。',
  'Eco-friendly production that minimizes heavy metals and wastewater.': '環保生產流程，最小化重金屬與廢水產生。',
  'In-house pre-press and CTP plate: short lead time, reducing the cost of transportation. Dot values controlled every day and dot value correction every week to ensure precise dot value. Environmental performance: reduced heavy metal and sewage during production.':
    '內部印前與CTP製版：交期短，降低運輸成本。每日控管網點值、每週校正網點值，確保精準網點表現。環境表現：降低生產過程中的重金屬與廢水。',
  'Heidelberg Prinect Color Proof Pro (digital color proof), Epson Pro9900 Image setter and ZÜND high-speed die cutting machine. NTI Printing can provide the box sample with imagesetter proof to save the cost and lead time for machine proofing.':
    '海德堡Prinect Color Proof Pro（數位色彩打樣）、Epson Pro9900影像輸出機與ZÜND高速裁切機。南台彩藝可提供影像輸出打樣的紙盒樣品，節省機器打樣的成本與交期。',
  'Ink mixed system can mix up the spot colour precisely the same as the colour swatch book. Standard litho printing production procedure, meeting international printing standard ISO 12647-2.':
    '油墨調配系統可精準調出與色卡完全一致的專色。標準平版印刷生產流程，符合ISO 12647-2國際印刷標準。',
  'Heidelberg Press varnishing in line, to shorten the lead time and keep good quality at the same time. We also introduce an environmentally friendly system into the printing procedure.':
    '海德堡印刷機連線上光，在縮短交期的同時維持優異品質。我們也持續導入綠色印刷技術與環保系統，落實於印刷流程的每個環節。',
  'Presses in Use': '先進印刷技術應用',
  'Heidelberg Speedmaster CD 102-6+LX 6-Colour Coater Press': '海德堡Speedmaster CD 102-6+LX六色上光機',
  'Heidelberg Speedmaster CD 102-5+LX 5-Colour Carbon Balanced Coater Press': '海德堡Speedmaster CD 102-5+LX五色碳平衡上光機',
  'Heidelberg Speedmaster CD 102-5+LX UV 5-Colour Coater Press': '海德堡Speedmaster CD 102-5+LX UV五色上光機',
  'Man Roland D-6050 Offenbach Two-Colour Offset Press': '曼羅蘭D-6050 Offenbach雙色平版印刷機',
  'Heidelberg Image Control System': '海德堡Image Control影像控制系統',
  'Heidelberg Axis Control Colour Management System': '海德堡Axis Control色彩管理系統',
  'Axis Control System': '海德堡Axis Control系統',
  'High-efficiency colour measurement, about 3 minutes faster per measurement cycle than comparable systems.':
    '高效色彩量測系統。可辨識印刷導表，量測效率比其他量測設備快約3分鐘。',
  'Image Control System': '海德堡Image Control系統',
  'Spectrophotometer-based in-line monitoring with automatic adjustment — reduces colour variance and generates reference values for repeat jobs.':
    '先進的光譜儀與控制系統，監控印刷流程。不僅能辨識印刷導表，更能辨識整張印刷影像並自動調整。Image Control可降低色差，印刷人員能將色值作為下一次生產的參考依據。',
  'NTI Printing uses the most advanced die-cutting machines, automated gluing machines, and heat shrink film equipment to achieve high-efficiency production and deliver high-quality packaging products.':
    '南台彩藝使用最先進的模切機、自動糊盒機與熱縮膠膜設備，達成高效率生產並交付高品質的包裝加工技術。',
  'Automated die-cutting, gluing, window patching, and lamination systems.': '自動模切、糊盒、開窗貼膜與貼合系統。',
  'BOPP film coating eliminates solvent use and meets EU and US eco standards.': 'BOPP膠膜塗層取代溶劑使用，符合歐美環保標準。',
  'High-speed shrink wrapping and labeling for efficient, secure finishing.': '高速收縮包膜與貼標，達成高效且穩固的成品加工。',
  'Heidelberg Varimatrix 105 Die-Cutter': '海德堡Varimatrix 105自動平台模切機',
  'High-performance automatic flat-bed die-cutting with non-stop feeder, German CITO creasing matrix, precise alignment, and clean waste stripping for straight, sturdy creases.':
    '精準對位，乾淨準確地清除廢料，確保無誤差且整潔的收紙機制；採用德國CITO壓痕模，確保完美壓痕品質，讓紙盒更易摺疊與黏合，壓痕線更平整；不停機送紙裝置，提升連續作業效率，無須中斷生產。',
  'SBL High-Speed Automatic Die-Cutter': 'SBL高速自動平台模切機',
  'Non-stop operation across paper sizes from 400 × 370 mm to 1050 × 750 mm, up to 7,500 sheets per hour.':
    '精準定位，適用不同紙張厚度，配備不停機裝置以維持連續生產。印刷紙張尺寸範圍400×370mm至1050×750mm，最高模切速度每小時7,500張。',
  'High-Speed Intelligent Laminating Machine': '高速自動貼合機',
  'BOPP pre-coated film instead of traditional wet lamination — solvent-free, no drying, meeting European and American environmental standards.':
    '採用BOPP預塗膜取代傳統貼合方式——無需使用溶劑，也無需烘乾，符合歐美環保標準。',
  'Digital Window Patching Machine': '高精度數位開窗貼膜機',
  'Servo-controlled alignment, creasing, corner cutting, and splitting in a single pass.':
    '採用數位系統，不同於傳統機械式開窗貼膜機，伺服馬達控制確保更精準的開窗貼膜——一次作業即可完成對位、壓痕、切角與分割。',
  'High-Speed Universal Folder-Gluer': '高效能自動糊盒機',
  'Up to 200 metres per minute with optional cold or hot glue systems and plasma surface treatment for strong adhesion.':
    '最高速度每分鐘200公尺，實現高速、經濟的生產。可依紙盒類型搭配自動冷膠或熱膠系統，並具備電漿表面處理，確保黏合牢固。',
  'Automatic Heat Shrink Wrap Machine': '自動收縮包膜系統',
  'Complete wrapping protects finished goods from dust, moisture, and handling damage — no rope-bundling marks.':
    '完整包膜可保護產品在儲存期間免受灰塵污染與濕氣損害，確保產品在客戶搬運過程中不因鬆散捆綁而散開或損壞，也防止捆綁過程中綁繩造成的產品表面損傷。',
  'Supporting Equipment': '其他印後設備',
  'Automatic labeling machine, automatic box sealing machine, and two DATIEN guillotine cutters.':
    '自動貼標機、自動封箱機、自動裝袋與收縮包膜系統，以及2台DATIEN高精度工業裁紙機。',

  // 品質檢驗
  'Quality You Can Measure': '品質，可被量化',
  'NTI conducts strict quality control throughout every production stage — from materials to finished goods. Each print is tested for accuracy, durability, and consistency using precision tools such as:':
    '南台彩藝在每一個生產階段——從原料到成品——皆實施嚴格的印刷品管。每一張印刷成品都會透過精密工具進行準確度、耐久度與一致性測試，包括：',
  'Press-side color measurement with single-click operation — strict color-deviation control with less manual error.':
    '高靈敏度，能滿足嚴格的色差標準，並可依使用者需求個別設定。一鍵操作即可提升產能並降低人為誤差——在提升色彩品質的同時節省時間並減少紙材浪費。',
  'Press-side colour measurement with single-click operation — strict colour-deviation control with less manual error.':
    '高靈敏度，能滿足嚴格的色差標準，並可依使用者需求個別設定。一鍵操作即可提升產能並降低人為誤差——在提升色彩品質的同時節省時間並減少紙材浪費。',
  'Measures plate dot area percentage to verify and adjust dot specifications.': '量測網點面積百分比，並分析數據以調整網點區域。',
  'Barcode Grade Scanner': '條碼等級掃描儀',
  'Verifies every printed barcode meets grade compliance.': '所有印製於商品上的條碼皆經過檢測以確認條碼等級。',
  'Temperature & Humidity Chamber': '溫濕度試驗箱',
  'High/low temperature simulation to catch issues from environmental fluctuation before shipment.': '模擬高低溫環境，並預防因溫度變化可能造成的品質異變。',
  'Ink Rub Tester': '油墨磨擦測試儀',
  'Confirms abrasion resistance of printed surfaces to customer requirements.': '用於客戶要求耐磨測試時，確保印刷品符合客戶要求。',
  'Blister Pack Strength Testing': '泡殼強度測試機',
  'Tests gluing strength for vacuum blister packaging components.': '測試真空泡殼黏合部位的強度。',
  'Measurement & Test Equipment': '檢測設備',
  'Our goal: every print that leaves NTI meets international standards — and your expectations.': '我們的目標：每一張離開南台彩藝的印刷品，都符合國際標準——以及您的期待。',
  'X-Rite i1iO & eXact spectrophotometers — spectrum colour control testing apparatus.': 'X-Rite i1iO與Exact光譜儀——光譜色彩控制檢測儀器。',
  'IC Plate II plate checker — measures percentage dot area and analyzes the data to adjust dot areas.': 'IC Plate II版材檢測儀——量測網點面積百分比，並分析數據以調整網點區域。',
  'Barcode grade scanner — all barcodes printed on goods are tested to check barcode grade.': '條碼等級掃描儀——所有印製於商品上的條碼皆經過檢測以確認條碼等級。',
  'Ink rub and gloss testers — used whenever a customer requests abrasion resistance testing.': '油墨磨擦與光澤度測試儀——用於客戶要求耐磨測試時，確保印刷品符合客戶要求。',
  'Temperature & humidity chambers — simulate high/low temperature conditions.': '溫濕度試驗箱——模擬高低溫環境，並預防因溫度變化可能造成的品質異變。',
  'Gloss-Meter — tests whether the brightness of the paper surface meets requirements.': '光澤度計——測試紙張表面亮度是否符合要求。',
  'Blister Packing Machine — tests the strength of the gluing part of the vacuum blister.': '泡殼強度測試機——測試真空泡殼黏合部位的強度。',

  // 工廠導覽（設備頁）
  'See Sustainability in Action': '見證永續，身臨其境',
  'NTI’s factory is built around environmental care and employee well-being. Our modern, fully air-conditioned office and production facility has been designed to provide a safe, clean and inspiring workplace for every member of our team.':
    '南台彩藝的廠房以環境關懷與員工福祉為核心打造。我們現代化、全空調的辦公與生產設施，致力為團隊每一位成員提供安全、潔淨且充滿啟發的工作環境。',
  'Visitors can explore our clean water treatment system, energy-efficient production lines, and green facilities designed for both people and the planet.':
    '參訪者可實地了解我們的清水處理系統、節能生產線，以及兼顧人與環境的綠色設施。',
  'Book a guided tour and experience how we bring ‘The Courage to Print Green’ to life.': '預約印刷廠參觀行程，親身體驗我們如何將「勇於綠色印刷」落實於行動。',

  // §4 綠色優勢
  'Eco-Friendly Printing in Taiwan': '台灣環保印刷',
  'NTI Printing is one of Taiwan’s most certified eco-friendly printing manufacturers, holding FSC CoC, G7 Master Printer, and ISO 14001 certifications.':
    '南台彩藝是台灣認證數量最多的環保印刷廠之一，持有FSC產銷監管鏈認證、G7 Master Printer與ISO 14001認證。',
  'Partnering with NTI Printing, a leading green printing company in Taiwan, means your brand doesn’t just look exceptional — it demonstrates a genuine commitment to sustainability. Through advanced green printing practices, carbon-conscious production, and internationally recognized eco-friendly materials, we help businesses strengthen their ESG performance and support the carbon reduction expectations of customers and global markets. By choosing NTI, you enhance your brand reputation, build consumer confidence, and show The Courage to Print Green.':
    '與南台彩藝這家台灣領先的綠色印刷公司合作，不僅讓您的品牌外觀出色——更展現真正的永續承諾與具體的環保印刷承諾。透過先進的綠色印刷實務、以碳為核心的生產思維，以及國際認可的環保材料，我們協助企業強化ESG表現，並回應客戶與全球市場對減碳的期待。選擇南台彩藝，即是提升品牌聲譽、建立消費者信任，並展現勇於綠色印刷的態度。',
  'NTI Printing is committed to measurable carbon neutral printing and low carbon packaging production in Taiwan. We track our carbon footprint across printing cycles, invest in energy-efficient machines and adopt digital workflows that cut waste. Through the 4 Rs — Reduce, Reuse, Recover, Recycle — we lower raw-material use and emissions while maintaining premium print standards.':
    '南台彩藝致力於在台灣實現可量化的碳中和與減碳印刷生產。我們追蹤每一次印刷週期的碳足跡，投資節能設備，並採用能降低浪費的數位化工作流程。透過4R原則——減量、再利用、回收再生、循環——我們在維持頂級印刷標準的同時，降低原料使用與排放。',
  'Our commitment to sustainable packaging materials begins with the materials we choose and the technology we invest in. From FSC paper printing and low-VOC eco friendly printing ink to RoHS-compliant materials, solvent recovery, and advanced wastewater recycling systems, every step of our production process is designed to reduce environmental impact. Combined with energy-efficient presses and finishing equipment, we deliver exceptional print quality while minimizing waste, emissions, and resource consumption.':
    '我們對永續包裝材料的承諾，始於我們所選用的材料與所投資的技術。從FSC紙材印刷、低VOC環保油墨，到符合RoHS標準的材料、溶劑回收系統與先進廢水回收系統，生產流程的每一步都以降低環境衝擊為目標。結合節能印刷機與加工設備，我們在最小化浪費、排放與資源消耗的同時，交付卓越的印刷品質。',
  'Our integrated production process improves efficiency while reducing environmental impact. By utilizing Computer-to-Plate (CTP) technology, we eliminate traditional plate-making processes, reducing heavy metal contamination, wastewater, material waste, and overall carbon emissions.':
    '我們的整合生產流程在提升效率的同時降低環境衝擊。透過CTP（電腦直接製版）技術，我們免除傳統製版流程，減少重金屬污染、廢水、材料浪費與整體碳排放。',
  'NTI’s advanced printing equipment is designed to maximize production efficiency while minimizing energy consumption. Our eco-friendly printing systems reduce ink waste, solvent usage, and paper waste, delivering exceptional print quality with a lower environmental footprint.':
    '南台彩藝的先進印刷設備專為在降低能源消耗的同時，最大化生產效率而設計。我們的環保印刷系統減少油墨浪費、溶劑用量與紙材浪費，以更低的環境足跡交付卓越印刷品質。',
  'We use environmentally responsible eco friendly printing ink containing less than 1% VOC (Volatile Organic Compounds), together with solvent recovery systems that help reduce emissions and improve workplace safety while maintaining outstanding print performance.':
    '我們使用VOC（揮發性有機化合物）含量低於1%的環保油墨，並搭配溶劑回收系統，在維持卓越印刷表現的同時，降低排放並提升工作環境安全性。',
  'Sewage Treatment': '廢水處理',
  'Environmental responsibility extends beyond the printing press. NTI operates advanced wastewater treatment and recycling systems for both production and domestic water, ensuring discharged water consistently meets strict environmental standards. Together with our renewable solar energy infrastructure and ongoing carbon footprint reduction initiatives, we continue to build a cleaner and more sustainable future.':
    '環境責任不只止於印刷機台。南台彩藝針對生產用水與生活用水，建置先進的廢水處理與回收系統，確保排放水質穩定符合嚴格的環保標準。搭配可再生太陽能基礎設施與持續進行的碳足跡減量計畫，我們持續打造更潔淨、更永續的未來。',
  'At NTI Printing, ESG begins with people. We believe a safe, clean, modern, and comfortable workplace is fundamental to building a sustainable business. Our fully air-conditioned offices and production facility, together with staff amenities including a restaurant, library, dormitories, and shared spaces, reflect our commitment to the wellbeing of both our local and international employees.':
    '在南台彩藝，ESG從「人」出發。我們相信安全、潔淨、現代且舒適的工作環境，是打造永續企業的根本。我們全空調的辦公與生產設施，搭配員工餐廳、圖書館、宿舍與共享空間等福利設施，體現我們對本地與國際員工福祉的承諾。',
  // ESG 報告 PDF 的佔位符已拿掉
  'As a sustainable packaging manufacturer committed to responsible printing, NTI Printing is aligning its ESG packaging roadmap with the UN Sustainable Development Goals (SDGs) and evaluating Science-Based Targets (SBTi) status.':
    '作為致力於負責任印刷與ESG印刷實踐的永續包裝製造商，南台彩藝正將ESG包裝發展藍圖與永續發展目標，對齊聯合國永續發展目標（SDGs），並評估科學基礎減碳目標（SBTi）的適用狀態。',

  // §5–7 最新消息／綠色部落格／FAQ
  'Latest news & insights': '最新消息與洞察',
  'Stay connected with NTI Printing’s latest green printing innovations, sustainable packaging initiatives, company news, and industry achievements.':
    '掌握南台彩藝最新的印刷產業新聞、公司最新消息、永續包裝計畫與綠色印刷創新動態。',
  'Explore practical insights, industry trends, and sustainable packaging and eco friendly printing solutions that help brands build a greener future.':
    '探索環保印刷知識、產業趨勢，以及能協助品牌打造更綠色未來的永續包裝設計與解決方案。',
  'Find answers to common questions about green printing, packaging, certifications, sustainability, and working with NTI.':
    '南台彩藝為您解答關於綠色印刷、包裝、環保印刷認證，以及與我們合作的印刷常見問題。',
}

/** 只在特定頁才這樣譯的段落 */
const perPage = [
  // 認證頁開場：文件要求的 GEO 引用句放在既有開場段之前（與 240 英文版同一處理），開場段沿用現有中文
  { page: 'about-certifications', source: 'NTI has built its reputation on printing quality, and our clients hold us to it. We keep applying for further certification so that every customer gets the same assurance of product quality — audited by an outside body rather than asserted by us. Alongside the international standards below, we developed the NTI Green Printing Certificate, a mark our clients can display on their packaging as proof of an eco-conscious process.',
    value: (zh) => GEO_CERT + zh },
]

const texts = []
const used = new Set()
for (const [page, { items }] of Object.entries(PAGE_TEXTS)) {
  if (SKIP_PAGES.has(page)) continue
  const seen = new Set()
  for (const it of items) {
    if (it.kind !== 'text' || seen.has(it.en)) continue
    seen.add(it.en)
    const special = perPage.find((p) => p.page === page && p.source === it.en)
    const value = special ? special.value(it.zh ?? '') : dict[it.en]
    if (value === undefined) continue
    used.add(it.en)
    if (it.zh && norm(it.zh) === norm(value)) continue // 字典已經是這個譯法
    texts.push({ page, source: it.en, value })
  }
}
const unused = Object.keys(dict).filter((k) => !used.has(k))
if (unused.length) throw new Error(`這些原文在開放的頁面文字清單裡找不到（mockup 改過字？）：\n  ${unused.join('\n  ')}`)
for (const p of perPage) if (!PAGE_TEXTS[p.page]?.items.some((i) => i.en === p.source)) throw new Error(`${p.page} 沒有這段：${p.source.slice(0, 60)}`)

// ── 2. SEO（PageI18n／SolutionI18n，zh）─────────────────────────────────────
// 文件的 Page Title 只有頁名的（工廠導覽、聯絡我們…）補「｜南台彩藝」，與其他頁一致

const pageSeo = {
  'home': { title: '南台彩藝｜台灣永續包裝與環保印刷領導品牌',
    desc: '南台彩藝——台灣領先的永續包裝與環保印刷製造商。通過 FSC 產銷監管鏈、G7 Master Printer、ISO 9001/14001 認證。提供客製化彩盒、UV 印刷及環保包裝解決方案，服務全球品牌。' },
  'about-difference': { title: '為何選擇南台彩藝｜品質、永續與夥伴關係' },
  'about-benefits': { title: '更聰明的全球B2B客製化印刷供應商｜南台彩藝' },
  'about-certifications': { title: '南台彩藝認證｜FSC・G7・ISO 9001・ISO 14001' },
  'facility-tour': { title: '工廠導覽｜南台彩藝' },
  'solutions': { title: '客製化包裝與印刷解決方案｜南台彩藝台灣' },
  'projects': { title: '包裝印刷作品實績｜南台彩藝' },
  'facility': { title: '頂尖印刷廠房｜南台彩藝' },
  'facility-quality': { title: '品質檢驗｜南台彩藝' },
  'green-our-advantage': { title: '台灣環保印刷｜南台彩藝的綠色優勢' },
  'green-carbon': { title: '碳中和印刷｜南台彩藝的淨零承諾' },
  'green-materials': { title: '永續印刷材料｜大豆油墨、FSC紙材與更多' },
  'green-esg': { title: 'ESG印刷承諾｜南台彩藝2030永續目標' },
  'news-list': { title: '最新消息與洞察｜南台彩藝' },
  'green-vlog': { title: '綠色知識中心｜南台彩藝' },
  'faq': { title: '印刷常見問題｜南台彩藝' },
  'contact': { title: '聯絡我們｜南台彩藝' },
}

/** 方案頁：SEO 標題與導言。只在空的、或還是 200／230 寫進去的初稿時換 */
const solutions = {
  boxes: { title: '客製化彩盒印刷｜南台彩藝台灣', titleDefaults: ['客製化彩盒包裝', '客製化彩盒包裝 —— NTI Printing'],
    intro: '<p>探索南台彩藝完整的客製化彩盒包裝與彩盒印刷選項：</p>',
    introDefault: '<p>探索 NTI 完整的客製化彩盒包裝與彩盒印刷選項：</p>' },
  cardboard: { title: '客製化紙板印刷｜南台彩藝', titleDefaults: ['客製化包裝紙板', '包裝紙板 —— NTI Printing'],
    intro: '<p>南台彩藝為零售、工業與消費性應用生產客製化包裝紙板與紙盒包裝製造服務，涵蓋以下產品：</p>',
    introDefault: '<p>NTI Printing 生產零售、工業與消費性應用的客製化紙板包裝與印刷紙盒，包括：</p>' },
  uv: { title: '台灣UV印刷服務｜南台彩藝', titleDefaults: ['環保 UV 印刷', 'UV 印刷 —— NTI Printing'],
    intro: '<p>UV印刷能在塑膠、金屬箔、塗佈紙板及其他不吸水材質上，呈現鮮豔且耐久的圖像效果。其瞬間固化的特性可加快生產速度、提升印刷品質，並支援頂級加工、特殊塗層與防偽應用——這正是南台彩藝成為台灣值得信賴的UV印刷技術供應商的原因之一。</p>',
    introDefault: '<p>UV 印刷能在塑膠、金屬箔、塗佈紙板等非吸收性材質上，呈現鮮豔而耐久的圖像。瞬間固化的製程加快生產、提升印刷品質，並支援高階加工、特殊塗層與防偽應用 —— 這也是 NTI Printing 成為台灣 UV 上光印刷可靠來源的原因之一。</p>' },
  other: { title: '台灣特殊印刷服務｜南台彩藝', titleDefaults: ['其他印刷服務', '其他印刷服務 —— NTI Printing'],
    intro: '<p>以燙金、壓紋、全息效果與防偽特徵等頂級加工，提升您的包裝質感。我們的特殊印刷與印刷加工服務能增添視覺衝擊力、強化品牌形象，並提升產品安全性。</p><p>其他產品包括（但不限於）桌曆、信封、提袋、滑鼠墊、產品說明書等。</p>',
    introDefault: '<p>以燙金、壓凸、雷射光影與防偽等高階加工，讓包裝更出色。特殊印刷與客製化印後加工能增加視覺衝擊、強化品牌感受，並提升產品的防偽保護。</p><p>其他產品包括但不限於月曆、紙袋、提袋、滑鼠墊、說明書等。</p>' },
}

/** 方案品項（以英文名稱找）：只在中文名稱還是 200 的初稿時換 */
const solutionItems = [
  { en: 'Gluing Box', old: '糊盒', name: '摺蓋盒', desc: '簡單的上下開口設計，易於組裝，適合輕量產品。' },
  { en: 'Bottom Gluing Box', old: '糊底盒', name: '黏合底盒', desc: '加強底部設計，適合較重物品，堅固耐用。' },
  { en: 'Insert Bottom Box', old: '插底盒', name: '插入式底盒', desc: '四扣角交叉結構，兼具耐用性與組裝便利性。' },
  { en: 'Hand-Carry Box', old: '手提盒', name: '手提盒', desc: '內建把手，方便提取並減少額外提袋使用。' },
  { en: 'Top & Bottom Box', old: '天地盒', name: '天地蓋盒', desc: '頂級雙件式盒型，優雅大方，適合禮品包裝。' },
  { en: 'Special Package', old: '特殊盒型', name: '特殊包裝', desc: '依獨特需求提供全客製化設計與材料建議。' },
  { en: 'Paper Hang Tags & Blister Backcards', old: '紙卡與吊卡底板', name: '紙吊卡與泡殼卡紙',
    desc: '客製印刷的紙吊卡與泡殼背卡，在提供清晰產品資訊與強烈零售視覺效果的同時，提升產品陳列質感。適用於手工具、五金零件、電子元件、汽車零件及各類消費性產品。' },
  { en: 'Blister Cardboard', old: '泡殼卡紙', name: '泡殼卡紙包裝',
    desc: '泡殼卡紙包裝結合兩層印刷紙板與透明塑膠泡殼，提供牢固的產品保護、優異的可視性，以及強烈的零售陳列效果。' },
]

// ── 3. 認證說明（CertificationI18n.Description，zh）─────────────────────────
// 依種子 Id（與 240 同一組）；只補空的

const certDescriptions = {
  4: dict['Developed by Idealliance, a globally recognized colour calibration methodology based on ISO 12647-2, ensuring consistent, accurate colour reproduction across every print run.'],
  5: dict['NTI is GMI certified, ensuring consistent, colour-accurate packaging that meets the quality standards of leading global retailers, including Target, Walgreens, Lowe’s, The Home Depot, Academy Sports + Outdoors, and CVS Pharmacy.'],
  6: dict['Demonstrates NTI’s commitment to consistent quality, continuous improvement, and customer satisfaction.'],
  7: dict['Demonstrates NTI’s commitment to reducing environmental impact through responsible management across every stage of production and the product lifecycle.'],
  8: dict['Certifies NTI’s commitment to maintaining a safe, healthy workplace through effective occupational health and safety management.'],
  9: dict['Guarantees that certified paper materials are sourced from responsibly managed forests and verified throughout the supply chain.'],
  14: dict['NTI uses MOF-certified eco-friendly printing materials and inks, helping clients reduce environmental impact while meeting recognized sustainability and quality standards.'],
}

// ── 4. FAQ：替 240 的十題草稿補中文（以英文問題找）───────────────────────────

const faqs = [
  { en: 'What certifications does NTI Printing hold?', q: '南台彩藝持有哪些認證？',
    a: '南台彩藝持有G7 Master Colorspace、GMI專業印刷認證、ISO 14001、ISO 9001、OHSAS 18001、FSC™產銷監管鏈認證，以及MOF認證環保印刷材料。' },
  { en: 'What does FSC CoC certification mean for my packaging?', q: 'FSC CoC認證對我的包裝意味著什麼？',
    a: 'FSC™產銷監管鏈（Chain of Custody）認證，確保通過認證的紙材來自負責任管理的森林，並在整個供應鏈中——從南台彩藝到您的成品包裝——都經過驗證。' },
  { en: 'What is G7 Master Printer certification?', q: '什麼是G7 Master Printer認證？',
    a: 'G7 Master Colorspace由Idealliance開發，以ISO 12647-2為基礎，是全球公認的色彩校正方法，確保南台彩藝每一次印刷都能呈現一致且精準的色彩重現。' },
  { en: 'Is NTI’s printing carbon neutral?', q: '南台彩藝的印刷是碳中和的嗎？',
    a: '南台彩藝正透過4R原則（減量、再利用、回收再生、循環）、碳平衡海德堡印刷機、太陽能，以及持續的碳足跡追蹤，朝淨零目標邁進。' },
  { en: 'What eco-friendly materials does NTI use?', q: '南台彩藝使用哪些環保材料？',
    a: '南台彩藝在生產過程中使用FSC認證紙材、低VOC（低於1%）環保油墨、符合RoHS標準的材料，以及溶劑回收系統。' },
  { en: 'Does eco-friendly printing cost more?', q: '環保印刷會比較貴嗎？', a: '' },
  { en: 'Can NTI handle international orders and export?', q: '南台彩藝能處理國際訂單與出口業務嗎？',
    a: '可以。南台彩藝為國內外客戶提供直送工廠、供應商、倉庫或組裝廠的服務，涵蓋台灣與亞洲地區，並簡化跨境協調流程。' },
  { en: 'What types of custom packaging can NTI produce?', q: '南台彩藝能生產哪些類型的客製化包裝？',
    a: '南台彩藝生產客製化彩盒包裝、包裝紙板、UV印刷加工品，以及特殊印刷（燙金、壓紋、全息效果）——完整產品範圍請參閱「印刷解決方案」頁面。' },
  { en: 'What is NTI’s minimum order quantity (MOQ)?', q: '南台彩藝的最小訂購量（MOQ）是多少？', a: '' },
  { en: 'What is the typical lead time for custom packaging?', q: '客製化包裝的一般交期是多久？', a: '' },
]

// ── 檢查 ─────────────────────────────────────────────────────────────────

const allValues = [
  ...texts.map((t) => t.value), ...Object.values(pageSeo).flatMap((s) => [s.title, s.desc ?? '']),
  ...Object.values(solutions).flatMap((s) => [s.title, s.intro]), ...solutionItems.flatMap((i) => [i.name, i.desc]),
  ...Object.values(certDescriptions), ...faqs.flatMap((f) => [f.q, f.a]),
]
for (const v of allValues) {
  if (v === undefined) throw new Error('有譯文是 undefined（certDescriptions 的 key 打錯？）')
  if (/［|請提供/.test(v)) throw new Error(`佔位符沒拿掉：${v.slice(0, 60)}`)
}
for (const [k, s] of Object.entries(pageSeo)) {
  if (s.title.length > 70) throw new Error(`${k} SEO 標題超過 70 字`)
  if (s.desc && s.desc.length > 180) throw new Error(`${k} SEO 描述超過 180 字`)
}
for (const [k, s] of Object.entries(solutions)) if (s.title.length > 70) throw new Error(`${k} SEO 標題超過 70 字`)
for (const v of Object.values(certDescriptions)) if (v.length > 400) throw new Error('認證說明超過 400 字')

// ── 輸出 ─────────────────────────────────────────────────────────────────

const out = []
out.push(`/* =============================================================================
   250_content_zh_sep30.sql  —  客戶 2026-09-30 中文文案（SEO/GEO 關鍵字優化翻譯版）
   -----------------------------------------------------------------------------
   **由 tools/build-content-zh-sep30-sql.mjs 產生，請勿手改。** 取捨見該檔檔頭。

   - 頁面文字覆寫 ${texts.length} 段（PageText，zh；已存在的不動）
   - 固定頁 SEO 標題 ${Object.keys(pageSeo).length} 頁、首頁 SEO 描述（只補空的／還是英文複本的）
   - 方案頁 SEO 標題與導言 4 頁、方案品項 ${solutionItems.length} 筆（只換還是初稿的）
   - 認證說明 ${Object.keys(certDescriptions).length} 筆（只補空的）
   - FAQ ${faqs.length} 題草稿補中文（240 建的，以英文問題找；已有中文的不動）

   需先有 0010（PageText）；在 200／230／240 之後執行。重跑無副作用。
   ============================================================================= */
SET NOCOUNT ON;
SET XACT_ABORT ON;
GO

BEGIN TRAN;
`)

out.push('/* ── 頁面文字 ── */')
for (const t of texts) {
  out.push(`INSERT dbo.PageText (PageId, Lang, SourceHash, SourceText, Value)
SELECT p.Id, 'zh', '${hash(t.source)}', ${sql(t.source)}, ${sql(t.value)}
FROM dbo.Page p
WHERE p.PageKey = ${sql(t.page)}
  AND NOT EXISTS (SELECT 1 FROM dbo.PageText x WHERE x.PageId = p.Id AND x.Lang = 'zh' AND x.SourceHash = '${hash(t.source)}');`)
}

// 「還是英文複本」：早期種子把英文值也寫進了 zh 列（首頁即是）
out.push('\n/* ── 固定頁 SEO ── */')
for (const [key, s] of Object.entries(pageSeo)) {
  for (const [col, v] of [['SeoTitle', s.title], ['SeoDescription', s.desc]]) {
    if (!v) continue
    out.push(`UPDATE i SET ${col} = ${sql(v)}
FROM dbo.PageI18n i JOIN dbo.Page p ON p.Id = i.PageId
WHERE p.PageKey = ${sql(key)} AND i.Lang = 'zh'
  AND (i.${col} IS NULL OR i.${col} = N'' OR i.${col} = (SELECT e.${col} FROM dbo.PageI18n e WHERE e.PageId = i.PageId AND e.Lang = 'en'));`)
  }
}

out.push('\n/* ── 方案頁 SEO 標題與導言 ── */')
for (const [code, s] of Object.entries(solutions)) {
  const where = `WHERE SolutionId = (SELECT Id FROM dbo.Solution WHERE Code = ${sql(code)}) AND Lang = 'zh'`
  out.push(`UPDATE dbo.SolutionI18n SET SeoTitle = ${sql(s.title)}
${where}
  AND (SeoTitle IS NULL OR SeoTitle = N'' OR SeoTitle IN (${s.titleDefaults.map(sql).join(', ')}));
UPDATE dbo.SolutionI18n SET IntroHtml = ${sql(s.intro)}
${where}
  AND (IntroHtml IS NULL OR IntroHtml = N'' OR IntroHtml = ${sql(s.introDefault)});`)
}

out.push('\n/* ── 方案品項 ── */')
for (const it of solutionItems) {
  out.push(`UPDATE z SET Name = ${sql(it.name)}, Description = ${sql(it.desc)}
FROM dbo.SolutionItemI18n z
JOIN dbo.SolutionItemI18n e ON e.SolutionItemId = z.SolutionItemId AND e.Lang = 'en'
JOIN dbo.SolutionItem si ON si.Id = z.SolutionItemId AND si.IsDeleted = 0
WHERE z.Lang = 'zh' AND e.Name = ${sql(it.en)} AND z.Name = ${sql(it.old)};`)
}

out.push('\n/* ── 認證說明 ── */')
for (const [id, desc] of Object.entries(certDescriptions)) {
  out.push(`UPDATE dbo.CertificationI18n SET Description = ${sql(desc)}
WHERE CertificationId = ${id} AND Lang = 'zh' AND (Description IS NULL OR Description = N'');`)
}

out.push('\n/* ── FAQ 草稿補中文 ── */')
for (const f of faqs) {
  out.push(`INSERT dbo.FaqI18n (FaqId, Lang, Question, AnswerHtml)
SELECT i.FaqId, 'zh', ${sql(f.q)}, ${f.a ? sql(`<p>${f.a}</p>`) : "N''"}
FROM dbo.FaqI18n i JOIN dbo.Faq f ON f.Id = i.FaqId
WHERE f.IsDeleted = 0 AND i.Lang = 'en' AND i.Question = ${sql(f.en)}
  AND NOT EXISTS (SELECT 1 FROM dbo.FaqI18n z WHERE z.FaqId = i.FaqId AND z.Lang = 'zh');`)
}

out.push(`
COMMIT;
GO
`)

writeFileSync(outFile, out.join('\n'))
console.error(`250_content_zh_sep30.sql：頁面文字 ${texts.length} 段、SEO ${Object.keys(pageSeo).length} 頁、方案 4 頁＋品項 ${solutionItems.length} 筆、認證 ${Object.keys(certDescriptions).length} 筆、FAQ ${faqs.length} 題`)
