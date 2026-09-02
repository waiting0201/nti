'use client'
import { useEffect } from 'react'

/** faq.html 的分類篩選（原樣移植） */
export function FaqFilter() {
  useEffect(() => {
    const faqNav = document.getElementById('faqNav')
    if (!faqNav) return
    const items = [...document.querySelectorAll<HTMLDetailsElement>('.faq-list .faq')]
    const onClick = (e: Event) => {
      const b = (e.target as HTMLElement).closest('button')
      if (!b) return
      faqNav.querySelectorAll('button').forEach((x) => x.classList.toggle('active', x === b))
      items.forEach((d) => {
        const show = b.dataset.c === 'All' || d.dataset.c === b.dataset.c
        d.style.display = show ? '' : 'none'
      })
      const first = items.find((d) => d.style.display !== 'none')
      items.forEach((d) => (d.open = d === first))
    }
    faqNav.addEventListener('click', onClick)
    return () => faqNav.removeEventListener('click', onClick)
  }, [])
  return null
}
