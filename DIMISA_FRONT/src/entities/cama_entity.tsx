export default interface CamaEntity{
    id_cama?:number
    id_area:number
    numero_cama: number
    nombres:string
    apellido1:string
    apellido2:string
    fecha_nac: string
    expediente:string
    riesgo_caida: string //enum(Bajo, Medio, Alto)
    riesgo_ulcera: string //enum(Bajo, Medio, Alto)
    habilitada: boolean
    occupied:boolean
}