interface DetalleEntrada {
  id_medicamento: number;
  cantidad: number;
  piezas_esperadas?: number; 
}

export interface EntradaRequest {
  id_cendis: number;
  id_usuario: number;
  id_colectivo: number
  detalles: DetalleEntrada[];
}

export interface CargarInventarioRequest {
  id_cendis: number;
  id_usuario: number;
  detalles: DetalleEntrada[];
}