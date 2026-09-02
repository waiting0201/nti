import type { Unit } from '@/lib/types'

/** docs/09-cms-admin.md §3 的權威提示文字，逐字引用（** ** 為粗體標記，渲染成 <strong>） */
export const HINT = {
  bannerDesktop: '建議 **2400×900px**（16:6）｜JPG／WebP｜≤500KB',
  bannerMobile: '建議 **1080×1350px**（4:5）｜JPG／WebP｜≤300KB｜未上傳則沿用桌機圖',
  homeGallery: '建議 **2400×1000px**（12:5）｜JPG／WebP｜≤500KB',
  solutionCover:
    '建議 **1160×940px**（約 5:4）｜JPG／WebP｜≤300KB｜同時用於首頁 Printing Solutions 卡片',
  solutionItem: '建議 **1280×960px**（4:3）｜JPG／WebP｜≤300KB',
  projectImage: '建議 **1160×940px**（約 5:4）｜JPG／WebP｜≤300KB',
  newsCover: '建議 **1800×1200px**（3:2）｜JPG／WebP｜≤400KB',
  newsInline: '建議寬度 **1800px**（3:2 最佳）｜JPG／WebP｜≤400KB',
  certLogo: '建議 **600×600px 去背 PNG 或 SVG**｜主體置中滿版、四周留白請先裁掉｜≤100KB',
  clientLogo: '建議 **短邊 ≥300px 去背 PNG 或 SVG**｜≤100KB',
  facilityPhoto: '建議 **1200×1200px**（1:1）｜JPG／WebP｜≤300KB',
  vlogThumb: '建議 **1280×720px**（16:9）｜未上傳將自動取 YouTube 官方縮圖',
  ogImage: '建議 **1200×630px**（1.91:1）｜JPG／PNG｜≤300KB｜未上傳則沿用封面圖',
  noticeAttachment: 'PDF｜≤20MB',
  supplierDownload: 'PDF／XLSX／DOCX／ZIP｜≤20MB｜檔案類型與大小由系統自動帶入前台',
} as const

/** 每個圖片欄位必附的中英 Alt（docs §3 共通規則） */
const alt = (key: string, label = '圖片替代文字 Alt') =>
  ({ key, label, type: 'text', i18n: true, required: true, side: 'locale' }) as const

const statusColumns = [
  { key: 'status', label: '狀態', render: 'status' as const, width: '110px' },
  { key: 'i18n', label: '中/英', render: 'i18n' as const, width: '90px' },
]

export const homeBanner: Unit = {
  code: 'home-banner',
  no: '01',
  title: '首頁 Banner',
  group: '首頁',
  phase: 'P4',
  frontend: 'index.html #hero 輪播',
  note: '新增／編輯／拖曳排序／上下架／刪除。建議 3–5 張。',
  sortable: true,
  hasStatus: true,
  countHint: { max: 6, message: '目前超過 6 張，輪播過長會拖慢首頁載入，建議保持 3–5 張。' },
  fields: [
    { key: 'imageDesktop', label: '桌機圖', type: 'image', required: true, hint: HINT.bannerDesktop, altKey: 'alt', side: 'neutral' },
    { key: 'imageMobile', label: '手機圖', type: 'image', hint: HINT.bannerMobile, altKey: 'alt', side: 'neutral' },
    alt('alt'),
    { key: 'linkUrl', label: '連結網址', type: 'url', side: 'neutral', placeholder: '/solutions 或 https://…', hint: '站內相對路徑或完整外部 URL' },
    { key: 'newWindow', label: '另開視窗', type: 'switch', side: 'neutral' },
  ],
  columns: [
    { key: 'imageDesktop', label: '桌機圖', render: 'thumb', width: '120px' },
    { key: 'alt', label: '替代文字' },
    { key: 'linkUrl', label: '連結' },
    ...statusColumns,
  ],
}

