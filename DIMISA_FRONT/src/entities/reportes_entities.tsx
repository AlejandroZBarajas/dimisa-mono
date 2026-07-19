interface EntradaColectivoDetalle {
  id_cendis: number
  id_medicamento: number
  clave: string
  descripcion: string
  piezas_esperadas: number 
  cantidad_recibida: number
  deficit: number
  estatus: "Completo" | "Parcial" | "No surtido"
  mes: number
  anio: number
}

export default interface EntradaColectivoReporte {
  id_cendis: number
  cendis: string
  mes: number
  anio: number
  total_solicitado: number  
  total_recibido: number
  total_deficit: number
  pct_cumplimiento: number
  detalles: EntradaColectivoDetalle[]
}

export default interface DeficitCronicoDetalle {
  id_cendis: number
  id_medicamento: number
  clave: string
  descripcion: string
  total_solicitado: number
  cantidad_recibida: number
  deficit: number
  estatus: "Parcial" | "No surtido"
}