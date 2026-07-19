import { useEffect, useState } from "react";
import { getInventarioByCendis } from "../../services/inventario_service";
import type InventarioEntity from "../../entities/inventario_entity";

interface Props {
  idCendis: number;
}

type Estado = "idle" | "loading" | "success" | "error";

function InventarioTable({ idCendis }: Props) {
  const [inventario, setInventario] = useState<InventarioEntity | null>(null);
  const [estado, setEstado] = useState<Estado>("idle");

  useEffect(() => {
    if (!idCendis) return;

    setEstado("loading");
    setInventario(null);

    getInventarioByCendis(idCendis)
      .then((data) => { setInventario(data); setEstado("success"); })
      .catch(() => setEstado("error"));
  }, [idCendis]);

  if (estado === "idle") return null;

  if (estado === "loading")
    return <p className="mt-4 text-sm text-gray-500 animate-pulse">Cargando inventario…</p>;

  if (estado === "error")
    return <p className="mt-4 text-sm text-red-500">No se pudo obtener el inventario.</p>;

  if (!inventario || inventario.detalles.length === 0)
    return <p className="mt-4 text-sm text-gray-500">Sin registros para este CENDIS.</p>;

  return (
    <div className="mt-4 p-4 ">
      <p className="mb-2 text-sm text-gray-500">
        <span className="font-semibold text-gray-700">{inventario.cendis}</span>
        {" · "}
        {inventario.detalles.length} artículo(s)
      </p>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Clave</th>
              <th className="px-4 py-3">Descripción</th>
              <th className="px-4 py-3">Cantidad</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {inventario.detalles.map((d) => (
              <tr key={d.id_medicamento} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-gray-400">{d.id_medicamento}</td>
                <td className="px-4 py-2 font-mono text-gray-500">{d.clave}</td>
                <td className="px-4 py-2 text-gray-700">{d.descripcion}</td>
                <td className="px-4 py-2 font-medium tabular-nums">{d.cantidad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InventarioTable;