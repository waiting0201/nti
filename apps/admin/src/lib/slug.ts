import type { Field } from './types'

/** 與後端 Api/Common/Slugs.cs 同一條規則：ASCII 小寫、數字與連字號 */
export const SLUG_PATTERN: NonNullable<Field['pattern']> = {
  re: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  message: '僅能使用小寫英數與連字號（例：green-printing），不可有中文或空白',
}
