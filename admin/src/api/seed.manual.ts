import type { Row } from './types'

/**
 * mockup 與 db/seed 裡沒有對應內容的單元，用示意資料開場。
 * 供應商下載檔、301 轉址、報價／聯絡／會員／訂單（P6，前台表單尚未接 API）、
 * 管理員、操作紀錄、信件紀錄、網站設定。
 */

const bi = (zh: Record<string, string>, en: Record<string, string>) => ({ zh, en })

export const MANUAL_SEED: Record<string, Row[]> = {
  'supplier-download': [
    {
      id: '1', sortOrder: 10, isPublished: true,
      file: '/files/supplier-handbook-2026.pdf', fileMeta: 'PDF｜2.4 MB',
      requireLogin: false, downloadCount: 148,
      i18n: bi({ displayName: '供應商作業手冊 2026（中文）' }, { displayName: 'Supplier Handbook 2026 (EN)' }),
    },
    {
      id: '2', sortOrder: 20, isPublished: true,
      file: '/files/board-spec-2026.xlsx', fileMeta: 'XLSX｜318 KB',
      requireLogin: false, downloadCount: 92,
      i18n: bi({ displayName: '紙板規格對照表' }, { displayName: 'Board Specification Sheet' }),
    },
    {
      id: '3', sortOrder: 30, isPublished: true,
      file: '/files/esg-data-template.xlsx', fileMeta: 'XLSX｜204 KB',
      requireLogin: true, downloadCount: 37,
      i18n: bi({ displayName: 'ESG 數據申報範本' }, { displayName: 'ESG Data Reporting Template' }),
    },
    {
      id: '4', sortOrder: 40, isPublished: false,
      file: '/files/coa-format.docx', fileMeta: 'DOCX｜96 KB',
      requireLogin: false, downloadCount: 0,
      i18n: bi({ displayName: '批次 COA 格式說明' }, { displayName: 'Batch COA Format Guide' }),
    },
  ],

  redirect: [
    { id: '1', fromPath: '/about.html', toPath: '/zh/about/difference', statusCode: '301', isEnabled: true, hitCount: 412 },
    { id: '2', fromPath: '/products.html', toPath: '/zh/solutions', statusCode: '301', isEnabled: true, hitCount: 1268 },
    { id: '3', fromPath: '/news/index.html', toPath: '/zh/insights/news', statusCode: '301', isEnabled: true, hitCount: 733 },
    { id: '4', fromPath: '/green.html', toPath: '/zh/sustainability', statusCode: '301', isEnabled: true, hitCount: 205 },
    { id: '5', fromPath: '/contact-us.html', toPath: '/zh/contact', statusCode: '301', isEnabled: true, hitCount: 96 },
    { id: '6', fromPath: '/old-quote', toPath: '/zh/get-a-quote', statusCode: '302', isEnabled: false, hitCount: 0 },
  ],

  quote: [
    {
      id: '1', quoteNo: 'Q-2026-0143', company: '合翊食品股份有限公司', contactName: '林佩璇',
      email: 'peihsuan.lin@heyi-foods.com.tw', phone: '06-2531234', productType: '彩盒包裝',
      industry: '食品飲料', quantity: '20,000', size: '180 × 90 × 240 mm', material: 'FSC 白卡 350g',
      expectedDate: '2026-10-15', sustainableAdvice: true,
      message: '外銷日本的餅乾禮盒，需要食品接觸合規文件與碳足跡數字。',
      attachments: ['dieline-v3.pdf', 'artwork.ai'],
      status: 'New', assignee: '', internalNote: '', replied: false, submittedAt: '2026-09-01T09:12:00Z',
    },
    {
      id: '2', quoteNo: 'Q-2026-0142', company: 'Northwind Cosmetics', contactName: 'Erin Vasquez',
      email: 'erin@northwind-cosmetics.com', phone: '+1 503 555 0142', productType: 'UV 印刷',
      industry: '美妝保養', quantity: '8,000', size: '120 × 120 × 60 mm', material: '銀卡紙',
      expectedDate: '2026-11-01', sustainableAdvice: true,
      message: 'Looking for a recyclable alternative to our current laminated carton.',
      attachments: ['brand-guide.pdf'],
      status: 'InProgress', assignee: '王思婷', internalNote: '已請廠務評估無膜方案。', replied: true, submittedAt: '2026-08-29T02:44:00Z',
    },
    {
      id: '3', quoteNo: 'Q-2026-0141', company: '曜盛電子', contactName: '陳柏勳',
      email: 'bhchen@yaosheng.com.tw', phone: '03-5678901', productType: '包裝紙板',
      industry: '電子科技', quantity: '50,000', size: '客製', material: '再生卡紙',
      expectedDate: '2026-09-30', sustainableAdvice: false,
      message: '吊卡背板，需通過 RoHS。', attachments: [],
      status: 'Quoted', assignee: '王思婷', internalNote: '報價單已寄出，等客戶回覆。', replied: true, submittedAt: '2026-08-26T07:05:00Z',
    },
    {
      id: '4', quoteNo: 'Q-2026-0140', company: '禾光生技', contactName: '黃于庭',
      email: 'yuting.huang@hokuang-bio.com', phone: '04-23456789', productType: '彩盒包裝',
      industry: '醫藥保健', quantity: '15,000', size: '70 × 70 × 130 mm', material: 'FSC 白卡 300g',
      expectedDate: '2026-12-01', sustainableAdvice: true,
      message: '保健食品外盒，需要 GMP 相關檢驗紀錄。', attachments: ['spec.pdf'],
      status: 'Closed', assignee: '李昀', internalNote: '已成案，轉訂單 SO-2026-0088。', replied: true, submittedAt: '2026-08-18T11:30:00Z',
    },
    {
      id: '5', quoteNo: 'Q-2026-0139', company: '—', contactName: 'seo-backlink',
      email: 'noreply@spam-domain.xyz', phone: '', productType: '其他印刷',
      industry: '', quantity: '', size: '', material: '', expectedDate: '', sustainableAdvice: false,
      message: 'Buy cheap backlinks now!!!', attachments: [],
      status: 'Spam', assignee: '', internalNote: '', replied: false, submittedAt: '2026-08-15T22:10:00Z',
    },
    {
      id: '6', quoteNo: 'Q-2026-0138', company: '春禾文創', contactName: '鄭雅文',
      email: 'yawen@chunho-culture.tw', phone: '02-27001234', productType: '其他印刷',
      industry: '禮品文創', quantity: '3,000', size: 'A5', material: '再生紙',
      expectedDate: '2026-10-05', sustainableAdvice: true,
      message: '文創桌曆，希望用低碳油墨。', attachments: ['calendar-layout.pdf'],
      status: 'New', assignee: '', internalNote: '', replied: false, submittedAt: '2026-09-01T14:20:00Z',
    },
  ],

  contact: [
    { id: '1', name: '吳孟哲', email: 'mengche.wu@example.com.tw', company: '晶宇包材', phone: '07-3456789', message: '想詢問供應商合作流程與稽核要求。', status: 'New', assignee: '', internalNote: '', submittedAt: '2026-09-02T01:15:00Z' },
    { id: '2', name: 'Sofia Marchetti', email: 'sofia.m@verdepack.it', company: 'VerdePack SRL', phone: '+39 02 5555 0198', message: 'Interested in your FSC certified cartons for the EU market.', status: 'Replied', assignee: '王思婷', internalNote: '已回覆並附上認證清單。', submittedAt: '2026-08-30T08:02:00Z' },
    { id: '3', name: '張筱涵', email: 'hsiaohan.chang@example.com', company: '', phone: '', message: '請問有沒有開放參觀工廠？', status: 'Replied', assignee: '李昀', internalNote: '已安排 9/20 導覽。', submittedAt: '2026-08-28T05:41:00Z' },
    { id: '4', name: '林大為', email: 'dawei.lin@example.com', company: '大為設計', phone: '02-87654321', message: '想合作結構設計，可否提供刀模檔規範？', status: 'Closed', assignee: '李昀', internalNote: '已寄出規範文件。', submittedAt: '2026-08-20T03:30:00Z' },
    { id: '5', name: 'promo bot', email: 'bot@spam.example', company: '', phone: '', message: 'CHEAP SEO SERVICE', status: 'Spam', assignee: '', internalNote: '', submittedAt: '2026-08-19T18:00:00Z' },
    { id: '6', name: '許哲瑋', email: 'chewei.hsu@example.com.tw', company: '瑋昇實業', phone: '05-2233445', message: '詢問 UV 印刷的最小起訂量。', status: 'New', assignee: '', internalNote: '', submittedAt: '2026-09-01T23:48:00Z' },
  ],

  member: [
    { id: '1', email: 'peihsuan.lin@heyi-foods.com.tw', name: '林佩璇', company: '合翊食品', isActive: true, registeredAt: '2026-05-11', lastLoginAt: '2026-09-01', internalNote: '' },
    { id: '2', email: 'erin@northwind-cosmetics.com', name: 'Erin Vasquez', company: 'Northwind Cosmetics', isActive: true, registeredAt: '2026-06-02', lastLoginAt: '2026-08-29', internalNote: '' },
    { id: '3', email: 'bhchen@yaosheng.com.tw', name: '陳柏勳', company: '曜盛電子', isActive: true, registeredAt: '2026-06-28', lastLoginAt: '2026-08-26', internalNote: '' },
    { id: '4', email: 'yuting.huang@hokuang-bio.com', name: '黃于庭', company: '禾光生技', isActive: true, registeredAt: '2026-07-14', lastLoginAt: '2026-08-18', internalNote: '' },
    { id: '5', email: 'old.account@example.com', name: '停用測試帳號', company: '', isActive: false, registeredAt: '2026-04-02', lastLoginAt: '2026-04-03', internalNote: '客戶要求停用。' },
  ],

  order: [
    { id: '1', orderNo: 'SO-2026-0088', memberEmail: 'yuting.huang@hokuang-bio.com', quoteNo: 'Q-2026-0140', productName: '保健食品外盒 15,000 只', status: 'Producing', etaDate: '2026-11-20' },
    { id: '2', orderNo: 'SO-2026-0087', memberEmail: 'bhchen@yaosheng.com.tw', quoteNo: 'Q-2026-0141', productName: '吊卡背板 50,000 張', status: 'Pending', etaDate: '2026-10-08' },
    { id: '3', orderNo: 'SO-2026-0086', memberEmail: 'peihsuan.lin@heyi-foods.com.tw', quoteNo: 'Q-2026-0128', productName: '外銷餅乾禮盒 12,000 只', status: 'Shipped', etaDate: '2026-08-22' },
    { id: '4', orderNo: 'SO-2026-0085', memberEmail: 'erin@northwind-cosmetics.com', quoteNo: 'Q-2026-0119', productName: 'Recyclable carton 6,000 pcs', status: 'Closed', etaDate: '2026-07-30' },
  ],

  adminUser: [
    { id: '1', email: 'tim@nti-printing.com', displayName: 'Tim（系統管理）', role: 'SuperAdmin', isActive: true, lastLoginAt: '2026-09-02T00:41:00Z' },
    { id: '2', email: 'sinting.wang@nti-printing.com', displayName: '王思婷', role: 'Editor', isActive: true, lastLoginAt: '2026-09-01T06:20:00Z' },
    { id: '3', email: 'yun.li@nti-printing.com', displayName: '李昀', role: 'Viewer', isActive: true, lastLoginAt: '2026-08-30T09:05:00Z' },
  ],
}

