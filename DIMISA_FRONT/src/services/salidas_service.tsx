import type SalidaEntity  from "../entities/salida_entity";
import type { SalidaDTO } from "../entities/salida_DTO";

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




export async function getClosedSalidasCendisDate(
  id_cendis: number,
  fecha: string, // formato YYYY-MM-DD
): Promise<SalidaDTO[]> {
  try {
    const params = new URLSearchParams({
      id_cendis: String(id_cendis),
      fecha,
    });

    const response = await fetch(`${API_URL}cerradas?${params.toString()}`, {
      method: "GET",
    });

    if (!response.ok) {
      // el backend responde con texto plano en los errores
      const message = await response.text();
      throw new Error(message || "No se pudieron obtener las salidas cerradas");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en getClosedSalidasCendisDate:", error);
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