export interface DetalleMes {
  mes: number
  anio: number
  nombre: string
  consumo: number
}

export interface UnidosisConsumoDetalle {
  id_medicamento: number
  clave: string
  descripcion: string
  meses: DetalleMes[]
  sumatoria: number
  promedio_mensual: number
  promedio_diario: number
  diez_pct: number
  consumo_diario: number
  consumo_mensual: number
}

export interface ConsumoUnidosisEntity {
  medicamentos: UnidosisConsumoDetalle[]
  material: UnidosisConsumoDetalle[]
}

export interface ConsumoCendisDetalle {
  cendis_id: number
  cendis: string
  medicamentos: UnidosisConsumoDetalle[]
  material: UnidosisConsumoDetalle[]
}

export interface ConsumoCendisResponse {
  cendis: ConsumoCendisDetalle[]
}

export interface ConsumoAreaDetalle {
  area_id: number
  area: string
  medicamentos: UnidosisConsumoDetalle[]
  material: UnidosisConsumoDetalle[]
}

export interface ConsumoAreaResponse {
  areas: ConsumoAreaDetalle[]
}