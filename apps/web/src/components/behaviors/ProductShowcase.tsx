'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { splitLocale } from '@/lib/i18n'
import { tr } from '@/lib/t-client'

export type ShowcaseItem = { src: string; name: string; cap: string }
type Item = ShowcaseItem
type Set = { apps: string; items: Item[] }

/**
 * solutions.html 的產品分類幻燈片（資料與行為皆自 mockup 原樣移植）。
 * `cms`：後台「02 解決方案 › 品項卡」的內容，有的方案就取代下面寫死的 items（Applications 那行仍照 mockup）。
 */
/**
 * `overrides`：後台單元 15「頁面文字」的覆寫（`page.texts`）。這個元件切換時會用下面寫死的清單重畫
 * 名稱／說明／Applications，不帶覆寫的話，後台改過的字一按左右鍵就變回原文（2026-11-13 稽核 A8）。
 * 後台品項卡的名稱與說明已經是該語系的內容，不經過字典也不經過覆寫。
 */
export function ProductShowcase({ cms = {}, overrides }: {
  cms?: Partial<Record<string, ShowcaseItem[]>>
  overrides?: Record<string, string>
}) {
  const { locale } = splitLocale(usePathname() ?? '/')
  useEffect(() => {
  const SETS: Record<string, Set> = {
    boxes:{apps:'Food | Electronics | Beauty | Medical | Luxury | Consumer Goods',items:[
      {src:'/assets/prod-box-gluing.jpg',name:'Gluing Box',cap:'The most common box type — top and bottom open, easy to assemble, and suited to lighter products.'},
      {src:'/assets/prod-box-bottom.jpg',name:'Bottom Gluing Box',cap:'Glued bottom carries more weight while staying easy to assemble — the choice for heavier products.'},
      {src:'/assets/prod-box-insert.jpg',name:'Insert Bottom Box',cap:'Four latches in a crossed structure add loading strength — easy to assemble and more economical.'},
      {src:'/assets/prod-box-handcarry.jpg',name:'Hand-Carry Box',cap:'Glued or crossed bottom with a built-in handle — no extra carrier bag needed. Popular for gift boxes, cakes, and takeaway.'},
      {src:'/assets/prod-box-topbottom.jpg',name:'Top & Bottom Box',cap:'Separate lid and base — a more complex structure with an elegant, premium presentation.'},
      {src:'/assets/prod-box-special.jpg',name:'Special Package',cap:'Customized structural design and material suggestions for shapes beyond the standard catalogue.'}]},
    cardboard:{apps:'Electronics | Electrical Appliances | Hardware | Auto Parts',items:[
      {src:'/assets/prod-card-hangtag.jpg',name:'Paper Hang Tags & Blister Backcards',cap:'Backcards for blister vacuum packaging — hand tools, electronic spare parts, and automotive components.'},
      {src:'/assets/prod-card-blister.jpg',name:'Blister Cardboard',cap:'Two cardboards laminated with one blister — protective display packaging for retail products.'}]},
    uv:{apps:'PE / PVC / PP Films | Metal Foils | Glossy Cardboard',items:[
      {src:'/assets/prod-uv-print.jpg',name:'UV Printing',cap:'Litho printing on non-absorbent materials — instant ink curing means post-finishing can start immediately, with no backprint, shorter lead times, and lower cost.'},
      {src:'/assets/prod-uv-special.webp',name:'Special Printing & Anti-Counterfeiting',cap:'Foil embossing and logical-light embossment — custom-developed finishes that protect and elevate your brand.'}]},
    other:{apps:'Corporate Gifts | Festival Promotion | Brand Merchandising',items:[
      {src:'/assets/prod-other-bag.jpg',name:'Hand Bags',cap:'Paper, plastic, or textile carrier bags that promote products and strengthen brand image.'},
      {src:'/assets/prod-other-redenvelope.webp',name:'Red Envelopes',cap:'Strong seasonal impact through graphic design and heat-emboss finishing.'},
      {src:'/assets/prod-other-calendar.webp',name:'Desk Calendars',cap:'A daily-use gift for festivals, corporate gifting, and advertising promotion.'},
      {src:'/assets/prod-other-mousepad.webp',name:'Mouse Pads',cap:'UV-printed for color saturation and long-lasting fade resistance.'},
      {src:'/assets/prod-other-manual.png',name:'Instructions & Catalogs',cap:'Product manuals and catalogs — functions, usage, instructions, and precautions.'}]}
  };
  const fromCms = new Set<string>()
  for (const [code, items] of Object.entries(cms)) if (items?.length && SETS[code]) { SETS[code].items = items; fromCms.add(code) }
  const text = (s: string) => tr(locale, s, overrides)

    const psImg = document.getElementById('psImg') as HTMLImageElement | null
    const psName = document.getElementById('psName')
    const psCap = document.getElementById('psCap')
    const psApps = document.getElementById('psApps')
    const psTabs = [...document.querySelectorAll<HTMLAnchorElement>('.fac-list a')]
    const psPrev = document.getElementById('psPrev')
    const psNext = document.getElementById('psNext')
    if (!psImg || !psName || !psCap || !psApps) return

    // 起始分頁＝伺服器標成 active 的那一個（boxes 被下架時不是第一個）
    const initial = psTabs.find((a) => a.classList.contains('active'))?.dataset.set
    let curSet = initial && SETS[initial] ? initial : 'boxes'
    let curIdx = 0
    function psShow() {
      const set = SETS[curSet]
      const s = set.items[curIdx]
      psImg!.src = s.src
      const own = fromCms.has(curSet)
      psName!.textContent = own ? s.name : text(s.name)
      psName!.insertAdjacentHTML('beforeend', ' <span class="fac-count">' + (curIdx + 1) + ' / ' + set.items.length + '</span>')
      psCap!.textContent = own ? s.cap : text(s.cap)
      psApps!.textContent = text(set.apps)
      psImg!.alt = psName!.textContent ?? ''
    }
    // 伺服器先畫的是第一個分頁的第一張，但 Applications 那行固定是 boxes 的；起始分頁不是 boxes 時補畫一次
    if (curSet !== 'boxes') psShow()
    const tabHandlers = psTabs.map((a) => {
      const h = (e: Event) => {
        e.preventDefault()
        psTabs.forEach((x) => x.classList.remove('active'))
        a.classList.add('active')
        curSet = a.dataset.set as string
        curIdx = 0
        psShow()
      }
      a.addEventListener('click', h)
      return h
    })
    const onPrev = () => {
      curIdx = (curIdx - 1 + SETS[curSet].items.length) % SETS[curSet].items.length
      psShow()
    }
    const onNext = () => {
      curIdx = (curIdx + 1) % SETS[curSet].items.length
      psShow()
    }
    psPrev?.addEventListener('click', onPrev)
    psNext?.addEventListener('click', onNext)

    return () => {
      psTabs.forEach((a, i) => a.removeEventListener('click', tabHandlers[i]))
      psPrev?.removeEventListener('click', onPrev)
      psNext?.removeEventListener('click', onNext)
    }
  }, [locale, cms, overrides])
  return null
}