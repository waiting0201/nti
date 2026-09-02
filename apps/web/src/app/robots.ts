import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
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
