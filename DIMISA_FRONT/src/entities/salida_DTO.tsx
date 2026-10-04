export interface SalidaCerradaDetalleDTO {
  clave: string;
  descripcion: string;
  cantidad: number;
}

export interface SalidaDTO {
  folio: string;
  tipo: string;
  cendis: string;
  area: string;
  usuario: string;
  fecha: string;
  claves: SalidaCerradaDetalleDTO[];
}