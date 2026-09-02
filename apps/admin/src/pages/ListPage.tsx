import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import * as api from '@/api/client'
import type { Row } from '@/api/types'
import { UNIT_BY_CODE } from '@/units'
import { publishState, type Unit } from '@/lib/types'
import { useAuth } from '@/lib/auth'
import { Badge, Modal, Notice, Pager, toast } from '@/components/ui'
import { categoryName, useCategories } from '@/components/fields'
import { isComplete } from '@/lib/completeness'
import { assetUrl } from '@/lib/asset'

const PAGE_SIZE = 20

export function ListPage() {
  const { code = '' } = useParams()
  const unit = UNIT_BY_CODE.get(code)
  const { can } = useAuth()
  const nav = useNavigate()
  const [sp, setSp] = useSearchParams()

  const [rows, setRows] = useState<Row[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [dragId, setDragId] = useState<string | null>(null)
  const [dropId, setDropId] = useState<string | null>(null)

  const keyword = sp.get('q') ?? ''
  const status = sp.get('status') ?? 'all'
  const categoryId = sp.get('category') ?? ''
  const page = Number(sp.get('page') ?? '1')

  // 沒有分類欄位的單元（如 home-banner）不該出現分類篩選；
  // useCategories(undefined) 會回傳全部分類，所以要先看單元有沒有這個欄位
  const categoryType = unit?.fields.find((f) => f.categoryType)?.categoryType
  const categories = useCategories(categoryType)

  const load = useCallback(async () => {
    if (!unit) return
    setLoading(true)
    if (unit.sortable) {
      // 可拖曳排序的單元不分頁，否則跨頁拖曳沒有意義
      const all = await api.listAll(unit.code)
      const filtered = all.filter((r) => {
        if (categoryId && r.categoryId !== categoryId) return false
        if (status === 'published' && !r.isPublished) return false
        if (status === 'draft' && r.isPublished) return false
        if (keyword && !JSON.stringify(r).toLowerCase().includes(keyword.toLowerCase())) return false
        return true
      })
      setRows(filtered)
      setTotal(filtered.length)
    } else {
      const res = await api.list(unit.code, { keyword, status, categoryId, page, pageSize: PAGE_SIZE })
      setRows(res.rows)
      setTotal(res.total)
    }
    setSelected(new Set())
    setLoading(false)
  }, [unit, keyword, status, categoryId, page])

  useEffect(() => {
    void load()
  }, [load])

  if (!unit) return <Notice kind="danger">找不到這個單元。</Notice>

  const canEdit = can(`${unit.code}.edit`)
  const canPublish = can(`${unit.code}.publish`)
  const canDelete = can(`${unit.code}.delete`)
  const readOnlyRecord = unit.readOnly === 'status-only'

  const setParam = (k: string, v: string) => {
    const next = new URLSearchParams(sp)
    if (v) next.set(k, v)
    else next.delete(k)
    if (k !== 'page') next.delete('page')
    setSp(next)
  }

  const toggle = (id: string) => {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelected(next)
  }

  const batch = async (published: boolean) => {
    await api.setPublished(unit.code, [...selected], published)
    toast(published ? `已上架 ${selected.size} 筆` : `已下架 ${selected.size} 筆`)
    void load()
  }

  const doDelete = async () => {
    await api.softDelete(unit.code, [...selected])
    setConfirmDelete(false)
    toast(`已刪除 ${selected.size} 筆（軟刪，資料仍保留在資料庫）`)
    void load()
  }

  const onDrop = async (targetId: string) => {
    if (!dragId || dragId === targetId) return
    const ids = rows.map((r) => r.id)
    const from = ids.indexOf(dragId)
    const to = ids.indexOf(targetId)
    ids.splice(to, 0, ...ids.splice(from, 1))
    await api.reorder(unit.code, ids)
    setDragId(null)
    setDropId(null)
    toast('排序已儲存')
    void load()
  }

  const countWarning = unit.countHint
    ? (unit.countHint.max !== undefined && total > unit.countHint.max) ||
      (unit.countHint.min !== undefined && total < unit.countHint.min)
      ? unit.countHint.message
      : ''
    : ''

  return (
    <>
      <div className="page-h">
        <h1>
          {unit.no} · {unit.title}
        </h1>
        <div className="sub">
          {unit.frontend && <>前台位置：{unit.frontend}　</>}
          權限碼 <code>{unit.code}.*</code>
        </div>
      </div>

      {unit.note && <Notice kind="info">{unit.note}</Notice>}
      {countWarning && <Notice>{countWarning}</Notice>}
      {unit.fixedRows && (
        <Notice kind="info">此單元為固定筆數，不可新增或刪除；要增減項目屬改版範圍。</Notice>
      )}

      <div className="card" style={{ marginTop: 14 }}>
        <div className="toolbar">
          <input
            type="search"
            placeholder="搜尋關鍵字"
            defaultValue={keyword}
            onKeyDown={(e) => e.key === 'Enter' && setParam('q', (e.target as HTMLInputElement).value)}
            onBlur={(e) => setParam('q', e.target.value)}
          />
          {unit.hasStatus && (
            <select value={status} onChange={(e) => setParam('status', e.target.value)}>
              <option value="all">全部狀態</option>
              <option value="published">上架中</option>
              <option value="draft">草稿／未上架</option>
            </select>
          )}
          {categoryType && categories.length > 0 && (
            <select value={categoryId} onChange={(e) => setParam('category', e.target.value)}>
              <option value="">全部分類</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {String(c.i18n?.zh?.name ?? c.id)}
                </option>
              ))}
            </select>
          )}
          <div className="spacer" style={{ marginLeft: 'auto' }} />
          {selected.size > 0 && (
            <>
              <span style={{ fontSize: 12.5, color: 'var(--grey-2)' }}>已選 {selected.size} 筆</span>
              {canPublish && unit.hasStatus && (
                <>
                  <button className="btn btn-sm" onClick={() => batch(true)}>
                    批次上架
                  </button>
                  <button className="btn btn-sm" onClick={() => batch(false)}>
                    批次下架
                  </button>
                </>
              )}
              {canDelete && !unit.fixedRows && (
                <button className="btn btn-sm btn-danger" onClick={() => setConfirmDelete(true)}>
                  刪除
                </button>
              )}
            </>
          )}
          {canEdit && !unit.fixedRows && !readOnlyRecord && (
            <button className="btn btn-primary btn-sm" onClick={() => nav(`/u/${unit.code}/new`)}>
              ＋ 新增
            </button>
          )}
        </div>

        {loading ? (
          <div className="empty">載入中…</div>
        ) : rows.length === 0 ? (
          <div className="empty">沒有符合條件的資料。</div>
        ) : (
          <table className="list">
            <thead>
              <tr>
                {unit.sortable && <th style={{ width: 34 }} />}
                <th style={{ width: 34 }}>
                  <input
                    type="checkbox"
                    checked={selected.size === rows.length && rows.length > 0}
                    onChange={(e) => setSelected(e.target.checked ? new Set(rows.map((r) => r.id)) : new Set())}
                  />
                </th>
                {unit.columns.map((c) => (
                  <th key={c.key} style={c.width ? { width: c.width } : undefined}>
                    {c.label}
                  </th>
                ))}
                <th style={{ width: 80 }} />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className={`${dragId === row.id ? 'dragging' : ''} ${dropId === row.id ? 'drop-target' : ''}`}
                  draggable={unit.sortable && canEdit}
                  onDragStart={() => setDragId(row.id)}
                  onDragOver={(e) => {
                    e.preventDefault()
                    setDropId(row.id)
                  }}
                  onDragEnd={() => {
                    setDragId(null)
                    setDropId(null)
                  }}
                  onDrop={() => onDrop(row.id)}
                >
                  {unit.sortable && (
                    <td className="drag-handle" title="拖曳排序">
                      ⠿
                    </td>
                  )}
                  <td>
                    <input type="checkbox" checked={selected.has(row.id)} onChange={() => toggle(row.id)} />
                  </td>
                  {unit.columns.map((c) => (
                    <td key={c.key}>
                      <Cell unit={unit} row={row} colKey={c.key} render={c.render} />
                    </td>
                  ))}
                  <td>
                    <Link className="btn btn-sm" to={`/u/${unit.code}/${row.id}`}>
                      {canEdit ? '編輯' : '檢視'}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!unit.sortable && <Pager page={page} pageSize={PAGE_SIZE} total={total} onPage={(p) => setParam('page', String(p))} />}
        {unit.sortable && <div className="pager"><span>共 {total} 筆，可直接拖曳列首排序</span></div>}
      </div>

      {confirmDelete && (
        <Modal
          title={`刪除 ${selected.size} 筆資料`}
          confirmLabel="確定刪除"
          confirmKind="btn-danger"
          onConfirm={doDelete}
          onCancel={() => setConfirmDelete(false)}
        >
          刪除後這些內容會立刻從前台消失。
          <br />
          系統採軟刪除，資料仍留在資料庫，可由工程端還原。
        </Modal>
      )}
    </>
  )
}

