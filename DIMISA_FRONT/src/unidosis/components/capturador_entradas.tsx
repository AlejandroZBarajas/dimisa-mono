import { useEffect, useState } from "react";
import { useAuth } from "../../common/auth/auth_context";
import { getPendingColectivosByCendis } from "../../services/colectivos_service";
//import ColectivoCard from "./colectivos/colectivo_para_entrada";
import ColectivoParaEntrada from "./colectivos/colectivo_para_entrada";
import type { ColectivoDTO } from "../../entities/colectivo_DTO";

export default function CapturadorEntradas() {
  const {auth} = useAuth()
  const [colectivos, setColectivos] = useState<ColectivoDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const id_cendis = auth.user?.cnd!
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getPendingColectivosByCendis(id_cendis); 
        setColectivos(res ?? []);
        console.log("Colectivos pendientes:", res);
      } catch (err) {
        console.error("Error cargando colectivos:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p>Cargando colectivos pendientes…</p>;

  return (
    <div className="p-4">
      <h1 className="text-red-600 text-xl font-bold">RECUERDE CAPTURAR ENTRADAS POR PIEZAS</h1>
      <h2 className="text-xl font-bold mb-4">Colectivos Pendientes de Captura</h2>

     {colectivos.length === 0 ? (
      <p>No hay colectivos pendientes.</p>
      ) : (
        [...colectivos]
          .sort((a, b) => b.id_colectivo - a.id_colectivo)
          .map((c) => <ColectivoParaEntrada key={c.id_colectivo} colectivo={c} />)
      )}
    </div>
  );
}
