import { useState } from "react";
import type { ColectivosPorPeriodoEntity } from "../../../entities/colectivo_por_periodo_entity";
import { getColectivosPorPeriodo } from "../../../services/colectivos_por_periodo_service";

export default function ColectivosPorPeriodo() {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [resultado, setResultado] = useState<ColectivosPorPeriodoEntity | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setResultado(null);
    setLoading(true);
    try {
      const res = await getColectivosPorPeriodo(fechaInicio, fechaFin);
      setResultado(res);
    } catch {
      setError("Error al consultar, intente de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Cantidad de Colectivos por Fechas</h2>

      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Fecha inicio</label>
          <input
            type="date"
            value={fechaInicio}
            max={fechaFin || undefined}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Fecha fin</label>
          <input
            type="date"
            value={fechaFin}
            min={fechaInicio || undefined}
            onChange={(e) => setFechaFin(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading || !fechaInicio || !fechaFin || fechaInicio === fechaFin}
          className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Consultando..." : "Consultar"}
        </button>
      </div>

      {resultado && (
        <div className="mt-6 flex flex-col gap-2">
          <p className="text-base">
            Colectivos de <span className="font-semibold">Medicamentos</span>:{" "}
            <span className="text-blue-700 font-bold">
              {resultado.colectivos_medicamentos_totales}
            </span>
          </p>
          <p className="text-base">
            Colectivos de <span className="font-semibold">Material de curación</span>:{" "}
            <span className="text-blue-700 font-bold">
              {resultado.colectivos_material_totales}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}