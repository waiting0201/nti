import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/lib/auth'
import { Shell } from '@/pages/Shell'
import { Login } from '@/pages/Login'
import { Dashboard } from '@/pages/Dashboard'
import { ListPage } from '@/pages/ListPage'
import { EditPage } from '@/pages/EditPage'
import { SettingPage, CategoryPage, AdminUsersPage, AuditPage } from '@/pages/custom'
import { Notice } from '@/components/ui'
import { UNIT_BY_CODE, validateUnits } from '@/units'

// 開發期把設定檔的問題直接吼出來（對應 docs §8 DoD 的兩條檢查）
if (import.meta.env.DEV) {
  const problems = validateUnits()
  if (problems.length) console.error('[units] 設定不符合 docs/09 規格：\n' + problems.join('\n'))
}

/** 有自訂畫面的單元走專屬元件，其餘走通用清單 */
function UnitRoute() {
  const { code = '' } = useParams()
  const { can } = useAuth()
  const unit = UNIT_BY_CODE.get(code)
  if (!unit) return <Notice kind="danger">找不到這個單元。</Notice>
  if (!can(`${code}.view`)) return <Notice kind="danger">你的角色沒有檢視這個單元的權限。</Notice>
  if (code === 'setting') return <SettingPage />
  if (code === 'category') return <CategoryPage />
  if (code === 'admin') return <AdminUsersPage />
  if (code === 'audit') return <AuditPage />
  return <ListPage />
}

function Guarded({ children }: { children: React.ReactNode }) {
  const { session } = useAuth()
  return session ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <Guarded>
              <Shell />
            </Guarded>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="u/:code" element={<UnitRoute />} />
          <Route path="u/:code/:id" element={<EditPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
