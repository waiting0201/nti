/**
 * 素材網址。
 *
 * 種子資料裡的路徑是 `/assets/...`（公開站的實際路徑），依執行形態決定要不要補前綴：
 * - **dev**（`pnpm --filter admin dev`）：素材由 `public/assets`（指向 mockup/assets 的
 *   symlink）提供，跟著 base 掛在 `/admin/` 底下，所以要補上前綴。
 * - **build**：產物進 `apps/web/public/admin`，與公開站同域，`/assets/...` 直接命中
 *   公開站的 `public/assets`，不補前綴、也不複製第二份素材（vite.config.ts 關掉 publicDir）。
 *
 * 設了 `VITE_MEDIA_BASE`（Azure Blob Storage）時一律以它為前綴，蓋過上面兩種。
 *
 * 接了 API（`VITE_API_BASE`）之後，後台上傳的圖片存的是 media 容器內的相對路徑，
 * 而那個容器是 private——一律改走 `/files/media/*` 代理路由取檔。
 */
import { API_BASE } from '@/api/http'

const mediaBase = (import.meta.env.VITE_MEDIA_BASE ?? '').replace(/\/$/, '')
const assetBase = mediaBase || (import.meta.env.DEV ? import.meta.env.BASE_URL.replace(/\/$/, '') : '')

export function assetUrl(src: unknown): string {
  const s = typeof src === 'string' ? src : ''
  if (!s) return ''
  if (/^(https?:|blob:|data:)/.test(s)) return s
  if (s.startsWith('/assets/')) return assetBase + s

  // 接了 API 之後，圖片欄位存的是 Blob 的**相對路徑**（`2026/09/{guid}.webp`）。
  // media 容器是 private，拿不到可直連的 URL，一律走後端的代理路由。
  if (API_BASE) return `${API_BASE}/files/media/${s.replace(/^\/+/, '')}`

  return s
}
