import type { Field, Locale, Unit } from './types'
import { unitFields } from '@/units'
import type { Row } from '@/api/types'

/**
 * docs/09-cms-admin.md §5.3：儲存時允許只填一種語系（草稿），
 * 但上架時必須兩語系皆完整，否則擋下並指出缺漏欄位。
 */

/** 欄位算不算「沒填」。null／undefined／全空白都算。 */
const isBlank = (v: unknown) => v === undefined || v === null || String(v).trim() === ''

/**
 * 必填但空著的**語系中性**欄位（圖片、分類、日期這種兩語系共用的欄位）。
 *
 * 這一組與分語系的文字欄位不同，**存檔時就得擋**：§5.3 的草稿寬容講的是
 * 「可以先只填一種語系」，不是「必填的圖可以留空」。留空的後果不對稱——
 * 少一段英文只是那一頁的英文版缺一塊，少一張必填圖是前台渲染出一個沒有 src 的
 * `<img>`，而且清空的當下看起來像成功了。
 */
export function missingNeutral(unit: Unit, row: Row): Field[] {
  return unitFields(unit).filter((f) => !f.i18n && f.required && isBlank(row[f.key]))
}

export function missingFields(unit: Unit, row: Row, locale: Locale): string[] {
  const fields = unitFields(unit)
  // 選填圖片（例如 OG 分享圖）沒上傳時，它配套的 Alt 就不該算缺漏 ——
  // docs §3 要求每張圖都有 Alt，但沒有圖的時候沒有東西要描述。
  const altOfEmptyImage = new Set(
    fields
      .filter((f) => f.type === 'image' && f.altKey && !String(row[f.key] ?? '').trim())
      .map((f) => f.altKey as string),
  )
  const usedAlt = new Set(
    fields
      .filter((f) => f.type === 'image' && f.altKey && String(row[f.key] ?? '').trim())
      .map((f) => f.altKey as string),
  )

  const out: string[] = []
  for (const f of fields) {
    if (!f.required) continue
    if (altOfEmptyImage.has(f.key) && !usedAlt.has(f.key)) continue
    if (f.i18n) {
      if (isBlank(row.i18n?.[locale]?.[f.key])) out.push(f.label)
    } else if (locale === 'zh') {
      // 語系中性的必填欄位只算一次，掛在中文那側檢查
      if (isBlank(row[f.key])) out.push(f.label)
    }
  }
  return out
}

export function isComplete(unit: Unit, row: Row, locale: Locale): boolean {
  return missingFields(unit, row, locale).length === 0
}

/** 兩語系都完整才可上架；回傳缺漏說明（空陣列代表可以上架） */
export function blockingReasons(unit: Unit, row: Row): string[] {
  const reasons: string[] = []
  const zh = missingFields(unit, row, 'zh')
  const en = missingFields(unit, row, 'en')
  if (zh.length) reasons.push(`中文缺：${zh.join('、')}`)
  if (en.length) reasons.push(`English 缺：${en.join('、')}`)
  return reasons
}