/** 生產進度：階段 × 狀態（docs §20） */
export const ORDER_PROGRESS: Record<string, Array<{ stage: string; state: string; at: string; note: string }>> = {
  '1': [
    { stage: '設計', state: '完成', at: '2026-08-20', note: '刀模與版面確認' },
    { stage: '印前', state: '完成', at: '2026-08-26', note: 'CTP 出版、數位打樣通過' },
    { stage: '印刷', state: '進行中', at: '2026-09-01', note: 'CD-102 排程中' },
    { stage: '印後', state: '未開始', at: '', note: '' },
    { stage: '品檢', state: '未開始', at: '', note: '' },
    { stage: '出貨', state: '未開始', at: '', note: '' },
  ],
  '3': [
    { stage: '設計', state: '完成', at: '2026-07-02', note: '' },
    { stage: '印前', state: '完成', at: '2026-07-10', note: '' },
    { stage: '印刷', state: '完成', at: '2026-07-24', note: '' },
    { stage: '印後', state: '完成', at: '2026-08-05', note: '貼窗、糊盒' },
    { stage: '品檢', state: '完成', at: '2026-08-15', note: '條碼等級 A' },
    { stage: '出貨', state: '完成', at: '2026-08-22', note: '已交高雄港' },
  ],
}

/** 網站設定：依 SiteSetting 的固定 key 清單分四組（docs §21） */
export type SettingField = {
  key: string
  label: string
  type: 'text' | 'textarea' | 'email-list' | 'image' | 'url' | 'embed'
  i18n?: boolean
  hint?: string
  altKey?: string
}

