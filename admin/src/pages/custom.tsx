import { useEffect, useMemo, useState } from 'react'
import * as api from '@/api/client'
import type { Row } from '@/api/types'
import { SETTING_GROUPS, MANUAL_SEED, AUDIT_LOG, EMAIL_LOG } from '@/api/seed.manual'
import { LOCALE_LABEL, LOCALES, type Locale } from '@/lib/types'
import { Badge, Hint, Modal, Notice, toast } from '@/components/ui'
import { FieldInput } from '@/components/fields'
import { useAuth, ROLE_LABEL, type RoleCode } from '@/lib/auth'
import { ROLE_PERMISSIONS, permissionRowCount, CONTENT_UNITS } from '@/lib/permissions'

/* ── 21 網站設定 ───────────────────────────────────────── */

export function SettingPage() {
  const { can } = useAuth()
  const canEdit = can('setting.edit')
  const [values, setValues] = useState<Record<string, string | { zh: string; en: string }>>({})
  const [locale, setLocale] = useState<Locale>('zh')
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    void api.getSettings().then(setValues)
  }, [])

  const set = (key: string, v: string, i18n?: boolean) => {
    setValues((prev) => {
      if (!i18n) return { ...prev, [key]: v }
      const cur = prev[key]
      const obj = typeof cur === 'object' ? { ...cur } : { zh: '', en: '' }
      obj[locale] = v
      return { ...prev, [key]: obj }
    })
    setDirty(true)
  }

  const read = (key: string, i18n?: boolean) => {
    const v = values[key]
    if (i18n) return typeof v === 'object' ? (v[locale] ?? '') : ''
    return typeof v === 'string' ? v : ''
  }

  return (
    <>
      <div className="page-h">
        <h1>21 · 網站設定</h1>
        <div className="sub">依 SiteSetting 的固定 key 清單渲染，不能自行新增設定項。</div>
      </div>

      <div className="locale-tabs">
        {LOCALES.map((l) => (
          <button key={l} className={locale === l ? 'active' : ''} onClick={() => setLocale(l)}>
            {LOCALE_LABEL[l]}
          </button>
        ))}
        <span className="fill" style={{ fontSize: 12, color: 'var(--grey-2)' }}>
          分頁只影響有多語標記的欄位（公司名稱、地址、營業時間、圖片 Alt）
        </span>
      </div>

      {SETTING_GROUPS.map((g) => (
        <div className="card" key={g.title}>
          <div className="card-h">
            <h2>{g.title}</h2>
          </div>
          <div className="card-b">
            <fieldset disabled={!canEdit} style={{ border: 0 }}>
              {g.fields.map((f) => (
                <FieldInput
                  key={f.key}
                  field={{
                    key: f.key,
                    label: f.label + (f.i18n ? `（${LOCALE_LABEL[locale]}）` : ''),
                    type: f.type,
                    hint: f.hint,
                    i18n: f.i18n,
                  }}
                  value={read(f.key, f.i18n)}
                  onChange={(v) => set(f.key, String(v ?? ''), f.i18n)}
                />
              ))}
            </fieldset>
          </div>
        </div>
      ))}

      <Notice kind="info">
        contact 頁目前是台中的暫代地址，上線前須換成台南實際廠址（IA §7 待客戶提供）。
      </Notice>

      <div className="card">
        <div className="card-b btn-row">
          {dirty && <span style={{ fontSize: 12.5, color: 'var(--warn)' }}>有未儲存的變更</span>}
          <span style={{ marginLeft: 'auto' }} />
          <button
            className="btn btn-primary"
            disabled={!canEdit || !dirty}
            onClick={async () => {
              await api.saveSettings(values)
              setDirty(false)
              toast('設定已儲存')
            }}
          >
            儲存設定
          </button>
        </div>
      </div>
    </>
  )
}

/* ── 22 分類管理 ───────────────────────────────────────── */

const CATEGORY_TYPES: Array<[string, string]> = [
  ['News', '最新消息'],
  ['Project', '案例實績'],
  ['Vlog', 'Green Vlog'],
  ['Faq', 'FAQ'],
  ['Certification', '認證・夥伴・獎項'],
  ['Facility', '設備與廠房'],
  ['SupplierNotice', '供應商公告'],
  ['Industry', '產業別'],
  ['Material', '報價材質'],
]

