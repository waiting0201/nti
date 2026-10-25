'use client'
import { Fragment, useCallback, useEffect, useRef, useState } from 'react'

export type TourPhoto = { src: string; alt: string }

/**
 * facility-tour.html 的工廠相簿（只在英文版出現；中文版是影片）：一排四張縮圖，點了開燈箱，
 * 可左右切換、Esc 關閉——比照舊站 nti-printing.com/home/factory 的相簿。
 * 照片來自後台單元 15 工廠導覽英文分頁的「相簿照片」。
 * 縮圖是 `<a href="原圖">`：JS 還沒載入時點了就是直接開原圖。燈箱只在打開時才渲染，
 * 所以 SSR 輸出與 mockup 一字不差，驗收閘才對得上。
 */
export function TourGallery({ photos }: { photos: TourPhoto[] }) {
  const [open, setOpen] = useState<number | null>(null)
  const links = useRef<(HTMLAnchorElement | null)[]>([])
  const closeBtn = useRef<HTMLButtonElement>(null)
  const lastOpened = useRef(0)
  const n = photos.length
  const isOpen = open !== null

  const go = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + n) % n)), [n])
  const close = useCallback(() => setOpen(null), [])

  // 打開時：鎖住背景捲動、接鍵盤、焦點移到關閉鈕；關掉時把焦點還給原本那張縮圖
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
      links.current[lastOpened.current]?.focus()
    }
  }, [isOpen, close, go])

  return (
    <>
      <div className="tour-gallery reveal mt-l" id="tourGallery">
        {/* 縮圖之間的空白與 mockup 一致（格線版面下不影響排版，但驗收閘逐字比對） */}
        {photos.map((p, i) => (
          <Fragment key={p.src + i}>
          {i > 0 && ' '}
          <a
            className="tg-item"
            href={p.src}
            ref={(el) => { links.current[i] = el }}
            onClick={(e) => {
              e.preventDefault()
              lastOpened.current = i
              setOpen(i)
            }}
          >
            <img src={p.src} alt={p.alt} loading="lazy" />
          </a>
          </Fragment>
        ))}
      </div>
      {open !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={photos[open].alt} onClick={(e) => e.target === e.currentTarget && close()}>
          <img src={photos[open].src} alt={photos[open].alt} />
          <button ref={closeBtn} className="lb-btn lb-close" aria-label="Close" onClick={close}>&times;</button>
          {n > 1 && (
            <>
              <button className="lb-btn lb-prev" aria-label="Previous" onClick={() => go(-1)}>&lsaquo;</button>
              <button className="lb-btn lb-next" aria-label="Next" onClick={() => go(1)}>&rsaquo;</button>
            </>
          )}
          <p className="lb-count">{`${open + 1} / ${n}`}</p>
        </div>
      )}
    </>
  )
}
