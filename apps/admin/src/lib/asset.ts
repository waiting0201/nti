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
 * 資料庫接上之後，圖片欄位會直接存 Blob 的完整 URL，那時走下面的原樣回傳。
 */
const mediaBase = (import.meta.env.VITE_MEDIA_BASE ?? '').replace(/\/$/, '')
const assetBase = mediaBase || (import.meta.env.DEV ? import.meta.env.BASE_URL.replace(/\/$/, '') : '')

export function assetUrl(src: unknown): string {
  const s = typeof src === 'string' ? src : ''
  if (!s) return ''
  if (/^(https?:|blob:|data:)/.test(s)) return s
  if (s.startsWith('/assets/')) return assetBase + s
  return s
}
