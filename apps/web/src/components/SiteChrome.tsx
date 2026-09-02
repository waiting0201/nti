'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { splitLocale } from '@/lib/i18n'

/**
 * mockup 每頁共用的那段 inline script，原樣移植：
 * sticky header 陰影／reveal on scroll／浮動按鈕收合／語系下拉／explorer 換圖。
 * 以 pathname 為 key 重新掛載，client 導覽後行為與整頁載入一致。
 */
export function SiteChrome() {
  const pathname = usePathname() ?? '/'
  // mockup 首頁的 reveal threshold 是 .14，其餘頁面 .12 — 照原值
  const revealThreshold = splitLocale(pathname).path === '/' ? 0.14 : 0.12

  useEffect(() => {
    const cleanups: Array<() => void> = []

    // sticky header shadow
    const hdr = document.getElementById('hdr')
    const onScroll = () => hdr?.classList.toggle('scrolled', window.scrollY > 8)
    addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    cleanups.push(() => removeEventListener('scroll', onScroll))

    // reveal on scroll
    const io = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: revealThreshold, rootMargin: '0px 0px -6% 0px' },
    )
    document.querySelectorAll('.reveal:not(.in)').forEach((el) => io.observe(el))
    cleanups.push(() => io.disconnect())

    // floating widget toggle
    const fab = document.getElementById('fab')
    const reopen = document.getElementById('fabReopen')
    const fabClose = document.getElementById('fabClose')
    if (fab && reopen && fabClose) {
      const close = () => {
        fab.classList.add('hide')
        reopen.classList.add('show')
      }
      const open = () => {
        fab.classList.remove('hide')
        reopen.classList.remove('show')
      }
      fabClose.addEventListener('click', close)
      reopen.addEventListener('click', open)
      cleanups.push(() => {
        fabClose.removeEventListener('click', close)
        reopen.removeEventListener('click', open)
      })
    }

    // explorer tab switching
    document.querySelectorAll<HTMLElement>('.explorer').forEach((ex) => {
      const links = ex.querySelectorAll<HTMLAnchorElement>('.ex-list a')
      const img = ex.querySelector('img')
      links.forEach((a) => {
        const onClick = (e: Event) => {
          e.preventDefault()
          links.forEach((x) => x.classList.remove('active'))
          a.classList.add('active')
          const s = a.dataset.img
          if (s && img) img.src = s
        }
        a.addEventListener('click', onClick)
        cleanups.push(() => a.removeEventListener('click', onClick))
      })
    })

    // language dropdown: click to toggle (touch-friendly)
    const lang = document.querySelector('.lang')
    const langBtn = document.querySelector('.lang-btn')
    if (lang && langBtn) {
      const toggle = () => {
        const open = lang.classList.toggle('open')
        langBtn.setAttribute('aria-expanded', String(open))
      }
      const outside = (e: MouseEvent) => {
        if (!lang.contains(e.target as Node)) {
          lang.classList.remove('open')
          langBtn.setAttribute('aria-expanded', 'false')
        }
      }
      const esc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          lang.classList.remove('open')
          langBtn.setAttribute('aria-expanded', 'false')
        }
      }
      langBtn.addEventListener('click', toggle)
      document.addEventListener('click', outside)
      document.addEventListener('keydown', esc)
      cleanups.push(() => {
        langBtn.removeEventListener('click', toggle)
        document.removeEventListener('click', outside)
        document.removeEventListener('keydown', esc)
      })
    }

    return () => cleanups.forEach((fn) => fn())
  }, [pathname, revealThreshold])

  return null
}
