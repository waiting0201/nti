'use client'
import { useCallback, useEffect, useRef, useState } from 'react'

type Clip = { id: string; title: string; card: HTMLAnchorElement }

const idOf = (href: string) => {
  const id = new URL(href).searchParams.get('v')
  return id && /^[\w-]{6,20}$/.test(id) ? id : null
}

/**
 * Green Vlog（/blog）：點下方的影片卡，在燈箱裡播，不跳去 YouTube。
 *
 * 只攔點擊、不動標記——卡片仍是 mockup 那個 `<a href="youtube.com/watch?v=…" target="_blank">`，
 * 所以版面驗收閘不受影響，JS 沒載入時也照舊連去 YouTube。
 * Cmd／Ctrl／Shift 點擊與中鍵維持瀏覽器預設（另開分頁）。
 *
 * 卡片從 DOM 讀，不吃 props：CMS 與沒接 API 時的 mockup 內容是兩份不同的 JSX，這樣兩邊都適用。
 * 燈箱沿用工廠導覽相簿的 `.lightbox`（`TourGallery`），只在打開時渲染；
 * 關掉時 iframe 跟著卸載，影片不會在背景繼續出聲。頂部的主打影片不受影響。
 */
export function VlogPlayer() {
  const [clips, setClips] = useState<Clip[]>([])
  const [open, setOpen] = useState<number | null>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const n = clips.length
  const isOpen = open !== null

  const go = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + n) % n)), [n])
  const close = useCallback(() => setOpen(null), [])

  useEffect(() => {
    const grid = document.querySelector<HTMLElement>('.vl-grid')
    if (!grid) return
    const list = [...grid.querySelectorAll<HTMLAnchorElement>('a.vl-card')].flatMap((card) => {
      const id = idOf(card.href)
      return id ? [{ id, title: card.querySelector('h3')?.textContent ?? '', card }] : []
    })
    setClips(list)

    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const card = (e.target as HTMLElement).closest<HTMLAnchorElement>('a.vl-card')
      const i = list.findIndex((c) => c.card === card)
      if (i < 0) return
      e.preventDefault()
      setOpen(i)
    }
    grid.addEventListener('click', onClick)
    return () => grid.removeEventListener('click', onClick)
  }, [])

  // 打開時：鎖住背景捲動、接鍵盤、焦點移到關閉鈕；關掉時把焦點還給最後播的那張卡
  const lastCard = useRef<HTMLAnchorElement | null>(null)
  useEffect(() => {
    if (open !== null) lastCard.current = clips[open]?.card ?? null
  }, [open, clips])
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowLeft') go(-1)
      else if (e.key === 'ArrowRight') go(1)
    }
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    addEventListener('keydown', onKey)
    closeBtn.current?.focus()
    return () => {
      document.body.style.overflow = overflow
      removeEventListener('keydown', onKey)
      lastCard.current?.focus()
    }
  }, [isOpen, close, go])

  if (open === null || !clips[open]) return null
  const clip = clips[open]
  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={clip.title} onClick={(e) => e.target === e.currentTarget && close()}>
      <div className="lb-video">
        {/* key：換片時整個重建，否則部分瀏覽器只改 src 會留下上一支的播放狀態 */}
        <iframe
          key={clip.id}
          src={`https://www.youtube.com/embed/${clip.id}?autoplay=1`}
          title={clip.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
      <button ref={closeBtn} className="lb-btn lb-close" aria-label="Close" onClick={close}>&times;</button>
      {n > 1 && (
        <>
          <button className="lb-btn lb-prev" aria-label="Previous" onClick={() => go(-1)}>&lsaquo;</button>
          <button className="lb-btn lb-next" aria-label="Next" onClick={() => go(1)}>&rsaquo;</button>
        </>
      )}
      <p className="lb-count">{`${open + 1} / ${n}`}</p>
    </div>
  )
}
