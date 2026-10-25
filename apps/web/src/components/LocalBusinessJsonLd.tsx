'use client'

import { usePathname } from 'next/navigation'
import { JsonLd } from './JsonLd'
import { splitLocale } from '@/lib/i18n'
import { LOCAL_BUSINESS_PATHS, localBusiness } from '@/lib/jsonld'

/**
 * 有地址＋地圖的頁才發 `LocalBusiness`（見 `lib/jsonld.ts`）。
 *
 * 跟 `BreadcrumbJsonLd` 一樣掛在 layout 的 footer 之後：`/contact` 在 `verify:markup`
 * 的比對範圍內，頁面本體不能多出 script 節點。
 */
export function LocalBusinessJsonLd() {
  const { locale, path } = splitLocale(usePathname() ?? '/')
  return LOCAL_BUSINESS_PATHS.has(path) ? <JsonLd data={localBusiness(locale)} /> : null
}
