import { useEffect, useRef, useState } from 'react'
import type { Field, Locale } from '@/lib/types'
import { Hint } from './ui'
import { assetUrl } from '@/lib/asset'
import * as api from '@/api/client'
import type { Row } from '@/api/types'

/* ── 分類快取（給 select 型欄位用） ───────────────────── */
let categoryCache: Row[] | null = null
const listeners = new Set<() => void>()

export function useCategories(type?: string) {
  const [, force] = useState(0)
  useEffect(() => {
    if (categoryCache) return
    const fn = () => force((n) => n + 1)
    listeners.add(fn)
    api.listAll('category').then((rows) => {
      categoryCache = rows
      listeners.forEach((l) => l())
    })
    return () => {
      listeners.delete(fn)
    }
  }, [])
  const all = categoryCache ?? []
  return type ? all.filter((c) => c.categoryType === type && c.isActive !== false) : all
}

export function categoryName(id: unknown, locale: Locale = 'zh'): string {
  if (typeof id !== 'string') return ''
  const c = (categoryCache ?? []).find((x) => x.id === id)
  return c?.i18n?.[locale]?.name ?? id.split(':')[1] ?? ''
}

/* ── 富文本 ───────────────────────────────────────────── */

/**
 * docs §5.5 的白名單：p h3 h4 strong em ul ol li a blockquote img figure figcaption br。
 * 禁止 script／iframe／style 與行內 style；貼上時清除樣式。
 * 前端這層是為了讓編輯者當下就看到結果，**伺服器端仍會二次 sanitize**（不信任前端）。
 */
const ALLOWED = new Set(['P', 'H3', 'H4', 'STRONG', 'B', 'EM', 'I', 'UL', 'OL', 'LI', 'A', 'BLOCKQUOTE', 'IMG', 'FIGURE', 'FIGCAPTION', 'BR'])

export function sanitizeHtml(html: string): string {
  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html')
  const root = doc.body.firstElementChild!
  const walk = (node: Element) => {
    for (const child of [...node.children]) {
      walk(child)
      if (!ALLOWED.has(child.tagName)) {
        // 不在白名單：保留文字內容，拿掉標籤本身
        child.replaceWith(...Array.from(child.childNodes))
        continue
      }
      for (const attr of [...child.attributes]) {
        const keep =
          (child.tagName === 'A' && (attr.name === 'href' || attr.name === 'target' || attr.name === 'rel')) ||
          (child.tagName === 'IMG' && (attr.name === 'src' || attr.name === 'alt'))
        if (!keep) child.removeAttribute(attr.name)
      }
    }
  }
  walk(root)
  return root.innerHTML
}

function RichText({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) ref.current.innerHTML = value
  }, [value])

  const exec = (cmd: string, arg?: string) => {
    ref.current?.focus()
    document.execCommand(cmd, false, arg)
    emit()
  }
  const emit = () => {
    if (ref.current) onChange(sanitizeHtml(ref.current.innerHTML))
  }

  return (
    <div className="richtext">
      <div className="rt-bar">
        <button type="button" onClick={() => exec('formatBlock', 'h3')} title="小標 H3">H3</button>
        <button type="button" onClick={() => exec('formatBlock', 'h4')} title="小標 H4">H4</button>
        <button type="button" onClick={() => exec('formatBlock', 'p')} title="段落">段落</button>
        <button type="button" onClick={() => exec('bold')} title="粗體"><b>B</b></button>
        <button type="button" onClick={() => exec('italic')} title="斜體"><i>I</i></button>
        <button type="button" onClick={() => exec('insertUnorderedList')} title="項目清單">• 清單</button>
        <button type="button" onClick={() => exec('insertOrderedList')} title="編號清單">1. 清單</button>
        <button type="button" onClick={() => exec('formatBlock', 'blockquote')} title="引言">引言</button>
        <button
          type="button"
          title="連結"
          onClick={() => {
            const url = prompt('連結網址')
            if (url) exec('createLink', url)
          }}
        >
          連結
        </button>
        <button
          type="button"
          title="插入圖片"
          onClick={() => {
            const url = prompt('圖片網址（正式站由上傳產生）')
            if (url) exec('insertImage', url)
          }}
        >
          圖片
        </button>
      </div>
      <div
        ref={ref}
        className="rt-body"
        contentEditable
        suppressContentEditableWarning
        onInput={emit}
        onBlur={emit}
        onPaste={(e) => {
          // 貼上 Word／網頁內容時自動清除樣式（docs §5.5）
          e.preventDefault()
          const text = e.clipboardData.getData('text/plain')
          document.execCommand('insertText', false, text)
          emit()
        }}
      />
    </div>
  )
}

/* ── 上傳 ─────────────────────────────────────────────── */

