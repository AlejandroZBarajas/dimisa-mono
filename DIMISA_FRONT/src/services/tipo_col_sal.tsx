import type TipoEntity from "../entities/tipo_entity";

const API_URL = import.meta.env.VITE_API_URL+"/tipos"

export const getTipos = async () : Promise<TipoEntity[]> => {
    const res = await fetch (API_URL,{
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })
    if(!res.ok) throw new Error("no se pudieron obtener los tipos de colectivo / salida")
    return res.json()
}