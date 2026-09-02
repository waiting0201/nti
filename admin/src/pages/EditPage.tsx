import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import * as api from '@/api/client'
import type { Row } from '@/api/types'
import { UNIT_BY_CODE, unitFields } from '@/units'
import { LOCALE_LABEL, LOCALES, publishState, type Field, type Locale, type Unit } from '@/lib/types'
import { useAuth } from '@/lib/auth'
import { Badge, Modal, Notice, toast, useUnsavedGuard } from '@/components/ui'
import { FieldInput } from '@/components/fields'
import { blockingReasons, isComplete } from '@/lib/completeness'
import { RecordView } from './RecordView'
import { assetUrl } from '@/lib/asset'

export function EditPage() {
  const { code = '', id = '' } = useParams()
  const unit = UNIT_BY_CODE.get(code)
  const { can } = useAuth()
  const nav = useNavigate()

  const [row, setRow] = useState<Row | null>(null)
  const [dirty, setDirty] = useState(false)
  const [locale, setLocale] = useState<Locale>('zh')
  const [blocked, setBlocked] = useState<string[] | null>(null)
  const [children, setChildren] = useState<Row[]>([])

  const isNew = id === 'new'

  const load = useCallback(async () => {
    if (!unit) return
    if (isNew) {
      setRow({ id: '', isPublished: false, i18n: { zh: {}, en: {} } })
      return
    }
    const r = await api.get(unit.code, id)
    setRow(r ? structuredClone(r) : null)
    if (unit.child) setChildren(await api.listChildren(`${unit.code}-item`, id))
  }, [unit, id, isNew])

  useEffect(() => {
    void load()
  }, [load])

  useUnsavedGuard(dirty)

  const fields = useMemo(() => (unit ? unitFields(unit) : []), [unit])

  if (!unit) return <Notice kind="danger">找不到這個單元。</Notice>
  if (!row) return <div className="empty">載入中…</div>

  const canEdit = can(`${unit.code}.edit`)
  const canPublish = can(`${unit.code}.publish`)

  const setNeutral = (key: string, v: unknown) => {
    setRow({ ...row, [key]: v })
    setDirty(true)
  }
  const setLocalised = (key: string, v: unknown) => {
    const i18n = { ...(row.i18n ?? { zh: {}, en: {} }) }
    i18n[locale] = { ...i18n[locale], [key]: String(v ?? '') }
    setRow({ ...row, i18n })
    setDirty(true)
  }

  const neutralFields = fields.filter((f) => f.side !== 'locale' && !f.i18n)
  const localeFields = fields.filter((f) => f.i18n)

  // page 單元：只有 HasRichBody = 1 的頁面才顯示「頁面內容」欄位（docs §15）
  const showField = (f: Field) =>
    !(unit.code === 'page' && f.key === 'body' && row.hasRichBody !== true)

  const save = async (publish?: boolean) => {
    const next: Row = { ...row }
    if (publish !== undefined) {
      if (publish) {
        const reasons = blockingReasons(unit, next)
        if (reasons.length) {
          setBlocked(reasons)
          return
        }
      }
      next.isPublished = publish
    }
    if (isNew) {
      const created = await api.create(unit.code, next)
      setDirty(false)
      toast('已新增')
      nav(`/u/${unit.code}/${created.id}`, { replace: true })
      return
    }
    await api.save(unit.code, next)
    setRow(next)
    setDirty(false)
    toast(publish === true ? '已上架' : publish === false ? '已下架' : '已儲存')
  }

  const copyToEnglish = () => {
    const i18n = { ...(row.i18n ?? { zh: {}, en: {} }) }
    i18n.en = { ...i18n.en }
    for (const f of localeFields) {
      const v = i18n.zh?.[f.key]
      if (v && !i18n.en[f.key]) i18n.en[f.key] = v
    }
    setRow({ ...row, i18n })
    setDirty(true)
    toast('已把中文尚未翻譯的欄位複製到 English')
  }

  const title = String(
    row.i18n?.zh?.title ??
      row.i18n?.zh?.name ??
      row.i18n?.zh?.question ??
      row.i18n?.zh?.displayName ??
      row.quoteNo ??
      row.orderNo ??
      row.path ??
      row.name ??
      row.email ??
      '',
  )

  return (
    <>
      <div className="page-h">
        <h1>
          {unit.no} · {unit.title}
          {isNew ? '　新增' : ''}
        </h1>
        <div className="sub">
          {title || (isNew ? '尚未輸入標題' : `#${row.id}`)}
          {unit.hasStatus && !isNew && <>　<Badge kind={publishState(row) === '上架中' ? 'ok' : 'off'}>{publishState(row)}</Badge></>}
        </div>
      </div>

      {!canEdit && <Notice kind="info">你的角色為唯讀，以下欄位不可修改。</Notice>}

      {unit.readOnly === 'status-only' ? (
        <RecordView unit={unit} row={row} onChange={setNeutral} canEdit={canEdit} />
      ) : (
        <div className="edit-grid">
          {/* 左：語系中性欄位（圖片、日期、分類、狀態） */}
          <div>
            <div className="card">
              <div className="card-h">
                <h2>基本設定</h2>
              </div>
              <div className="card-b">
                <fieldset disabled={!canEdit} style={{ border: 0 }}>
                  {neutralFields.filter(showField).map((f) => (
                    <FieldInput key={f.key} field={f} value={row[f.key]} onChange={(v) => setNeutral(f.key, v)} />
                  ))}
                </fieldset>
              </div>
            </div>

            {unit.hasStatus && <StatusCard row={row} onChange={setNeutral} canEdit={canPublish} />}
          </div>

          {/* 右：中文／English 分頁的文字欄位 */}
          <div className="card">
            <div className="card-b">
              <div className="locale-tabs">
                {LOCALES.map((l) => (
                  <button key={l} className={locale === l ? 'active' : ''} onClick={() => setLocale(l)}>
                    {LOCALE_LABEL[l]}
                    {'　'}
                    <Badge kind={isComplete(unit, row, l) ? 'ok' : 'warn'}>{isComplete(unit, row, l) ? '完整' : '待補'}</Badge>
                  </button>
                ))}
                <span className="fill">
                  {canEdit && locale === 'en' && (
                    <button type="button" className="btn btn-sm" onClick={copyToEnglish}>
                      複製中文到英文
                    </button>
                  )}
                </span>
              </div>
              <fieldset disabled={!canEdit} style={{ border: 0 }}>
                {localeFields.filter(showField).map((f) => (
                  <FieldInput
                    key={f.key}
                    field={f}
                    value={row.i18n?.[locale]?.[f.key] ?? ''}
                    onChange={(v) => setLocalised(f.key, v)}
                  />
                ))}
              </fieldset>
            </div>
          </div>
        </div>
      )}

      {unit.child && !isNew && <ChildList unit={unit} rows={children} />}

      <div className="card">
        <div className="card-b btn-row">
          <button className="btn" onClick={() => nav(`/u/${unit.code}`)}>
            返回清單
          </button>
          <span style={{ marginLeft: 'auto' }} />
          {dirty && <span style={{ fontSize: 12.5, color: 'var(--warn)' }}>有未儲存的變更</span>}
          {canEdit && (
            <button className="btn" onClick={() => save()}>
              儲存草稿
            </button>
          )}
          {canPublish && unit.hasStatus && (
            <>
              {row.isPublished ? (
                <button className="btn" onClick={() => save(false)}>
                  下架
                </button>
              ) : (
                <button className="btn btn-primary" onClick={() => save(true)}>
                  儲存並上架
                </button>
              )}
            </>
          )}
          {canEdit && !unit.hasStatus && (
            <button className="btn btn-primary" onClick={() => save()}>
              儲存
            </button>
          )}
        </div>
      </div>

      {blocked && (
        <Modal title="兩種語系都填完才能上架" onCancel={() => setBlocked(null)}>
          <p style={{ marginBottom: 10 }}>上架後前台中英文頁面都會出現這筆內容，缺一邊會破版。還缺這些必填欄位：</p>
          {blocked.map((r) => (
            <div key={r} className="notice" style={{ marginBottom: 6 }}>
              {r}
            </div>
          ))}
          <p style={{ marginTop: 10, color: 'var(--grey-2)' }}>
            想先上中文再補翻譯，可用「複製中文到英文」暫時填滿，之後再修。
          </p>
        </Modal>
      )}
    </>
  )
}

