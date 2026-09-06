import { Children, cloneElement, isValidElement, type ReactNode } from 'react'
import type { Locale } from './i18n'

/**
 * 靜態文字中文化的共用機制（不含字典）。
 *
 * 版面與英文文案的權威來源仍是 `mockup/`（CLAUDE.md 的切版鐵律），所以這層
 * **不改頁面結構、也不改英文字面**：字典以英文原文為 key，查不到就原樣回傳，
 * `/en` 完全不經過替換。`verify:markup` 跑的是 `/en`，因此對驗收閘透明。
 *
 * 字典分兩份是為了**不要把整本字典打進 client bundle**：
 *   - `lib/t`（伺服器）吃完整字典，給 44 頁與 footer／浮動鈕用
 *   - `lib/t-client`（client component）只吃 header 與 behaviors 需要的那幾十筆
 */

/** 字典 key 的正規化：JSX 與 HTML 的換行／縮排不該影響比對 */
const norm = (s: string) => s.replace(/\s+/g, ' ').trim()

/** 會被翻譯的屬性。其餘（href／className／src…）一律不動 */
const ATTRS = ['alt', 'title', 'placeholder', 'aria-label'] as const

/** 內容不是給人看的標籤，整棵跳過 */
const SKIP_TAGS = new Set(['script', 'style', 'code', 'pre'])

export type Dict = Record<string, string>

export function createTranslator(dict: Dict) {
  /** 英文原文 → 該語系的字。前後空白是版面的一部分（行內標籤之間會渲染成空格），只換中間的字 */
  function tr(locale: Locale, en: string): string {
    if (locale !== 'zh') return en
    const zh = dict[norm(en)]
    if (!zh) return en
    return /^\s*/.exec(en)![0] + zh + /\s*$/.exec(en)![0]
  }

  function walk(node: ReactNode, locale: Locale): ReactNode {
    if (typeof node === 'string') return tr(locale, node)
    if (Array.isArray(node)) return Children.map(node, (n) => walk(n, locale))
    if (!isValidElement(node)) return node

    const el = node as React.ReactElement<Record<string, unknown>>
    if (typeof el.type === 'string' && SKIP_TAGS.has(el.type)) return el

    const props = el.props
    const next: Record<string, unknown> = {}

    for (const a of ATTRS) {
      const v = props[a]
      if (typeof v === 'string') {
        const t = tr(locale, v)
        if (t !== v) next[a] = t
      }
    }

    // CMS 的 rich text 已經是該語系的內容，不能再翻一次
    if (!props.dangerouslySetInnerHTML && props.children !== undefined) {
      next.children = walk(props.children as ReactNode, locale)
    }

    return Object.keys(next).length ? cloneElement(el, next) : el
  }

  /**
   * 把 children 裡的文字換成該語系的版本。
   *
   * ⚠ 只看得到「已經展開的」element tree。子元件內部的 JSX（client component、
   * CMS 元件）它進不去，那些檔案要自己包一層 `<T>` 或改用 `tr()`。
   */
  function T({ locale, children }: { locale: Locale; children: ReactNode }) {
    if (locale !== 'zh') return <>{children}</>
    return <>{walk(children, locale)}</>
  }

  return { tr, T }
}
