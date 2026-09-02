/**
 * 單元設定的驗收閘，對應 docs/09-cms-admin.md §8 DoD：
 *   - 每個上傳欄位旁都顯示 §3 的建議尺寸提示文字
 *   - 每個圖片欄位都有中英 Alt
 *   - 權限矩陣展開後與 db/seed/110_role_permission.sql 的 171 列一致
 *
 * 開發模式下 App.tsx 也會跑同一份檢查並印在 console；這支是給 CI／手動用的。
 * 用 vite 內建的 esbuild 把 TS 打包成一支 ESM，避開 `@/` 別名在 node 端的解析問題。
 */
import { build } from 'esbuild'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dir = await mkdtemp(path.join(tmpdir(), 'nti-units-'))
const outfile = path.join(dir, 'units.mjs')

try {
  await build({
    entryPoints: [path.join(root, 'src/units/index.ts')],
    bundle: true,
    format: 'esm',
    platform: 'neutral',
    outfile,
    alias: { '@': path.join(root, 'src') },
    logLevel: 'error',
  })

  const mod = await import(pathToFileURL(outfile).href)
  const problems = mod.validateUnits()
  console.log(`清單項目：${mod.UNITS.length}（儀表板 + 24 個單元）`)
  if (problems.length) {
    console.error('✗ ' + problems.join('\n✗ '))
    process.exitCode = 1
  } else {
    console.log('✓ 每個上傳欄位都有 §3 提示、每個圖片欄位都有中英 Alt、權限矩陣 171 列')
  }
} finally {
  await rm(dir, { recursive: true, force: true })
}