export function CategoryPage() {
  const { can } = useAuth()
  const canEdit = can('category.edit')
  const [type, setType] = useState('News')
  const [rows, setRows] = useState<Row[]>([])
  const [confirm, setConfirm] = useState<Row | null>(null)

  const load = () => void api.listAll('category').then(setRows)
  useEffect(load, [])

  const shown = rows.filter((r) => r.categoryType === type)

  return (
    <>
      <div className="page-h">
        <h1>22 · 分類管理</h1>
        <div className="sub">已被引用的分類不可刪除，只能停用。九種分類共 {rows.length} 筆。</div>
      </div>

      <div className="locale-tabs" style={{ flexWrap: 'wrap' }}>
        {CATEGORY_TYPES.map(([code, label]) => (
          <button key={code} className={type === code ? 'active' : ''} onClick={() => setType(code)}>
            {label}
          </button>
        ))}
      </div>

      <div className="card">
        <table className="list">
          <thead>
            <tr>
              <th style={{ width: 160 }}>代號 Code</th>
              <th>中文名稱</th>
              <th>English</th>
              <th style={{ width: 90 }}>排序</th>
              <th style={{ width: 100 }}>引用筆數</th>
              <th style={{ width: 90 }}>啟用</th>
              <th style={{ width: 90 }} />
            </tr>
          </thead>
          <tbody>
            {shown.map((c) => {
              const usage = api.categoryUsage(c.id)
              return (
                <tr key={c.id}>
                  <td>
                    <code style={{ fontSize: 12 }}>{String(c.code)}</code>
                    <div className="hint" style={{ margin: 0 }}>
                      建立後不可修改
                    </div>
                  </td>
                  <td className="row-title">{String(c.i18n?.zh?.name ?? '')}</td>
                  <td>{String(c.i18n?.en?.name ?? '')}</td>
                  <td>{String(c.sortOrder ?? '')}</td>
                  <td>{usage}</td>
                  <td>
                    <Badge kind={c.isActive === false ? 'off' : 'ok'}>{c.isActive === false ? '停用' : '啟用'}</Badge>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-danger" disabled={!canEdit} onClick={() => setConfirm(c)}>
                      {usage > 0 ? '停用' : '刪除'}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {confirm && (
        <Modal
          title={api.categoryUsage(confirm.id) > 0 ? '停用分類' : '刪除分類'}
          confirmKind="btn-danger"
          confirmLabel={api.categoryUsage(confirm.id) > 0 ? '停用' : '刪除'}
          onCancel={() => setConfirm(null)}
          onConfirm={async () => {
            const usage = api.categoryUsage(confirm.id)
            await api.save('category', usage > 0 ? { ...confirm, isActive: false } : { ...confirm, isDeleted: true })
            setConfirm(null)
            toast(usage > 0 ? '分類已停用' : '分類已刪除')
            load()
          }}
        >
          {api.categoryUsage(confirm.id) > 0 ? (
            <>
              「{String(confirm.i18n?.zh?.name)}」目前有 <b>{api.categoryUsage(confirm.id)}</b> 筆內容引用，不能刪除。
              停用後不會再出現在新增內容的下拉選單，既有內容不受影響。
            </>
          ) : (
            <>沒有任何內容引用「{String(confirm.i18n?.zh?.name)}」，可以安全刪除。</>
          )}
        </Modal>
      )}
    </>
  )
}

/* ── 23 管理員與角色 ───────────────────────────────────── */

const MATRIX_ROWS: Array<{ label: string; codes: string[] }> = [
  { label: '內容單元 01–14 檢視', codes: CONTENT_UNITS.map((u) => `${u}.view`) },
  { label: '內容單元 01–14 新增／編輯／排序', codes: CONTENT_UNITS.map((u) => `${u}.edit`) },
  { label: '內容單元 01–14 上下架', codes: CONTENT_UNITS.map((u) => `${u}.publish`) },
  { label: '內容單元 01–14 刪除', codes: CONTENT_UNITS.map((u) => `${u}.delete`) },
  { label: '15 頁面 SEO ／ 16 轉址', codes: ['page.edit', 'redirect.edit'] },
  { label: '17 報價 ／ 18 聯絡：檢視・改狀態', codes: ['quote.edit', 'contact.edit'] },
  { label: '17 報價：附件下載・匯出 CSV', codes: ['quote.download', 'quote.export'] },
  { label: '19 會員 ／ 20 訂單', codes: ['member.view', 'order.view'] },
  { label: '21 網站設定 ／ 22 分類', codes: ['setting.edit', 'category.edit'] },
  { label: '23 管理員與角色', codes: ['admin.edit'] },
  { label: '24 操作紀錄', codes: ['audit.view'] },
]

export function AdminUsersPage() {
  const { session } = useAuth()
  const users = MANUAL_SEED.adminUser as unknown as Array<Row & { email: string; displayName: string; role: RoleCode; isActive: boolean; lastLoginAt: string }>
  const counts = useMemo(permissionRowCount, [])

  return (
    <>
      <div className="page-h">
        <h1>23 · 管理員與角色</h1>
        <div className="sub">不可停用或降級自己；系統至少保留一名啟用中的超級管理員。</div>
      </div>

      <div className="card">
        <div className="card-h">
          <h2>管理員</h2>
        </div>
        <table className="list">
          <thead>
            <tr>
              <th>Email</th>
              <th style={{ width: 160 }}>顯示名稱</th>
              <th style={{ width: 130 }}>角色</th>
              <th style={{ width: 90 }}>啟用</th>
              <th style={{ width: 180 }}>最後登入</th>
              <th style={{ width: 90 }} />
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const isSelf = u.email === session?.email
              return (
                <tr key={u.id}>
                  <td className="row-title">{u.email}</td>
                  <td>{u.displayName}</td>
                  <td>{ROLE_LABEL[u.role]}</td>
                  <td>
                    <Badge kind={u.isActive ? 'ok' : 'off'}>{u.isActive ? '啟用' : '停用'}</Badge>
                  </td>
                  <td>{String(u.lastLoginAt).replace('T', ' ').replace('Z', '')}</td>
                  <td>
                    <button className="btn btn-sm" disabled={isSelf} title={isSelf ? '不可停用或降級自己' : ''}>
                      停用
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <div className="card-b">
          <Notice kind="info">
            新增管理員時寄啟用信、強制首次登入改密碼；連續 5 次登入失敗鎖定 15 分鐘。
          </Notice>
        </div>
      </div>

      <div className="card">
        <div className="card-h">
          <h2>權限矩陣</h2>
          <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--grey-2)' }}>
            展開後共 {counts.total} 列（超級管理員 {counts.SuperAdmin}／內容編輯 {counts.Editor}／檢視者 {counts.Viewer}）
          </span>
        </div>
        <div className="card-b">
          <table className="matrix">
            <thead>
              <tr>
                <th>動作</th>
                <th style={{ width: 110 }}>超級管理員</th>
                <th style={{ width: 110 }}>內容編輯</th>
                <th style={{ width: 110 }}>檢視者</th>
              </tr>
            </thead>
            <tbody>
              {MATRIX_ROWS.map((r) => (
                <tr key={r.label}>
                  <td>{r.label}</td>
                  {(['SuperAdmin', 'Editor', 'Viewer'] as RoleCode[]).map((role) => {
                    const all = r.codes.every((c) => ROLE_PERMISSIONS[role].has(c))
                    const some = r.codes.some((c) => ROLE_PERMISSIONS[role].has(c))
                    return (
                      <td key={role} className="c">
                        {all ? '✓' : some ? '部分' : '—'}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <Hint text="權限碼格式 `{單元代號}.{view|edit|publish|delete|export}`。**這張表是權限的權威來源**，對應 db/seed/110_role_permission.sql。" />
        </div>
      </div>
    </>
  )
}

/* ── 24 操作紀錄 ───────────────────────────────────────── */

export function AuditPage() {
  const { can } = useAuth()
  const [tab, setTab] = useState<'audit' | 'email'>('audit')

  return (
    <>
      <div className="page-h">
        <h1>24 · 操作紀錄</h1>
        <div className="sub">唯讀。保留 12 個月，逾期由排程清除。</div>
      </div>

      <div className="locale-tabs">
        <button className={tab === 'audit' ? 'active' : ''} onClick={() => setTab('audit')}>
          操作紀錄
        </button>
        <button className={tab === 'email' ? 'active' : ''} onClick={() => setTab('email')}>
          信件紀錄
        </button>
      </div>

      <div className="card">
        {tab === 'audit' ? (
          <table className="list">
            <thead>
              <tr>
                <th style={{ width: 170 }}>時間</th>
                <th style={{ width: 140 }}>管理員</th>
                <th style={{ width: 70 }}>動作</th>
                <th>對象</th>
                <th style={{ width: 120 }}>IP</th>
                <th style={{ width: 280 }}>變更明細</th>
              </tr>
            </thead>
            <tbody>
              {AUDIT_LOG.map((a) => (
                <tr key={a.id}>
                  <td>{a.at.replace('T', ' ').replace('Z', '')}</td>
                  <td>{a.actor}</td>
                  <td>{a.action}</td>
                  <td className="row-title">{a.target}</td>
                  <td>{a.ip}</td>
                  <td className="diff">{a.diff || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="list">
            <thead>
              <tr>
                <th style={{ width: 170 }}>時間</th>
                <th style={{ width: 240 }}>收件者</th>
                <th>主旨</th>
                <th style={{ width: 80 }}>狀態</th>
                <th style={{ width: 300 }}>失敗原因</th>
                <th style={{ width: 80 }} />
              </tr>
            </thead>
            <tbody>
              {EMAIL_LOG.map((e) => (
                <tr key={e.id}>
                  <td>{e.at.replace('T', ' ').replace('Z', '')}</td>
                  <td>{e.to}</td>
                  <td className="row-title">{e.subject}</td>
                  <td>
                    <Badge kind={e.status === '成功' ? 'ok' : 'danger'}>{e.status}</Badge>
                  </td>
                  <td className="diff">{e.error || '—'}</td>
                  <td>
                    {e.status === '失敗' && (
                      <button
                        className="btn btn-sm"
                        disabled={!can('audit.resend')}
                        title={can('audit.resend') ? '' : '需要 audit.resend 權限'}
                        onClick={() => toast('已重新寄送（示範）')}
                      >
                        重寄
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}