function Cell({ unit, row, colKey, render }: { unit: Unit; row: Row; colKey: string; render?: string }) {
  const raw = row[colKey] ?? row.i18n?.zh?.[colKey] ?? ''

  if (render === 'thumb') {
    const src =
      colKey === 'youtubeId' && typeof row.youtubeId === 'string'
        ? `https://img.youtube.com/vi/${row.youtubeId}/hqdefault.jpg`
        : String(raw)
    return src ? <img className="thumb" src={assetUrl(src)} alt="" /> : <span style={{ color: 'var(--grey-2)' }}>—</span>
  }
  if (render === 'status') {
    const s = publishState(row)
    const kind = s === '上架中' ? 'ok' : s === '已排程' ? 'info' : s === '已下架' ? 'off' : 'warn'
    return <Badge kind={kind}>{s}</Badge>
  }
  if (render === 'i18n') {
    const zh = isComplete(unit, row, 'zh')
    const en = isComplete(unit, row, 'en')
    return (
      <span style={{ display: 'inline-flex', gap: 4 }}>
        <Badge kind={zh ? 'ok' : 'warn'}>中</Badge>
        <Badge kind={en ? 'ok' : 'warn'}>英</Badge>
      </span>
    )
  }
  if (render === 'bool') return <Badge kind={raw ? 'ok' : 'off'}>{raw ? '是' : '否'}</Badge>
  if (render === 'category') return <span>{categoryName(raw)}</span>
  if (render === 'date') return <span>{String(raw).slice(0, 10) || '—'}</span>

  const text = String(raw)
  const isTitle = unit.columns.findIndex((c) => !c.render) === unit.columns.findIndex((c) => c.key === colKey)
  return <span className={isTitle ? 'row-title' : undefined}>{text || '—'}</span>
}
