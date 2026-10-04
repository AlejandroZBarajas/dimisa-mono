import { useEffect, useState } from "react";
import { useAuth } from "../../../../common/auth/auth_context";
import type { SalidaDTO } from "../../../../entities/salida_DTO";
import { getClosedSalidasCendisDate } from "../../../../services/salidas_service";
import SalidaCard from "../salida_card";

// Fecha local en formato YYYY-MM-DD (toISOString usaría UTC y puede correr un día)
function hoy(): string {
  return new Date().toLocaleDateString("en-CA");
}

export default function TabBuscarSalidas() {
  const {auth} = useAuth();
const id_cendis = auth.user?.cnd!;

  const [fecha, setFecha] = useState<string>(hoy());
  const [salidas, setSalidas] = useState<SalidaDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id_cendis || !fecha) return;

    // evita que una respuesta vieja pise a una más reciente si cambian la fecha rápido
    let cancelado = false;

    setLoading(true);
    setError(null);

    getClosedSalidasCendisDate(id_cendis, fecha)
      .then((data) => {
        if (!cancelado) setSalidas(data);
      })
      .catch((e: Error) => {
        if (!cancelado) {
          setSalidas([]);
          setError(e.message);
        }
      })
      .finally(() => {
        if (!cancelado) setLoading(false);
      });

    return () => {
      cancelado = true;
    };
  }, [id_cendis, fecha]);

  if (!id_cendis) {
    return <p className="text-red-600">No se pudo identificar el CENDIS del usuario.</p>;
  }

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center gap-3">
        <label htmlFor="fecha-salidas" className="font-semibold">
          Fecha:
        </label>
        <input
          id="fecha-salidas"
          type="date"
          value={fecha}
          max={hoy()}
          onChange={(e) => setFecha(e.target.value)}
          className="border rounded px-3 py-1"
        />
      </div>

      {loading && <p>Cargando salidas...</p>}

      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && salidas.length === 0 && (
        <p className="text-gray-600">No hay salidas cerradas para esta fecha.</p>
      )}

      {!loading &&
        salidas.map((s) => <SalidaCard key={s.folio} salida={s} />)}
    </div>
  );
}