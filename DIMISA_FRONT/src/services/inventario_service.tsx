import type InventarioEntity from "../entities/inventario_entity";  

const API_URL = import.meta.env.VITE_API_URL+"/inventarios"

export const getAllInventarios = async (): Promise<InventarioEntity[]> => {
  const res = await fetch(`${API_URL}`,{});
  if (!res.ok) throw new Error("Error al obtener inventarios");
  return res.json();
}

export const getInventarioByCendis = async (id_cendis: number): Promise<InventarioEntity> => {
  const res = await fetch(`${API_URL}/cendis`,{
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({id_cendis})
  })
  if (!res.ok) throw new Error("Error al obtener inventario por cendis");
  return res.json();
}