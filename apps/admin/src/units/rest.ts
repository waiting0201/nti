import type { Unit } from '@/lib/types'
import { HINT } from './content'

const statusColumns = [
  { key: 'status', label: '狀態', render: 'status' as const, width: '110px' },
  { key: 'i18n', label: '中/英', render: 'i18n' as const, width: '90px' },
]

/* ── 供應商 12–14 ───────────────────────────────────────── */

export const supplierNotice: Unit = {
  code: 'supplier-notice',
  no: '12',
  title: '供應商公告',
  group: '供應商',
  phase: 'P4',
  frontend: 'supplier-area.html 公告區',
  note: '清單依公告日期倒序。',
  hasStatus: true,
  fields: [
    { key: 'categoryId', label: '分類', type: 'select', required: true, categoryType: 'SupplierNotice', side: 'neutral' },
    { key: 'noticeDate', label: '公告日期', type: 'date', required: true, side: 'neutral' },
    { key: 'title', label: '標題', type: 'text', i18n: true, required: true, side: 'locale' },
    { key: 'body', label: '內文', type: 'richtext', i18n: true, required: true, side: 'locale' },
    { key: 'attachment', label: '公告附件', type: 'file', hint: HINT.noticeAttachment, side: 'neutral' },
  ],
  columns: [
    { key: 'noticeDate', label: '公告日', render: 'date', width: '110px' },
    { key: 'title', label: '標題' },
    { key: 'categoryId', label: '分類', render: 'category', width: '130px' },
    ...statusColumns,
  ],
}

export const supplierSpec: Unit = {
  code: 'supplier-spec',
  no: '13',
  title: '規格與要求',
  group: '供應商',
  phase: 'P4',
  frontend: 'supplier-area.html 規格區',
  sortable: true,
  hasStatus: true,
  fields: [
    { key: 'title', label: '標題', type: 'text', i18n: true, required: true, max: 160, side: 'locale' },
    { key: 'description', label: '說明', type: 'textarea', i18n: true, max: 600, side: 'locale' },
  ],
  columns: [{ key: 'title', label: '標題' }, ...statusColumns],
}

export const supplierDownload: Unit = {
  code: 'supplier-download',
  no: '14',
  title: '下載專區',
  group: '供應商',
  phase: 'P4',
  frontend: 'supplier-area.html 下載區',
  sortable: true,
  hasStatus: true,
  fields: [
    { key: 'file', label: '檔案', type: 'file', required: true, hint: HINT.supplierDownload, side: 'neutral' },
    { key: 'fileMeta', label: '檔案類型／大小', type: 'readonly', side: 'neutral', hint: '上傳時自動帶入，前台顯示 PDF｜2.4 MB' },
    { key: 'displayName', label: '顯示名稱', type: 'text', i18n: true, required: true, side: 'locale', placeholder: 'Supplier Handbook 2026 (EN)' },
    { key: 'requireLogin', label: '需登入下載', type: 'switch', side: 'neutral', hint: '會員系統上線（P6）後才生效，之前顯示「即將啟用」' },
    { key: 'downloadCount', label: '下載次數', type: 'readonly', side: 'neutral' },
  ],
  columns: [
    { key: 'displayName', label: '顯示名稱' },
    { key: 'fileMeta', label: '檔案', width: '150px' },
    { key: 'downloadCount', label: '下載次數', width: '100px' },
    ...statusColumns,
  ],
}

/* ── 頁面／SEO 15–16 ────────────────────────────────────── */

export const page: Unit = {
  code: 'page',
  no: '15',
  title: '頁面設定與 SEO',
  group: '頁面／SEO',
  phase: 'P4',
  frontend: '全站 29 筆固定頁',
  note: '29 筆固定頁，不可新增／刪除，只可編輯。「頁面內容」欄位僅 HasRichBody = 1 的頁面（privacy-legal、預留的 green-csr）顯示。',
  fixedRows: true,
  hasSeo: true,
  fields: [
    { key: 'path', label: '頁面／路徑', type: 'readonly', side: 'neutral' },
    { key: 'isIndexable', label: '允許索引', type: 'switch', side: 'neutral', hint: '關閉 → 前台輸出 noindex' },
    { key: 'body', label: '頁面內容', type: 'richtext', i18n: true, side: 'locale', hint: '僅 HasRichBody = 1 的頁面有此欄位' },
  ],
  columns: [
    { key: 'path', label: '路徑', width: '220px' },
    { key: 'seoTitle', label: 'SEO Title' },
    { key: 'isIndexable', label: '索引', render: 'bool', width: '80px' },
    { key: 'i18n', label: '中/英', render: 'i18n', width: '90px' },
  ],
}

