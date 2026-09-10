/**
 * 單元設定的驗收閘，對應 docs/09-cms-admin.md §8 DoD：
 *   - 每個上傳欄位旁都顯示 §3 的建議尺寸提示文字
 *   - 每個圖片欄位都有中英 Alt
 *   - 權限矩陣展開後與 db/seed/110_role_permission.sql 的 173 列一致
 *   - 網站設定的 15 個 key 與多語旗標，與後端種子（Api/Data/Seed/SeedData.cs）一致
 *
 * 開發模式下 App.tsx 也會跑同一份檢查並印在 console；這支是給 CI／手動用的。
 * 用 vite 內建的 esbuild 把 TS 打包成一支 ESM，避開 `@/` 別名在 node 端的解析問題。
 */
import { build } from 'esbuild'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dir = await mkdtemp(path.join(tmpdir(), 'nti-units-'))
const outfile = path.join(dir, 'units.mjs')
const seedfile = path.join(dir, 'seed.mjs')

const bundle = (entry, out) =>
  build({
    entryPoints: [entry],
    bundle: true,
    format: 'esm',
    platform: 'neutral',
    outfile: out,
    alias: { '@': path.join(root, 'src') },
    logLevel: 'error',
  })

try {
  await bundle(path.join(root, 'src/units/index.ts'), outfile)
  // 21 網站設定的欄位宣告不在 units/ 裡（自訂畫面），要另外拉進來比對
  await bundle(path.join(root, 'src/api/seed.manual.ts'), seedfile)

  const mod = await import(pathToFileURL(outfile).href)
  const seed = await import(pathToFileURL(seedfile).href)
  const problems = mod.validateUnits()
  problems.push(...(await checkSettingKeys(seed)))
  console.log(`清單項目：${mod.UNITS.length}（側欄顯示的單元）`)
  if (problems.length) {
    console.error('✗ ' + problems.join('\n✗ '))
    process.exitCode = 1
  } else {
    console.log('✓ 每個上傳欄位都有 §3 提示、每個圖片欄位都有中英 Alt、權限矩陣 173 列、設定 key 與多語旗標與後端一致')
  }
} finally {
  await rm(dir, { recursive: true, force: true })
}

/**
 * 網站設定的 key 對照。
 *
 * 21 網站設定不是通用單元（自訂畫面、欄位宣告在 api/seed.manual.ts），所以
 * `validateUnits()` 掃不到它——前端表單的 key 就這樣跟後端岔開過一次：
 * 表單問的是 `company.map`／`home.gallery`／`mail.quoteTo`，資料庫裡是
 * `company.map_embed`／`home.gallery_image`／`mail.quote_notify_to`。
 *
 * 而後端的 PUT /admin/setting 對不認得的 key 是整批擋下（AdminSimpleHandlers.cs），
 * 表單又是一次送出十五筆——五個 key 對不上，另外十筆也一起存不進去。
 * mock 模式下這件事完全看不出來：key 兩邊都是自己的，怎麼填都會過。
 *
 * 這裡不抄第三份清單，直接讀後端種子那份權威來源比對。
 */
async function checkSettingKeys(seed) {
  const problems = []
  const src = await readFile(path.join(root, '../../Api/Data/Seed/SeedData.cs'), 'utf8')

  // 只取 SiteSettings 陣列那一段，避免掃到檔案其他地方的字串
  const block = src.match(/SiteSetting\[\] SiteSettings\s*=\s*\[([\s\S]*?)\n    \];/)
  if (!block) return ['讀不到 Api/Data/Seed/SeedData.cs 的 SiteSettings 種子，設定 key 無法比對']

  // 逐筆拆再取欄位，不用一條橫跨整列的正規式：種子哪天換行重排，那種寫法會match不到，
  // 然後這裡會報「後端沒有這個 key」——一個會謊報的檢查比沒有更糟。看不懂就明說看不懂。
  const backend = new Map()
  for (const entry of block[1].split(/new\(\)/).slice(1)) {
    const key = entry.match(/SettingKey\s*=\s*"([^"]+)"/)
    if (!key) continue
    const localized = entry.match(/IsLocalized\s*=\s*(true|false)/)
    if (!localized) {
      problems.push(`讀不出設定 key「${key[1]}」的 IsLocalized，SeedData.cs 的格式可能變了`)
      continue
    }
    backend.set(key[1], localized[1] === 'true')
  }
  if (backend.size === 0) return ['解析不出 SeedData.cs 的 SiteSettings 種子，設定 key 無法比對']
  const fields = seed.SETTING_GROUPS.flatMap((g) => g.fields)
  const frontend = new Map(fields.map((f) => [f.key, Boolean(f.i18n)]))

  for (const key of frontend.keys()) {
    if (!backend.has(key)) problems.push(`設定 key「${key}」後端沒有，存檔會被整批擋下（SeedData.cs SiteSettings）`)
  }
  for (const key of backend.keys()) {
    if (!frontend.has(key)) problems.push(`設定 key「${key}」後端有、後台表單沒有，客戶改不到這個值`)
  }

  // 多語旗標也要一致。表單認為某個 key 是單語時，saveSettings 會把同一個值同時寫進
  // ValueZh 與 ValueEn（client.api.ts）——後端若當它是雙語的，英文站就會出現中文字，
  // 而且畫面上不會有任何錯誤，是靜靜地錯。
  for (const [key, i18n] of frontend) {
    if (backend.has(key) && backend.get(key) !== i18n) {
      problems.push(
        `設定 key「${key}」多語旗標不一致：後台 ${i18n ? '雙語' : '單語'}、` +
          `後端 IsLocalized=${backend.get(key)}（英文站會拿到中文值）`,
      )
    }
  }

  // 圖片欄位的 altKey 要真的指到同一組設定裡的欄位（validateUnits 對通用單元做的同一條）
  for (const f of fields) {
    if (f.type === 'image' && f.altKey && !frontend.has(f.altKey)) {
      problems.push(`設定 ${f.key}：altKey「${f.altKey}」找不到對應欄位`)
    }
  }

  // mock 的示範值也照同一組 key，少一個那格在 demo 上就是空的
  for (const key of frontend.keys()) {
    if (!(key in seed.SETTING_VALUES)) problems.push(`設定 key「${key}」在 SETTING_VALUES 沒有示範值，demo 上會是空白`)
  }

  return problems
}
