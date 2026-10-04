import { useState } from "react";
import type { SalidaDTO } from "../../../entities/salida_DTO"; // ajusta la ruta
import { TemplateSalida } from "../../../imprimir/template_salida";
import { PrintColSal } from "../../../imprimir/printer";

interface Props {
  salida: SalidaDTO;
}

export default function SalidaCard({ salida }: Props) {
  const [open, setOpen] = useState(true);

function handleImprimir() {
  const html = TemplateSalida({
    encabezado: "Salida",
    tipo_nombre: salida.tipo,
    usuario_nombre: salida.usuario,
    folio: salida.folio,
    fecha: salida.fecha,
    cendis_nombre: salida.cendis,
    area_nombre: salida.area,
    lista: salida.claves.map((item) => ({
      clave: item.clave ?? "",
      descripcion: item.descripcion ?? "",
      cantidad: item.cantidad ?? 0,
    })),
  });

  PrintColSal(html);
}

  if (!salida.claves || salida.claves.length === 0) return null;

  return (
    <div className="border rounded-lg shadow p-4 mb-4 w-full bg-white">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div>
          <h3 className="font-bold text-lg">
            {salida.tipo} - {salida.folio}
          </h3>
          <p className="text-sm text-gray-600">Fecha: {salida.fecha}</p>
          <p className="text-sm text-gray-600">Área: {salida.area}</p>
          <p className="text-sm text-gray-600">Generado por: {salida.usuario}</p>
        </div>
        <button className="text-sm bg-blue-600 text-white px-3 py-1 rounded">
          {open ? "Cerrar" : "Abrir"}
        </button>
      </div>

      {open && (
        <div className="mt-4">
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Clave</th>
                <th className="border p-2">Descripción</th>
                <th className="border p-2 text-center">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {salida.claves.map((item, index: number) => (
                <tr key={`${item.clave}-${index}`}>
                  <td className="border p-2">{item.clave}</td>
                  <td className="border p-2">{item.descripcion}</td>
                  <td className="border p-2 text-center">{item.cantidad}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleImprimir}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Imprimir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}