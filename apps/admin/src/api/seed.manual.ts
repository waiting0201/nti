import type { Row } from './types'

/**
 * mockup 與 db/seed 裡沒有對應內容的單元，用示意資料開場。
 * 供應商下載檔、報價／聯絡（前台表單尚未接 API）、
 * 管理員、信件紀錄、網站設定。
 *
 * 301 轉址不在這裡：那份是真的對照表，由 build-seed.mjs 自
 * db/content/210_legacy_redirects.csv 產生。
 */

const bi = (zh: Record<string, string>, en: Record<string, string>) => ({ zh, en })

export const MANUAL_SEED: Record<string, Row[]> = {
  'supplier-download': [
    {
      id: '1', sortOrder: 10, isPublished: true,
      file: '/files/supplier-handbook-2026.pdf', fileMeta: 'PDF｜2.4 MB', downloadCount: 148,
      i18n: bi({ displayName: '供應商作業手冊 2026（中文）' }, { displayName: 'Supplier Handbook 2026 (EN)' }),
    },
    {
      id: '2', sortOrder: 20, isPublished: true,
      file: '/files/board-spec-2026.xlsx', fileMeta: 'XLSX｜318 KB', downloadCount: 92,
      i18n: bi({ displayName: '紙板規格對照表' }, { displayName: 'Board Specification Sheet' }),
    },
    {
      id: '3', sortOrder: 30, isPublished: true,
      file: '/files/esg-data-template.xlsx', fileMeta: 'XLSX｜204 KB', downloadCount: 37,
      i18n: bi({ displayName: 'ESG 數據申報範本' }, { displayName: 'ESG Data Reporting Template' }),
    },
    {
      id: '4', sortOrder: 40, isPublished: false,
      file: '/files/coa-format.docx', fileMeta: 'DOCX｜96 KB', downloadCount: 0,
      i18n: bi({ displayName: '批次 COA 格式說明' }, { displayName: 'Batch COA Format Guide' }),
    },
  ],

  /*
   * 標籤主檔。權威來源是 EF 的 Migration 種子（Api/Data/Seed/SeedData.cs 的 Tags），
   * 這裡是同一份的 mock 副本——接上 API 之後就走真資料。
   * usageCount 在真 API 是後端算的，mock 這裡是寫死的示意值。
   */
  tag: [
    { id: '1', slug: 'green-printing', sortOrder: 10, isActive: true, usageCount: 4,
      i18n: bi({ name: '綠色印刷' }, { name: 'Green Printing' }) },
    { id: '2', slug: 'low-carbon', sortOrder: 20, isActive: true, usageCount: 4,
      i18n: bi({ name: '低碳製程' }, { name: 'Low Carbon' }) },
    { id: '3', slug: 'carbon-footprint', sortOrder: 30, isActive: true, usageCount: 1,
      i18n: bi({ name: '碳足跡' }, { name: 'Carbon Footprint' }) },
    { id: '4', slug: 'esg', sortOrder: 40, isActive: true, usageCount: 3,
      i18n: bi({ name: 'ESG' }, { name: 'ESG' }) },
    { id: '5', slug: 'csr', sortOrder: 50, isActive: true, usageCount: 3,
      i18n: bi({ name: '企業社會責任' }, { name: 'Corporate Social Responsibility' }) },
    { id: '6', slug: 'green-building', sortOrder: 60, isActive: true, usageCount: 2,
      i18n: bi({ name: '綠建築' }, { name: 'Green Building' }) },
    { id: '7', slug: 'green-supply-chain', sortOrder: 70, isActive: true, usageCount: 1,
      i18n: bi({ name: '綠色供應鏈' }, { name: 'Green Supply Chain' }) },
    { id: '8', slug: 'sustainable-packaging', sortOrder: 80, isActive: true, usageCount: 3,
      i18n: bi({ name: '永續包裝' }, { name: 'Sustainable Packaging' }) },
    { id: '9', slug: 'packaging-design', sortOrder: 90, isActive: true, usageCount: 2,
      i18n: bi({ name: '包裝設計' }, { name: 'Packaging Design' }) },
    { id: '10', slug: 'digital-printing', sortOrder: 100, isActive: true, usageCount: 4,
      i18n: bi({ name: '數位印刷' }, { name: 'Digital Printing' }) },
    { id: '11', slug: 'variable-data-printing', sortOrder: 110, isActive: true, usageCount: 2,
      i18n: bi({ name: '可變資料印刷' }, { name: 'Variable Data Printing' }) },
    { id: '12', slug: 'paper-craft', sortOrder: 120, isActive: true, usageCount: 3,
      i18n: bi({ name: '紙藝與紙模型' }, { name: 'Paper Craft' }) },
    { id: '13', slug: 'conservation', sortOrder: 130, isActive: true, usageCount: 2,
      i18n: bi({ name: '生態保育' }, { name: 'Conservation' }) },
    { id: '14', slug: 'disaster-education', sortOrder: 140, isActive: true, usageCount: 1,
      i18n: bi({ name: '防災教育' }, { name: 'Disaster-Prevention Education' }) },
    { id: '15', slug: 'awards', sortOrder: 150, isActive: true, usageCount: 3,
      i18n: bi({ name: '獲獎與認證' }, { name: 'Awards & Recognition' }) },
    { id: '16', slug: 'media-coverage', sortOrder: 160, isActive: true, usageCount: 1,
      i18n: bi({ name: '媒體報導' }, { name: 'Media Coverage' }) },
    { id: '17', slug: 'partnership', sortOrder: 170, isActive: true, usageCount: 3,
      i18n: bi({ name: '產業合作' }, { name: 'Partnership' }) },
  ],

  quote: [
    {
      id: '1', quoteNo: 'Q-2026-0143', company: '合翊食品股份有限公司', contactName: '林佩璇',
      email: 'peihsuan.lin@heyi-foods.com.tw', phone: '06-2531234', productType: '彩盒包裝',
      industry: '食品飲料', quantity: '20,000', size: '180 × 90 × 240 mm', material: 'FSC 白卡 350g',
      expectedDate: '2026-10-15', sustainableAdvice: true,
      message: '外銷日本的餅乾禮盒，需要食品接觸合規文件與碳足跡數字。',
      attachments: [{ id: '1', name: 'dieline-v3.pdf', sizeBytes: 2_411_520 }, { id: '2', name: 'artwork.ai', sizeBytes: 8_912_896 }],
      status: 'New', assignee: '', internalNote: '', replied: false, submittedAt: '2026-09-01T09:12:00Z',
    },
    {
      id: '2', quoteNo: 'Q-2026-0142', company: 'Northwind Cosmetics', contactName: 'Erin Vasquez',
      email: 'erin@northwind-cosmetics.com', phone: '+1 503 555 0142', productType: 'UV 印刷',
      industry: '美妝保養', quantity: '8,000', size: '120 × 120 × 60 mm', material: '銀卡紙',
      expectedDate: '2026-11-01', sustainableAdvice: true,
      message: 'Looking for a recyclable alternative to our current laminated carton.',
      attachments: [{ id: '3', name: 'brand-guide.pdf', sizeBytes: 5_242_880 }],
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
      message: '保健食品外盒，需要 GMP 相關檢驗紀錄。',
      attachments: [{ id: '4', name: 'spec.pdf', sizeBytes: 731_136 }],
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
      message: '文創桌曆，希望用低碳油墨。',
      attachments: [{ id: '5', name: 'calendar-layout.pdf', sizeBytes: 1_887_436 }],
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

  adminUser: [
    { id: '1', username: 'tim', email: 'tim@nti-printing.com', displayName: 'Tim（系統管理）', role: 'SuperAdmin', isActive: true, lastLoginAt: '2026-09-02T00:41:00Z' },
    { id: '2', username: 'sinting.wang', email: 'sinting.wang@nti-printing.com', displayName: '王思婷', role: 'Editor', isActive: true, lastLoginAt: '2026-09-01T06:20:00Z' },
    // 帳號不限定 email 格式（2026-09-06）：這筆刻意不是信箱，也沒填通知信箱
    { id: '3', username: 'yun.li', displayName: '李昀', role: 'Viewer', isActive: true, lastLoginAt: '2026-08-30T09:05:00Z' },
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
      { key: 'company.map_embed', label: 'Google 地圖', type: 'embed', hint: '在 Google 地圖點「分享 → 嵌入地圖」，把複製到的內容貼進來' },
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
      { key: 'home.gallery_image', label: '首頁形象圖帶', type: 'image', altKey: 'home.gallery_alt', hint: '建議 **2400×1000px**（12:5）｜JPG／WebP｜≤500KB' },
      { key: 'home.gallery_alt', label: '形象圖帶替代文字', type: 'text', i18n: true },
    ],
  },
  {
    title: '信件',
    fields: [
      { key: 'mail.quote_notify_to', label: '報價通知收件者', type: 'email-list', hint: '多組請用逗號分隔' },
      { key: 'mail.contact_notify_to', label: '聯絡通知收件者', type: 'email-list', hint: '多組請用逗號分隔' },
      { key: 'mail.bcc', label: '密件副本', type: 'email-list', hint: '多組請用逗號分隔' },
    ],
  },
]

/**
 * 設定的**值**改由 scripts/build-seed.mjs 自 mockup 與前台中文字典產生
 * （`src/api/settings.generated.ts`），這裡只轉出去。
 *
 * 原本是手寫的，於是寫進了幾個沒有依據的值：公司中文名、一組 000-0001 的傳真、
 * 一個沒人用過的 sales@ 收件者、省略號的地圖嵌入碼。它們在 demo 上看起來像真的，
 * 客戶會照著驗收；而資料庫那 15 個 key 其實還是 NULL——兩邊都不對，方向還相反。
 */
export { SETTING_VALUES } from './settings.generated'

export const EMAIL_LOG = [
  { id: '6', at: '2026-09-01T14:20:41Z', to: 'service@nti-printing.com', subject: '新的報價需求 Q-2026-0138', status: '成功', error: '' },
  { id: '5', at: '2026-09-01T14:20:39Z', to: 'yawen@chunho-culture.tw', subject: '我們已收到您的報價需求', status: '成功', error: '' },
  { id: '4', at: '2026-09-01T09:12:22Z', to: 'service@nti-printing.com', subject: '新的報價需求 Q-2026-0143', status: '成功', error: '' },
  { id: '3', at: '2026-08-30T08:02:11Z', to: 'service@nti-printing.com', subject: '新的聯絡訊息', status: '成功', error: '' },
  { id: '2', at: '2026-08-29T02:44:58Z', to: 'erin@northwind-cosmetics.com', subject: '我們已收到您的報價需求', status: '失敗', error: '550 5.1.1 recipient mailbox unavailable（對方信箱暫時無法收信）' },
  { id: '1', at: '2026-08-26T07:05:33Z', to: 'bhchen@yaosheng.com.tw', subject: '我們已收到您的報價需求', status: '成功', error: '' },
]
