/**
 * 待上傳檔案暫存區。
 *
 * 上傳欄位「選好檔案」時**不送出**，只產生一個本機 `blob:` URL 當作欄位的暫時值，
 * 真正的 `POST /admin/{unit}/upload` 延到按下儲存那一刻，換成 Blob 相對路徑後
 * 再跟其他欄位一起送。
 *
 * **為什麼要延後**：先上傳的話，使用者選了圖卻沒存檔（或直接關掉分頁），檔案已經
 * 躺在 Blob 裡而 DB 沒有任何引用——就是 `OrphanMediaFunction` 要收的孤兒。延後之後
 * 那個視窗從「使用者猶豫的幾分鐘」縮成「上傳與存檔兩個請求之間的幾百毫秒」。
 * 孤兒仍有可能（Blob 寫入與 EF SaveChanges 本來就不同一個交易），孤兒清除照樣要留著。
 *
 * **為什麼用 module-level Map 而不是 React state**：欄位值必須是字串（`Row` 的形狀、
 * 完整度檢查、`assetUrl()` 都吃字串），沒有地方掛 File 物件。用 blob URL 當鍵把
 * File 藏在旁邊，上層的儲存流程只要掃過 row 找 `blob:` 開頭的值即可，
 * `FieldInput` 的介面完全不用改。`assetUrl()` 本來就放行 `blob:`，預覽直接可用。
 */

import { api as http, hasApi } from '@/api/http'

/**
 * 圖片與文件走**不同端點**，白名單與大小上限都不一樣（後端 `AdminMediaHandler`
 * 的 `UploadAsync`／`UploadFileAsync`）。暫存時就把種類記下來，
 * 儲存時才知道該送哪一個。
 */
export type UploadKind = 'image' | 'file'

/** blob URL → 使用者選的檔案。存檔成功或按下移除時清掉。 */
const pending = new Map<string, { file: File; kind: UploadKind }>()

/** 以下四個常數與後端 `UploadRules`／docs/09 §3 一致——早點擋，錯誤才不會拖到按儲存才冒出來。 */
export const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.svg']
export const IMAGE_MAX_BYTES = 10 * 1024 * 1024
export const DOCUMENT_EXTENSIONS = ['.pdf', '.docx', '.xlsx', '.zip']
export const DOCUMENT_MAX_BYTES = 20 * 1024 * 1024

/** 該種類的端點後綴。 */
const ENDPOINT: Record<UploadKind, string> = { image: 'upload', file: 'upload-file' }

/** 把檔案收進暫存區，回傳可直接當欄位值／預覽用的 blob URL。 */
export function stagePending(file: File, kind: UploadKind): string {
  const url = URL.createObjectURL(file)
  pending.set(url, { file, kind })
  return url
}

/** 放棄一個尚未上傳的檔案（按「移除」或改選別的檔案）。 */
export function discardPending(value: unknown): void {
  if (typeof value !== 'string' || !pending.has(value)) return
  pending.delete(value)
  URL.revokeObjectURL(value)
}

/** 這個值是不是還沒上傳的暫存檔。 */
export function isPending(value: unknown): boolean {
  return typeof value === 'string' && pending.has(value)
}

/** 這筆資料裡還有幾個沒上傳的檔案（給提示文案用）。 */
export function countPending(target: Target): number {
  return collect(target).length
}

/** 編輯畫面的一列，或設定頁的 key-value 表——兩者都是「字串值散落在巢狀物件裡」。 */
export type Target = Record<string, unknown>

/**
 * 找出 target 裡所有指向暫存檔的位置。
 *
 * 遞迴進巢狀物件，因為圖片欄位不只出現在頂層：編輯畫面的分語系欄位在
 * `i18n[lang][key]`，設定頁的多語值在 `values[key].zh`／`.en`。
 */
function collect(target: Target): Array<{ url: string; set: (path: string) => void }> {
  const found: Array<{ url: string; set: (path: string) => void }> = []

  const walk = (node: Record<string, unknown>) => {
    for (const [key, value] of Object.entries(node)) {
      if (isPending(value)) found.push({ url: value as string, set: (p) => (node[key] = p) })
      else if (value && typeof value === 'object' && !Array.isArray(value)) {
        walk(value as Record<string, unknown>)
      }
    }
  }
  walk(target)

  return found
}

/**
 * 儲存前呼叫：把裡面的暫存檔逐一上傳，欄位值換成 Blob 相對路徑。
 *
 * **就地修改傳進來的物件**，所以請傳一份可以改的複本（儲存流程本來就在組 `next`）。
 * 任何一個檔案上傳失敗就整個 throw，由呼叫端中止儲存——半套的路徑寫進 DB
 * 比擋下來更難收拾。
 *
 * 示範模式（沒設 `VITE_API_BASE`）沒有後端可以收檔，維持 blob URL 讓預覽還看得到。
 */
export async function resolvePendingUploads<T extends Target>(unit: string, target: T): Promise<T> {
  if (!hasApi) return target

  for (const { url, set } of collect(target)) {
    const staged = pending.get(url)
    if (!staged) continue

    const form = new FormData()
    form.append('file', staged.file)

    const endpoint = `/admin/${unit}/${ENDPOINT[staged.kind]}`
    const { path } = await http.upload<{ path: string }>(endpoint, form)
    set(path)
    discardPending(url)
  }

  return target
}
