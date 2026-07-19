import type { ColectivoDetalleEntity} from "./colectivo_detalle_entity";

export interface ColectivoEntity {
  tipo_id: number,
  fecha: string;
  id_user: number;  
  id_cendis: number;
  claves: ColectivoDetalleEntity[];
}
