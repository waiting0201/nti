import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { can as canDo, ROLE_LABEL, type RoleCode } from './permissions'

/**
 * 登入狀態。目前是本機示範：選一個角色即進入後台，用來展示 docs §6 的權限矩陣
 * 實際長什麼樣。接上後端後改成打 `/api/v1/admin/auth/login` 取 JWT，
 * 角色與權限由 token 內的 claims 決定，元件層的 can() 用法不變。
 */

type Session = { email: string; displayName: string; role: RoleCode }

type AuthValue = {
  session: Session | null
  login: (s: Session) => void
  logout: () => void
  can: (code: string) => boolean
}

const AuthCtx = createContext<AuthValue | null>(null)
const KEY = 'nti-admin-session'

const DEMO_ACCOUNTS: Record<RoleCode, Session> = {
  SuperAdmin: { email: 'tim@nti-printing.com', displayName: 'Tim（系統管理）', role: 'SuperAdmin' },
  Editor: { email: 'sinting.wang@nti-printing.com', displayName: '王思婷', role: 'Editor' },
  Viewer: { email: 'yun.li@nti-printing.com', displayName: '李昀', role: 'Viewer' },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => {
    // 示範用捷徑：任何網址加上 ?as=SuperAdmin|Editor|Viewer 就以該角色進入，
    // 方便把不同角色看到的畫面直接丟連結給客戶。整套登入目前都還是本機示範
    // （沒有真的驗證），接上後端後這段會一併移除。
    const as = new URLSearchParams(location.search).get('as')
    if (as && as in DEMO_ACCOUNTS) return DEMO_ACCOUNTS[as as RoleCode]
    try {
      const raw = localStorage.getItem(KEY)
      return raw ? (JSON.parse(raw) as Session) : null
    } catch {
      return null
    }
  })

  const value = useMemo<AuthValue>(
    () => ({
      session,
      login: (s) => {
        setSession(s)
        try {
          localStorage.setItem(KEY, JSON.stringify(s))
        } catch {
          /* 無痕視窗：僅留在記憶體 */
        }
      },
      logout: () => {
        setSession(null)
        try {
          localStorage.removeItem(KEY)
        } catch {
          /* 同上 */
        }
      },
      can: (code) => (session ? canDo(session.role, code) : false),
    }),
    [session],
  )

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export function useAuth() {
  const v = useContext(AuthCtx)
  if (!v) throw new Error('useAuth 必須在 AuthProvider 之內使用')
  return v
}

export { ROLE_LABEL }
export type { RoleCode, Session }
