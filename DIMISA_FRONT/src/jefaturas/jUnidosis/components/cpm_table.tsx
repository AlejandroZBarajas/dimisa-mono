import { useEffect, useMemo, useState } from "react"
import { getCpm } from "../../../services/cpm_service"
import type { CpmEntity, CpmDetalle } from "../../../entities/cpm_entity"

type Estado = "idle" | "loading" | "success" | "error"

function TablaDetalle({ detalles, nombresMes }: { detalles: CpmDetalle[], nombresMes: string[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
          <tr>
            <th className="px-4 py-3 sticky left-0 bg-gray-50 z-10">Clave</th>
            <th className="px-4 py-3">Descripción</th>
            {nombresMes.map((nombre, i) => (
              <th key={i} className="px-4 py-3 whitespace-nowrap">{nombre}</th>
            ))}
            <th className="px-4 py-3 whitespace-nowrap">Sumatoria</th>
            <th className="px-4 py-3 whitespace-nowrap">Prom. mensual</th>
            <th className="px-4 py-3 whitespace-nowrap">Prom. diario</th>
            <th className="px-4 py-3 whitespace-nowrap">10%</th>
            <th className="px-4 py-3 whitespace-nowrap">Consumo diario</th>
            <th className="px-4 py-3 whitespace-nowrap">Consumo mensual</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {detalles.map((d: CpmDetalle) => (
            <tr key={d.id_medicamento} className="hover:bg-gray-50">
              <td className="px-4 py-2 font-mono text-gray-500 sticky left-0 bg-white">{d.clave}</td>
              <td className="px-4 py-2 text-gray-700 max-w-xs truncate">{d.descripcion}</td>
              {d.meses.map((m, i) => (
                <td key={i} className="px-4 py-2 tabular-nums text-gray-600">{m.consumo}</td>
              ))}
              <td className="px-4 py-2 tabular-nums font-semibold text-gray-700">{d.sumatoria}</td>
              <td className="px-4 py-2 tabular-nums text-gray-600">{d.promedio_mensual}</td>
              <td className="px-4 py-2 tabular-nums text-gray-600">{d.promedio_diario}</td>
              <td className="px-4 py-2 tabular-nums text-gray-600">{d.diez_pct}</td>
              <td className="px-4 py-2 tabular-nums text-gray-600">{d.consumo_diario}</td>
              <td className="px-4 py-2 tabular-nums font-semibold text-gray-700">{d.consumo_mensual}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function SeccionColapsable({ titulo, children }: { titulo: string, children: React.ReactNode }) {
  const [abierto, setAbierto] = useState(true)

  return (
    <section>
      <button
        onClick={() => setAbierto(!abierto)}
        className="flex items-center gap-2 w-full text-left mb-2"
      >
        <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          {titulo}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${abierto ? "rotate-180" : "rotate-0"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className={`transition-all duration-300 overflow-hidden ${abierto ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}`}>
        {children}
      </div>
    </section>
  )
}

function CpmTable() {
  const [data, setData] = useState<CpmEntity | null>(null)
  const [estado, setEstado] = useState<Estado>("idle")
  const [busqueda, setBusqueda] = useState("")
  
  const medicamentosFiltrados = useMemo(() => {
  const q = busqueda.toLowerCase().trim()
  if (!q) return data?.medicamentos ?? []
  return (data?.medicamentos ?? []).filter(
    (d) => d.clave.toLowerCase().includes(q) || d.descripcion.toLowerCase().includes(q)
  )
}, [data, busqueda])

const materialFiltrado = useMemo(() => {
  const q = busqueda.toLowerCase().trim()
  if (!q) return data?.material ?? []
  return (data?.material ?? []).filter(
    (d) => d.clave.toLowerCase().includes(q) || d.descripcion.toLowerCase().includes(q)
  )
}, [data, busqueda])
  
  useEffect(() => {
    setEstado("loading")
    getCpm()
      .then((res) => { setData(res); setEstado("success") })
      .catch(() => setEstado("error"))

  }, [])
      console.log(data)

  if (estado === "loading")
    return <p className="mt-4 text-sm text-gray-500 animate-pulse">Cargando CPM…</p>

  if (estado === "error")
    return <p className="mt-4 text-sm text-red-500">No se pudo obtener el CPM.</p>

  if (!data || (data.medicamentos.length === 0 && data.material.length === 0))
    return <p className="mt-4 text-sm text-gray-500">Sin datos de consumo.</p>

  const nombresMed = data.medicamentos[0]?.meses.map((m) => m.nombre) ?? []
  const nombresMat = data.material[0]?.meses.map((m) => m.nombre) ?? []

  return (
    <div className="mt-4 space-y-8">
      <input
        type="search"
        placeholder="Buscar por clave o descripción…"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="w-full max-w-sm px-3 py-2 text-sm border border-gray-300 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {medicamentosFiltrados.length > 0 && (
        <SeccionColapsable titulo="Medicamentos">
          <TablaDetalle detalles={medicamentosFiltrados} nombresMes={nombresMed} />
        </SeccionColapsable>
      )}

      {materialFiltrado.length > 0 && (
        <SeccionColapsable titulo="Material de Curación">
          <TablaDetalle detalles={materialFiltrado} nombresMes={nombresMat} />
        </SeccionColapsable>
      )}
    </div>
  )
}

export default CpmTable