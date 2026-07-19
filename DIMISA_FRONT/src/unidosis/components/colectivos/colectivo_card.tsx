import { useState } from "react";
import type { ColectivoDTO } from "../../../entities/colectivo_DTO";
import { TemplateColectivo } from "../../../imprimir/template_colectivo";
import { PrintColSal } from "../../../imprimir/printer";
import { closeColectivo } from "../../../services/colectivos_service";

interface Props {
  colectivo: ColectivoDTO;
  onCantidadChange?: (index: number, cantidad: number) => void;
  onEliminar?: (index: number) => void;
  onGenerar?: () => void;
  onColectivoImpreso?: () => void;
}

export default function ColectivoCard({
  colectivo,
  onColectivoImpreso
}: Props) {
  const [open, setOpen] = useState(true);

async function handleImprimir() {
  const html = TemplateColectivo({
    encabezado: "Colectivo",
    tipo_nombre: colectivo.tipo,
    usuario_nombre: colectivo.nombre_usuario,
    folio: colectivo.folio,
    fecha: colectivo.fecha,
    cendis_nombre: colectivo.cendis,
    lista: colectivo.claves.map(item => ({
      clave: item.clave ?? "",
      descripcion: item.descripcion ?? "",
      cantidad: item.cantidad ?? 0, 
    })),
  });

  PrintColSal(html);
  //closeColectivo(colectivo.id_colectivo)

  try {
      await closeColectivo(colectivo.id_colectivo);
      // Llamar al callback para actualizar la lista en el padre
      if (onColectivoImpreso) {
        onColectivoImpreso();
      }
    } catch (error) {
      console.error("Error al cerrar colectivo:", error);
    }
}

  if (!colectivo.claves || colectivo.claves.length === 0) return null;

  return (
    <div className="border rounded-lg shadow p-4 mb-4 w-full bg-white">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div>
          <h3 className="font-bold text-lg">{colectivo.tipo} - {colectivo.folio}</h3>
          <p className="text-sm text-gray-600">Fecha: {colectivo.fecha}</p>
          <p className="text-sm text-gray-600">Generado por: {colectivo.nombre_usuario}</p>
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
              {colectivo.claves.map((item, index: number) => (
                <tr key={item.id_detalle || index}>
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
             Guardar e Imprimir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}