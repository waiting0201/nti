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
        <h1>NTI Printing 管理後台</h1>

        <label className="field">
          <span>Email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
        </label>

        <label className="field">
          <span>密碼</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>

        {error && <p className="sub" style={{ color: 'var(--danger, #c0392b)' }}>{error}</p>}

        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={busy}>
          {busy ? '登入中…' : '登入'}
        </button>

        <p className="sub" style={{ marginTop: 16, marginBottom: 0 }}>
          連續 5 次失敗會鎖定 15 分鐘。忘記密碼請聯絡超級管理員重設。
        </p>
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
        <h1>NTI Printing 管理後台</h1>
        <p className="sub">
          目前為本機示範（未設定 <code>VITE_API_BASE</code>）—— 選一個角色即可進入，
          用來檢視各角色實際看得到什麼。
        </p>
        <div className="role-pick">
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
        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} type="submit">
          進入後台
        </button>
        <p className="sub" style={{ marginTop: 16, marginBottom: 0 }}>
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
        <h1>請先設定新密碼</h1>
        <p className="sub">這是你第一次登入，或密碼是由管理員產生的。設定完成後才能使用後台。</p>

        <label className="field">
          <span>目前密碼</span>
          <input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} required autoFocus />
        </label>
        <label className="field">
          <span>新密碼（至少 8 碼）</span>
          <input type="password" value={next} onChange={(e) => setNext(e.target.value)} required />
        </label>
        <label className="field">
          <span>再輸入一次</span>
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
        </label>

        {error && <p className="sub" style={{ color: 'var(--danger, #c0392b)' }}>{error}</p>}

        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={busy}>
          {busy ? '更新中…' : '設定新密碼'}
        </button>

        <button type="button" className="btn" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} onClick={logout}>
          改用其他帳號登入
        </button>
      </form>
    </div>
  )
}