export const redirect: Unit = {
  code: 'redirect',
  no: '16',
  title: '301 轉址',
  group: '頁面／SEO',
  phase: 'P8',
  frontend: '前台路由層',
  note: '支援 CSV 匯入匯出（舊站 46 頁 + 80 篇文章的對照表）。儲存時檢查轉址鏈與迴圈並擋下。',
  fields: [
    { key: 'fromPath', label: '來源路徑', type: 'text', required: true, side: 'neutral', placeholder: '/old-page', hint: '唯一、小寫' },
    { key: 'toPath', label: '目標路徑', type: 'text', required: true, side: 'neutral', placeholder: '/en/news' },
    {
      key: 'statusCode',
      label: '狀態碼',
      type: 'select',
      required: true,
      side: 'neutral',
      options: [
        { value: '301', label: '301 永久轉址' },
        { value: '302', label: '302 暫時轉址' },
        { value: '308', label: '308 永久轉址（保留方法）' },
      ],
    },
    { key: 'isEnabled', label: '啟用', type: 'switch', side: 'neutral' },
    { key: 'hitCount', label: '命中次數', type: 'readonly', side: 'neutral' },
  ],
  columns: [
    { key: 'fromPath', label: '來源路徑' },
    { key: 'toPath', label: '目標路徑' },
    { key: 'statusCode', label: '狀態碼', width: '90px' },
    { key: 'hitCount', label: '命中', width: '80px' },
    { key: 'isEnabled', label: '啟用', render: 'bool', width: '80px' },
  ],
}

/* ── 表單 17–18 ─────────────────────────────────────────── */

const QUOTE_STATUS = [
  { value: 'New', label: '待處理' },
  { value: 'InProgress', label: '處理中' },
  { value: 'Quoted', label: '已報價' },
  { value: 'Closed', label: '已結案' },
  { value: 'Spam', label: '垃圾訊息' },
]

export const quote: Unit = {
  code: 'quote',
  no: '17',
  title: '報價需求',
  group: '表單',
  phase: 'P6',
  frontend: 'get-a-quote.html',
  note: '唯讀資料 + 可改狀態，不可編輯客戶填寫內容。附件掃毒未通過者不提供下載。',
  readOnly: 'status-only',
  fields: [
    { key: 'status', label: '狀態', type: 'select', required: true, options: QUOTE_STATUS, side: 'neutral' },
    { key: 'assignee', label: '承辦人', type: 'text', side: 'neutral' },
    { key: 'internalNote', label: '內部備註', type: 'textarea', side: 'neutral' },
    { key: 'replied', label: '標記已回覆', type: 'switch', side: 'neutral' },
  ],
  columns: [
    { key: 'quoteNo', label: '報價單號', width: '140px' },
    { key: 'company', label: '公司' },
    { key: 'contactName', label: '聯絡人', width: '120px' },
    { key: 'productType', label: '產品類型', width: '140px' },
    { key: 'status', label: '狀態', width: '110px' },
    { key: 'submittedAt', label: '送出時間', render: 'date', width: '120px' },
  ],
}

export const contact: Unit = {
  code: 'contact',
  no: '18',
  title: '聯絡訊息',
  group: '表單',
  phase: 'P6',
  frontend: 'contact.html',
  note: '唯讀資料 + 可改狀態，不可編輯客戶填寫內容。',
  readOnly: 'status-only',
  fields: [
    {
      key: 'status',
      label: '狀態',
      type: 'select',
      required: true,
      side: 'neutral',
      options: [
        { value: 'New', label: '待處理' },
        { value: 'Replied', label: '已回覆' },
        { value: 'Closed', label: '已結案' },
        { value: 'Spam', label: '垃圾訊息' },
      ],
    },
    { key: 'assignee', label: '承辦人', type: 'text', side: 'neutral' },
    { key: 'internalNote', label: '內部備註', type: 'textarea', side: 'neutral' },
  ],
  columns: [
    { key: 'name', label: '姓名', width: '120px' },
    { key: 'email', label: 'Email' },
    { key: 'company', label: '公司', width: '160px' },
    { key: 'status', label: '狀態', width: '110px' },
    { key: 'submittedAt', label: '送出時間', render: 'date', width: '120px' },
  ],
}

