import type { ClaveEntity } from "./clave_entity"

export interface SearchResponse {
  success: boolean
  data?: ClaveEntity[]
  message?: string
  count: number
}