export const solution: Unit = {
  code: 'solution',
  no: '02',
  title: '解決方案 Solutions',
  group: '內容',
  phase: 'P4',
  frontend: 'solutions.html 列表、四個方案頁、首頁 Printing Solutions 四張卡',
  note: '固定 4 筆，不可新增／刪除（新增方案屬改版範圍）。品項卡為子清單，可自由增刪。',
  fixedRows: true,
  sortable: true,
  hasStatus: true,
  hasSeo: true,
  fields: [
    { key: 'code', label: '代號 Code', type: 'readonly', side: 'neutral', hint: 'boxes／cardboard／uv／other' },
    { key: 'cover', label: '方案封面', type: 'image', required: true, hint: HINT.solutionCover, altKey: 'coverAlt', side: 'neutral' },
    alt('coverAlt', '封面替代文字 Alt'),
    { key: 'name', label: '方案名稱', type: 'text', i18n: true, required: true, side: 'locale', hint: '選單與卡片標題' },
    { key: 'h1', label: '頁面標題 H1', type: 'text', i18n: true, required: true, side: 'locale' },
    { key: 'summary', label: '短述', type: 'textarea', i18n: true, max: 300, side: 'locale', hint: '首頁／列表卡片用' },
    { key: 'intro', label: '方案導言', type: 'richtext', i18n: true, side: 'locale', hint: '方案頁開頭段落' },
  ],
  columns: [
    { key: 'cover', label: '封面', render: 'thumb', width: '120px' },
    { key: 'code', label: '代號', width: '110px' },
    { key: 'name', label: '方案名稱' },
    ...statusColumns,
  ],
  child: {
    title: '品項卡',
    fields: [
      { key: 'image', label: '品項圖', type: 'image', required: true, hint: HINT.solutionItem, altKey: 'alt', side: 'neutral' },
      alt('alt'),
      { key: 'name', label: '名稱', type: 'text', i18n: true, required: true, side: 'locale' },
      { key: 'description', label: '說明', type: 'textarea', i18n: true, max: 400, side: 'locale' },
    ],
    columns: [
      { key: 'image', label: '品項圖', render: 'thumb', width: '110px' },
      { key: 'name', label: '名稱' },
      { key: 'status', label: '狀態', render: 'status', width: '110px' },
    ],
  },
}

export const project: Unit = {
  code: 'project',
  no: '03',
  title: '案例實績 Projects',
  group: '內容',
  phase: 'P4',
  frontend: 'projects.html #cases 卡片（可依分類篩選）',
  sortable: true,
  hasStatus: true,
  fields: [
    { key: 'categoryId', label: '分類', type: 'select', required: true, categoryType: 'Project', side: 'neutral' },
    { key: 'image', label: '案例圖', type: 'image', required: true, hint: HINT.projectImage, altKey: 'alt', side: 'neutral' },
    alt('alt'),
    { key: 'title', label: '標題', type: 'text', i18n: true, required: true, side: 'locale' },
    { key: 'description', label: '說明', type: 'textarea', i18n: true, max: 400, side: 'locale' },
    { key: 'videoUrl', label: '影片連結', type: 'url', side: 'neutral', hint: '有值才顯示播放圖示' },
    { key: 'statValue', label: '數據值', type: 'text', side: 'neutral', placeholder: '-32%', hint: '與「數據說明」需同時填或同時空' },
    { key: 'statLabel', label: '數據說明', type: 'text', i18n: true, side: 'locale', placeholder: 'carbon / unit' },
  ],
  columns: [
    { key: 'image', label: '案例圖', render: 'thumb', width: '120px' },
    { key: 'title', label: '標題' },
    { key: 'categoryId', label: '分類', render: 'category', width: '130px' },
    ...statusColumns,
  ],
}

export const news: Unit = {
  code: 'news',
  no: '04',
  title: '最新消息 News',
  group: '內容',
  phase: 'P4',
  frontend: 'news.html 列表 + 詳細頁；insights.html 精選',
  hasStatus: true,
  hasSeo: true,
  fields: [
    { key: 'categoryId', label: '分類', type: 'select', required: true, categoryType: 'News', side: 'neutral' },
    { key: 'publishDate', label: '發佈日期', type: 'date', required: true, side: 'neutral', hint: '前台顯示用（2026.03.13）' },
    { key: 'cover', label: '封面圖', type: 'image', required: true, hint: HINT.newsCover, altKey: 'coverAlt', side: 'neutral' },
    alt('coverAlt', '封面替代文字 Alt'),
    { key: 'title', label: '標題', type: 'text', i18n: true, required: true, max: 250, side: 'locale', hint: '同時作為 H1' },
    { key: 'summary', label: '摘要', type: 'textarea', i18n: true, required: true, max: 500, side: 'locale', hint: '列表卡片 + 詳細頁導言' },
    { key: 'body', label: '內文', type: 'richtext', i18n: true, required: true, side: 'locale', hint: `內文插圖${HINT.newsInline}` },
    { key: 'featured', label: '上首頁／精選', type: 'switch', side: 'neutral' },
    // OG 分享圖由 SEO 欄位組提供（docs §5.6），不在此重複定義
  ],
  columns: [
    { key: 'cover', label: '縮圖', render: 'thumb', width: '110px' },
    { key: 'title', label: '標題' },
    { key: 'categoryId', label: '分類', render: 'category', width: '130px' },
    { key: 'publishDate', label: '發佈日', render: 'date', width: '110px' },
    ...statusColumns,
  ],
}

