'use client'

import { usePathname } from 'next/navigation'
import { JsonLd } from './JsonLd'
import { splitLocale } from '@/lib/i18n'
import { LOCAL_BUSINESS_PATHS } from '@/lib/jsonld'

/**
 * 有地址＋地圖的頁才發 `LocalBusiness`（見 `lib/jsonld.ts`）。
 *
 * 跟 `BreadcrumbJsonLd` 一樣掛在 layout 的 footer 之後：`/contact` 在 `verify:markup`
 * 的比對範圍內，頁面本體不能多出 script 節點。
 */
export function LocalBusinessJsonLd({ data }: { data: object }) {
  // 內容由 layout（伺服器）算好傳進來：電話／地址／營業時間吃後台的網站設定，這裡只決定哪一頁要發
  const { path } = splitLocale(usePathname() ?? '/')
  return LOCAL_BUSINESS_PATHS.has(path) ? <JsonLd data={data} /> : null
}
