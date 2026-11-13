'use client'
import { useEffect } from 'react'
import { apiBase, hasApi } from '@/lib/api'

/**
 * 供應商專區的下載計數：點了帶 `data-hit="{id}"` 的下載連結，就回報一次
 * `POST /supplier/downloads/{id}/hit`（後台 14 的「下載次數」）。
 *
 * 只回報、不攔下載：`keepalive` 讓請求在瀏覽器離開頁面去開檔案時也送得出去，失敗就算了——
 * 計數少一次不該讓人下載不到檔案。連結本身仍是一般的 <a>，沒有 JS 也照樣能下載。
 */
export function DownloadHit() {
  useEffect(() => {
    if (!hasApi) return
    const onClick = (e: MouseEvent) => {
      const id = (e.target as HTMLElement).closest<HTMLElement>('[data-hit]')?.dataset.hit
      if (!id) return
      fetch(`${apiBase}/supplier/downloads/${id}/hit`, { method: 'POST', keepalive: true }).catch(() => {})
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])
  return null
}
