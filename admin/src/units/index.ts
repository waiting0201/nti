import type { Field, Unit } from '@/lib/types'
import { permissionRowCount } from '@/lib/permissions'
import { HINT } from './content'
import * as content from './content'
import * as rest from './rest'

/**
 * SEO 欄位組（docs/09-cms-admin.md §5.6）—— 僅 page／news／solution 三個單元有。
 * Slug 由標題自動產生、可手改；已上架內容改 slug 時自動在 redirect 建立一筆 301。
 */
export const SEO_FIELDS: Field[] = [
  { key: 'slug', label: 'Slug', type: 'text', i18n: true, required: true, side: 'locale', hint: '小寫、連字號；中英可不同' },
  { key: 'seoTitle', label: 'SEO Title', type: 'text', i18n: true, required: true, max: 70, side: 'locale' },
  { key: 'metaDescription', label: 'Meta Description', type: 'textarea', i18n: true, required: true, max: 180, side: 'locale' },
  { key: 'canonical', label: 'Canonical', type: 'url', i18n: true, side: 'locale', hint: '留空則自動' },
  { key: 'ogTitle', label: 'OG 標題', type: 'text', i18n: true, side: 'locale', hint: '留空則沿用 SEO Title' },
  { key: 'ogDescription', label: 'OG 描述', type: 'textarea', i18n: true, side: 'locale', hint: '留空則沿用 Meta Description' },
  { key: 'ogImage', label: 'OG 分享圖', type: 'image', side: 'neutral', hint: HINT.ogImage, altKey: 'ogImageAlt' },
  { key: 'ogImageAlt', label: 'OG 圖替代文字 Alt', type: 'text', i18n: true, required: true, side: 'locale' },
  // 註：OG 圖本身選填，所以這個 Alt 只有在真的上傳了圖片時才算必填 —— 判斷在 completeness.ts
]

/** docs §2 的 24 個單元，順序即側邊選單順序 */
export const UNITS: Unit[] = [
  rest.dashboard,
  content.homeBanner,
  content.solution,
  content.project,
  content.news,
  content.vlog,
  content.faq,
  content.trend,
  content.certification,
  content.client,
  content.facility,
  content.job,
  rest.supplierNotice,
  rest.supplierSpec,
  rest.supplierDownload,
  rest.page,
  rest.redirect,
  rest.quote,
  rest.contact,
  rest.member,
  rest.order,
  rest.setting,
  rest.category,
  rest.admin,
  rest.audit,
]

export const UNIT_BY_CODE = new Map(UNITS.map((u) => [u.code, u]))

/** 單元的完整欄位清單（含 SEO 欄位組） */
export function unitFields(unit: Unit): Field[] {
  return unit.hasSeo ? [...unit.fields, ...SEO_FIELDS] : unit.fields
}

/**
 * 開發期自我檢查，對應 docs §8 DoD 的兩條：
 *  - 每個圖片欄位都有中英 Alt
 *  - 每個上傳欄位旁都顯示 §3 的建議尺寸提示文字
 * 設定寫錯時在 console 直接指出，不會靜靜漏掉。
 */
export function validateUnits(): string[] {
  const problems: string[] = []

  // 權限矩陣展開後應與 db/seed/110_role_permission.sql 的 171 列一致；
  // 對不上代表前後端對權限的認知已岔開，要先修正再往下做。
  const perm = permissionRowCount()
  if (perm.SuperAdmin !== 83 || perm.Editor !== 67 || perm.Viewer !== 21) {
    problems.push(
      `權限矩陣與 db/seed/110_role_permission.sql 不一致：` +
        `SuperAdmin ${perm.SuperAdmin}（應 83）／Editor ${perm.Editor}（應 67）／Viewer ${perm.Viewer}（應 21）`,
    )
  }

  for (const unit of UNITS) {
    const fields = unitFields(unit)
    const keys = new Set(fields.map((f) => f.key))
    for (const f of fields) {
      if ((f.type === 'image' || f.type === 'file') && !f.hint) {
        problems.push(`${unit.code}.${f.key}：上傳欄位缺少建議尺寸提示（docs §3）`)
      }
      if (f.type === 'image') {
        // client 的 logo 以「名稱」作為 alt（docs §09 單元 09 明訂），是唯一例外
        const exempt = unit.code === 'client'
        if (!exempt) {
          if (!f.altKey) problems.push(`${unit.code}.${f.key}：圖片欄位未指定 altKey`)
          else if (!keys.has(f.altKey)) problems.push(`${unit.code}.${f.key}：altKey「${f.altKey}」找不到對應欄位`)
          else {
            const altField = fields.find((x) => x.key === f.altKey)!
            if (!altField.i18n) problems.push(`${unit.code}.${f.altKey}：Alt 欄位必須中英各一份`)
          }
        }
      }
    }
    if (unit.child) {
      for (const f of unit.child.fields) {
        if (f.type === 'image' && !f.hint) {
          problems.push(`${unit.code}（子清單）.${f.key}：上傳欄位缺少建議尺寸提示`)
        }
      }
    }
  }
  return problems
}