function Uploader({
  field,
  value,
  onChange,
}: {
  field: Field
  value: string
  onChange: (v: string) => void
}) {
  const isImage = field.type === 'image'
  const [warn, setWarn] = useState('')

  const pick = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = isImage ? 'image/*' : '.pdf,.xlsx,.docx,.zip'
    input.onchange = () => {
      const file = input.files?.[0]
      if (!file) return
      const url = URL.createObjectURL(file)
      if (isImage) {
        // docs §3：超過建議尺寸不擋、只提醒；不足一半則擋下
        const img = new Image()
        img.onload = () => {
          setWarn(`已選擇 ${img.naturalWidth}×${img.naturalHeight}。正式站會在上傳後比對建議尺寸並提示。`)
        }
        img.src = url
      } else {
        setWarn(`已選擇 ${file.name}（${(file.size / 1024 / 1024).toFixed(1)} MB）`)
      }
      onChange(url)
    }
    input.click()
  }

  return (
    <>
      <div className="uploader">
        {isImage ? (
          value ? (
            <img src={assetUrl(value)} alt="" />
          ) : (
            <div className="meta">尚未上傳</div>
          )
        ) : (
          <div className="meta">{value ? value.split('/').pop() : '尚未上傳檔案'}</div>
        )}
        <div style={{ minWidth: 0 }}>
          <div className="btn-row">
            <button type="button" className="btn btn-sm" onClick={pick}>
              {value ? '更換' : '上傳'}
            </button>
            {value && (
              <button type="button" className="btn btn-sm btn-danger" onClick={() => { onChange(''); setWarn('') }}>
                移除
              </button>
            )}
          </div>
          {isImage && value && <div className="meta" style={{ marginTop: 6 }}>{value}</div>}
        </div>
      </div>
      {field.hint && <Hint text={field.hint} />}
      {warn && <div className="hint">{warn}</div>}
    </>
  )
}

/* ── 單一欄位 ─────────────────────────────────────────── */

export function FieldInput({
  field,
  value,
  onChange,
  error,
}: {
  field: Field
  value: unknown
  onChange: (v: unknown) => void
  error?: string
}) {
  const categories = useCategories(field.categoryType)
  const str = typeof value === 'string' ? value : value == null ? '' : String(value)
  const over = field.max ? str.length > field.max : false

  const label = (
    <label>
      {field.label}
      {field.required && <span className="req">*</span>}
      {field.max && (
        <span className={`counter ${over ? 'over' : ''}`}>
          {str.length} / {field.max}
        </span>
      )}
    </label>
  )

  const body = () => {
    switch (field.type) {
      case 'readonly':
        return <input value={str} readOnly disabled />
      case 'textarea':
        return <textarea value={str} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} />
      case 'embed':
        return <textarea value={str} onChange={(e) => onChange(e.target.value)} style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12 }} />
      case 'email-list':
        return <input value={str} onChange={(e) => onChange(e.target.value)} placeholder="a@example.com, b@example.com" />
      case 'richtext':
        return <RichText value={str} onChange={onChange} />
      case 'image':
      case 'file':
        return <Uploader field={field} value={str} onChange={onChange} />
      case 'switch':
        return (
          <label className="switch">
            <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
            <span className="track" />
            <span style={{ fontSize: 12.5 }}>{value ? '開啟' : '關閉'}</span>
          </label>
        )
      case 'select':
        return (
          <select value={str} onChange={(e) => onChange(e.target.value)}>
            <option value="">請選擇</option>
            {(field.options ?? categories.map((c) => ({ value: c.id, label: String(c.i18n?.zh?.name ?? c.id) }))).map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        )
      case 'date':
        return <input type="date" value={str} onChange={(e) => onChange(e.target.value)} />
      case 'number':
        return <input type="number" value={str} onChange={(e) => onChange(e.target.value)} />
      case 'youtube':
        return (
          <>
            <input
              value={str}
              onChange={(e) => onChange(extractYoutubeId(e.target.value))}
              placeholder="https://www.youtube.com/watch?v=… 或直接貼 ID"
            />
            {str && (
              <div className="uploader" style={{ marginTop: 8 }}>
                <img src={`https://img.youtube.com/vi/${str}/hqdefault.jpg`} alt="" />
                <div className="meta">影片 ID：{str}</div>
              </div>
            )}
          </>
        )
      default:
        return <input value={str} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} />
    }
  }

  return (
    <div className="field">
      {label}
      {body()}
      {field.hint && field.type !== 'image' && field.type !== 'file' && <Hint text={field.hint} />}
      {over && <div className="err">超過建議長度 {field.max} 字，搜尋結果可能被截斷。</div>}
      {error && <div className="err">{error}</div>}
    </div>
  )
}

/** 貼完整網址時自動抽出 ID（docs 單元 05） */
export function extractYoutubeId(input: string): string {
  const m =
    /(?:youtube\.com\/(?:watch\?v=|embed\/|vi?\/)|youtu\.be\/)([\w-]{6,})/.exec(input) ??
    /^([\w-]{6,})$/.exec(input.trim())
  return m ? m[1] : input.trim()
}
