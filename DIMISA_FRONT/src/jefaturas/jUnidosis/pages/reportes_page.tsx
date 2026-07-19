import { useState } from "react"
import ColectivosPorPeriodo from "../components/colectivos_por_periodo"
import ReporteMensual from "../components/reporte_mensual"
import DeficitCronico from "../components/deficit_cronico"
import ComparativoCendis from "../components/reporte_comparativo"
import ReportesSubheader from "../components/reportes_subheader"
import Header from "../../../common/header"

const TABS = ["Reporte mensual", "Déficit crónico", "Comparativo cendis", "Cantidad de colectivos"] as const
type Tab = typeof TABS[number]

export default function ReportesPage() {
  const [tab, setTab] = useState<Tab>("Reporte mensual")

  return (
    <div >
      <Header />
      <ReportesSubheader />
      <div className="p-6">
        <div className="flex gap-1 border-b border-gray-200 p-4 m-4">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                tab === t
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "Reporte mensual"    && <ReporteMensual />}
        {tab === "Déficit crónico"    && <DeficitCronico />}
        {tab === "Comparativo cendis" && <ComparativoCendis />}
        {tab === "Cantidad de colectivos" && <ColectivosPorPeriodo />}

      </div>
    </div>
  )
}