import type { ColectivoEntity } from "../entities/colectivo_entity";
import type { ColectivoDTO } from "../entities/colectivo_DTO";
import type { ColectivoDetalleEntity } from "../entities/colectivo_detalle_entity";

const API_URL = import.meta.env.VITE_API_URL 

export async function createColectivo(data: ColectivoEntity): Promise<ColectivoEntity> {
  try {
    const response = await fetch(`${API_URL}/colectivos/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al crear el colectivo: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error en createColectivo:", error);
    throw error;
  }
}

export async function getColectivosByCendis(id_cendis: number): Promise<ColectivoDTO[]> {
  try {
    const response = await fetch(`${API_URL}/colectivos/by-cendis`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_cendis }),
    });

    if (!response.ok) throw new Error("No se pudieron obtener los colectivos");

    return await response.json();
  } catch (error) {
    console.error("Error en getColectivosByCendis:", error);
    throw error;
  }
}

export async function getPendingColectivosByCendis(id_cendis: number): Promise<ColectivoDTO[]> {
  try {
    const response = await fetch(`${API_URL}/colectivos/pending`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_cendis }),
    });
    if (!response.ok) throw new Error("No se pudieron obtener los colectivos pendientes");

    return await response.json();
  } catch (error) {
    console.error("Error en getPendingColectivosByCendis:", error);
    throw error;
  }
}

export async function getColectivosEditablesByCendis(id_cendis: number): Promise<ColectivoDTO[]> {
  try {
    const response = await fetch(`${API_URL}/colectivos/editables`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_cendis }),
    });

    if (!response.ok) throw new Error("No se pudieron obtener los colectivos pendientes");

    return await response.json();
  } catch (error) {
    console.error("Error en getColectivosEditablesByCendis:", error);
    throw error;
  }
}

export async function addToColectivo(id_cendis: number, tipo_colectivo:number, detalles :ColectivoDetalleEntity[]):Promise <string>{
  try{
    const response = await fetch (`${API_URL}/colectivos/add`,{
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({id_cendis, tipo_colectivo, detalles }),
    })

    if(!response.ok){
      throw new Error ("No se pudieron añadir claves")
    }
    return await response.json()
  }catch (error){
    console.error("Error al añadir claves ", error)
    throw error
  }
}

export async function closeColectivo(id_colectivo: number):Promise<void>{
  try{
    const response = await fetch(`${API_URL}/colectivos/close`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({id_colectivo})
    })
    if(!response.ok){
      throw new Error ("No se pudo cerrar el colectivo")
    }
    return await response.json()
  }catch(error){
    console.error("error al cerrar: ", error)
    throw error
  }
}