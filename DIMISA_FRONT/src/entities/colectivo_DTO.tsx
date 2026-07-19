import type { ColectivoDetalleDTO } from "./colectivo_detalle_DTO";

export interface ColectivoDTO{
    id_colectivo: number,
    tipo_id: number,
    tipo: string,
    folio: string,
    fecha: string,
    id_user: number,
    nombre_usuario:string
    id_cendis: number,
    cendis:string
    claves: ColectivoDetalleDTO[];
}