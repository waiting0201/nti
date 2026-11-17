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
    // 2026-11-11 起語系鈕是直接切換的連結、沒有下拉；只有還有 .lang-menu 時才接這段
    const lang = document.querySelector('.lang')
    const langBtn = document.querySelector('.lang-btn')
    if (lang && langBtn && lang.querySelector('.lang-menu')) {
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

    // mobile menu: mockup 的漢堡鈕只有外觀，這裡補上行為 —— header 加 .mopen 時
    // 把 .menu 攤成下拉面板（樣式在 globals.css 的 header mobile menu 段）
    const burger = document.querySelector('.burger')
    const menu = document.querySelector('.menu')
    if (hdr && burger && menu) {
      burger.setAttribute('aria-expanded', 'false')
      const setOpen = (open: boolean) => {
        hdr.classList.toggle('mopen', open)
        burger.setAttribute('aria-expanded', String(open))
      }
      const toggle = () => setOpen(!hdr.classList.contains('mopen'))
      const outside = (e: MouseEvent) => {
        if (!hdr.contains(e.target as Node)) setOpen(false)
      }
      // 點到選單裡的連結就收起（連到本頁時 pathname 不變，不會重新掛載）
      const pick = (e: MouseEvent) => {
        if ((e.target as Element).closest('a')) setOpen(false)
      }
      const esc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setOpen(false)
      }
      const wide = matchMedia('(min-width: 901px)')
      const onWide = () => wide.matches && setOpen(false)
      burger.addEventListener('click', toggle)
      menu.addEventListener('click', pick as EventListener)
      document.addEventListener('click', outside)
      document.addEventListener('keydown', esc)
      wide.addEventListener('change', onWide)
      cleanups.push(() => {
        setOpen(false)
        burger.removeEventListener('click', toggle)
        menu.removeEventListener('click', pick as EventListener)
        document.removeEventListener('click', outside)
        document.removeEventListener('keydown', esc)
        wide.removeEventListener('change', onWide)
      })
    }

    // desktop dropdown: 子選單是純 CSS（.mi:hover / :focus-within），而 next/link 換頁時
    // header 不重掛載 —— 點完連結焦點留在 <a> 上、指標也還在面板上，子選單就一直開著。
    // 點到選單連結時：先 blur 解除 :focus-within；若點的是子選單項目，再用 inline style
    // 蓋掉 :hover，直到指標離開該 .mi 才還原（不動 globals.css，驗收閘不受影響）。
    if (menu) {
      const desktop = matchMedia('(min-width: 901px)')
      const pickDesktop = (e: MouseEvent) => {
        if (!desktop.matches) return
        const a = (e.target as Element).closest<HTMLAnchorElement>('a')
        if (!a) return
        a.blur()
        if (!a.closest('.sub-menu')) return
        const mi = a.closest<HTMLElement>('.mi')
        const sub = mi?.querySelector<HTMLElement>('.sub-menu')
        if (!mi || !sub) return
        sub.style.visibility = 'hidden'
        sub.style.opacity = '0'
        // 監聽掛在 DOM 上、不隨 pathname 的 cleanup 移除：換頁後指標還在面板上，此時還原會立刻重開
        mi.addEventListener(
          'mouseleave',
          () => {
            sub.style.visibility = ''
            sub.style.opacity = ''
          },
          { once: true },
        )
      }
      menu.addEventListener('click', pickDesktop as EventListener)
      cleanups.push(() => menu.removeEventListener('click', pickDesktop as EventListener))
    }

    return () => cleanups.forEach((fn) => fn())
  }, [pathname, revealThreshold])

  return null
}
