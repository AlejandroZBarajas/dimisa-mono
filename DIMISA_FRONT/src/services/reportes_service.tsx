import type EntradaColectivoReporte from "../entities/reportes_entities"
import type DeficitCronicoDetalle from "../entities/reportes_entities"

const API_URL = import.meta.env.VITE_API_URL

export const getReporteMensual = async (
  id_cendis: number,
  mes: number,
  anio: number
): Promise<EntradaColectivoReporte> => {
  const res = await fetch(`${API_URL}/entradas-colectivo/reporte-mensual`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_cendis, mes, anio }),
  })
  if (!res.ok) throw new Error("Error al obtener reporte mensual")
  return res.json()
}

export const getDeficitCronico = async (
  id_cendis: number,
  anio: number
): Promise<DeficitCronicoDetalle[]> => {
  const res = await fetch(`${API_URL}/entradas-colectivo/deficit-cronico`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_cendis, anio }),
  })
  if (!res.ok) throw new Error("Error al obtener déficit crónico")
  return res.json().then((data) => data ?? [])
}

export const getComparativoCendis = async (
  mes: number,
  anio: number
): Promise<EntradaColectivoReporte[]> => {
  const res = await fetch(`${API_URL}/entradas-colectivo/comparativo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mes, anio }),
  })
  if (!res.ok) throw new Error("Error al obtener comparativo")
  return res.json().then((data) => data ?? [])
}