/* ── 會員 19–20 ─────────────────────────────────────────── */

export const member: Unit = {
  code: 'member',
  no: '19',
  title: '會員管理',
  group: '會員',
  phase: 'P6',
  frontend: '會員中心',
  note: '後台不可查看或設定會員密碼；只能啟用／停用、重寄驗證信、觸發密碼重設信。',
  readOnly: 'status-only',
  fields: [
    { key: 'isActive', label: '啟用', type: 'switch', side: 'neutral' },
    { key: 'internalNote', label: '內部備註', type: 'textarea', side: 'neutral' },
  ],
  columns: [
    { key: 'email', label: 'Email' },
    { key: 'name', label: '名稱', width: '140px' },
    { key: 'company', label: '公司', width: '180px' },
    { key: 'isActive', label: '狀態', render: 'bool', width: '90px' },
    { key: 'registeredAt', label: '註冊日', render: 'date', width: '110px' },
    { key: 'lastLoginAt', label: '最後登入', render: 'date', width: '120px' },
  ],
}

export const order: Unit = {
  code: 'order',
  no: '20',
  title: '訂單與生產進度',
  group: '會員',
  phase: 'P6',
  frontend: '會員中心時間軸',
  note: '進度階段：設計／印前／印刷／印後／品檢／出貨，各有未開始／進行中／完成三種狀態。',
  fields: [
    { key: 'orderNo', label: '訂單編號', type: 'readonly', side: 'neutral' },
    { key: 'memberEmail', label: '會員', type: 'readonly', side: 'neutral' },
    { key: 'quoteNo', label: '關聯報價單', type: 'readonly', side: 'neutral' },
    { key: 'productName', label: '品名', type: 'text', required: true, side: 'neutral' },
    {
      key: 'status',
      label: '狀態',
      type: 'select',
      required: true,
      side: 'neutral',
      options: [
        { value: 'Pending', label: '待生產' },
        { value: 'Producing', label: '生產中' },
        { value: 'Shipped', label: '已出貨' },
        { value: 'Closed', label: '已結案' },
      ],
    },
    { key: 'etaDate', label: '預計出貨日', type: 'date', side: 'neutral' },
  ],
  columns: [
    { key: 'orderNo', label: '訂單編號', width: '150px' },
    { key: 'memberEmail', label: '會員' },
    { key: 'productName', label: '品名' },
    { key: 'status', label: '狀態', width: '110px' },
    { key: 'etaDate', label: '預計出貨', render: 'date', width: '120px' },
  ],
}

/* ── 系統 21–24（皆為自訂畫面） ─────────────────────────── */

export const setting: Unit = {
  code: 'setting',
  no: '21',
  title: '網站設定',
  group: '系統',
  phase: 'P4',
  frontend: '全站頁首／頁尾／聯絡資訊',
  note: '單頁表單，依 SiteSetting 的固定 key 清單渲染。',
  custom: true,
  fields: [],
  columns: [],
}

export const category: Unit = {
  code: 'category',
  no: '22',
  title: '分類管理',
  group: '系統',
  phase: 'P4',
  note: '已被引用的分類不可刪除，只能停用；刪除前顯示引用筆數。',
  custom: true,
  fields: [],
  columns: [],
}

export const admin: Unit = {
  code: 'admin',
  no: '23',
  title: '管理員與角色',
  group: '系統',
  phase: 'P4',
  note: '不可停用或降級自己；系統至少保留一名啟用中的超級管理員。',
  custom: true,
  fields: [],
  columns: [],
}

export const audit: Unit = {
  code: 'audit',
  no: '24',
  title: '操作紀錄',
  group: '系統',
  phase: 'P4',
  note: '唯讀。保留 12 個月，逾期由排程清除。',
  custom: true,
  readOnly: 'full',
  fields: [],
  columns: [],
}

export const dashboard: Unit = {
  code: 'dashboard',
  no: '00',
  title: '待辦總覽',
  group: '儀表板',
  phase: 'P4',
  custom: true,
  readOnly: 'full',
  fields: [],
  columns: [],
}
