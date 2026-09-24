import { useEffect, useImperativeHandle, useMemo, useState, type Ref } from 'react'
import * as api from '@/api/client'
import { PAGE_TEXTS, type PageTextItem } from '@/api/page-texts.generated'
import type { PageTextRow } from '@/api/types'
import type { Locale } from '@/lib/types'
import { Badge, Notice, toast } from '@/components/ui'

/** 開放「頁面文字」的頁面（清單由 apps/web/scripts/extract-page-texts.mjs 從 mockup 產生） */
export const hasPageTexts = (pageKey: string) => pageKey in PAGE_TEXTS

type Values = Record<string, { zh: string; en: string }>

const empty = () => ({ zh: '', en: '' })

/** 交給 EditPage 的把手：頁面底部那顆「儲存」會一起把頁面文字送出 */
export type PageTextsHandle = { save: () => Promise<void> }

/**
 * 15 page 的「頁面文字」：固定頁上每一段文字都可改中英文，空著＝沿用原文。
 *
 * 版面、段落數、圖片不在這裡——那些仍以 mockup 為準；這裡只換字。
 * 和上方的 SEO 表單是不同的 API，但畫面上只有一顆「儲存」：EditPage 存完主表後
 * 透過 handle 呼叫這裡的 save()；未儲存的段數以 onChangesCount 回報給底部的提示。
 */
