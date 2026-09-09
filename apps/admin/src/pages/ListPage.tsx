import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import * as api from '@/api/client'
import type { Row } from '@/api/types'
import { UNIT_BY_CODE } from '@/units'
import { publishState, type Locale, type Unit } from '@/lib/types'
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
  const [exporting, setExporting] = useState(false)
  const [importing, setImporting] = useState(false)
  const nav = useNavigate()
  const [sp, setSp] = useSearchParams()

  const [rows, setRows] = useState<Row[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  // 'selected' = 工具列的批次刪除；字串 id = 該列自己的刪除鈕
  const [confirmDelete, setConfirmDelete] = useState<'selected' | string | null>(null)
  const [dragId, setDragId] = useState<string | null>(null)
  const [dropId, setDropId] = useState<string | null>(null)

  const keyword = sp.get('q') ?? ''
  const status = sp.get('status') ?? 'all'
  const categoryId = sp.get('category') ?? ''
  const i18n = (sp.get('i18n') ?? '') as '' | Locale
  const page = Number(sp.get('page') ?? '1')

  // 中英完成度只看得到手上這批資料，所以篩選開啟時一律走「取整份」那條，
  // 否則只會在當頁 20 筆裡找，數字與清單都會是錯的。
  const wholeList = Boolean(unit?.sortable) || i18n !== ''
  // 清單被任何條件縮過之後就不是完整的順序了，這時拖曳會把沒顯示的列從排序中洗掉
  const filtering = Boolean(keyword) || status !== 'all' || Boolean(categoryId) || i18n !== ''

  // 沒有分類欄位的單元（如 home-banner）不該出現分類篩選；
  // useCategories(undefined) 會回傳全部分類，所以要先看單元有沒有這個欄位
  const categoryType = unit?.fields.find((f) => f.categoryType)?.categoryType
  const categories = useCategories(categoryType)

  const load = useCallback(async () => {
    if (!unit) return
    setLoading(true)
    if (wholeList) {
      // 可拖曳排序的單元不分頁（否則跨頁拖曳沒有意義），中英篩選也走這條
      const all = await api.listAll(unit.code)
      const filtered = all.filter((r) => {
        if (categoryId && r.categoryId !== categoryId) return false
        if (status === 'published' && !r.isPublished) return false
        if (status === 'draft' && r.isPublished) return false
        if (i18n && isComplete(unit, r, i18n)) return false
        // 這條路徑拿到的是整份資料（拖曳排序需要），在前端過濾不會漏掉別頁的資料；
        // 分頁的那條走後端的 keyword 參數（見 client.api.ts）
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
  }, [unit, keyword, status, categoryId, i18n, wholeList, page])

  useEffect(() => {
    void load()
  }, [load])

  if (!unit) return <Notice kind="danger">找不到這個單元。</Notice>

  // 中/英徽章欄在哪些單元有，篩選就在哪些單元出現（宣告在 units/*.ts 的 columns）
  const hasI18nColumn = unit.columns.some((c) => c.render === 'i18n')

  const canEdit = can(`${unit.code}.edit`)
  // 兩個單元有 CSV：報價（quote.export）與 301 轉址（redirect.export）。
  // 301 另外可以「匯入」——舊站 229 條要一次帶進來，逐筆新增不切實際。
  const canExport =
    (unit.code === 'quote' && can('quote.export')) ||
    (unit.code === 'redirect' && can('redirect.export'))
  const canImport = unit.code === 'redirect' && can('redirect.export') && can('redirect.edit')
  const canPublish = can(`${unit.code}.publish`)
  const canDelete = can(`${unit.code}.delete`)

  async function exportCsv() {
    setExporting(true)
    try {
      if (unit!.code === 'redirect') await api.exportRedirectsCsv()
      else await api.exportQuotesCsv()
    } catch (err) {
      toast(err instanceof Error ? err.message : '匯出失敗，請稍後再試。')
    } finally {
      setExporting(false)
    }
  }

  /**
   * 匯入 301 CSV。後端以 `fromPath` 為鍵覆寫，重跑同一份檔案不會產生重複，
   * 所以不必先清空——但被跳過的列只有這裡的提示會講，別把回傳的數字吞掉。
   */
  async function importCsv(file: File) {
    setImporting(true)
    try {
      const { created, updated, skipped } = await api.importRedirectsCsv(file)
      toast(`匯入完成：新增 ${created} 筆、更新 ${updated} 筆${skipped ? `、略過 ${skipped} 筆（格式不符）` : ''}`)
      void load()
    } catch (err) {
      toast(err instanceof Error ? err.message : '匯入失敗，請稍後再試。')
    } finally {
      setImporting(false)
    }
  }
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
    const ids = confirmDelete === 'selected' ? [...selected] : [confirmDelete!]
    try {
      await api.remove(unit.code, ids)
      toast(`已刪除 ${ids.length} 筆`)
    } catch (err) {
      // 被別的資料引用而刪不掉時後端回 409，理由要照原文顯示——
      // 吞掉只會讓操作者一直重按同一顆按鈕
      toast(err instanceof Error ? err.message : '刪除失敗，請稍後再試。')
    }
    setConfirmDelete(null)
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
        <Notice kind="info">
          此單元為固定筆數，<b>不可新增</b>（要增加項目屬改版範圍）。刪除是真的刪掉，
          前台對應的頁面會因此讀不到內容，請確定之後再刪。
        </Notice>
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
          {hasI18nColumn && (
            <select value={i18n} onChange={(e) => setParam('i18n', e.target.value)}>
              <option value="">全部語系</option>
              <option value="en">英文未填</option>
              <option value="zh">中文未填</option>
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
              {canDelete && (
                <button className="btn btn-sm btn-danger" onClick={() => setConfirmDelete('selected')}>
                  刪除
                </button>
              )}
            </>
          )}
          {canExport && (
            <button className="btn btn-sm" disabled={exporting} onClick={() => void exportCsv()}>
              {exporting ? '匯出中…' : '⬇ 匯出 CSV'}
            </button>
          )}
          {canImport && (
            <label className="btn btn-sm" style={{ cursor: importing ? 'default' : 'pointer' }}>
              {importing ? '匯入中…' : '⬆ 匯入 CSV'}
              <input
                type="file"
                accept=".csv,text/csv"
                hidden
                disabled={importing}
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  // 同一個檔案連選兩次也要能觸發 change，所以選完就把 input 清空
                  e.target.value = ''
                  if (file) void importCsv(file)
                }}
              />
            </label>
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
                <th style={{ width: canDelete ? 140 : 80 }} />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className={`${dragId === row.id ? 'dragging' : ''} ${dropId === row.id ? 'drop-target' : ''}`}
                  draggable={unit.sortable && canEdit && !filtering}
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
                  <td style={{ display: 'flex', gap: 6 }}>
                    <Link className="btn btn-sm" to={`/u/${unit.code}/${row.id}`}>
                      {canEdit ? '編輯' : '檢視'}
                    </Link>
                    {/* 逐列的刪除鈕。只有工具列那顆的話，得先勾選才看得到刪除這件事存在——
                        客戶回報「後台沒有刪除功能」正是因為它藏在勾選之後（2026-09-09） */}
                    {canDelete && (
                      <button className="btn btn-sm btn-danger" onClick={() => setConfirmDelete(row.id)}>
                        刪除
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {wholeList ? (
          <div className="pager">
            <span>
              共 {total} 筆
              {unit.sortable && (filtering ? '；清單已篩選，清掉篩選條件才能拖曳排序' : '，可直接拖曳列首排序')}
            </span>
          </div>
        ) : (
          <Pager page={page} pageSize={PAGE_SIZE} total={total} onPage={(p) => setParam('page', String(p))} />
        )}
      </div>

      {confirmDelete && (
        <Modal
          title={confirmDelete === 'selected' ? `刪除 ${selected.size} 筆資料` : '刪除這筆資料'}
          confirmLabel="確定刪除"
          confirmKind="btn-danger"
          onConfirm={doDelete}
          onCancel={() => setConfirmDelete(null)}
        >
          刪除後這些內容會立刻從前台消失。
          <br />
          <b>這是真的刪除，資料不會留在資料庫，無法還原</b>
          （中英文字、圖片欄位與附屬項目一併刪除）。
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
