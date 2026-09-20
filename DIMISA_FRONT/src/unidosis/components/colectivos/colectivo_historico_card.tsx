import type { ColectivoDTO } from "../../../entities/colectivo_DTO";

interface Props {
  colectivo: ColectivoDTO;
}

export default function ColectivoHistoricoCard({
  colectivo,
}: Props) {
  return (
    <div className="w-full max-w-6xl rounded-lg border bg-white p-4 shadow">
      <div className="mb-4">
        <h3 className="text-xl font-bold">
          {colectivo.folio}
        </h3>

        <div className="mt-2 grid gap-2 text-sm md:grid-cols-2">
          <p>
            <span className="font-semibold">Tipo:</span>{" "}
            {colectivo.tipo}
          </p>

          <p>
            <span className="font-semibold">Fecha:</span>{" "}
            {colectivo.fecha}
          </p>

          <p>
            <span className="font-semibold">
              Generado por:
            </span>{" "}
            {colectivo.nombre_usuario}
          </p>

          <p>
            <span className="font-semibold">CENDIS:</span>{" "}
            {colectivo.cendis}
          </p>
        </div>
      </div>

      {colectivo.claves.length === 0 ? (
        <p className="text-gray-600">
          El colectivo no contiene medicamentos.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2 text-left">
                  Clave
                </th>

                <th className="border p-2 text-left">
                  Descripción
                </th>

                <th className="border p-2 text-center">
                  Cajas solicitadas
                </th>

                <th className="border p-2 text-center">
                  Piezas esperadas
                </th>

                <th className="border p-2 text-center">
                  Piezas recibidas
                </th>
              </tr>
            </thead>

            <tbody>
              {colectivo.claves.map((detalle) => (
                <tr
                  key={
                    detalle.id_detalle ??
                    `${colectivo.id_colectivo}-${detalle.id_medicamento}`
                  }
                >
                  <td className="border p-2">
                    {detalle.clave ?? "Sin clave"}
                  </td>

                  <td className="border p-2">
                    {detalle.descripcion ?? "Sin descripción"}
                  </td>

                  <td className="border p-2 text-center">
                    {detalle.cantidad ?? 0}
                  </td>

                  <td className="border p-2 text-center">
                    {detalle.piezas_esperadas}
                  </td>

                  <td className="border p-2 text-center">
                    {detalle.piezas_recibidas ?? 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}