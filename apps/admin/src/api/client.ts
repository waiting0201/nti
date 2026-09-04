/**
 * 後台資料存取層（門面）。
 *
 * 兩套實作、同一組簽章，上層的清單／編輯畫面不知道資料從哪來：
 *
 *   - `client.api.ts`  —— 打真實的 `/api/v1/admin/*`，帶 JWT
 *   - `client.mock.ts` —— 本機 mock（localStorage），資料來自 db/seed 與 mockup
 *
 * **由 `VITE_API_BASE` 有沒有設定來選。** 保留 mock 不是為了偷懶：
 * 後台已經部署在 SWA 上（`/admin/`）供客戶操作，而 API 的 Azure 資源還沒開；
 * 硬切過去會讓那個站當場壞掉。等資源開好、CI 帶入 `VITE_API_BASE`，就自動走真 API。
 */
import * as mock from './client.mock'
import * as real from './client.api'
import { hasApi } from './http'

const impl = hasApi ? real : mock

export const list          = impl.list
export const listAll       = impl.listAll
export const get           = impl.get
export const save          = impl.save
export const create        = impl.create
export const softDelete    = impl.softDelete
export const setPublished  = impl.setPublished
export const reorder       = impl.reorder
export const listChildren  = impl.listChildren
export const getSettings   = impl.getSettings
export const saveSettings  = impl.saveSettings
export const categoryUsage = impl.categoryUsage
export const resetStore    = impl.resetStore

/** 目前是不是接著真的 API（畫面上要顯示「示範資料」提示時用得到）。 */
export const isLive = hasApi
