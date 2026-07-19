export interface ColectivoDetalleEntity {
  id_detalle?: number;
  id_colectivo?: number;
  clave?: string | undefined;
  id_medicamento: number;
  descripcion?: string | undefined;
  cantidad: number | undefined;
}