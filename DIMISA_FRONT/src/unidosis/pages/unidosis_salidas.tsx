import { useState } from "react";
import Header from "../../common/header";
import UnidosisSubheader from "../components/unidosis_subheader";


import TabGenerarSalidas from "../components/salidas/TABS/tab_generar_salida";
import TabBuscarSalidas from "../components/salidas/TABS/tab_buscar_salida";

const TABS = ["Generar Salida", "Buscar Salida"] as const;
type Tab = typeof TABS[number];

function UnidosisSalidas() {

  const [tab, setTab] = useState<Tab>("Generar Salida");
  
  return (
    <div>
      <Header />
      <UnidosisSubheader />
      <div className="flex flex-row w-12/12 justify-center p-2">
        {TABS.map((t) => (
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
      {tab === "Generar Salida" && <TabGenerarSalidas />}
      {tab === "Buscar Salida" && <TabBuscarSalidas />}
    </div>
  );
}

export default UnidosisSalidas;