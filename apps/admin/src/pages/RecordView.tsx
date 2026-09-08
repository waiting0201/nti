import { useState } from 'react'
import type { Row } from '@/api/types'
import type { Unit } from '@/lib/types'
import { downloadQuoteAttachment } from '@/api/client'
import { FieldInput } from '@/components/fields'
import { Notice, toast } from '@/components/ui'
import { useAuth } from '@/lib/auth'

/** 報價附件。本期不做病毒掃描（docs/09 §17），所以沒有掃描狀態要顯示。 */
type Attachment = { id: string; name: string; sizeBytes: number }

function fileSize(bytes: number): string {
  if (!bytes) return ''
  const mb = bytes / (1024 * 1024)
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`
}

/** 每個唯讀單元要以「客戶填了什麼」呈現的欄位（docs §17–18） */
const VIEW: Record<string, Array<[string, string]>> = {
  quote: [
    ['quoteNo', '報價單號'],
    ['company', '公司'],
    ['contactName', '聯絡人'],
    ['email', 'Email'],
    ['phone', '電話'],
    ['productType', '產品類型'],
    ['industry', '產業'],
    ['quantity', '數量'],
    ['size', '尺寸'],
    ['material', '材質偏好'],
    ['expectedDate', '期望日期'],
    ['message', '需求描述'],
    ['submittedAt', '送出時間'],
  ],
  contact: [
    ['name', '姓名'],
    ['email', 'Email'],
    ['company', '公司'],
    ['phone', '電話'],
    ['message', '訊息'],
    ['submittedAt', '送出時間'],
  ],
}

export function RecordView({
  unit,
  row,
  onChange,
  canEdit,
}: {
  unit: Unit
  row: Row
  onChange: (key: string, v: unknown) => void
  canEdit: boolean
}) {
  const { can } = useAuth()
  const pairs = VIEW[unit.code] ?? []
  const attachments = Array.isArray(row.attachments) ? (row.attachments as Attachment[]) : []
  const [downloading, setDownloading] = useState('')

  async function download(a: Attachment) {
    setDownloading(a.id)
    try {
      await downloadQuoteAttachment(row.id, a.id, a.name)
    } catch (err) {
      toast(err instanceof Error ? err.message : '下載失敗，請稍後再試。')
    } finally {
      setDownloading('')
    }
  }

  return (
    <div className="edit-grid">
      <div>
        <div className="card">
          <div className="card-h">
            <h2>可異動的欄位</h2>
          </div>
          <div className="card-b">
            <fieldset disabled={!canEdit} style={{ border: 0 }}>
              {unit.fields.map((f) => (
                <FieldInput key={f.key} field={f} value={row[f.key]} onChange={(v) => onChange(f.key, v)} unit={unit.code} />
              ))}
            </fieldset>
          </div>
        </div>
      </div>

      <div>
        <div className="card">
          <div className="card-h">
            <h2>{unit.code === 'quote' ? '客戶填寫內容' : '資料內容'}</h2>
            <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--grey-2)' }}>唯讀</span>
          </div>
          <div className="card-b">
            <dl className="kv">
              {pairs.map(([k, label]) => (
                <div key={k} style={{ display: 'contents' }}>
                  <dt>{label}</dt>
                  <dd>{formatValue(row[k])}</dd>
                </div>
              ))}
              {unit.code === 'quote' && (
                <div style={{ display: 'contents' }}>
                  <dt>永續建議</dt>
                  <dd>{row.sustainableAdvice ? '客戶勾選了希望提供永續建議' : '未勾選'}</dd>
                </div>
              )}
            </dl>

            {unit.code === 'quote' && (
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>設計稿附件</div>
                {attachments.length === 0 ? (
                  <div style={{ fontSize: 13, color: 'var(--grey-2)' }}>無附件</div>
                ) : can('quote.download') ? (
                  <>
                    <div className="btn-row">
                      {attachments.map((a) => (
                        <button
                          key={a.id}
                          className="btn btn-sm"
                          disabled={downloading !== ''}
                          onClick={() => void download(a)}
                        >
                          {downloading === a.id ? '下載中…' : `⬇ ${a.name}`}
                          {a.sizeBytes ? <span style={{ color: 'var(--grey-2)' }}>（{fileSize(a.sizeBytes)}）</span> : null}
                        </button>
                      ))}
                    </div>
                    <Notice kind="info">
                      這些是客戶自行上傳的檔案，<b>系統不做病毒掃描</b>。請存檔後先用防毒軟體確認再開啟，
                      不要直接在瀏覽器中打開。
                    </Notice>
                  </>
                ) : (
                  <Notice kind="info">
                    附件共 {attachments.length} 個。附件下載限超級管理員（權限碼 <code>quote.download</code>）。
                  </Notice>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function formatValue(v: unknown): string {
  if (v === undefined || v === null || v === '') return '—'
  if (typeof v === 'boolean') return v ? '是' : '否'
  const s = String(v)
  return /^\d{4}-\d{2}-\d{2}T/.test(s) ? s.replace('T', ' ').replace('Z', '') : s
}
