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

/** 沒有覆寫時前台顯示的字：中文查 zh.ts，查不到就落回英文原文 */
const defaultOf = (item: PageTextItem, lang: Locale) => (lang === 'zh' ? (item.zh ?? item.en) : item.en)

/** 欄位值 → 要存的覆寫。空白或與原文相同＝不存（前台沿用原文，原文日後改了也會跟著走） */
const overrideOf = (item: PageTextItem, lang: Locale, value: string | undefined) => {
  const v = value?.trim() ?? ''
  return v === '' || v === defaultOf(item, lang).trim() ? '' : v
}

/**
 * 15 page 的「頁面文字」：固定頁上每一段文字，嵌在 EditPage 的中文／English 分頁裡，只顯示目前語系。
 *
 * 欄位直接填著前台目前顯示的字，改了就是改了；DB 仍然只存「與原文不同」的覆寫（見 overrideOf）。
 * 版面、段落數、圖片不在這裡——那些仍以 mockup 為準；這裡只換字。
 *
 * 和 SEO 表單是不同的 API，但畫面上只有一顆「儲存」：EditPage 存完主表後透過 handle 呼叫
 * 這裡的 save()；未儲存的格數以 onChangesCount 回報給底部的提示。切換語系只換 locale prop，
 * 元件不重掛，草稿不會掉。
 */
export function PageTextFields({
  pageKey,
  locale,
  canEdit,
  handle,
  onChangesCount,
}: {
  pageKey: string
  locale: Locale
  canEdit: boolean
  handle: Ref<PageTextsHandle>
  onChangesCount: (n: number) => void
}) {
  const manifest = PAGE_TEXTS[pageKey]
  /** DB 裡的覆寫（原始值） */
  const [saved, setSaved] = useState<Values>({})
  /** 畫面上的欄位值（每段都有，沒覆寫的就是原文） */
  const [draft, setDraft] = useState<Values>({})
  const [loaded, setLoaded] = useState(false)

  const fill = (overrides: Values): Values => {
    const out: Values = {}
    for (const item of manifest?.items ?? []) {
      out[item.en] = {
        zh: overrides[item.en]?.zh || defaultOf(item, 'zh'),
        en: overrides[item.en]?.en || defaultOf(item, 'en'),
      }
    }
    return out
  }

  useEffect(() => {
    let alive = true
    void api.getPageTexts(pageKey).then(
      (rows) => {
        if (!alive) return
        const v = toValues(rows)
        setSaved(v)
        setDraft(fill(v))
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
    // fill 只依賴 manifest，而 manifest 由 pageKey 決定
  }, [pageKey])

  /** 只送有變動的格子；覆寫被改回原文的送空字串（API 會刪掉那一列） */
  const changes = useMemo(() => {
    const out: PageTextRow[] = []
    if (!loaded) return out
    for (const item of manifest?.items ?? []) {
      for (const lang of ['zh', 'en'] as const) {
        const before = overrideOf(item, lang, saved[item.en]?.[lang])
        const after = overrideOf(item, lang, draft[item.en]?.[lang])
        if (before !== after) out.push({ lang, sourceText: item.en, value: after })
      }
    }
    return out
  }, [manifest, saved, draft, loaded])
  useEffect(() => onChangesCount(changes.length), [changes.length, onChangesCount])

  /** 存過、但 mockup 已經沒有那段原文的覆寫：前台不會再顯示，列出來讓人搬到新的那段 */
  const orphans = useMemo(() => {
    const known = new Set(manifest?.items.map((i) => i.en))
    return Object.keys(saved).filter((k) => !known.has(k))
  }, [manifest, saved])

  const sections = useMemo(() => {
    const out: { name: string; items: PageTextItem[] }[] = []
    for (const item of manifest?.items ?? []) {
      const last = out[out.length - 1]
      if (last?.name === item.section) last.items.push(item)
      else out.push({ name: item.section, items: [item] })
    }
    return out
  }, [manifest])

  /** 失敗就往外丟，由 EditPage 統一顯示錯誤訊息 */
  const save = async () => {
    if (changes.length === 0) return
    await api.savePageTexts(pageKey, changes)
    const next: Values = {}
    for (const en of orphans) next[en] = saved[en]
    for (const item of manifest?.items ?? []) {
      const v = { zh: overrideOf(item, 'zh', draft[item.en]?.zh), en: overrideOf(item, 'en', draft[item.en]?.en) }
      if (v.zh || v.en) next[item.en] = v
    }
    setSaved(next)
    setDraft(fill(next))
  }
  useImperativeHandle(handle, () => ({ save }))

  if (!manifest) return null

  const set = (en: string, value: string) =>
    setDraft((prev) => ({ ...prev, [en]: { ...(prev[en] ?? empty()), [locale]: value } }))

  const removeOrphan = async (en: string) => {
    const items: PageTextRow[] = (['zh', 'en'] as const).map((lang) => ({ lang, sourceText: en, value: '' }))
    try {
      await api.savePageTexts(pageKey, items)
    } catch (err) {
      toast(`移除失敗：${(err as Error).message}`)
      return
    }
    setSaved(({ [en]: _, ...rest }) => rest)
    toast('已移除')
  }

  if (!loaded) return <div className="empty">頁面文字載入中…</div>

  return (
    <>
      <div className="hint" style={{ marginTop: 0, marginBottom: 14 }}>
        以下是這一頁前台目前顯示的文字，直接修改即可；清空則回到原文。
        標示「×2」的是同一段文字在頁面上出現多次，會一起改。版面、段落數與圖片不在這裡調整。
      </div>

      <fieldset disabled={!canEdit} style={{ border: 0 }}>
        {sections.map((sec, si) => (
          <div key={si} className="ptext-section">
            <div className="ptext-section-h">{sec.name}</div>
            {sec.items.map((item) => {
              const value = draft[item.en]?.[locale] ?? defaultOf(item, locale)
              const props = {
                value,
                'aria-label': `${sec.name}：${item.en.slice(0, 40)}`,
                onChange: (e: { target: { value: string } }) => set(item.en, e.target.value),
              }
              return (
                <div key={item.en} className="ptext-row">
                  {(item.kind === 'alt' || item.count > 1) && (
                    <div className="ptext-meta">
                      {item.kind === 'alt' && <Badge>圖片替代文字</Badge>}
                      {item.count > 1 && <Badge kind="warn">×{item.count}</Badge>}
                    </div>
                  )}
                  <div className="field">
                    {item.en.length > 90 ? <textarea rows={3} {...props} /> : <input type="text" {...props} />}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </fieldset>

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
    </>
  )
}

function toValues(rows: PageTextRow[]): Values {
  const out: Values = {}
  for (const r of rows) (out[r.sourceText] ??= empty())[r.lang] = r.value
  return out
}
