/**
 * Google reCAPTCHA v3（後台登入）。
 *
 * 後端的 `/auth/admin/login` 與兩支公開表單一樣走 `IBotCheckService`（docs/10 §9.6），
 * 沒帶 token 就是 `BOT_CHECK_FAILED`。⚠ 這一段先前漏掉了：後端的檢查在
 * 2026-09-08 隨 reCAPTCHA v3 一起加上去，但後台從來沒送過 token——只要
 * Function App 設了 `Recaptcha__SecretKey`，登入就必然被擋（2026-09-09 修）。
 *
 * 實作刻意與公開站的 `apps/web/src/components/behaviors/PageForm.tsx` 一致
 * （載入方式、5 秒逾時、拿不到就回 null），兩邊行為不同的話很難對照除錯。
 * 差別只有 env 的取法：Vite 是 `import.meta.env.VITE_*`，Next 是 `process.env.NEXT_PUBLIC_*`。
 */

/** 動作名稱必須與後端 `BotCheckActions` 一字不差，否則 siteverify 會回 action 不符。 */
export const RECAPTCHA_ACTIONS = { adminLogin: 'admin_login' } as const

const SITE_KEY = (import.meta.env.VITE_RECAPTCHA_SITE_KEY ?? '') as string

declare global {
  interface Window {
    grecaptcha?: {
      ready(cb: () => void): void
      execute(siteKey: string, opts: { action: string }): Promise<string>
    }
  }
}

/** 載入 v3 的 script（只載一次）。沒設 site key 就不載——本機開發不該被擋住。 */
export function loadRecaptcha(): void {
  if (!SITE_KEY || document.getElementById('recaptcha-v3')) return

  const script = document.createElement('script')
  script.id = 'recaptcha-v3'
  script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`
  script.async = true
  document.head.appendChild(script)
}

/**
 * 取 token。沒設 site key 或載入失敗時回 `null`。
 *
 * 回 null 不代表一定登不進去：後端沒設 secret 時本來就會放行（RecaptchaService）。
 * 設了 secret 卻拿不到 token 時，後端會回 `BOT_CHECK_FAILED`，登入畫面顯示
 * 「機器人驗證未通過，請重新整理後再試」——那正是使用者該做的事（多半是
 * script 被擋或網路不通）。
 */
export async function recaptchaToken(action: string): Promise<string | null> {
  if (!SITE_KEY) return null

  loadRecaptcha()

  const ready = await new Promise<boolean>((resolve) => {
    const start = Date.now()
    const tick = () => {
      if (window.grecaptcha?.execute) return resolve(true)
      if (Date.now() - start > 5000) return resolve(false) // 載不到就別讓登入畫面卡住
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
