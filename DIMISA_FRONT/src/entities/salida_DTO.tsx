import type SalidaDetalleDTO from "./salida_detalle_DTO"
export default interface SalidaDTO{
    folio: string
    id_salida:number
    id_area: number
    area: string
    id_cendis: number
    cendis: string
    id_usuario: number
    usuario: string
    fecha: string
    created_at: string
    claves: SalidaDetalleDTO[]
}