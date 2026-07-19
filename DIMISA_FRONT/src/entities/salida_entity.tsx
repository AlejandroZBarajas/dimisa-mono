import type { SalidaDetalleEntity } from "./salida_detalle"

export default interface SalidaEntity {
    id_area: number
    id_cendis: number
    id_usuario : number
    tipo_id : number
    fecha: string; 
    claves: SalidaDetalleEntity[]
    editable: number
    pendiente: number
}