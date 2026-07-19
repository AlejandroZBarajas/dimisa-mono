import {useMemo, useState, useEffect } from "react"
import { getReporteMensual } from "../../../services/reportes_service"
import { getAllCendis } from "../../../services/cendis_service"
import type EntradaColectivoReporte from "../../../entities/reportes_entities"
import type CendisEntity from "../../../entities/cendis_entity"
import { useExcelExport } from "../../../hooks/excel"

const MESES = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
]

const estatusStyle: Record<string, string> = {
  "Completo":   "bg-green-100 text-green-700",
  "Parcial":    "bg-yellow-100 text-yellow-700",
  "No surtido": "bg-red-100 text-red-700",
}

const pctColor = (pct: number) =>
  pct >= 90 ? "text-green-600" : pct >= 70 ? "text-yellow-500" : "text-red-600"

export default function ReporteMensual() {
  const anioActual = new Date().getFullYear()
  const mesActual  = new Date().getMonth() + 1

  const [cendis,   setCendis]  = useState<CendisEntity[]>([])
  const [idCendis, setIdCendis] = useState<number>(0)
  const [mes,      setMes]     = useState(mesActual)
  const [anio,     setAnio]    = useState(anioActual)
  const [data,     setData]    = useState<EntradaColectivoReporte | null>(null)
  const [estado,   setEstado]  = useState<"idle"|"loading"|"error">("idle")

  const [ordenEstatus, setOrdenEstatus] = useState<string | null>(null)
  const detallesOrdenados = useMemo(() => {
    if (!data || !ordenEstatus) return data?.detalles ?? []
    const prioridad: Record<string, number> = { "No surtido": 0, "Parcial": 1, "Completo": 2 }
    return [...data.detalles].sort((a, b) => prioridad[a.estatus] - prioridad[b.estatus])
}, [data, ordenEstatus])

  const { exportar } = useExcelExport()

  useEffect(() => {
    getAllCendis().then(res => {
      setCendis(res)
      if (res.length > 0) setIdCendis(res[0].id_cendis!)
    })
  }, [])

  const buscar = async () => {
    if (!idCendis) return
    setEstado("loading")
    try {
      const res = await getReporteMensual(idCendis, mes, anio)
      setData(res)
      setEstado("idle")
    } catch {
      setEstado("error")
    }
  }

  const descargar = () => {
    if (!data) return
    const filas = data.detalles.map(d => ({
      Clave:        d.clave,
      Descripción:  d.descripcion,
      Solicitado:   d.piezas_esperadas,
      Recibido:     d.cantidad_recibida,
      Déficit:      d.deficit,
      Estatus:      d.estatus,
    }))
    exportar(filas, `reporte-mensual-${MESES[mes-1]}-${anio}`, "Reporte")
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-medium">CENDIS</label>
          <select
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            value={idCendis}
            onChange={e => setIdCendis(Number(e.target.value))}
          >
            {cendis.map(c => (
              <option key={c.id_cendis} value={c.id_cendis}>{c.cendis_nombre}</option>
            ))}
          </select>
        </div>
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
        {data && (
          <button
            onClick={descargar}
            className="px-4 py-2 border border-gray-300 text-sm rounded-lg hover:bg-gray-50"
          >
            Descargar Excel
          </button>
        )}
      </div>

      {estado === "error" && (
        <p className="text-sm text-red-500">No se pudo obtener el reporte.</p>
      )}

      {data && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Solicitado",   valor: data.total_solicitado,       cls: "text-gray-700" },
              { label: "Recibido",     valor: data.total_recibido,         cls: "text-green-600" },
              { label: "Déficit",      valor: data.total_deficit,          cls: "text-red-500" },
              { label: "Cumplimiento", valor: `${data.pct_cumplimiento}%`, cls: pctColor(data.pct_cumplimiento) },
            ].map(c => (
              <div key={c.label} className="border border-gray-200 rounded-lg p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wide">{c.label}</p>
                <p className={`text-2xl font-semibold mt-1 ${c.cls}`}>{c.valor}</p>
              </div>
            ))}
          </div>

          {data.detalles.length === 0 ? (
            <p className="text-sm text-gray-500">Sin registros para este período.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <tr>
                    <th className="px-4 py-3">Clave</th>
                    <th className="px-4 py-3">Descripción</th>
                    <th className="px-4 py-3">Total solicitado</th>
                    <th className="px-4 py-3">Piezas recibidas</th>
                    <th className="px-4 py-3">Déficit</th>
                    <th
                      className="px-4 py-3 cursor-pointer select-none hover:text-gray-700"
                      onClick={() => setOrdenEstatus(prev => prev ? null : "asc")}
                    >
                      Estatus {ordenEstatus ? "↑" : "⇅"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {detallesOrdenados.map(d => (
                    <tr key={d.id_medicamento} className="hover:bg-gray-50">
                      <td className="px-4 py-2 font-mono text-gray-500 whitespace-nowrap">{d.clave}</td>
                      <td className="px-4 py-2 text-gray-700 max-w-xs truncate">{d.descripcion}</td>
                      <td className="px-4 py-2 tabular-nums">{d.piezas_esperadas}</td>
                      <td className="px-4 py-2 tabular-nums">{d.cantidad_recibida}</td>
                      <td className="px-4 py-2 tabular-nums font-medium text-red-500">{d.deficit}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${estatusStyle[d.estatus]}`}>
                          {d.estatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}