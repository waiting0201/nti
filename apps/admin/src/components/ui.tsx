import { useEffect, useState, type ReactNode } from 'react'

/** docs §3 的提示文字用 **粗體** 標記重點尺寸，這裡把它渲染成 <strong> */
export function Hint({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean)
  return (
    <div className="hint">
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**') ? <strong key={i}>{p.slice(2, -2)}</strong> : <span key={i}>{p}</span>,
      )}
    </div>
  )
}

export function Badge({ kind = '', children }: { kind?: string; children: ReactNode }) {
  return <span className={`badge ${kind}`}>{children}</span>
}

export function Notice({ kind = '', children }: { kind?: string; children: ReactNode }) {
  return <div className={`notice ${kind}`}>{children}</div>
}

export function Modal({
  title,
  children,
  confirmLabel = '確定',
  confirmKind = 'btn-primary',
  onConfirm,
  onCancel,
}: {
  title: string
  children: ReactNode
  confirmLabel?: string
  confirmKind?: string
  onConfirm?: () => void
  onCancel: () => void
}) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onCancel()
    document.addEventListener('keydown', esc)
    return () => document.removeEventListener('keydown', esc)
  }, [onCancel])

  return (
    <div className="modal-back" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <div className="m-b">{children}</div>
        <div className="m-f">
          <button className="btn" onClick={onCancel}>
            取消
          </button>
          {onConfirm && (
            <button className={`btn ${confirmKind}`} onClick={onConfirm}>
              {confirmLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

let toastSetter: ((msg: string) => void) | null = null
export function toast(message: string) {
  toastSetter?.(message)
}

export function ToastHost() {
  const [msg, setMsg] = useState('')
  useEffect(() => {
    toastSetter = (m: string) => {
      setMsg(m)
      window.setTimeout(() => setMsg(''), 2600)
    }
    return () => {
      toastSetter = null
    }
  }, [])
  if (!msg) return null
  return <div className="toast">{msg}</div>
}

export function Pager({
  page,
  pageSize,
  total,
  onPage,
}: {
  page: number
  pageSize: number
  total: number
  onPage: (p: number) => void
}) {
  const last = Math.max(1, Math.ceil(total / pageSize))
  return (
    <div className="pager">
      <span>
        共 {total} 筆，第 {page} / {last} 頁
      </span>
      <span className="spacer" />
      <button className="btn btn-sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>
        上一頁
      </button>
      <button className="btn btn-sm" disabled={page >= last} onClick={() => onPage(page + 1)}>
        下一頁
      </button>
    </div>
  )
}

/** 離開前攔截未儲存變更（docs §5.2） */
export function useUnsavedGuard(dirty: boolean) {
  useEffect(() => {
    if (!dirty) return
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    addEventListener('beforeunload', handler)
    return () => removeEventListener('beforeunload', handler)
  }, [dirty])
}
