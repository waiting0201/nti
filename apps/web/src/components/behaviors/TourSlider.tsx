'use client'
import { useEffect, useState } from 'react'

export type TourSlide = { src: string; alt: string }

/**
 * facility-tour.html 的工廠導覽輪播（只在英文版出現；中文版是影片）。
 * 照片來自後台單元 10「參觀」分類。5.5s 自動、hover 暫停、左右鈕，與首頁 HeroSlider 同節奏；
 * SSR 的初始輸出（第 1 張 .on、計數 1 / N）與 mockup 一字不差，驗收閘才對得上。
 */
export function TourSlider({ slides }: { slides: TourSlide[] }) {
  const [cur, setCur] = useState(0)
  const [paused, setPaused] = useState(false)
  const n = slides.length

  useEffect(() => {
    if (n < 2 || paused || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = setInterval(() => setCur((i) => (i + 1) % n), 5500)
    return () => clearInterval(timer)
  }, [n, paused, cur]) // cur 在依賴裡：按左右鈕後重新計時

  const go = (i: number) => setCur((i + n) % n)

  return (
    <div className="ex-media tour-slider reveal mt-l" id="tourSlider" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {n > 1 && (
        <button className="ex-arrow" aria-label="Previous" onClick={() => go(cur - 1)}><svg width="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="m15 18-6-6 6-6" /></svg></button>
      )}
      <div className="ex-stack">
        <div className="ex-frame tour-frame">
          {slides.map((s, i) => (
            <img key={s.src + i} className={i === cur ? 'on' : undefined} src={s.src} alt={s.alt} loading={i ? 'lazy' : undefined} />
          ))}
        </div>
        {n > 1 && <p className="fac-cap"><span className="fac-count">{`${cur + 1} / ${n}`}</span></p>}
      </div>
      {n > 1 && (
        <button className="ex-arrow" aria-label="Next" onClick={() => go(cur + 1)}><svg width="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="m9 18 6-6-6-6" /></svg></button>
      )}
    </div>
  )
}