export function PageTextsCard({
  pageKey,
  canEdit,
  handle,
  onChangesCount,
}: {
  pageKey: string
  canEdit: boolean
  handle: Ref<PageTextsHandle>
  onChangesCount: (n: number) => void
}) {
  const manifest = PAGE_TEXTS[pageKey]
  const [saved, setSaved] = useState<Values>({})
  const [draft, setDraft] = useState<Values>({})
  const [loaded, setLoaded] = useState(false)
  const [onlyEdited, setOnlyEdited] = useState(false)

  useEffect(() => {
    let alive = true
    void api.getPageTexts(pageKey).then(
      (rows) => {
        if (!alive) return
        const v = toValues(rows)
        setSaved(v)
        setDraft(structuredClone(v))
        setLoaded(true)
      },
      (err) => {
        toast(`頁面文字載入失敗：${(err as Error).message}`)
        setLoaded(true)
      },
    )
    return () => {
      alive = false
    }
  }, [pageKey])

  const changes = useMemo(() => diff(saved, draft), [saved, draft])
  useEffect(() => onChangesCount(changes.length), [changes.length, onChangesCount])

  /** 存過、但 mockup 已經沒有那段原文的覆寫：前台不會再顯示，列出來讓人搬到新的那段 */
  const orphans = useMemo(() => {
    const known = new Set(manifest?.items.map((i) => i.en))
    return Object.keys(saved).filter((k) => !known.has(k))
  }, [manifest, saved])

  const sections = useMemo(() => {
    const out: { name: string; items: PageTextItem[] }[] = []
    for (const item of manifest?.items ?? []) {
      if (onlyEdited && !hasValue(draft[item.en])) continue
      const last = out[out.length - 1]
      if (last?.name === item.section) last.items.push(item)
      else out.push({ name: item.section, items: [item] })
    }
    return out
  }, [manifest, draft, onlyEdited])

  if (!manifest) return null

  const editedCount = manifest.items.filter((i) => hasValue(saved[i.en])).length

  const set = (en: string, lang: Locale, value: string) =>
    setDraft((prev) => ({ ...prev, [en]: { ...(prev[en] ?? empty()), [lang]: value } }))

  /** 失敗就往外丟，由 EditPage 統一顯示錯誤訊息 */
  const save = async () => {
    if (changes.length === 0) return
    await api.savePageTexts(pageKey, changes)
    const next = structuredClone(draft)
    for (const k of Object.keys(next)) {
      next[k] = { zh: next[k].zh.trim(), en: next[k].en.trim() }
      if (!hasValue(next[k])) delete next[k]
    }
    setSaved(next)
    setDraft(structuredClone(next))
  }
  useImperativeHandle(handle, () => ({ save }))

  const removeOrphan = async (en: string) => {
    const items: PageTextRow[] = (['zh', 'en'] as const).map((lang) => ({ lang, sourceText: en, value: '' }))
    try {
      await api.savePageTexts(pageKey, items)
    } catch (err) {
      toast(`移除失敗：${(err as Error).message}`)
      return
    }
    setSaved(({ [en]: _, ...rest }) => rest)
    setDraft(({ [en]: _, ...rest }) => rest)
    toast('已移除')
  }

  return (
    <div className="card">
      <div className="card-h">
        <h2>頁面文字</h2>
        <span style={{ fontSize: 12.5, color: 'var(--grey-2)', marginLeft: 8 }}>
          共 {manifest.items.length} 段，已改 {editedCount} 段
        </span>
        <span style={{ marginLeft: 'auto', display: 'flex', gap: 12, alignItems: 'center' }}>
          <label className="switch">
            <input type="checkbox" checked={onlyEdited} onChange={(e) => setOnlyEdited(e.target.checked)} />
            <span className="track" />
            <span style={{ fontSize: 12.5 }}>只顯示改過的段落</span>
          </label>
        </span>
      </div>
      <div className="card-b">
        <div className="hint" style={{ marginTop: 0, marginBottom: 14 }}>
          每一段都可以分別改中文與英文；<strong>空著就沿用目前前台的字</strong>（灰色提示文字就是現在顯示的內容）。
          版面、段落數與圖片不在這裡調整。同一段原文在頁面上出現多次時（標示「×2」），會一起改。
        </div>

        {!loaded ? (
          <div className="empty">載入中…</div>
        ) : (
          <fieldset disabled={!canEdit} style={{ border: 0 }}>
            {sections.map((sec, si) => (
              <div key={si} className="ptext-section">
                <div className="ptext-section-h">{sec.name}</div>
                {sec.items.map((item) => {
                  const v = draft[item.en] ?? empty()
                  const long = item.en.length > 90
                  return (
                    <div key={item.en} className={`ptext-row${hasValue(v) ? ' edited' : ''}`}>
                      <div className="ptext-src">
                        {item.kind === 'alt' && <Badge>圖片替代文字</Badge>}
                        {item.count > 1 && <Badge kind="warn">×{item.count}</Badge>}
                        <span>{item.en}</span>
                      </div>
                      <div className="ptext-inputs">
                        {(['zh', 'en'] as const).map((lang) => {
                          const current = lang === 'zh' ? (item.zh ?? item.en) : item.en
                          const props = {
                            value: v[lang],
                            placeholder: current,
                            'aria-label': `${lang === 'zh' ? '中文' : 'English'}：${item.en.slice(0, 40)}`,
                            onChange: (e: { target: { value: string } }) => set(item.en, lang, e.target.value),
                          }
                          return (
                            <div key={lang} className="field">
                              <label>
                                {lang === 'zh' ? '中文' : 'English'}
                                {v[lang] && (
                                  <button type="button" className="ptext-reset" onClick={() => set(item.en, lang, '')}>
                                    還原
                                  </button>
                                )}
                              </label>
                              {long ? <textarea rows={3} {...props} /> : <input type="text" {...props} />}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
            {sections.length === 0 && <div className="empty">還沒有改過任何一段。</div>}
          </fieldset>
        )}

        {orphans.length > 0 && (
          <Notice>
            <div style={{ marginBottom: 6 }}>
              <strong>原文已變更：</strong>以下 {orphans.length} 段是先前改過的字，但網站原文已經換掉，前台不會再顯示。
              需要的話請把內容搬到上面對應的新段落，再移除。
            </div>
            {orphans.map((en) => (
              <div key={en} className="ptext-orphan">
                <div>
                  <div className="hint" style={{ marginTop: 0 }}>{en}</div>
                  <div>中文：{saved[en]?.zh || '—'}　English：{saved[en]?.en || '—'}</div>
                </div>
                {canEdit && (
                  <button type="button" className="btn btn-sm" onClick={() => void removeOrphan(en)}>
                    移除
                  </button>
                )}
              </div>
            ))}
          </Notice>
        )}
      </div>
    </div>
  )
}

function toValues(rows: PageTextRow[]): Values {
  const out: Values = {}
  for (const r of rows) (out[r.sourceText] ??= empty())[r.lang] = r.value
  return out
}

const hasValue = (v?: { zh: string; en: string }) => Boolean(v && (v.zh.trim() || v.en.trim()))

/** 只送有變動的格子；清空的送空字串（API 會刪掉那一列） */
function diff(saved: Values, draft: Values): PageTextRow[] {
  const out: PageTextRow[] = []
  for (const en of new Set([...Object.keys(saved), ...Object.keys(draft)])) {
    for (const lang of ['zh', 'en'] as const) {
      const before = saved[en]?.[lang]?.trim() ?? ''
      const after = draft[en]?.[lang]?.trim() ?? ''
      if (before !== after) out.push({ lang, sourceText: en, value: after })
    }
  }
  return out
}
