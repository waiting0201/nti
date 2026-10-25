import { JsonLd } from './JsonLd'
import { videoObject } from '@/lib/jsonld'
import { getYoutubeMeta } from '@/lib/youtube'

/**
 * 嵌入影片的 `VideoObject`。讀不到 YouTube 那端的上傳日期就整段不發（見 `lib/youtube.ts`）。
 *
 * ⚠ 放置位置：會放進頁面本體，所以只能用在**接了 CMS 的分支**——沒接 API 時頁面要與 mockup
 * 逐字相同（`verify:markup`），那個區間不能多出 script 節點。見 components/JsonLd.tsx
 */
export async function VideoJsonLd({
  id,
  name,
  description,
  thumbnailUrl,
}: {
  id: string
  name?: string
  description?: string | null
  thumbnailUrl?: string | null
}) {
  const meta = await getYoutubeMeta(id)
  if (!meta) return null
  return (
    <JsonLd
      data={videoObject({
        id,
        uploadDate: meta.uploadDate,
        duration: meta.duration,
        name: name || meta.name,
        description: description || meta.description,
        thumbnailUrl,
      })}
    />
  )
}
