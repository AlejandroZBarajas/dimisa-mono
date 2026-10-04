import type { UnidosisConsumoDetalle } from "../../../../entities/consumo_unidosis_entity"

interface ConsumoUnidosisTableProps {
  data: UnidosisConsumoDetalle[]
}

export const ConsumoUnidosisTable = ({
  data,
}: ConsumoUnidosisTableProps) => {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay consumo registrado.
      </div>
    )
  }

  const meses = data[0].meses

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="px-4 py-3 text-left whitespace-nowrap">
              Clave
            </th>

            <th className="px-4 py-3 text-left min-w-[250px]">
              Descripción
            </th>

            {meses.map((mes) => (
              <th
                key={`${mes.anio}-${mes.mes}`}
                className="px-4 py-3 text-center whitespace-nowrap"
              >
                {mes.nombre}
              </th>
            ))}

            <th className="px-4 py-3 text-center whitespace-nowrap">
              Sumatoria
            </th>

            <th className="px-4 py-3 text-center whitespace-nowrap">
              Prom. mensual
            </th>

            <th className="px-4 py-3 text-center whitespace-nowrap">
              Prom. diario
            </th>

            <th className="px-4 py-3 text-center whitespace-nowrap">
              10%
            </th>

            <th className="px-4 py-3 text-center whitespace-nowrap">
              Consumo diario
            </th>

            <th className="px-4 py-3 text-center whitespace-nowrap">
              Consumo mensual
            </th>
          </tr>
        </thead>

        <tbody>
          {data.map((medicamento) => (
            <tr
              key={medicamento.id_medicamento}
              className="border-b hover:bg-gray-50"
            >
              <td className="px-4 py-3 whitespace-nowrap font-medium">
                {medicamento.clave}
              </td>

              <td className="px-4 py-3">
                {medicamento.descripcion}
              </td>

              {meses.map((mes) => {
                const detalleMes = medicamento.meses.find(
                  (item) =>
                    item.mes === mes.mes &&
                    item.anio === mes.anio
                )

                return (
                  <td
                    key={`${medicamento.id_medicamento}-${mes.anio}-${mes.mes}`}
                    className="px-4 py-3 text-center"
                  >
                    {detalleMes?.consumo ?? 0}
                  </td>
                )
              })}

              <td className="px-4 py-3 text-center font-medium">
                {medicamento.sumatoria}
              </td>

              <td className="px-4 py-3 text-center">
                {medicamento.promedio_mensual.toFixed(2)}
              </td>

              <td className="px-4 py-3 text-center">
                {medicamento.promedio_diario.toFixed(2)}
              </td>

              <td className="px-4 py-3 text-center">
                {medicamento.diez_pct.toFixed(2)}
              </td>

              <td className="px-4 py-3 text-center">
                {medicamento.consumo_diario.toFixed(2)}
              </td>

              <td className="px-4 py-3 text-center">
                {medicamento.consumo_mensual.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}