'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { apiBase, hasApi } from '@/lib/api'
import { splitLocale } from '@/lib/i18n'

/**
 * contact / get-a-quote 的表單送出。
 *
 * 版面與欄位都在 `mockup/`（切版鐵律），這裡只掛行為——所以整個元件不渲染任何
 * 節點，只對既有的 `#pgForm` 加監聽，`verify:markup` 因此不受影響。
 * 錯誤訊息的節點是送出失敗時才在 client 端插入的，SSR 輸出一字不變。
 *
 * **沒設 `NEXT_PUBLIC_API_BASE` 就維持原型行為**（直接顯示成功卡），與 `lib/api`
 * 的整層停用同一個判斷：公開站已經在線上，接了空後端只會讓表單看起來壞掉。
 */

/** reCAPTCHA v3 的動作名稱，必須與後端 `BotCheckActions` 一字不差。 */
const ACTION = { quote: 'quote', contact: 'contact' } as const

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? ''

/**
 * 這幾句在 mockup 裡沒有英文原文（是送出失敗才會出現的訊息），
 * 所以不走 `zh.ts` 那本以 mockup 英文為 key 的字典，直接寫在這裡。
 */
const MSG = {
  sending:   { en: 'Sending…',            zh: '傳送中…' },
  botFailed: { en: 'Verification failed. Please refresh the page and try again.',
               zh: '機器人驗證未通過，請重新整理後再試。' },
  tooMany:   { en: 'Too many submissions. Please try again later.',
               zh: '提交次數過於頻繁，請稍後再試。' },
  tooLarge:  { en: 'Attachment too large or too many files (max 20 MB each, up to 5).',
               zh: '附件太大或數量過多（單檔上限 20MB，最多 5 個）。' },
  badType:   { en: 'Unsupported file type. Accepted: PDF, AI, PSD, JPG, PNG, ZIP.',
               zh: '不支援的檔案格式，可接受 PDF、AI、PSD、JPG、PNG、ZIP。' },
  invalid:   { en: 'Please check the highlighted fields and try again.',
               zh: '請檢查填寫的欄位後再送出一次。' },
  failed:    { en: 'Could not send right now. Please try again, or email us directly.',
               zh: '目前無法送出，請稍後再試，或直接寫信給我們。' },
} as const

/** API 的錯誤碼 → 給人看的訊息。沒對到的一律用通用訊息，不把內部代碼丟給訪客。 */
const BY_CODE: Record<string, keyof typeof MSG> = {
  BOT_CHECK_FAILED:  'botFailed',
  RATE_LIMITED:      'tooMany',
  UPLOAD_SIZE:       'tooLarge',
  UPLOAD_TYPE:       'badType',
  VALIDATION_FAILED: 'invalid',
  VALIDATION_REQUIRED: 'invalid',
  VALIDATION_FORMAT: 'invalid',
}

declare global {
  interface Window {
    grecaptcha?: {
      ready(cb: () => void): void
      execute(siteKey: string, opts: { action: string }): Promise<string>
    }
    /** api.js 自己放的初始化旗標，卸載時得一起清掉才會重新畫出 badge。 */
    ___grecaptcha_cfg?: unknown
  }
}

