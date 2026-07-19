export default interface InventarioDetalle {
    id_medicamento: number,
    clave: string,
    descripcion: string,
    cantidad: number,
}
export default interface InventarioEntity{
    id_inventario: number,
    id_cendis: number
    cendis: string,
    detalles: InventarioDetalle[]
}