/** docs §5.4：上架開關 + 上架時間 + 下架時間 */
function StatusCard({ row, onChange, canEdit }: { row: Row; onChange: (k: string, v: unknown) => void; canEdit: boolean }) {
  const toLocal = (v: unknown) => (typeof v === 'string' && v ? v.slice(0, 16) : '')
  return (
    <div className="card">
      <div className="card-h">
        <h2>上下架</h2>
        <span style={{ marginLeft: 'auto' }}>
          <Badge kind={publishState(row) === '上架中' ? 'ok' : 'off'}>{publishState(row)}</Badge>
        </span>
      </div>
      <div className="card-b">
        <fieldset disabled={!canEdit} style={{ border: 0 }}>
          <div className="field">
            <label>上架</label>
            <label className="switch">
              <input type="checkbox" checked={Boolean(row.isPublished)} onChange={(e) => onChange('isPublished', e.target.checked)} />
              <span className="track" />
              <span style={{ fontSize: 12.5 }}>{row.isPublished ? '已開啟' : '未開啟'}</span>
            </label>
          </div>
          <div className="field">
            <label>上架時間</label>
            <input type="datetime-local" value={toLocal(row.publishAt)} onChange={(e) => onChange('publishAt', e.target.value)} />
            <div className="hint">留空代表立即生效。時間以台北時間輸入，存進資料庫時轉為 UTC。</div>
          </div>
          <div className="field">
            <label>下架時間</label>
            <input type="datetime-local" value={toLocal(row.unpublishAt)} onChange={(e) => onChange('unpublishAt', e.target.value)} />
            <div className="hint">留空代表不自動下架。</div>
          </div>
        </fieldset>
        <div className="hint">內容變更後由 webhook 觸發前台 ISR 重新產生頁面。</div>
      </div>
    </div>
  )
}

/** 子清單（目前只有 solution 的品項卡） */
function ChildList({ unit, rows }: { unit: Unit; rows: Row[] }) {
  const child = unit.child!
  return (
    <div className="card">
      <div className="card-h">
        <h2>{child.title}</h2>
        <span style={{ marginLeft: 'auto', fontSize: 12.5, color: 'var(--grey-2)' }}>{rows.length} 筆</span>
      </div>
      {rows.length === 0 ? (
        <div className="empty">尚無項目。</div>
      ) : (
        <table className="list">
          <thead>
            <tr>
              {child.columns.map((c) => (
                <th key={c.key} style={c.width ? { width: c.width } : undefined}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                {child.columns.map((c) => (
                  <td key={c.key}>
                    {c.render === 'thumb' ? (
                      <img className="thumb" src={assetUrl(r[c.key])} alt="" />
                    ) : c.render === 'status' ? (
                      <Badge kind={r.isPublished ? 'ok' : 'off'}>{publishState(r)}</Badge>
                    ) : (
                      String(r.i18n?.zh?.[c.key] ?? r[c.key] ?? '—')
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
