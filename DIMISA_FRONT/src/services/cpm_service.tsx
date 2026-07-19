import type { CpmEntity } from "../entities/cpm_entity"

const API_URL = import.meta.env.VITE_API_URL

export const getCpm = async (): Promise<CpmEntity> => {
  const res = await fetch(`${API_URL}/cpm`, { method: "GET" })
  if (!res.ok) throw new Error("Error al obtener CPM")
  return res.json()
}