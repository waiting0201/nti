/**
 * 素材網址。
 *
 * mockup 的素材（127 檔、63MB）不進 SWA 產物 —— 那會吃掉 Free 方案 250MB 上限的
 * 四分之一；而且 `mockup/` 未進版控，CI checkout 之後根本沒有這些檔案，會建出一個
 * 缺圖但 build 成功的站。正式站改由 Azure Blob Storage 提供。
 *
 * 靠 `NEXT_PUBLIC_MEDIA_BASE` 切換：
 * - **未設**（本機開發、`verify:markup`）：回傳 `/assets/...`，由 `public/assets`
 *   服務。輸出與 mockup 逐字相同，版面驗收閘不受影響。
 * - **設為 `https://<account>.blob.core.windows.net`**：回傳 Blob 上的絕對網址。
 *   容器名就叫 `assets`，所以只要補前綴，路徑本身不用改寫。
 *
 * 這是 `NEXT_PUBLIC_*`，值在 build 當下內嵌進 bundle，不是 runtime 讀取 ——
 * 換 base 要重新 build。
 */
export const mediaBase = (process.env.NEXT_PUBLIC_MEDIA_BASE ?? '').replace(/\/$/, '')

export function mediaUrl(path: string): string {
  return mediaBase + path
}