export const vlog: Unit = {
  code: 'vlog',
  no: '05',
  title: 'Green Vlog',
  group: '內容',
  phase: 'P4',
  frontend: 'green-vlog.html',
  sortable: true,
  hasStatus: true,
  fields: [
    { key: 'youtubeId', label: 'YouTube 影片 ID／網址', type: 'youtube', required: true, side: 'neutral', hint: '貼完整網址系統自動抽出 ID，並即時顯示縮圖預覽' },
    { key: 'categoryId', label: '分類', type: 'select', required: true, categoryType: 'Vlog', side: 'neutral' },
    { key: 'thumbOverride', label: '縮圖覆蓋', type: 'image', hint: HINT.vlogThumb, altKey: 'thumbAlt', side: 'neutral' },
    alt('thumbAlt', '縮圖替代文字 Alt'),
    { key: 'title', label: '標題', type: 'text', i18n: true, required: true, side: 'locale' },
    { key: 'description', label: '說明', type: 'textarea', i18n: true, side: 'locale' },
    { key: 'isHero', label: '設為頁面主打影片', type: 'switch', side: 'neutral', hint: '全站僅一支；開啟新的會自動關閉舊的' },
  ],
  columns: [
    { key: 'youtubeId', label: '影片', render: 'thumb', width: '120px' },
    { key: 'title', label: '標題' },
    { key: 'isHero', label: '主打', render: 'bool', width: '80px' },
    ...statusColumns,
  ],
}

export const faq: Unit = {
  code: 'faq',
  no: '06',
  title: 'FAQ',
  group: '內容',
  phase: 'P4',
  frontend: 'faq.html（同時輸出 FAQPage JSON-LD）',
  note: '答案富文本請避免使用表格 —— 前台需把問答解析成 FAQPage 結構化資料。',
  sortable: true,
  hasStatus: true,
  fields: [
    { key: 'categoryId', label: '分類', type: 'select', categoryType: 'Faq', side: 'neutral' },
    { key: 'question', label: '問題', type: 'text', i18n: true, required: true, max: 300, side: 'locale' },
    { key: 'answer', label: '答案', type: 'richtext', i18n: true, required: true, side: 'locale' },
  ],
  columns: [
    { key: 'question', label: '問題' },
    { key: 'categoryId', label: '分類', render: 'category', width: '150px' },
    ...statusColumns,
  ],
}

export const trend: Unit = {
  code: 'trend',
  no: '07',
  title: '產業趨勢 Industry Trends',
  group: '內容',
  phase: 'P4',
  frontend: 'industry-trends.html 的段落區塊',
  sortable: true,
  hasStatus: true,
  fields: [
    { key: 'title', label: '標題', type: 'text', i18n: true, required: true, max: 200, side: 'locale' },
    { key: 'body', label: '內文', type: 'richtext', i18n: true, required: true, side: 'locale' },
  ],
  columns: [{ key: 'title', label: '標題' }, ...statusColumns],
}

