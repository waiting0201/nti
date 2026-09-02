/**
 * 素材網址。
 *
 * 種子資料裡的路徑是 `/assets/...`（公開站的實際路徑），依執行形態決定要不要補前綴：
 * - **dev**（`pnpm --filter admin dev`）：素材由 `public/assets`（指向 mockup/assets 的
 *   symlink）提供，跟著 base 掛在 `/admin/` 底下，所以要補上前綴。
 * - **build**：產物進 `apps/web/public/admin`，與公開站同域，`/assets/...` 直接命中
 *   公開站的 `public/assets`，不補前綴、也不複製第二份素材（vite.config.ts 關掉 publicDir）。
 *
 * 正式站的圖片來自 Blob Storage，會是完整 URL，原樣回傳。
 */
const assetBase = import.meta.env.DEV ? import.meta.env.BASE_URL.replace(/\/$/, '') : ''

export function assetUrl(src: unknown): string {
  const s = typeof src === 'string' ? src : ''
  if (!s) return ''
  if (/^(https?:|blob:|data:)/.test(s)) return s
  if (s.startsWith('/assets/')) return assetBase + s
  return s
}
