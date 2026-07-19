import type { ColectivosPorPeriodoEntity } from "../entities/colectivo_por_periodo_entity";

const API_URL = import.meta.env.VITE_API_URL + "/colectivos-por-periodo";

export const getColectivosPorPeriodo = async (
  fechaInicio: string,
  fechaFin: string
): Promise<ColectivosPorPeriodoEntity> => {
  const params = new URLSearchParams({ fecha_inicio: fechaInicio, fecha_fin: fechaFin });
  const res = await fetch(`${API_URL}?${params}`);
  if (!res.ok) throw new Error("Error al obtener colectivos por periodo");
  return res.json();
};