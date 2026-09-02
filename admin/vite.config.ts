import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// 後台為純 SPA（靜態、noindex），部署到 SWA / Blob 靜態站
export default defineConfig({
  plugins: [react()],
  base: '/admin/',
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  // 打包產物放 static/，把 assets/ 留給 mockup 素材（public/assets 是指向 mockup 的 symlink）
  build: { outDir: 'dist', assetsDir: 'static', sourcemap: false },
})
