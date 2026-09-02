'use client'
import { useEffect } from 'react'

/** index.html 的 hero 輪播（原樣移植：5.5s 自動、hover 暫停、左右鈕、dots 由 JS 產生） */
export function HeroSlider() {
  useEffect(() => {
    const hero = document.getElementById('hero')
    if (!hero) return
    const slides = [...hero.querySelectorAll<HTMLElement>('.slide')]
    const dotsBox = hero.querySelector<HTMLElement>('.dots')
    if (!dotsBox || !slides.length) return
    dotsBox.innerHTML = ''
    let cur = 0
    let timer: ReturnType<typeof setInterval> | undefined

    slides.forEach((_, i) => {
      const d = document.createElement('button')
      d.className = 'dot' + (i ? '' : ' on')
      d.setAttribute('aria-label', 'Slide ' + (i + 1))
      d.onclick = () => {
        go(i)
        restart()
      }
      dotsBox.appendChild(d)
    })
    const dots = [...dotsBox.children] as HTMLElement[]
    const go = (i: number) => {
      slides[cur].classList.remove('on')
      dots[cur].classList.remove('on')
      cur = (i + slides.length) % slides.length
      slides[cur].classList.add('on')
      dots[cur].classList.add('on')
    }
    const restart = () => {
      clearInterval(timer)
      timer = setInterval(() => go(cur + 1), 5500)
    }
    const prev = hero.querySelector<HTMLElement>('.sbtn.prev')
    const next = hero.querySelector<HTMLElement>('.sbtn.next')
    const onPrev = () => {
      go(cur - 1)
      restart()
    }
    const onNext = () => {
      go(cur + 1)
      restart()
    }
    const stop = () => clearInterval(timer)
    prev?.addEventListener('click', onPrev)
    next?.addEventListener('click', onNext)
    hero.addEventListener('mouseenter', stop)
    hero.addEventListener('mouseleave', restart)
    restart()

    return () => {
      clearInterval(timer)
      prev?.removeEventListener('click', onPrev)
      next?.removeEventListener('click', onNext)
      hero.removeEventListener('mouseenter', stop)
      hero.removeEventListener('mouseleave', restart)
      dotsBox.innerHTML = ''
    }
  }, [])
  return null
}
