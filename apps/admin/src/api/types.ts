import type { Locale } from '@/lib/types'

/** 後台資料列的通用形狀：語系中性欄位直接放在列上，文字欄位放在 i18n 之下 */
export type Row = {
  id: string
  sortOrder?: number
  isPublished?: boolean
  publishAt?: string | null
  unpublishAt?: string | null
  isDeleted?: boolean
  parentId?: string
  i18n?: Record<Locale, Record<string, string>>
  [key: string]: unknown
}

export type ListQuery = {
  keyword?: string
  status?: string
  categoryId?: string
  page?: number
  pageSize?: number
}

export type ListResult = { rows: Row[]; total: number }
