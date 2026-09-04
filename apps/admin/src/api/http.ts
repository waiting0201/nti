/**
 * 與 `/api/v1` 溝通的底層。
 *
 * 所有回應都是 docs/10 §5 的統一信封 `{ success, code, data, message, errors }`——
 * **前端一律以 `code` 分支，不比對 `message` 字串**（訊息是給人看的，會改）。
 */

/** 沒設定就走本機 mock（見 client.ts）。正式部署由 CI 帶入。 */
export const API_BASE = (import.meta.env.VITE_API_BASE ?? '').replace(/\/$/, '')

export const hasApi = API_BASE.length > 0

const TOKEN_KEY = 'nti-admin-token'

export type Session = {
  accessToken: string
  displayName: string
  email: string
  roleCode: string
  permissions: string[]
  mustChangePassword: boolean
}

export function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(TOKEN_KEY)
    return raw ? (JSON.parse(raw) as Session) : null
  } catch {
    return null
  }
}

export function saveSession(session: Session | null) {
  try {
    if (session) localStorage.setItem(TOKEN_KEY, JSON.stringify(session))
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* 無痕視窗存不進去；當次操作仍可用，重整才要重登 */
  }
}

/** API 回錯時丟這個，畫面可以直接看 `code` 決定怎麼提示。 */
export class ApiError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly status: number,
    readonly errors: string[] = [],
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

type RequestOptions = {
  method?: string
  body?: unknown
  /** multipart 上傳用；有值時不設 Content-Type，交給瀏覽器帶 boundary */
  form?: FormData
  /** 登入端點不帶 token */
  anonymous?: boolean
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, form, anonymous } = options
  const headers: Record<string, string> = {}

  if (!anonymous) {
    const session = loadSession()
    if (session) headers.Authorization = `Bearer ${session.accessToken}`
  }
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: form ?? (body === undefined ? undefined : JSON.stringify(body)),
  })

  // 檔案下載（CSV／附件）不是信封，直接把 Response 交回去
  const contentType = res.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) {
    if (!res.ok) throw new ApiError('INTERNAL', `HTTP ${res.status}`, res.status)
    return res as unknown as T
  }

  const envelope = await res.json()

  if (!res.ok || envelope.success === false) {
    // token 過期或無效就清掉，讓畫面回到登入頁——留著只會讓每一次操作都失敗
    if (res.status === 401) saveSession(null)

    throw new ApiError(
      envelope.code ?? 'INTERNAL',
      envelope.message ?? `HTTP ${res.status}`,
      res.status,
      envelope.errors ?? [],
    )
  }

  return envelope.data as T
}

export const api = {
  get:    <T>(path: string) => request<T>(path),
  post:   <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body }),
  put:    <T>(path: string, body?: unknown) => request<T>(path, { method: 'PUT', body }),
  patch:  <T>(path: string, body?: unknown) => request<T>(path, { method: 'PATCH', body }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
  upload: <T>(path: string, form: FormData) => request<T>(path, { method: 'POST', form }),
}
