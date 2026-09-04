import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { UNITS, UNIT_BY_CODE } from '@/units'
import { useAuth, ROLE_LABEL } from '@/lib/auth'
import { ToastHost } from '@/components/ui'
import { hasApi } from '@/api/http'
import type { UnitGroup } from '@/lib/types'

export function Shell() {
  const { session, logout, can } = useAuth()
  const nav = useNavigate()
  const loc = useLocation()

  if (!session) {
    nav('/login', { replace: true })
    return null
  }

  // 沒有 view 權限的單元不出現在選單（真正的把關在後端 RBAC）
  const visible = UNITS.filter((u) => can(`${u.code}.view`))
  const groups: UnitGroup[] = []
  for (const u of visible) if (!groups.includes(u.group)) groups.push(u.group)

  const activeCode = /^\/u\/([\w-]+)/.exec(loc.pathname)?.[1]
  const activeUnit = activeCode ? UNIT_BY_CODE.get(activeCode) : undefined

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <b>NTI Printing</b>
          <span>管理後台</span>
        </div>
        {groups.map((g) => (
          <div className="nav-group" key={g}>
            <span>{g}</span>
            {visible
              .filter((u) => u.group === g)
              .map((u) => (
                <NavLink
                  key={u.code}
                  to={u.code === 'dashboard' ? '/' : `/u/${u.code}`}
                  end={u.code === 'dashboard'}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                  <span className="no">{u.no}</span>
                  <span>{u.title}</span>
                </NavLink>
              ))}
          </div>
        ))}
        {/*
          這行以前是寫死的「尚未串接 API」，接上 API 之後就變成謊話。
          改讀 hasApi（＝有沒有 VITE_API_BASE），資料來源是什麼就顯示什麼。
        */}
        <div className="sidebar-foot">
          {hasApi ? '資料來自 CMS API' : '資料為本機示範用，尚未串接 API'}
          <br />
          docs/09-cms-admin.md · 儀表板 + 24 個單元
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <div className="crumb">
            {activeUnit ? (
              <>
                {activeUnit.group} <span style={{ opacity: 0.5 }}>›</span> <b>{activeUnit.title}</b>
              </>
            ) : (
              <b>待辦總覽</b>
            )}
          </div>
          <div className="spacer" />
          <div className="who">
            <span className="avatar">{session.displayName.slice(0, 1)}</span>
            <span>
              {session.displayName}
              <span style={{ color: 'var(--grey-2)' }}>（{ROLE_LABEL[session.role]}）</span>
            </span>
            <button
              className="btn btn-sm"
              onClick={() => {
                logout()
                nav('/login')
              }}
            >
              登出
            </button>
          </div>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
      <ToastHost />
    </div>
  )
}
