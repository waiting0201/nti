/**
 * 素材網址。
 *
 * 種子資料裡的路徑是 `/assets/...`（前台的實際路徑）。後台掛在 /admin/ 底下，
 * 開發時素材由 admin/public/assets（指向 mockup/assets 的 symlink）提供，
 * 所以要補上 base。正式站的圖片來自 Blob Storage，會是完整 URL，原樣回傳。
 */
export function assetUrl(src: unknown): string {
  const s = typeof src === 'string' ? src : ''
  if (!s) return ''
  if (/^(https?:|blob:|data:)/.test(s)) return s
  if (s.startsWith('/assets/')) return import.meta.env.BASE_URL.replace(/\/$/, '') + s
  return s
}
