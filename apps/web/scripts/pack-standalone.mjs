// 把 `next build`（output: standalone）的產物整理成 SWA 收得下的形狀。
//
// 兩件事：
// 1. 把 .next/static 與 public/ 複製進 standalone —— Next 不會自己放，
//    少了它們部署後 CSS、字型、圖片與整個 /admin 全部 404，而 build 完全成功。
// 2. 壓平 pnpm workspace 造成的兩層巢狀。SWA 找的是 .next/standalone/server.js；
//    在 workspace 下它會被放到 .next/standalone/apps/web/server.js，SWA 找不到
//    入口，部署會走到最後才回「Web app warm up timed out」。
//
// ⚠️ CI 必須以 NPM_CONFIG_NODE_LINKER=hoisted 安裝：SWA 的打包器不跟隨符號連結，
//    而 pnpm 預設的 node_modules 幾乎全是連結，會以
//    `Could not find file .../node_modules/react` 失敗。本機保留 pnpm 的嚴格佈局
//    （才擋得住 phantom dependency），只在 CI 改成 hoisted。
//
// ⚠️ 不要改用 outputFileTracingRoot 來避免巢狀，原因見 next.config.ts。
import { cpSync, existsSync, rmSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const standalone = path.join(root, '.next', 'standalone')
const nested = path.join(standalone, 'apps', 'web')

if (!existsSync(standalone)) {
  console.error('[pack-standalone] 找不到 .next/standalone —— next.config 是否還設著 output: standalone？')
  process.exit(1)
}

// workspace 下才有巢狀；非 workspace 建置時 server.js 本來就在根
const appDir = existsSync(nested) ? nested : standalone

cpSync(path.join(root, '.next', 'static'), path.join(appDir, '.next', 'static'), { recursive: true })
cpSync(path.join(root, 'public'), path.join(appDir, 'public'), { recursive: true })

if (appDir !== standalone) {
  // node_modules 已經在 standalone 根（tracing 從 repo 根複製進來的實體檔案），
  // 這裡只把 app 自己的檔案往上搬，不要動它
  cpSync(appDir, standalone, { recursive: true })
  rmSync(path.join(standalone, 'apps'), { recursive: true, force: true })
}

if (!existsSync(path.join(standalone, 'server.js'))) {
  console.error('[pack-standalone] 壓平後仍找不到 server.js —— SWA 會以 warm up timeout 失敗。')
  process.exit(1)
}

console.log('[pack-standalone] ✓ standalone 已就緒（server.js 在根目錄）')
