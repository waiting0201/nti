import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

/**
 * 後台是掛在公開站 `/admin/` 底下的 SPA —— 與公開站共用同一個 Azure Static Web Apps，
 * 所以 `base` 必須是 `/admin/`，產物也直接寫進 web 的 `public/admin`（不經複製步驟）。
 *
 * ⚠️ 建置有順序相依：**先 admin 後 web**，`next build` 才會把 public/admin 一起打包。
 *
 *     pnpm --filter admin build && pnpm --filter web build
 */
export default defineConfig(({ command }) => ({
  base: '/admin/',
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  // public/assets 是指向 mockup/assets 的 symlink（70MB），只服務 dev。
  // 建置時關掉 publicDir，正式站的後台直接吃公開站那份 /assets/（見 src/lib/asset.ts）。
  publicDir: command === 'build' ? false : 'public',
  build: {
    outDir: '../web/public/admin',
    emptyOutDir: true,
    // 打包產物放 static/，把 assets/ 留給公開站的素材
    assetsDir: 'static',
    sourcemap: false,
  },
}))
