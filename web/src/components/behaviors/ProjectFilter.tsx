'use client'
import { useEffect } from 'react'

/** projects.html 的案例篩選（原樣移植） */
export function ProjectFilter() {
  useEffect(() => {
    const pjF = document.getElementById('pjFilters')
    if (!pjF) return
    const cards = [...document.querySelectorAll<HTMLElement>('#pjGrid .pj-card')]
    const onClick = (e: Event) => {
      const b = (e.target as HTMLElement).closest<HTMLElement>('.fbtn')
      if (!b) return
      pjF.querySelectorAll('.fbtn').forEach((x) => x.classList.toggle('active', x === b))
      cards.forEach((c) => {
        c.style.display = b.dataset.f === 'All' || c.dataset.tag === b.dataset.f ? '' : 'none'
      })
    }
    pjF.addEventListener('click', onClick)
    return () => pjF.removeEventListener('click', onClick)
  }, [])
  return null
}
