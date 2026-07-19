import type AreaEntity from "../entities/area_entity";

const API_URL = import.meta.env.VITE_API_URL+"/areas"

export const getAreas = async (): Promise<AreaEntity[]> => {
  const res = await fetch(`${API_URL}`,{});
  if (!res.ok) throw new Error("Error al obtener areas");
  return res.json();
};

export const createArea = async (area: AreaEntity): Promise<AreaEntity> => {
  const res = await fetch(`${API_URL}/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(area),
  });
  if (!res.ok) throw new Error("Error al crear Area (servicio)");
  return res.json();
};

export const updateArea = async (area: AreaEntity): Promise<AreaEntity> => {

  const res = await fetch(`${API_URL}/update`, {
    method: "PUT", 
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(area),
  });
  if (!res.ok) throw new Error("Error en el servicio del front al actualizar area");
  return res.json();
};

export const deleteArea = async (id: number): Promise<void> => {

  const res = await fetch(`${API_URL}/delete`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body:JSON.stringify({id_area:id}),
  });
  if (!res.ok) throw new Error("Error al eliminar area en el servicio del front");
};

export const getFreeAreas = async (): Promise<AreaEntity[]> =>{
  const res = await fetch(`${API_URL}/free`,{})
  if(!res.ok) throw new Error("No se pudieron obtener areas sin vincular a cendis")
  return res.json()
}

export const getAreasByCendis = async (id_cendis: number): Promise <AreaEntity[]> => {

  const res = await fetch(`${API_URL}/cendis`,{
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({id_cendis})
  })
  if(!res.ok) throw new Error("No se pudieron obtener areas asociadas al cendis")
  return res.json()
}