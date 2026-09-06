import { createTranslator } from './translate'
import { ZH } from './zh'

/** 伺服器端的靜態文字翻譯（完整字典）。機制與注意事項見 `translate.tsx` */
export const { tr, T } = createTranslator(ZH)
