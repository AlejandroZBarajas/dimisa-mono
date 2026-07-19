import { useState, useEffect } from "react"
import { getDeficitCronico } from "../../../services/reportes_service"
import { getAllCendis } from "../../../services/cendis_service"
import type DeficitCronicoDetalle from "../../../entities/reportes_entities"
import type  CendisEntity from "../../../entities/cendis_entity"
import { useExcelExport } from "../../../hooks/excel"

export default function DeficitCronico() {
  const anioActual = new Date().getFullYear()

  const [cendis,   setCendis]   = useState<CendisEntity[]>([])
  const [idCendis, setIdCendis] = useState<number>(0)
  const [anio,     setAnio]     = useState(anioActual)
  const [data,     setData]     = useState<DeficitCronicoDetalle[]>([])
  const [estado,   setEstado]   = useState<"idle"|"loading"|"error">("idle")

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
      const res = await getDeficitCronico(idCendis, anio)
      console.log(res)
      setData(res)
      setEstado("idle")
    } catch {
      setEstado("error")
    }
  }

  const descargar = () => {
    const filas = data.map((d, i) => ({
      Ranking:      i + 1,
      Clave:        d.clave,
      Descripción:  d.descripcion,
      Solicitado:   d.total_solicitado,
      Recibido:     d.cantidad_recibida,
      Déficit:      d.deficit,
      Estatus:      d.estatus,
    }))
    exportar(filas, `deficit-cronico-${anio}`, "Déficit")
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
        <p className="text-sm text-red-500">No se pudo obtener el déficit crónico.</p>
      )}

      {data.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Clave</th>
                <th className="px-4 py-3">Descripción</th>
                <th className="px-4 py-3">Déficit</th>
                <th className="px-4 py-3 w-40">Cobertura</th>
                <th className="px-4 py-3">Estatus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((d, i) => {
                const pct = Math.round((d.cantidad_recibida / d.total_solicitado) * 100)
                return (
                  <tr key={d.id_medicamento} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-400 tabular-nums">{i + 1}</td>
                    <td className="px-4 py-2 font-mono text-gray-500 whitespace-nowrap">{d.clave}</td>
                    <td className="px-4 py-2 text-gray-700 max-w-xs truncate">{d.descripcion}</td>
                    <td className="px-4 py-2 tabular-nums font-semibold text-red-500">{d.deficit}</td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                          <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-gray-500 tabular-nums w-8">{pct}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        d.estatus === "No surtido"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {d.estatus}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}