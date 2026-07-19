// useSearchInInventoryHook.ts
import { useEffect, useState } from "react"
import { SearchInInventory } from "../services/claves_service"
import type { ClaveInventarioEntity } from "../entities/clave_inventario_entity"

export function useSearchInInventory(query: string, cendisId: number, itemType: "med" | "mat" | "all") {
  const [results, setResults] = useState<ClaveInventarioEntity[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (query.trim().length < 2 || !cendisId) {
      setResults([])
      return
    }

    const delay = setTimeout(async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await SearchInInventory(query, cendisId, itemType)
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
  }, [query, cendisId, itemType])

  return { results, loading, error }
}