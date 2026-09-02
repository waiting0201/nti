'use client'
import { useEffect } from 'react'

type Item = { src: string; cap: string; fit?: string }

/** facility.html 的設備分類幻燈片（資料與行為皆自 mockup 原樣移植） */
export function FacilityExplorer() {
  useEffect(() => {
  const SETS: Record<string, Item[]> = {
    pre:[
      {src:'/assets/fac-pre-ctp.jpg',cap:'Heidelberg Suprasetter 105 S CTP'},
      {src:'/assets/fac-pre-proof.jpg',cap:'Prinect Color Proof Pro — digital proofing'},
      {src:'/assets/fac-pre-jazzy.jpg',cap:'Jazzy Light color management system'},
      {src:'/assets/fac-pre-zund.jpg',cap:'ZÜND CCD high-speed cutter'}],
    eco:[
      {src:'/assets/fac-eco-press.png',cap:'Heidelberg Speedmaster CD-102 press line',fit:'contain'},
      {src:'/assets/fac-eco-pressroom.jpg',cap:'Press room — production control'},
      {src:'/assets/fac-eco-axis.jpg',cap:'Axis Control color measurement system'},
      {src:'/assets/fac-eco-imagecontrol.jpg',cap:'Image Control spectral measurement'}],
    post:[
      {src:'/assets/fac-post-diecut.jpg',cap:'Heidelberg Varimatrix 105 die-cutter'},
      {src:'/assets/fac-post-laminate.jpg',cap:'High-speed intelligent laminating machine'},
      {src:'/assets/fac-post-window.jpg',cap:'Digital window patching machine'},
      {src:'/assets/fac-post-gluer.jpg',cap:'High-speed universal folder-gluer'},
      {src:'/assets/fac-post-shrink.jpg',cap:'Automatic heat shrink wrap machine'}],
    qc:[
      {src:'/assets/fac-qc-i1io.png',cap:'X-Rite i1iO spectral color measurement',fit:'contain'},
      {src:'/assets/fac-qc-exact.png',cap:'X-Rite eXact spectrophotometer',fit:'contain'},
      {src:'/assets/fac-qc-icplate.png',cap:'X-Rite IC Plate II dot measurement',fit:'contain'},
      {src:'/assets/fac-qc-barcode.png',cap:'Barcode grade scanner',fit:'contain'},
      {src:'/assets/fac-qc-chamber.png',cap:'Temperature &amp; humidity chamber',fit:'contain'},
      {src:'/assets/fac-qc-rub.png',cap:'Ink rub tester',fit:'contain'},
      {src:'/assets/fac-qc-gloss.png',cap:'Gloss meter — Elcometer 406',fit:'contain'},
      {src:'/assets/fac-qc-blister.png',cap:'Blister packing strength tester',fit:'contain'}],
    tour:[
      {src:'/assets/fac-tour1.jpg',cap:'Factory floor'},
      {src:'/assets/fac-tour2.jpg',cap:'Production aisle'},
      {src:'/assets/fac-tour-main.jpg',cap:'Packaging stock &amp; logistics'}]
  };

    const facImg = document.getElementById('facImg') as HTMLImageElement | null
    const facCap = document.getElementById('facCap')
    const facTabs = [...document.querySelectorAll<HTMLAnchorElement>('.fac-list a')]
    const facPrev = document.getElementById('facPrev')
    const facNext = document.getElementById('facNext')
    if (!facImg || !facCap) return

    let curSet = 'pre'
    let curIdx = 0
    function facShow() {
      const list = SETS[curSet]
      const s = list[curIdx]
      facImg!.src = s.src
      facImg!.style.objectFit = s.fit || 'cover'
      facCap!.innerHTML = s.cap + ' <span class="fac-count">' + (curIdx + 1) + ' / ' + list.length + '</span>'
      facImg!.alt = facCap!.textContent ?? ''
    }
    const tabHandlers = facTabs.map((a) => {
      const h = (e: Event) => {
        e.preventDefault()
        facTabs.forEach((x) => x.classList.remove('active'))
        a.classList.add('active')
        curSet = a.dataset.set as string
        curIdx = 0
        facShow()
      }
      a.addEventListener('click', h)
      return h
    })
    const onPrev = () => {
      curIdx = (curIdx - 1 + SETS[curSet].length) % SETS[curSet].length
      facShow()
    }
    const onNext = () => {
      curIdx = (curIdx + 1) % SETS[curSet].length
      facShow()
    }
    facPrev?.addEventListener('click', onPrev)
    facNext?.addEventListener('click', onNext)

    return () => {
      facTabs.forEach((a, i) => a.removeEventListener('click', tabHandlers[i]))
      facPrev?.removeEventListener('click', onPrev)
      facNext?.removeEventListener('click', onNext)
    }
  }, [])
  return null
}