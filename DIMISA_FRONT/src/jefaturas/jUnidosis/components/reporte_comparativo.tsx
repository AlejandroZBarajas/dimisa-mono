import { useState } from "react"
import { getComparativoCendis } from "../../../services/reportes_service"
import type EntradaColectivoReporte from "../../../entities/reportes_entities"
import { useExcelExport } from "../../../hooks/excel"

const MESES = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
]

const pctColor = (pct: number) =>
  pct >= 90 ? "text-green-600" : pct >= 70 ? "text-yellow-500" : "text-red-600"

const pctBg = (pct: number) =>
  pct >= 90 ? "bg-green-500" : pct >= 70 ? "bg-yellow-400" : "bg-red-500"

export default function ComparativoCendis() {
  const anioActual = new Date().getFullYear()
  const mesActual  = new Date().getMonth() + 1

  const [mes,    setMes]   = useState(mesActual)
  const [anio,   setAnio]  = useState(anioActual)
  const [data,   setData]  = useState<EntradaColectivoReporte[]>([])
  const [estado, setEstado] = useState<"idle"|"loading"|"error">("idle")

  const { exportar } = useExcelExport()

  const buscar = async () => {
    setEstado("loading")
    try {
      const res = await getComparativoCendis(mes, anio)
      setData(res)
      setEstado("idle")
    } catch {
      setEstado("error")
    }
  }

  const descargar = () => {
    const filas = data.map(d => ({
      CENDIS:          d.cendis,
      Solicitado:      d.total_solicitado,
      Recibido:        d.total_recibido,
      Déficit:         d.total_deficit,
      "Cumplimiento%": d.pct_cumplimiento,
    }))
    exportar(filas, `comparativo-${MESES[mes-1]}-${anio}`, "Comparativo")
  }

  return (
    <div className="space-y-4">
      {/* Controles */}
      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-medium">Mes</label>
          <select
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            value={mes}
            onChange={e => setMes(Number(e.target.value))}
          >
            {MESES.map((m, i) => (
              <option key={i} value={i + 1}>{m}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-medium">Año</label>
          <select
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            value={anio}
            onChange={e => setAnio(Number(e.target.value))}
          >
            {[anioActual - 1, anioActual].map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
        <button
          onClick={buscar}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
        >
          {estado === "loading" ? "Cargando…" : "Buscar"}
        </button>
        {data.length > 0 && (
          <button
            onClick={descargar}
            className="px-4 py-2 border border-gray-300 text-sm rounded-lg hover:bg-gray-50"
          >
            Descargar Excel
          </button>
        )}
      </div>

      {estado === "error" && (
        <p className="text-sm text-red-500">No se pudo obtener el comparativo.</p>
      )}

      {data.length > 0 && (
        <>
          {/* Cards por cendis */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.map(d => (
              <div key={d.id_cendis} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <p className="font-semibold text-gray-700">{d.cendis}</p>
                <div className="flex items-end justify-between">
                  <span className={`text-3xl font-bold ${pctColor(d.pct_cumplimiento)}`}>
                    {d.pct_cumplimiento}%
                  </span>
                  <span className="text-xs text-gray-400">déficit: {d.total_deficit}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${pctBg(d.pct_cumplimiento)}`}
                    style={{ width: `${d.pct_cumplimiento}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Solicitado: {d.total_solicitado}</span>
                  <span>Recibido: {d.total_recibido}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Tabla resumen */}
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3">CENDIS</th>
                  <th className="px-4 py-3">Solicitado</th>
                  <th className="px-4 py-3">Recibido</th>
                  <th className="px-4 py-3">Déficit</th>
                  <th className="px-4 py-3">Cumplimiento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.map(d => (
                  <tr key={d.id_cendis} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium text-gray-700">{d.cendis}</td>
                    <td className="px-4 py-2 tabular-nums">{d.total_solicitado}</td>
                    <td className="px-4 py-2 tabular-nums">{d.total_recibido}</td>
                    <td className="px-4 py-2 tabular-nums font-medium text-red-500">{d.total_deficit}</td>
                    <td className={`px-4 py-2 tabular-nums font-semibold ${pctColor(d.pct_cumplimiento)}`}>
                      {d.pct_cumplimiento}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}