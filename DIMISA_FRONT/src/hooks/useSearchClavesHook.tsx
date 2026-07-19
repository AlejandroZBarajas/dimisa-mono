// useSearchClavesHook.ts
import { useEffect, useState } from "react"
import { SearchClaves, SearchAllClaves } from "../services/claves_service"
import type { ClaveEntity } from "../entities/clave_entity"

export function useSearchClaves(query: string, itemType: "med" | "mat" | "all") {
  const [results, setResults] = useState<ClaveEntity[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      return
    }

    const delay = setTimeout(async () => {
      try {
        setLoading(true)
        setError(null)
          const response = itemType === "all"
            ? await SearchAllClaves(query)
            : await SearchClaves(query, itemType)
        if (response.success && response.data) {
          setResults(response.data)
        } else {
          setResults([])
          setError(response.message || "Sin resultados")
        }
      } catch (err) {
        setError((err as Error).message)
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 400)

    return () => clearTimeout(delay)
  }, [query, itemType])

  return { results, loading, error }
}