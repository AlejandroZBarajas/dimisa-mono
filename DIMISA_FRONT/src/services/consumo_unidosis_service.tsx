import type {
  ConsumoUnidosisEntity,
  ConsumoAreaResponse,
  ConsumoCendisResponse,
} from "../entities/consumo_unidosis_entity"

const API_URL = import.meta.env.VITE_API_URL + "/consumo-unidosis"

export const getConsumoUnidosisGlobal =
  async (): Promise<ConsumoUnidosisEntity> => {
    console.log("url: ", `${API_URL}`)

    const res = await fetch(`${API_URL}`, {
      method: "GET",
    })

    if (!res.ok) throw new Error("Error al obtener consumo unidosis")

    return res.json()
  }

export const getConsumoUnidosisAreas =
  async (): Promise<ConsumoAreaResponse> => {
    console.log("url: ", `${API_URL}/areas`)
    const res = await fetch(`${API_URL}/areas`, {
      method: "GET",
    })

    if (!res.ok) throw new Error("Error al obtener consumo unidosis por áreas")

    return res.json()
  }

export const getConsumoUnidosisCendis =
  async (): Promise<ConsumoCendisResponse> => {
    console.log("url: ", `${API_URL}/cendis`)

    const res = await fetch(`${API_URL}/cendis`, {
      method: "GET",
    })

    if (!res.ok) throw new Error("Error al obtener consumo unidosis por CENDIS")

    return res.json()
  }