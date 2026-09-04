#!/usr/bin/env node
/**
 * openapi.yaml ↔ AppRouter 漂移檢查
 *
 * openapi.yaml 是手寫的（catch-all 路由讓自動產生器無從內省，見 docs/10 §13），
 * 手寫的東西一定會漂移。這支做兩件事：
 *
 *   1. 靜態比對：openapi 裡每個路徑的字面 segment，都要能在 AppRouter 的路由表裡找到。
 *      抓得到「文件寫了但沒實作」與拼錯的路徑。
 *   2. 實機比對（帶 --live）：對每個 GET 端點發一次請求，確認不是 404 NOT_FOUND
 *      的「端點不存在」。只打 GET——這是檢查工具，不該改動任何資料。
 *
 * 用法：
 *   node tools/check-openapi.mjs                    # 靜態
 *   node tools/check-openapi.mjs --live [base]      # 另外實打 GET（需先 func start）
 */
import fs from 'node:fs'
import { execFileSync } from 'node:child_process'

const SPEC   = 'Api/openapi.yaml'
const ROUTER = ['Api/Routing/AppRouter.Public.cs', 'Api/Routing/AppRouter.Admin.cs', 'Api/Routing/AppRouter.cs']

// 系統的 python 有 PyYAML，repo 裡沒有 YAML 套件，就借它解析
const spec = JSON.parse(execFileSync('/usr/bin/python3', ['-c',
  `import yaml, json; print(json.dumps(yaml.safe_load(open(${JSON.stringify(SPEC)}))))`]).toString())

const routerSource = ROUTER.map(f => fs.readFileSync(f, 'utf8')).join('\n')
const methods = ['get', 'post', 'put', 'patch', 'delete']

/** 路徑參數（{id}）對應 router 的 `var x` 或 `_`，比對時忽略；只看字面 segment。 */
const literalSegments = path =>
  path.split('/').filter(s => s && !s.startsWith('{'))

let problems = 0
const ops = []

for (const [path, item] of Object.entries(spec.paths)) {
  for (const method of methods) {
    if (!item[method]) continue
    ops.push({ path, method })

    for (const segment of literalSegments(path)) {
      // 內容單元的 {unit} 由 ContentUnits 那份集合展開，路由表裡不會有字面值
      if (path.startsWith('/admin/{unit}')) continue

      if (!routerSource.includes(`"${segment}"`)) {
        console.log(`  ✗ ${method.toUpperCase()} ${path} —— router 找不到 segment "${segment}"`)
        problems++
      }
    }
  }
}

console.log(`openapi.yaml：${Object.keys(spec.paths).length} 個路徑、${ops.length} 個 operation`)
console.log(problems === 0 ? '靜態比對：每個路徑的字面 segment 都在 AppRouter 裡 ✓'
                           : `靜態比對：${problems} 個問題 ✗`)

if (process.argv.includes('--live')) {
  const base = process.argv[process.argv.indexOf('--live') + 1]?.startsWith('http')
    ? process.argv[process.argv.indexOf('--live') + 1]
    : 'http://localhost:7072/api/v1'

  // 路徑參數填入不會存在的值：要驗的是「路由認得這條路徑」，不是資料查得到
  const sample = { id: '1', attachmentId: '1', slug: 'x', pageKey: 'home', unit: 'news' }
  const fill = p => p.replace(/\{(\w+)\}/g, (_, k) => sample[k] ?? 'x')

  let liveProblems = 0, checked = 0
  for (const { path, method } of ops) {
    if (method !== 'get') continue        // 只打 GET，不動資料
    checked++

    const res = await fetch(base + fill(path))
    const body = await res.text()

    // 路由不認得會回 NOT_FOUND 且 errors 帶「does not exist」；
    // 資料查不到也是 404，但 errors 是空的——兩者要分開
    if (res.status === 404 && body.includes('does not exist')) {
      console.log(`  ✗ GET ${path} —— 路由不認得（${fill(path)}）`)
      liveProblems++
    }
  }
  console.log(liveProblems === 0 ? `實機比對：${checked} 個 GET 端點路由皆存在 ✓`
                                 : `實機比對：${liveProblems} 個問題 ✗`)
  problems += liveProblems
}

process.exit(problems === 0 ? 0 : 1)
