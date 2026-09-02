'use client'
import { useEffect } from 'react'

/** contact / get-a-quote 的表單送出 → 成功卡（原樣移植，尚未接 API） */
export function PageForm() {
  useEffect(() => {
    const f = document.getElementById('pgForm') as HTMLFormElement | null
    const ok = document.getElementById('pgOk')
    const reset = document.getElementById('pgReset')
    if (!f || !ok) return
    const onSubmit = (e: Event) => {
      e.preventDefault()
      f.hidden = true
      ok.hidden = false
      scrollTo({ top: 0, behavior: 'smooth' })
    }
    const onReset = () => {
      ok.hidden = true
      f.hidden = false
      f.reset()
    }
    f.addEventListener('submit', onSubmit)
    reset?.addEventListener('click', onReset)
    return () => {
      f.removeEventListener('submit', onSubmit)
      reset?.removeEventListener('click', onReset)
    }
  }, [])
  return null
}
