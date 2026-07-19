export interface DetalleMes {
  mes: number
  anio: number
  nombre: string
  consumo: number
}

export interface CpmDetalle {
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

export interface CpmEntity {
  medicamentos: CpmDetalle[]
  material: CpmDetalle[]
}