export interface ColectivoDetalleDTO {
  id_detalle?: number;
  id_colectivo?: number;
  clave?: string | undefined;
  id_medicamento: number;
  descripcion?: string | undefined;
  cantidad: number | undefined;
  piezas_esperadas: number; 
}