export const certification: Unit = {
  code: 'certification',
  no: '08',
  title: '認證・夥伴・獎項',
  group: '內容',
  phase: 'P4',
  frontend: '首頁 Proof 認證牆、about-certifications、differences、green-esg',
  note: '現有 logo 素材解析度偏低，上線前需向客戶索取向量原檔（見 IA §6）。',
  sortable: true,
  hasStatus: true,
  countHint: { min: 12, max: 16, message: '首頁 Proof 牆建議 12–16 枚，目前數量超出建議範圍。' },
  fields: [
    { key: 'categoryId', label: '分組', type: 'select', required: true, categoryType: 'Certification', side: 'neutral' },
    { key: 'logo', label: 'Logo', type: 'image', required: true, hint: HINT.certLogo, altKey: 'alt', side: 'neutral' },
    alt('alt', 'Logo 替代文字 Alt'),
    { key: 'name', label: '名稱', type: 'text', i18n: true, required: true, side: 'locale' },
    { key: 'description', label: '說明', type: 'textarea', i18n: true, side: 'locale' },
    { key: 'linkUrl', label: '連結網址', type: 'url', side: 'neutral' },
    { key: 'showOnHome', label: '顯示於首頁 Proof 牆', type: 'switch', side: 'neutral', hint: '預設開' },
  ],
  columns: [
    { key: 'logo', label: 'Logo', render: 'thumb', width: '110px' },
    { key: 'name', label: '名稱' },
    { key: 'categoryId', label: '分組', render: 'category', width: '130px' },
    { key: 'showOnHome', label: '首頁', render: 'bool', width: '70px' },
    ...statusColumns,
  ],
}

export const client: Unit = {
  code: 'client',
  no: '09',
  title: '客戶 Logo',
  group: '內容',
  phase: 'P4',
  frontend: '首頁 Our Clients 輪播',
  note: '名稱同時作為 alt（品牌名不翻譯）。前台為輪播，建議 ≥6 筆。',
  sortable: true,
  hasStatus: true,
  countHint: { min: 6, message: '客戶輪播建議至少 6 筆，數量太少輪播會顯得空。' },
  fields: [
    { key: 'name', label: '名稱', type: 'text', required: true, side: 'neutral', hint: '同時作為圖片 alt，品牌名不翻譯' },
    { key: 'logo', label: 'Logo', type: 'image', required: true, hint: HINT.clientLogo, side: 'neutral' },
    { key: 'linkUrl', label: '連結', type: 'url', side: 'neutral' },
  ],
  columns: [
    { key: 'logo', label: 'Logo', render: 'thumb', width: '110px' },
    { key: 'name', label: '名稱' },
    { key: 'status', label: '狀態', render: 'status', width: '110px' },
  ],
}

export const facility: Unit = {
  code: 'facility',
  no: '10',
  title: '設備與廠房',
  group: '內容',
  phase: 'P4',
  frontend: 'facility-pre-press／-eco-printing／-post-press／-quality／-tour 五個子頁的設備卡',
  note: '五個子頁的導言與流程敘述文字為固定文案（docs §7），後台只管設備卡。',
  sortable: true,
  hasStatus: true,
  fields: [
    { key: 'categoryId', label: '所屬子頁', type: 'select', required: true, categoryType: 'Facility', side: 'neutral' },
    { key: 'image', label: '設備照', type: 'image', required: true, hint: HINT.facilityPhoto, altKey: 'alt', side: 'neutral' },
    alt('alt', '設備照替代文字 Alt'),
    { key: 'name', label: '設備名稱', type: 'text', i18n: true, required: true, side: 'locale' },
    { key: 'description', label: '說明', type: 'textarea', i18n: true, max: 600, side: 'locale' },
  ],
  columns: [
    { key: 'image', label: '設備照', render: 'thumb', width: '110px' },
    { key: 'name', label: '設備名稱' },
    { key: 'categoryId', label: '所屬子頁', render: 'category', width: '150px' },
    ...statusColumns,
  ],
}

export const job: Unit = {
  code: 'job',
  no: '11',
  title: '職缺 Careers',
  group: '內容',
  phase: 'P4',
  frontend: 'careers.html 職缺清單',
  note: 'careers.html 的「Why NTI」六條福利為固定文案（docs §7）。',
  sortable: true,
  hasStatus: true,
  fields: [
    { key: 'title', label: '職稱', type: 'text', i18n: true, required: true, max: 160, side: 'locale' },
    { key: 'location', label: '地點', type: 'text', i18n: true, side: 'locale' },
    { key: 'body', label: '說明', type: 'richtext', i18n: true, required: true, side: 'locale' },
  ],
  columns: [
    { key: 'title', label: '職稱' },
    { key: 'location', label: '地點', width: '160px' },
    ...statusColumns,
  ],
}
