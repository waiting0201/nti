import { useEffect, useMemo, useState } from 'react'
import * as api from '@/api/client'
import type { Row } from '@/api/types'
import { SETTING_GROUPS, EMAIL_LOG } from '@/api/seed.manual'
import { LOCALE_LABEL, LOCALES, type Locale } from '@/lib/types'
import { Badge, Hint, Modal, Notice, toast } from '@/components/ui'
import { FieldInput } from '@/components/fields'
import { useAuth, ROLE_LABEL, type RoleCode } from '@/lib/auth'
import { ROLE_PERMISSIONS, permissionRowCount, CONTENT_UNITS } from '@/lib/permissions'
import { countPending, resolvePendingUploads } from '@/lib/pending-uploads'
import { ApiError } from '@/api/http'

/* ── 21 網站設定 ───────────────────────────────────────── */

export function SettingPage() {
  const { can } = useAuth()
  const canEdit = can('setting.edit')
  const [values, setValues] = useState<Record<string, string | { zh: string; en: string }>>({})
  const [locale, setLocale] = useState<Locale>('zh')
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)

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

  const pendingCount = countPending(values)

  const read = (key: string, i18n?: boolean) => {
    const v = values[key]
    if (i18n) return typeof v === 'object' ? (v[locale] ?? '') : ''
    return typeof v === 'string' ? v : ''
  }

  return (
    <>
      <div className="page-h">
        <h1>21 · 網站設定</h1>
        <div className="sub">設定項目固定，不能自行新增。</div>
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
        聯絡我們頁的地址與電話已是客戶提供的台南廠址（2026-09-06）；傳真與地圖仍待客戶提供。
      </Notice>

      <div className="card">
        <div className="card-b btn-row">
          {dirty && (
            <span style={{ fontSize: 12.5, color: 'var(--warn)' }}>
              {pendingCount > 0 ? `有未儲存的變更，含 ${pendingCount} 個待上傳的檔案` : '有未儲存的變更'}
            </span>
          )}
          <span style={{ marginLeft: 'auto' }} />
          <button
            className="btn btn-primary"
            disabled={!canEdit || !dirty || saving}
            onClick={async () => {
              // 圖片欄位是選檔當下暫存、按這裡才真的送出（見 lib/pending-uploads）
              const next = structuredClone(values)
              try {
                setSaving(true)
                await resolvePendingUploads('setting', next)
              } catch (err) {
                const code = err instanceof ApiError ? err.code : 'INTERNAL'
                toast(
                  code === 'UPLOAD_TYPE' ? '檔案格式不符，設定尚未儲存。'
                  : code === 'UPLOAD_SIZE' ? '檔案太大，設定尚未儲存。'
                  : `圖片上傳失敗，設定尚未儲存：${(err as Error).message}`,
                )
                return
              } finally {
                setSaving(false)
              }

              await api.saveSettings(next)
              setValues(next)
              setDirty(false)
              toast('設定已儲存')
            }}
          >
            {saving ? '上傳中…' : '儲存設定'}
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
  const canDelete = can('category.delete')

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
                    <button
                      className="btn btn-sm btn-danger"
                      // 停用是改欄位（category.edit），刪除是刪除（category.delete）——
                      // 兩顆按鈕長在同一個位置，權限也要各認各的
                      disabled={usage > 0 ? !canEdit : !canDelete}
                      onClick={() => setConfirm(c)}
                    >
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
            try {
              if (usage > 0) await api.save('category', { ...confirm, isActive: false })
              else await api.remove('category', [confirm.id])
              toast(usage > 0 ? '分類已停用' : '分類已刪除')
            } catch (err) {
              toast(err instanceof Error ? err.message : '操作失敗，請稍後再試。')
            }
            setConfirm(null)
            load()
          }}

        >
          {api.categoryUsage(confirm.id) > 0 ? (
            <>
              「{String(confirm.i18n?.zh?.name)}」目前有 <b>{api.categoryUsage(confirm.id)}</b> 筆內容引用，不能刪除。
              停用後不會再出現在新增內容的下拉選單，既有內容不受影響。
            </>
          ) : (
            <>
              沒有任何內容引用「{String(confirm.i18n?.zh?.name)}」，可以安全刪除。
              <br />
              <b>這是真的刪除，無法還原</b>；要再用同一個代號得重新建立一筆。
            </>
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
  { label: '15 頁面 SEO', codes: ['page.edit'] },
  { label: '15 頁面：刪除', codes: ['page.delete'] },
  { label: '17 報價 ／ 18 聯絡：檢視・改狀態', codes: ['quote.edit', 'contact.edit'] },
  { label: '17 報價：附件下載・匯出 CSV', codes: ['quote.download', 'quote.export'] },
  { label: '17 報價 ／ 18 聯絡：刪除', codes: ['quote.delete', 'contact.delete'] },
  { label: '21 網站設定 ／ 22 分類', codes: ['setting.edit', 'category.edit'] },

  { label: '23 管理員與角色', codes: ['admin.edit'] },
  { label: '24 信件紀錄', codes: ['audit.view'] },
]

type Draft = {
  id: string | null
  username: string
  displayName: string
  email: string
  roleId: number
  isActive: boolean
  /** 新增時是必填的初始密碼；編輯時留空＝不改密碼。 */
  password: string
  password2: string
}

const NEW_DRAFT: Draft = {
  id: null, username: '', displayName: '', email: '', roleId: 2, isActive: true, password: '', password2: '',
}

/** 與後端 `AuthHandler.MinPasswordLength`、Login.tsx 的 `MIN_PASSWORD_LENGTH` 同一個值。 */
const MIN_PASSWORD_LENGTH = 6

export function AdminUsersPage() {
  const { can, session } = useAuth()
  const canEdit = can('admin.edit')
  const canDelete = can('admin.delete')

  const [users, setUsers] = useState<api.AdminAccount[]>([])
  const [roles, setRoles] = useState<api.AdminRole[]>([])
  const [loading, setLoading] = useState(true)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [confirm, setConfirm] = useState<api.AdminAccount | null>(null)
  const counts = useMemo(permissionRowCount, [])

  const load = () => {
    setLoading(true)
    void Promise.all([api.listAdmins(), api.listRoles()])
      .then(([u, r]) => {
        setUsers(u)
        setRoles(r)
      })
      .catch((e: Error) => toast(e.message))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const roleName = (code: string) => ROLE_LABEL[code as RoleCode] ?? code
  const isSelf = (u: api.AdminAccount) => u.username === session?.username

  /** 停用／刪除自己都會把自己鎖在外面，後端也會擋（回 409）；這裡先不給按。 */
  const lastSuperAdmin = (u: api.AdminAccount) =>
    u.roleCode === 'SuperAdmin' &&
    users.filter((x) => x.roleCode === 'SuperAdmin' && x.isActive).length <= 1

  async function submit() {
    if (!draft) return
    const username = draft.username.trim()
    const displayName = draft.displayName.trim()

    if (!displayName) return toast('顯示名稱為必填。')
    if (!draft.id && username.length < 3) return toast('帳號至少 3 個字。')

    // 新增一定要設密碼；編輯時留空代表這次不改密碼
    const password = draft.password
    if (!draft.id && !password) return toast('請設定密碼。')
    if (password) {
      if (password.length < MIN_PASSWORD_LENGTH) return toast(`密碼至少 ${MIN_PASSWORD_LENGTH} 碼。`)
      if (password !== draft.password2) return toast('兩次輸入的密碼不一致。')
    }

    try {
      if (draft.id) {
        await api.updateAdmin(draft.id, {
          // 清空信箱要送空字串，不是 null——後端把 null 當成「這次沒改」，
          // 送 null 會讓「把信箱刪掉」這個動作靜靜地沒有生效
          displayName,
          email: draft.email.trim(),
          roleId: draft.roleId,
          isActive: draft.isActive,
        })
        // 密碼走另一支端點，只有真的填了才送
        if (password) await api.setAdminPassword(draft.id, password)
        toast(password ? '已更新，密碼已重設' : '已更新')
      } else {
        await api.createAdmin({
          username,
          displayName,
          email: draft.email.trim() || undefined,
          roleId: draft.roleId,
          password,
        })
        toast('已建立，請把帳號密碼轉交給對方')
      }
      setDraft(null)
      load()
    } catch (e) {
      toast((e as Error).message)
    }
  }

  return (
    <>
      <div className="page-h">
        <h1>23 · 管理員與角色</h1>
        <div className="sub">不可停用或降級自己；系統至少保留一名啟用中的超級管理員。</div>
      </div>

      <div className="card">
        <div className="card-h">
          <h2>管理員</h2>
          <span style={{ marginLeft: 'auto' }} />
          {canEdit && (
            <button className="btn btn-primary btn-sm" onClick={() => setDraft({ ...NEW_DRAFT })}>
              ＋ 新增管理員
            </button>
          )}
        </div>
        {loading ? (
          <div className="empty">載入中…</div>
        ) : (
          <table className="list">
            <thead>
              <tr>
                <th style={{ width: 180 }}>帳號</th>
                <th>通知信箱</th>
                <th style={{ width: 160 }}>顯示名稱</th>
                <th style={{ width: 130 }}>角色</th>
                <th style={{ width: 90 }}>啟用</th>
                <th style={{ width: 180 }}>最後登入</th>
                <th style={{ width: 150 }} />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="row-title">{u.username}</td>
                  <td>{u.email ?? <span style={{ color: 'var(--grey-2)' }}>—</span>}</td>
                  <td>{u.displayName}</td>
                  <td>{roleName(u.roleCode)}</td>
                  <td>
                    <Badge kind={u.isActive ? 'ok' : 'off'}>{u.isActive ? '啟用' : '停用'}</Badge>
                  </td>
                  <td>{u.lastLoginAt ? u.lastLoginAt.replace('T', ' ').replace('Z', '').slice(0, 16) : '—'}</td>
                  <td className="btn-row">
                    <button
                      className="btn btn-sm"
                      onClick={() =>
                        setDraft({
                          id: u.id,
                          username: u.username,
                          displayName: u.displayName,
                          email: u.email ?? '',
                          roleId: u.roleId,
                          isActive: u.isActive,
                          password: '',
                          password2: '',
                        })
                      }
                    >
                      {canEdit ? '編輯' : '檢視'}
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      disabled={!canDelete || isSelf(u) || lastSuperAdmin(u)}
                      title={
                        isSelf(u)
                          ? '不能刪除自己的帳號'
                          : lastSuperAdmin(u)
                            ? '至少要保留一位可用的超級管理員'
                            : ''
                      }
                      onClick={() => setConfirm(u)}
                    >
                      刪除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="card-b">
          <Notice kind="info">
            帳號不限定 email 格式；密碼由建立者當場設定並轉交，系統不寄啟用信或密碼重設信。
            忘記密碼時，在編輯視窗直接重設一組新的。通知信箱只用來收系統通知，與登入無關。
            登入失敗不鎖定帳號（那會讓人被惡意鎖在外面），連續嘗試登入由登入頁的機器人驗證擋下。
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
          <Hint text="**這張表是權限的依據**：✓ 代表整組動作都可以，「部分」代表只開放其中幾項。要調整請聯絡系統維護人員。" />
        </div>
      </div>

      {draft && (
        <Modal
          title={draft.id ? `編輯管理員 · ${draft.username}` : '新增管理員'}
          confirmLabel={draft.id ? '儲存' : '建立'}
          onCancel={() => setDraft(null)}
          onConfirm={canEdit ? submit : undefined}
        >
          <fieldset disabled={!canEdit} style={{ border: 0, padding: 0 }}>
            <div className="field">
              <label>
                帳號<span className="req">*</span>
              </label>
              {/* 帳號建立後唯讀：改帳號等於換一個人，稽核紀錄會對不上（後端也不收） */}
              <input
                value={draft.username}
                disabled={draft.id !== null}
                onChange={(e) => setDraft({ ...draft, username: e.target.value })}
                placeholder="不限定 email 格式，3–80 字、不含空白"
              />
            </div>
            <div className="field">
              <label>
                顯示名稱<span className="req">*</span>
              </label>
              <input value={draft.displayName} onChange={(e) => setDraft({ ...draft, displayName: e.target.value })} />
            </div>
            <div className="field">
              <label>通知信箱（選填）</label>
              <input
                value={draft.email}
                onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                placeholder="只用來收系統通知，與登入無關"
              />
            </div>
            <div className="field">
              <label>
                {draft.id ? '重設密碼（留空＝不改）' : '密碼'}
                {!draft.id && <span className="req">*</span>}
              </label>
              <input
                type="password"
                autoComplete="new-password"
                value={draft.password}
                onChange={(e) => setDraft({ ...draft, password: e.target.value })}
                placeholder={`至少 ${MIN_PASSWORD_LENGTH} 碼`}
              />
            </div>
            <div className="field">
              <label>
                再輸入一次
                {!draft.id && <span className="req">*</span>}
              </label>
              <input
                type="password"
                autoComplete="new-password"
                value={draft.password2}
                onChange={(e) => setDraft({ ...draft, password2: e.target.value })}
              />
            </div>
            <div className="field">
              <label>角色</label>
              <select value={draft.roleId} onChange={(e) => setDraft({ ...draft, roleId: Number(e.target.value) })}>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {roleName(r.code)}
                  </option>
                ))}
              </select>
            </div>
            {draft.id && (
              <div className="field">
                <label>啟用</label>
                {/* 停用自己等於把自己鎖在外面，後端也會回 409 */}
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={draft.isActive}
                    disabled={draft.username === session?.username}
                    onChange={(e) => setDraft({ ...draft, isActive: e.target.checked })}
                  />
                  <span className="track" />
                  <span style={{ fontSize: 12.5 }}>{draft.isActive ? '啟用' : '停用'}</span>
                </label>
              </div>
            )}
          </fieldset>
          <Hint
            text={
              draft.id
                ? '重設密碼會**立刻生效**，對方下次要用新密碼登入——請當面轉交，系統不會寄信通知。'
                : '密碼由你設定，**不寄啟用信**；建立後請把帳號密碼當面轉交，對方可自行到後台改。'
            }
          />
        </Modal>
      )}

      {confirm && (
        <Modal
          title="刪除管理員"
          confirmKind="btn-danger"
          confirmLabel="確定刪除"
          onCancel={() => setConfirm(null)}
          onConfirm={async () => {
            try {
              await api.deleteAdmin(confirm.id)
              toast('已刪除')
            } catch (e) {
              toast((e as Error).message)
            }
            setConfirm(null)
            load()
          }}
        >
          「{confirm.displayName}（{confirm.username}）」會被<b>真的刪除</b>，之後同一個帳號名可以重新建立。
          此人建立或修改過的內容不受影響，只是不再對得回一個帳號。
        </Modal>
      )}

    </>
  )
}

/* ── 24 信件紀錄 ───────────────────────────────────────── */

export function AuditPage() {
  const { can } = useAuth()

  return (
    <>
      <div className="page-h">
        <h1>24 · 信件紀錄</h1>
        <div className="sub">唯讀。寄信結果與失敗原因，失敗的可重寄。</div>
      </div>

      <div className="card">
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
                      onClick={() => toast('已重新寄送')}
                    >
                      重寄
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
