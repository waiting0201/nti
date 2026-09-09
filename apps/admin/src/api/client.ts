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
export const downloadQuoteAttachment = impl.downloadQuoteAttachment
export const exportQuotesCsv         = impl.exportQuotesCsv
export const exportRedirectsCsv      = impl.exportRedirectsCsv
export const importRedirectsCsv      = impl.importRedirectsCsv

// 23 admin：帳號與角色不走泛用的 list/create/save（形狀不同，見 client.api.ts）
export const listAdmins   = impl.listAdmins
export const listRoles    = impl.listRoles
export const createAdmin  = impl.createAdmin
export const updateAdmin  = impl.updateAdmin
export const deleteAdmin  = impl.deleteAdmin

export type { AdminAccount, AdminDraft, AdminPatch, AdminRole } from './client.api'

/** 目前是不是接著真的 API（畫面上要顯示「示範資料」提示時用得到）。 */
export const isLive = hasApi
