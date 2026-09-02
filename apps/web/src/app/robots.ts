import type { MetadataRoute } from 'next'

/**
 * 正式上線前一律 noindex。
 *
 * 站台在 SWA 上是公開可達的（`*.azurestaticapps.net`），而規劃的上線時間是 2026-11。
 * 中間這段若被搜尋引擎收錄，之後換到正式網域會留下一批指向 azurestaticapps.net
 * 的舊索引，得再花力氣清。所以**預設擋全站**，要開放收錄必須在該次 build 明確設
 * `NEXT_PUBLIC_ALLOW_INDEXING=1`。
 */
const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === '1'

export default function robots(): MetadataRoute.Robots {
  if (!allowIndexing) {
    return { rules: { userAgent: '*', disallow: '/' } }
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // 後台與公開站同域（public/admin）。index.html 的 meta noindex 只擋索引、
      // 不擋爬取，所以這裡要明確擋掉。
      disallow: '/admin/',
    },
  }
}