export const SETTING_GROUPS: Array<{ title: string; fields: SettingField[] }> = [
  {
    title: '公司資訊',
    fields: [
      { key: 'company.name', label: '公司名稱', type: 'text', i18n: true },
      { key: 'company.address', label: '地址', type: 'textarea', i18n: true },
      { key: 'company.hours', label: '營業時間', type: 'text', i18n: true },
      { key: 'company.phone', label: '電話', type: 'text' },
      { key: 'company.fax', label: '傳真', type: 'text' },
      { key: 'company.email', label: 'Email', type: 'text' },
      { key: 'company.map', label: 'Google Map 嵌入碼', type: 'embed', hint: '貼 Google 地圖的 iframe 內嵌碼' },
    ],
  },
  {
    title: '社群',
    fields: [
      { key: 'social.facebook', label: 'Facebook 網址', type: 'url', hint: '留空則前台不顯示該圖示' },
      { key: 'social.linkedin', label: 'LinkedIn 網址', type: 'url', hint: '留空則前台不顯示該圖示' },
      { key: 'social.youtube', label: 'YouTube 網址', type: 'url', hint: '留空則前台不顯示該圖示' },
    ],
  },
  {
    title: '首頁',
    fields: [
      { key: 'home.gallery', label: '首頁形象圖帶', type: 'image', altKey: 'home.galleryAlt', hint: '建議 **2400×1000px**（12:5）｜JPG／WebP｜≤500KB' },
      { key: 'home.galleryAlt', label: '形象圖帶替代文字 Alt', type: 'text', i18n: true },
    ],
  },
  {
    title: '信件',
    fields: [
      { key: 'mail.quoteTo', label: '報價通知收件者', type: 'email-list', hint: '多組請用逗號分隔' },
      { key: 'mail.contactTo', label: '聯絡通知收件者', type: 'email-list', hint: '多組請用逗號分隔' },
      { key: 'mail.bcc', label: '密件副本', type: 'email-list', hint: '多組請用逗號分隔' },
    ],
  },
]

