/**
 * 輸出一段 JSON-LD。
 *
 * ⚠ 放置位置有限制：版面驗收閘 `verify:markup` 比對 `</header>` 到 `<footer>`
 * 之間的輸出，那個區間**不能**多出任何節點（即使 script 不渲染東西也會讓節點序列對不上）。
 * 所以全站共用的 graph 放在 layout 的 body 末端（footer 之後），
 * 頁面層級的只加在 mockup 沒有的路由（例如 CMS 的 `/news/{slug}`）。
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // `<` 跳脫掉，避免內容裡的字串提前結束 script 標籤
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
