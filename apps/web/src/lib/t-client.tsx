'use client'

import { createTranslator } from './translate'
import { ZH_CLIENT } from './zh-client'

/**
 * client component 用的翻譯（精簡字典）。
 *
 * header 與 behaviors 是 client component，若讓它們吃 `lib/t` 的完整字典，
 * 整本 1000 筆會被打進 client bundle。`zh-client.ts` 只放它們用得到的那幾十筆，
 * 內容與 `zh.ts` 一致，由 `scripts/extract-i18n.mjs --client` 守住不漂移。
 */
export const { tr, T } = createTranslator(ZH_CLIENT)