export const SETTING_VALUES: Record<string, string | { zh: string; en: string }> = {
  'company.name': { zh: '南台灣印刷股份有限公司', en: 'NTI Printing Co., Ltd.' },
  'company.address': {
    zh: '台中市西屯區東沙路一段 192 巷 56 弄 18 號（暫代地址，待換台南實際廠址）',
    en: 'No. 18, Aly. 56, Ln. 192, Sec. 1, Dongshan Rd., Beitun Dist., Taichung 406, Taiwan',
  },
  'company.hours': { zh: '週一至週五 08:30–17:30', en: 'Mon–Fri 08:30–17:30' },
  'company.phone': '+886-6-000-0000',
  'company.fax': '+886-6-000-0001',
  'company.email': 'service@nti-printing.com',
  'company.map': '<iframe src="https://www.google.com/maps?q=…&output=embed"></iframe>',
  'social.facebook': '',
  'social.linkedin': '',
  'social.youtube': '',
  'home.gallery': '/assets/ref-home-mid1.png',
  'home.galleryAlt': { zh: 'NTI 印刷廠區形象', en: 'NTI Printing plant' },
  'mail.quoteTo': 'sales@nti-printing.com',
  'mail.contactTo': 'service@nti-printing.com',
  'mail.bcc': '',
}

