import type SalidaEntity  from "../entities/salida_entity";
import type SalidaDTO from "../entities/salida_DTO";

const API_URL = import.meta.env.VITE_API_URL+"/salidas/"


// Define la interfaz para la respuesta
interface CreateSalidaResponse {
  message: string;
  id_salida: number;
}

export async function createSalida(data: SalidaEntity): Promise<CreateSalidaResponse> {
  try {
    const response = await fetch(`${API_URL}create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Error al crear la salida");
    }

    return await response.json(); // Retorna { message: string, id_salida: number }
  } catch (error) {
    console.error("Error en createSalida:", error);
    throw error;
  }
}

export async function getSalidasEditablesByCendis(id_cendis: number): Promise<SalidaDTO[]> {
  try {
    const response = await fetch(`${API_URL}abiertas`, {
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

export async function updateSalida(id_salida: number, salida: SalidaEntity) {
  try {
    const response = await fetch(`${API_URL}update/${id_salida}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(salida),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "No se pudo actualizar la salida");
    }

    return await response.json();

  } catch (error) {
    console.error("Error al actualizar salida:", error);
    throw error;
  }
}

export async function cerrarSalida(id_salida: number) {
  try {
    const response = await fetch(`${API_URL}close`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_salida }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "No se pudo cerrar la salida");
    }

    return await response.json();

  } catch (error) {
    console.error("Error al cerrar salida:", error);
    throw error;
  }
}