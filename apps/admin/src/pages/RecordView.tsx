import type { Row } from '@/api/types'
import type { Unit } from '@/lib/types'
import { FieldInput } from '@/components/fields'
import { Badge, Notice, toast } from '@/components/ui'
import { useAuth } from '@/lib/auth'
import { ORDER_PROGRESS } from '@/api/seed.manual'

/** 每個唯讀單元要以「客戶填了什麼」呈現的欄位（docs §17–20） */
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
  member: [
    ['email', 'Email'],
    ['name', '名稱'],
    ['company', '公司'],
    ['registeredAt', '註冊日'],
    ['lastLoginAt', '最後登入'],
  ],
  order: [
    ['orderNo', '訂單編號'],
    ['memberEmail', '會員'],
    ['quoteNo', '關聯報價單'],
    ['productName', '品名'],
    ['etaDate', '預計出貨日'],
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
  const attachments = Array.isArray(row.attachments) ? (row.attachments as string[]) : []

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
            {unit.code === 'member' && (
              <>
                <div className="btn-row" style={{ marginTop: 8 }}>
                  <button className="btn btn-sm" disabled={!canEdit} onClick={() => toast('已重寄驗證信（示範）')}>
                    重寄驗證信
                  </button>
                  <button className="btn btn-sm" disabled={!canEdit} onClick={() => toast('已寄出密碼重設信（示範）')}>
                    寄密碼重設信
                  </button>
                </div>
                <Notice kind="info">後台不可查看或設定會員密碼。</Notice>
              </>
            )}
          </div>
        </div>
      </div>

      <div>
        <div className="card">
          <div className="card-h">
            <h2>{unit.code === 'quote' ? '客戶填寫內容' : unit.code === 'order' ? '訂單資料' : '資料內容'}</h2>
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
                  <div className="btn-row">
                    {attachments.map((a) => (
                      <button key={a} className="btn btn-sm" onClick={() => toast(`下載 ${a}（示範）`)}>
                        ⬇ {a}
                      </button>
                    ))}
                  </div>
                ) : (
                  <Notice kind="info">
                    附件共 {attachments.length} 個。附件下載限超級管理員（權限碼 <code>quote.download</code>）。
                  </Notice>
                )}
              </div>
            )}
          </div>
        </div>

        {unit.code === 'order' && <Progress orderId={row.id} />}
      </div>
    </div>
  )
}

function Progress({ orderId }: { orderId: string }) {
  const stages = ORDER_PROGRESS[orderId] ?? [
    { stage: '設計', state: '未開始', at: '', note: '' },
    { stage: '印前', state: '未開始', at: '', note: '' },
    { stage: '印刷', state: '未開始', at: '', note: '' },
    { stage: '印後', state: '未開始', at: '', note: '' },
    { stage: '品檢', state: '未開始', at: '', note: '' },
    { stage: '出貨', state: '未開始', at: '', note: '' },
  ]
  return (
    <div className="card">
      <div className="card-h">
        <h2>生產進度</h2>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--grey-2)' }}>會員中心以時間軸呈現</span>
      </div>
      <div className="card-b">
        <div className="timeline">
          {stages.map((s) => (
            <div className="tl" key={s.stage}>
              <span className={`dot ${s.state === '完成' ? 'done' : s.state === '進行中' ? 'doing' : ''}`} />
              <span>
                <b>{s.stage}</b>
                <br />
                <Badge kind={s.state === '完成' ? 'ok' : s.state === '進行中' ? 'warn' : 'off'}>{s.state}</Badge>
              </span>
              <span style={{ fontSize: 12.5, color: 'var(--grey-2)' }}>
                {s.at || '—'}
                {s.note ? `　${s.note}` : ''}
              </span>
            </div>
          ))}
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