/** 載入 reCAPTCHA v3 的 script（只載一次）。沒設 site key 就不載。 */
function loadRecaptcha(): void {
  if (!SITE_KEY || document.getElementById('recaptcha-v3')) return

  const script = document.createElement('script')
  script.id = 'recaptcha-v3'
  script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`
  script.async = true
  document.head.appendChild(script)
}

/** 目前掛載中的表單頁數量；StrictMode 的重掛與下面的延遲清掃都靠它判斷「真的離開了」。 */
let mountedForms = 0

/**
 * 把 reCAPTCHA 整包拆掉。
 *
 * 右下角那顆 badge 是 api.js 直接掛在 `<body>` 上的，不屬於 React 樹，所以換頁時
 * 不會跟著這個元件消失——只要訪客進過一次聯絡／報價頁，badge 就會跟著他逛完整站。
 * 只有這兩頁需要驗證，因此離開時連 script、badge、challenge 的 iframe 一起收掉。
 */
function sweepRecaptcha(): void {
  if (mountedForms > 0) return                 // 又回到表單頁了，別把新的 badge 掃掉

  document.querySelectorAll('script[src*="recaptcha"]').forEach((el) => el.remove())

  // badge 與 challenge 的 iframe 各自被包在一層 body 直屬的 div 裡，連外層一起移除
  document.querySelectorAll('.grecaptcha-badge, iframe[src*="recaptcha"]').forEach((el) => {
    const wrapper = el.closest('body > div')
    ;(wrapper ?? el).remove()
  })

  // 兩個 global 都要清，不然下次載入 api.js 會以為已經初始化過，badge 不會再出現
  delete window.grecaptcha
  delete window.___grecaptcha_cfg
}

/** 卸載時清一次，兩秒後再清一次——訪客一進來就馬上換頁時，badge 會在拆完之後才畫出來。 */
function unloadRecaptcha(): void {
  sweepRecaptcha()
  setTimeout(sweepRecaptcha, 2000)
}

/** 取 token。沒設 site key 或載入失敗時回 null——後端沒設 secret 時本來就會放行。 */
async function recaptchaToken(action: string): Promise<string | null> {
  if (!SITE_KEY) return null

  const ready = await new Promise<boolean>((resolve) => {
    const start = Date.now()
    const tick = () => {
      if (window.grecaptcha?.execute) return resolve(true)
      if (Date.now() - start > 5000) return resolve(false)   // 載不到就別讓表單卡住
      setTimeout(tick, 100)
    }
    tick()
  })
  if (!ready) return null

  try {
    return await window.grecaptcha!.execute(SITE_KEY, { action })
  } catch {
    return null
  }
}

export function PageForm() {
  const { locale } = splitLocale(usePathname() ?? '/')

  useEffect(() => {
    const form = document.getElementById('pgForm') as HTMLFormElement | null
    const ok = document.getElementById('pgOk')
    const reset = document.getElementById('pgReset')
    if (!form || !ok) return

    // 有 requirement 欄位的是報價單，只有 message 的是聯絡表單
    const kind: keyof typeof ACTION = form.querySelector('[name="requirement"]') ? 'quote' : 'contact'
    const submit = form.querySelector('button[type="submit"]') as HTMLButtonElement | null
    const submitLabel = submit?.innerHTML ?? ''

    mountedForms += 1
    loadRecaptcha()

    const say = (text: string) => {
      let box = form.querySelector('.form-error') as HTMLElement | null
      if (!box) {
        box = document.createElement('p')
        box.className = 'form-error'
        box.setAttribute('role', 'alert')
        submit?.parentElement?.insertBefore(box, submit)
      }
      box.textContent = text
    }
    const clear = () => form.querySelector('.form-error')?.remove()

    const succeed = () => {
      form.hidden = true
      ok.hidden = false
      scrollTo({ top: 0, behavior: 'smooth' })
    }

    const onSubmit = async (e: Event) => {
      e.preventDefault()
      clear()

      // 後端還沒接上時維持原型行為，不然線上的表單會變成「按了沒反應」
      if (!hasApi) return succeed()

      if (submit) {
        submit.disabled = true
        submit.textContent = MSG.sending[locale]
      }

      try {
        const body = new FormData(form)
        const token = await recaptchaToken(ACTION[kind])
        if (token) body.set('recaptchaToken', token)

        // 沒選檔案時 FormData 仍會帶一個空的 files 欄位，後端會當成 0 個附件
        const res = await fetch(`${apiBase}/${kind === 'quote' ? 'quotes' : 'contacts'}`, {
          method: 'POST',
          body,
          headers: { 'Accept-Language': locale },
        })
        const envelope = await res.json().catch(() => null)

        if (res.ok && envelope?.success) return succeed()

        say(MSG[BY_CODE[envelope?.code as string] ?? 'failed'][locale])
      } catch {
        say(MSG.failed[locale])
      } finally {
        if (submit) {
          submit.disabled = false
          submit.innerHTML = submitLabel
        }
      }
    }

    const onReset = () => {
      ok.hidden = true
      form.hidden = false
      form.reset()
      clear()
    }

    form.addEventListener('submit', onSubmit)
    reset?.addEventListener('click', onReset)
    return () => {
      form.removeEventListener('submit', onSubmit)
      reset?.removeEventListener('click', onReset)
      mountedForms -= 1
      unloadRecaptcha()
    }
  }, [locale])

  return null
}
