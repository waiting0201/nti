import type { NextConfig } from 'next'

/**
 * ⚠️ 部署目標是 Azure Static Web Apps **Free** 方案的 Next.js hybrid。
 * 這裡每一項設定都對應一條該平台的硬限制，改動前先讀 docs/07-deployment.md。
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,

  // SWA Free 單一環境上限 250MB。standalone 是必須，不是最佳化選項。
  // 產物由 scripts/pack-standalone.mjs 收尾（見 package.json 的 postbuild）。
  output: 'standalone',

  /**
   * ⚠️ **不要**把 `outputFileTracingRoot` 釘在這個 app 上。
   *
   * 那樣產物確實會變平坦（`.next/standalone/server.js`），但 pnpm 的相依都躺在
   * workspace 根的 `.pnpm` store 裡 —— tracing 根縮小之後那些檔案在範圍外，
   * Next 只會留下**指向 standalone 之外的符號連結**。體積看起來大幅下降像是
   * 優化，其實是空的，SWA 打包時會以 `Could not find file .../node_modules/react`
   * 失敗。
   *
   * 正確做法是保留 repo 根當 tracing 根（相依會真的被複製進來），
   * 再由 postbuild 把巢狀的那兩層壓平。
   */

  // mockup 的 <img> 一律原樣輸出，不走 next/image，確保版面與 mockup 逐像素一致。
  // 這同時避開 SWA managed backend 的圖片優化——那會讓每個位元組都計入
  // Free 方案的 100GB/月頻寬，超額不能加購，直接中斷服務。
  images: { unoptimized: true },

  // 後台（public/admin）的 SPA fallback 在 src/middleware.ts —— 那裡才擋得住
  // /[locale]/* 動態路由的碰撞，原因見該檔註解。
}

export default nextConfig
