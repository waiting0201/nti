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
                  to={`/u/${u.code}`}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                  <span className="no">{u.no}</span>
                  <span>{u.title}</span>
                </NavLink>
              ))}
          </div>
        ))}
        {/*
          接上 API 之後這裡什麼都不顯示——「資料來自 CMS API」對使用者不是資訊，
          docs 路徑更只是內部的東西。只留示範模式的警語：那時畫面上的資料是假的，
          不講的話會被當成真的內容在改。
        */}
        {!hasApi && <div className="sidebar-foot">展示模式：畫面上的資料為範例，儲存後不會保留</div>}
      </aside>

      <div className="main">
        <header className="topbar">
          <div className="crumb">
            {activeUnit && (
              <>
                {activeUnit.group} <span style={{ opacity: 0.5 }}>›</span> <b>{activeUnit.title}</b>
              </>
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