/** 操作紀錄（docs §24） */
export const AUDIT_LOG = [
  { id: '20', at: '2026-09-02T00:41:12Z', actor: 'Tim（系統管理）', action: '登入', target: '—', ip: '203.74.12.88', diff: '' },
  { id: '19', at: '2026-09-01T08:22:04Z', actor: '王思婷', action: '更新', target: 'news / NTI wins a 2026 Global Views ESG Award…', ip: '61.220.9.14', diff: 'zh.summary：（空）→「第 22 屆遠見 ESG…」' },
  { id: '18', at: '2026-09-01T08:10:47Z', actor: '王思婷', action: '上架', target: 'news / Green printing and digital innovation at NTI Tainan', ip: '61.220.9.14', diff: 'isPublished：false → true' },
  { id: '17', at: '2026-09-01T06:20:31Z', actor: '王思婷', action: '登入', target: '—', ip: '61.220.9.14', diff: '' },
  { id: '16', at: '2026-08-31T10:02:55Z', actor: 'Tim（系統管理）', action: '排序', target: 'home-banner', ip: '203.74.12.88', diff: 'sortOrder：3 筆重新排列' },
  { id: '15', at: '2026-08-31T09:58:13Z', actor: 'Tim（系統管理）', action: '新增', target: 'certification / CO₂ Neutral', ip: '203.74.12.88', diff: '' },
  { id: '14', at: '2026-08-30T09:05:02Z', actor: '李昀', action: '登入', target: '—', ip: '114.32.55.7', diff: '' },
  { id: '13', at: '2026-08-30T08:30:19Z', actor: '王思婷', action: '更新', target: 'contact / Sofia Marchetti', ip: '61.220.9.14', diff: 'status：New → Replied' },
  { id: '12', at: '2026-08-29T03:11:40Z', actor: '王思婷', action: '更新', target: 'quote / Q-2026-0142', ip: '61.220.9.14', diff: 'status：New → InProgress；assignee：（空）→ 王思婷' },
  { id: '11', at: '2026-08-28T07:44:26Z', actor: 'Tim（系統管理）', action: '刪除', target: 'project / 舊版電子包材案例', ip: '203.74.12.88', diff: 'isDeleted：false → true（軟刪）' },
]

export const EMAIL_LOG = [
  { id: '6', at: '2026-09-01T14:20:41Z', to: 'sales@nti-printing.com', subject: '新的報價需求 Q-2026-0138', status: '成功', error: '' },
  { id: '5', at: '2026-09-01T14:20:39Z', to: 'yawen@chunho-culture.tw', subject: '我們已收到您的報價需求', status: '成功', error: '' },
  { id: '4', at: '2026-09-01T09:12:22Z', to: 'sales@nti-printing.com', subject: '新的報價需求 Q-2026-0143', status: '成功', error: '' },
  { id: '3', at: '2026-08-30T08:02:11Z', to: 'service@nti-printing.com', subject: '新的聯絡訊息', status: '成功', error: '' },
  { id: '2', at: '2026-08-29T02:44:58Z', to: 'erin@northwind-cosmetics.com', subject: '我們已收到您的報價需求', status: '失敗', error: '550 5.1.1 recipient mailbox unavailable（對方信箱暫時無法收信）' },
  { id: '1', at: '2026-08-26T07:05:33Z', to: 'bhchen@yaosheng.com.tw', subject: '我們已收到您的報價需求', status: '成功', error: '' },
]
