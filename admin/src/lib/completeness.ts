import type { Locale, Unit } from './types'
import { unitFields } from '@/units'
import type { Row } from '@/api/types'

/**
 * docs/09-cms-admin.md §5.3：儲存時允許只填一種語系（草稿），
 * 但上架時必須兩語系皆完整，否則擋下並指出缺漏欄位。
 */

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
      const v = row.i18n?.[locale]?.[f.key]
      if (!v || !String(v).trim()) out.push(f.label)
    } else if (locale === 'zh') {
      // 語系中性的必填欄位只算一次，掛在中文那側檢查
      const v = row[f.key]
      if (v === undefined || v === null || String(v).trim() === '') out.push(f.label)
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
