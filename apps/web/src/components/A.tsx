import Link from 'next/link'
import type { AnchorHTMLAttributes } from 'react'

/**
 * mockup 的 <a> 統一換成本元件：站內連結走 next/link（SPA 導覽 + prefetch），
 * 錨點／外部連結／`#` 佔位維持原生 <a>。兩者輸出的 DOM 都是 <a href>，
 * 與 mockup 的 HTML 完全一致。
 */
export function A(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { href, ...rest } = props
  const internal = typeof href === 'string' && href.startsWith('/')
  if (internal) return <Link href={href} {...rest} />
  return <a href={href} {...rest} />
}
