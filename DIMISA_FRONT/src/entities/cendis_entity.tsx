export default interface CendisEntity{
    id_cendis?: number
    cendis_nombre: string
    areas: {id_area: number, nombre_area: string}[]
}