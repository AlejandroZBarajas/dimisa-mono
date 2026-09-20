import { useState} from "react";
import Header from "../../common/header";
import UnidosisSubheader from "../components/unidosis_subheader";
import TabNuevoColectivo from "../components/colectivos/TABS/tab_nuevo_colectivo";
import TabHistorialColectivos from "../components/colectivos/TABS/tab_historial_colectivos";

const TABS = ["Nuevo colectivo", "Buscar colectivo"] as const
type Tab = typeof TABS[number]

export default function UnidosisColectivos(){

  const [tab, setTab] = useState<Tab>("Nuevo colectivo")

    return(
        <div className="flex flex-col items-center">
            <Header></Header>
            <UnidosisSubheader></UnidosisSubheader>
            <div className="flex flex-row w-12/12 justify-center p-2">

              {TABS.map(t => (
                <button
                  key={t}
                  className={`px-4 py-2 mx-2 rounded-md ${
                    tab === t ? "bg-verde2 text-white" : "bg-gray-300 text-gray-700"
                  }`}
                  onClick={() => setTab(t)}
                >
                  {t}
                </button>
              ))}


            </div>
            {tab === "Nuevo colectivo"    && <TabNuevoColectivo/>}
            {tab === "Buscar colectivo"    && <TabHistorialColectivos/>}

        </div>
    )
}