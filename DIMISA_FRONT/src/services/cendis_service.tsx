import type CendisEntity from "../entities/cendis_entity";
import type CendisPayload from "../entities/cendis_payload";

const API_URL = import.meta.env.VITE_API_URL + "/cendis/";

export const createCendis = async (payload: CendisPayload): Promise<CendisEntity> => {

  const res = await fetch(`${API_URL}create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("El servicio no pudo crear el cendis");
  return res.json();
};

export const updateCendis = async (payload: CendisPayload): Promise<CendisEntity> => {
  const res = await fetch(`${API_URL}update`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("El servicio no pudo actualizar el cendis");
  return res.json();
};

export const getAllCendis = async (): Promise<CendisEntity[]> => {
  const res = await fetch(`${API_URL}all`, {
    method: "GET",
  });
  if (!res.ok) throw new Error("El servicio no pudo obtener los cendis");
  return res.json();
};

export const deleteCendis = async (id_cendis: number): Promise<void> => {
  const res = await fetch(`${API_URL}delete`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body:JSON.stringify({id_cendis})
  });
  if (!res.ok) throw new Error("El servicio no pudo eliminar el cendis");
  return res.json();
};
