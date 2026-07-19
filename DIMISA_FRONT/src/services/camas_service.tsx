import type CamaEntity from "../entities/cama_entity";

const API_URL = import.meta.env.VITE_API_URL+"/camas/"

export const createCamas = async (data: {
  id_area: number;
  cama_1: number;
  cama_n?: number;
}): Promise<void> => {
  const res = await fetch(`${API_URL}range`, { 
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error al crear camas: ${text}`);
  }
};

export const getCamasByArea = async (id_area : number): Promise <CamaEntity[]> => {
    const res = await fetch(`${API_URL}ar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    body: JSON.stringify({id_area}),
    })
    if (!res.ok) throw new Error("Error al cargar camas por servicio (servicio)");
    return res.json();
}

export const enableCama = async (id_cama : number): Promise <void> => {
    const res = await fetch(`${API_URL}enable`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
    body: JSON.stringify({id_cama}),
    })
    if (!res.ok) throw new Error("Error al cargar camas por servicio (servicio)");
    return 
}

export const disableCama = async (id_cama : number): Promise <void> => {
    const res = await fetch(`${API_URL}disable`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
    body: JSON.stringify({id_cama}),
    })
    if (!res.ok) throw new Error("Error al cargar camas por servicio (servicio)");
    return;
}

export const deleteCama = async (id_cama:number): Promise <void> => {
    const res = await fetch(`${API_URL}delete`,{
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({id_cama}),
    })
    if (!res.ok) throw new Error("Error al eliminar cama (service front)");
    return;
}

export const getFreeCamasbyArea = async (id_area:number): Promise<CamaEntity[]> => {
  const res = await fetch(`${API_URL}frbyar`,{
    method:"POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({id_area}),
  })
  if (!res.ok) throw new Error("no se pudieron obtener las camas habilitadas desocupadas")
  return res.json();
}

export const occupyCama = async (cama: CamaEntity): Promise<void> => {

  const res = await fetch(`${API_URL}update`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cama),
  })
  if(!res.ok) throw new Error("error en el front al ocupar cama")
    return res.json()
}

export const setCamaFree = async (id_cama: number): Promise<void> => {
  const res = await fetch(`${API_URL}setfree`,{
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({id_cama}),
  })
  if(!res.ok) throw new Error("error en el front al desocupar cama")
}
