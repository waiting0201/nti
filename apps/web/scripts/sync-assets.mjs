// 從 mockup/assets 同步靜態素材到 web/public/assets。
// 素材不進版控（見 web/.gitignore），clone 後先跑一次：npm run sync:assets
import { cp, rm, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const src = path.resolve(root, '../../mockup/assets')
const dest = path.resolve(root, 'public/assets')

if (!existsSync(src)) {
  console.error(`找不到來源素材：${src}`)
  process.exit(1)
}
await rm(dest, { recursive: true, force: true })
await mkdir(path.dirname(dest), { recursive: true })
await cp(src, dest, {
  recursive: true,
  // img-size.js 只供 mockup 檢視用，正式站不掛載
  filter: (s) => path.basename(s) !== 'img-size.js',
})
console.log(`已同步素材：${src} → ${dest}`)
