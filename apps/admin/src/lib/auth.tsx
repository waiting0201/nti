import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { can as canDo, ROLE_LABEL, type RoleCode } from './permissions'
import { api, hasApi, loadSession as loadApiSession, saveSession as saveApiSession, type Session as ApiSession } from '@/api/http'

/**
 * 登入狀態。兩種模式，由 `VITE_API_BASE` 有沒有設定決定（見 `api/client.ts`）：
 *
 *   - **接了 API**：`POST /auth/admin/login` 取 JWT，權限來自 token 的 `permissions` claim
 *   - **本機示範**：選一個角色即進入，權限查本地的 171 列矩陣
 *
 * 兩種模式下元件層的 `can()` 用法完全一樣。
 *
 * ⚠ 前端的 `can()` **只決定畫面上顯不顯示**。真正的把關在 `/api/v1/admin/*`
 * 的 JWT + RBAC（未登記於權限表的路徑直接 403），前端不可信。
 */

type Session = {
  email: string
  displayName: string
  role: RoleCode
  /** 接了 API 時由 token 帶回；示範模式為 undefined，改查本地矩陣 */
  permissions?: string[]
  mustChangePassword?: boolean
}

type AuthValue = {
  session: Session | null
  login: (s: Session) => void
  loginWithPassword: (email: string, password: string) => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
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

const fromApiSession = (s: ApiSession): Session => ({
  email: s.email,
  displayName: s.displayName,
  role: (s.roleCode as RoleCode) ?? 'Viewer',
  permissions: s.permissions,
  mustChangePassword: s.mustChangePassword,
})

function initialSession(): Session | null {
  if (hasApi) {
    const stored = loadApiSession()
    return stored ? fromApiSession(stored) : null
  }

  // 示範用捷徑：網址加上 ?as=SuperAdmin|Editor|Viewer 就以該角色進入，
  // 方便把不同角色看到的畫面直接丟連結給客戶。
  // ⚠ 只在示範模式有效——接了 API 之後它會繞過真正的登入，所以擋在 hasApi 之後。
  const as = new URLSearchParams(location.search).get('as')
  if (as && as in DEMO_ACCOUNTS) return DEMO_ACCOUNTS[as as RoleCode]

  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Session) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(initialSession)

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

      loginWithPassword: async (email, password) => {
        const data = await api.post<ApiSession>('/auth/admin/login', { email, password })
        saveApiSession(data)
        setSession(fromApiSession(data))
      },

      changePassword: async (currentPassword, newPassword) => {
        await api.post('/auth/admin/change-password', { currentPassword, newPassword })

        // 改完就不再需要強制導向；token 本身沒變，不用重登
        const stored = loadApiSession()
        if (stored) {
          const next = { ...stored, mustChangePassword: false }
          saveApiSession(next)
          setSession(fromApiSession(next))
        }
      },

      logout: () => {
        setSession(null)
        saveApiSession(null)
        try {
          localStorage.removeItem(KEY)
        } catch {
          /* 同上 */
        }
      },

      can: (code) => {
        if (!session) return false

        // 接了 API：以 token 帶回來的權限碼為準。
        // 超管在後端是逐列展開的（不是萬用碼），所以這裡不需要特例。
        if (session.permissions) return session.permissions.includes(code)

        return canDo(session.role, code)
      },
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
