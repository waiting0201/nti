'use client'

import { usePathname } from 'next/navigation'
import { JsonLd } from './JsonLd'
import { splitLocale } from '@/lib/i18n'
import { staticBreadcrumbList } from '@/lib/jsonld'

/**
 * 靜態頁的 BreadcrumbList。
 *
 * 麵包屑只取決於路由，所以掛在 layout 就好，不必逐頁去改那 44 個 page.tsx
 * （其中 28 個是 `build-pages.mjs` 產生的，手動加會被下次重跑洗掉）。
 * layout 拿不到 pathname，因此這裡用 client component ——
 * 與 `SiteHeader`（active 狀態）同一個做法，SSR 當下就已經有值，
 * 爬蟲看到的 HTML 裡就有這段。
 *
 * `lib/breadcrumbs.ts` 沒收的路由（畫面上沒有麵包屑、CMS 的消息詳細頁）回 null，
 * 後者由頁面自己發。
 */
export function BreadcrumbJsonLd() {
  const { locale, path } = splitLocale(usePathname() ?? '/')
  const data = staticBreadcrumbList(locale, path)
  return data ? <JsonLd data={data} /> : null
}
