import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/lib/auth'
import { Shell } from '@/pages/Shell'
import { ChangePassword, Login } from '@/pages/Login'
import { ListPage } from '@/pages/ListPage'
import { EditPage } from '@/pages/EditPage'
import { SettingPage, CategoryPage, AdminUsersPage, AuditPage } from '@/pages/custom'
import { Notice } from '@/components/ui'
import { UNITS, UNIT_BY_CODE, validateUnits } from '@/units'

// 開發期把設定檔的問題直接吼出來（對應 docs §8 DoD 的兩條檢查）
if (import.meta.env.DEV) {
  const problems = validateUnits()
  if (problems.length) console.error('[units] 設定不符合 docs/09 規格：\n' + problems.join('\n'))
}

/**
 * 後台沒有首頁——原本的 00 待辦總覽已移除（數字卡的連結與統計範圍對不上，
 * 且全站掃描在分頁 API 下會失真）。登入後直接落在側邊欄第一個看得到的單元，
 * 判斷方式與 Shell 的選單可見性一致，權限矩陣改了也不會導到看不到的頁。
 */
function Landing() {
  const { can } = useAuth()
  const first = UNITS.find((u) => can(`${u.code}.view`))
  if (!first) return <Notice kind="danger">你的角色目前沒有任何可用的單元，請聯絡超級管理員。</Notice>
  return <Navigate to={`/u/${first.code}`} replace />
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
  if (!session) return <Navigate to="/login" replace />

  // 首登或管理員產生的密碼：改完之前不讓進後台（docs/09 §23）。
  // 後端那邊 /auth/admin/change-password 刻意不要求權限碼，否則這裡會卡死。
  if (session.mustChangePassword) return <ChangePassword />

  return <>{children}</>
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
          <Route index element={<Landing />} />
          <Route path="u/:code" element={<UnitRoute />} />
          <Route path="u/:code/:id" element={<EditPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
