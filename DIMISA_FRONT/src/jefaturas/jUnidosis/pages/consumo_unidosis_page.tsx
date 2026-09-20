import Header from "../../../common/header";
import { useEffect, useState } from "react";

import ConsumoGlobal from "../components/consumo_unidosis/consumo_unidosis_global";
import ConsumoCendis from "../components/consumo_unidosis/consumo_unidosis_cendis";
import ConsumoArea from "../components/consumo_unidosis/consumo_unidosis_area";
import ReportesSubheader from "../components/reportes_subheader";

import {
  getConsumoUnidosisGlobal,
  getConsumoUnidosisAreas,
  getConsumoUnidosisCendis,
} from "../../../services/consumo_unidosis_service";

import type {
  ConsumoUnidosisEntity,
  ConsumoAreaResponse,
  ConsumoCendisResponse,
} from "../../../entities/consumo_unidosis_entity"

const TABS = [
  "Consumo global",
  "Consumo por cendis",
  "Consumo por área",
] as const;

type Tab = (typeof TABS)[number];

export default function ConsumoUnidosis() {
  const [tab, setTab] = useState<Tab>("Consumo global");

  const [global, setGlobal] = useState<ConsumoUnidosisEntity | null>(null);
  const [cendis, setCendis] = useState<ConsumoCendisResponse | null>(null);
  const [areas, setAreas] = useState<ConsumoAreaResponse | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      setError(null);

      try {
        if (tab === "Consumo global" && !global) {
          const data = await getConsumoUnidosisGlobal();
          setGlobal(data);
        }

        if (tab === "Consumo por cendis" && !cendis) {
          const data = await getConsumoUnidosisCendis();
          setCendis(data);
        }

        if (tab === "Consumo por área" && !areas) {
          const data = await getConsumoUnidosisAreas();
          setAreas(data);
        }
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el consumo unidosis.");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [tab, global, cendis, areas]);

  return (
    <div>
      <Header />
      <ReportesSubheader />

      <div className="p-6">
        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200 p-4 m-4">
          {TABS.map((t) => (
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

        {/* Contenido */}
        <div className="m-4">
          {loading && (
            <div className="text-center py-8 text-gray-500">
              Cargando consumo...
            </div>
          )}

          {error && (
            <div className="text-center py-8 text-red-500">
              {error}
            </div>
          )}

          {!loading && !error && tab === "Consumo global" && global && (
            <ConsumoGlobal data={global} />
          )}

          {!loading && !error && tab === "Consumo por cendis" && cendis && (
            <ConsumoCendis data={cendis} />
          )}

          {!loading && !error && tab === "Consumo por área" && areas && (
            <ConsumoArea data={areas} />
          )}
        </div>
      </div>
    </div>
  );
}