import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'
import { CMS_TAG } from '@/lib/api'

/**
 * 後台存檔後由 API 呼叫，把 CMS 資料的快取作廢。
 *
 * 沒有這支的話，`lib/api.ts` 的 `revalidate: 300` 就是唯一的時鐘：編輯者存了檔，
 * 公開頁最多五分鐘後才換上新內容，而且踩到期限的那個請求拿到的仍是舊頁
 * （stale-while-revalidate），下一個請求才看得到。對編輯者來說那就是「存了沒反應」。
 *
 * **只作廢資料快取，不重建頁面**：`revalidateTag` 把打了 `cms` tag 的 fetch 結果標成過期，
 * 下一個訪客會拿到重新取過資料的頁面。不用 `revalidatePath` 是因為要逐頁列出受影響的路徑，
 * 那份對照表會跟著單元增減慢慢失真，而漏掉一條的症狀是「某一頁永遠不更新」——很難查。
 *
 * ⚠️ ISR 快取是**每個執行個體各自持有**的。SWA 若把站台擴出多個執行個體，
 * 這支只會清到接到請求的那一個，其餘仍等 300 秒。目前 Free 方案是單一執行個體，
 * 之後若擴充，這裡要改成共用的 cache handler。
 */
export async function POST(req: Request) {
  const secret = process.env.REVALIDATE_SECRET

  // 沒設定就當這支不存在——比回 500 好：沒設定是「還沒啟用」，不是故障
  if (!secret) return new NextResponse(null, { status: 404 })

  if (req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ revalidated: false }, { status: 401 })
  }

  revalidateTag(CMS_TAG)
  return NextResponse.json({ revalidated: true, at: Date.now() })
}
