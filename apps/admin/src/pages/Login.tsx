import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth, type RoleCode } from '@/lib/auth'
import { MANUAL_SEED } from '@/api/seed.manual'
import { hasApi, ApiError } from '@/api/http'

const ROLE_DESC: Record<RoleCode, string> = {
  SuperAdmin: '全部 24 個單元，含會員、訂單、系統設定與操作紀錄',
  Editor: '內容單元與頁面 SEO 可編輯；會員、設定、管理員看不到',
  Viewer: '所有內容唯讀，不能新增、編輯或上下架',
}

export function Login() {
  return hasApi ? <PasswordLogin /> : <DemoLogin />
}

/** 三個畫面共用的標頭：品牌小標 + 標題 +（可選）副標。
 *  獨立成元件是為了讓「標題與欄位的距離」只有一個地方要對齊（見 styles.css .login-head）。 */
function LoginHead({ title, sub }: { title: string; sub?: React.ReactNode }) {
  return (
    <div className="login-head">
      <div className="login-brand">
        <span className="login-brand-mark" aria-hidden="true" />
        <span className="login-brand-name">NTI Printing</span>
      </div>
      <h1>{title}</h1>
      {sub && <p className="sub">{sub}</p>}
    </div>
  )
}

/** 接了 API：Email + 密碼。連續 5 次失敗鎖 15 分鐘（後端擋，docs/09 §23）。 */
function PasswordLogin() {
  const { loginWithPassword } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')

    try {
      await loginWithPassword(email, password)
      nav('/')
    } catch (err) {
      // 以 code 分支，不比對訊息字串（docs/10 §5.1）
      const code = err instanceof ApiError ? err.code : 'INTERNAL'
      setError(
        code === 'AUTH_INVALID_CREDENTIALS' ? '帳號或密碼錯誤。'
        : code === 'AUTH_ACCOUNT_INACTIVE' ? (err as ApiError).message
        : code === 'BOT_CHECK_FAILED' ? '機器人驗證未通過，請重新整理後再試。'
        : '無法連線到伺服器，請稍後再試。',
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={submit}>
        <LoginHead title="管理後台" />

        <div className="login-fields">
          <div className="field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="field">
            <label htmlFor="login-password">密碼</label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        {error && (
          <p className="notice danger" role="alert">
            {error}
          </p>
        )}

        <div className="login-actions">
          <button className="btn btn-primary" disabled={busy}>
            {busy ? '登入中…' : '登入'}
          </button>
        </div>

        <p className="login-foot">連續 5 次失敗會鎖定 15 分鐘。忘記密碼請聯絡超級管理員重設。</p>
      </form>
    </div>
  )
}

/** 本機示範：選角色即進入，用來檢視各角色實際看得到什麼。 */
function DemoLogin() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [role, setRole] = useState<RoleCode>('SuperAdmin')
  const [sp] = useSearchParams()

  const accounts = MANUAL_SEED.adminUser as unknown as Array<{ email: string; displayName: string; role: RoleCode }>

  const as = sp.get('as')
  useEffect(() => {
    if (as) nav('/', { replace: true })
  }, [as, nav])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const account = accounts.find((a) => a.role === role) ?? accounts[0]
    login({ email: account.email, displayName: account.displayName, role })
    nav('/')
  }

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={submit}>
        <LoginHead
          title="管理後台"
          sub={
            <>
              目前為本機示範（未設定 <code>VITE_API_BASE</code>）—— 選一個角色即可進入，
              用來檢視各角色實際看得到什麼。
            </>
          }
        />

        <div className="role-pick" role="radiogroup" aria-label="選擇角色">
          {(Object.keys(ROLE_DESC) as RoleCode[]).map((r) => {
            const account = accounts.find((a) => a.role === r)
            return (
              <label key={r}>
                <input type="radio" name="role" checked={role === r} onChange={() => setRole(r)} />
                <span>
                  <b>{r === 'SuperAdmin' ? '超級管理員' : r === 'Editor' ? '內容編輯' : '檢視者'}</b>
                  <small>{ROLE_DESC[r]}</small>
                  {account && <small>{account.email}</small>}
                </span>
              </label>
            )
          })}
        </div>

        <div className="login-actions">
          <button className="btn btn-primary" type="submit">
            進入後台
          </button>
        </div>

        <p className="login-foot">
          設定 <code>VITE_API_BASE</code> 後這裡會變成 Email + 密碼登入。
        </p>
      </form>
    </div>
  )
}

/** 首次登入強制改密碼（docs/09 §23）。改完之前其他畫面都進不去。 */
export function ChangePassword() {
  const { changePassword, logout } = useAuth()
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (next !== confirm) return setError('兩次輸入的新密碼不一致。')
    if (next.length < 8) return setError('新密碼至少 8 碼。')

    setBusy(true)
    setError('')

    try {
      await changePassword(current, next)
    } catch (err) {
      const code = err instanceof ApiError ? err.code : 'INTERNAL'
      setError(code === 'AUTH_INVALID_CREDENTIALS' ? '目前密碼錯誤。' : (err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={submit}>
        <LoginHead
          title="設定新密碼"
          sub="這是你第一次登入，或密碼是由管理員產生的。設定完成後才能使用後台。"
        />

        <div className="login-fields">
          <div className="field">
            <label htmlFor="cp-current">目前密碼</label>
            <input
              id="cp-current"
              type="password"
              autoComplete="current-password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="field">
            <label htmlFor="cp-next">新密碼（至少 8 碼）</label>
            <input
              id="cp-next"
              type="password"
              autoComplete="new-password"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="cp-confirm">再輸入一次</label>
            <input
              id="cp-confirm"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>
        </div>

        {error && (
          <p className="notice danger" role="alert">
            {error}
          </p>
        )}

        <div className="login-actions">
          <button className="btn btn-primary" disabled={busy}>
            {busy ? '更新中…' : '設定新密碼'}
          </button>
          <button type="button" className="btn" onClick={logout}>
            改用其他帳號登入
          </button>
        </div>
      </form>
    </div>
  )
}
