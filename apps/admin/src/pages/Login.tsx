import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth, type RoleCode } from '@/lib/auth'
import { MANUAL_SEED } from '@/api/seed.manual'

const ROLE_DESC: Record<RoleCode, string> = {
  SuperAdmin: '全部 24 個單元，含會員、訂單、系統設定與操作紀錄',
  Editor: '內容單元與頁面 SEO 可編輯；會員、設定、管理員看不到',
  Viewer: '所有內容唯讀，不能新增、編輯或上下架',
}

export function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [role, setRole] = useState<RoleCode>('SuperAdmin')
  const [sp] = useSearchParams()

  const accounts = MANUAL_SEED.adminUser as unknown as Array<{ email: string; displayName: string; role: RoleCode }>

  // ?as=Editor 的捷徑由 AuthProvider 直接建立 session，這裡只負責把人送進後台
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
          目前為本機示範，後端 <code>/api/v1/admin/*</code> 尚未上線 —— 選一個角色即可進入，
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
          正式版會是 Email + 密碼，首次登入強制改密碼、連續 5 次失敗鎖定 15 分鐘（docs 09 §23）。
        </p>
      </form>
    </div>
  )
}
