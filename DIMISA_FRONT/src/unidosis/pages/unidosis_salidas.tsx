import { useState, useEffect } from "react";
import { useAuth } from "../../common/auth/auth_context";
import type AreaEntity from "../../entities/area_entity";
import Header from "../../common/header";
import UnidosisSubheader from "../components/unidosis_subheader";
import { getAreasByCendis, getAreas } from "../../services/areas_service";
import { getTipos } from "../../services/tipo_col_sal";
import type TipoEntity from "../../entities/tipo_entity";
import SalidasArea from "../components/salidas/salidas_area";

function UnidosisSalidas() {
  const { auth } = useAuth();
  const [myAreas, setMyAreas]               = useState<AreaEntity[]>([]);
  const [todasLasAreas, setTodasLasAreas]   = useState<AreaEntity[]>([]);
  const [areaExtra, setAreaExtra]           = useState<AreaEntity | null>(null);
  const [tiposSalida, setTiposSalida]       = useState<TipoEntity[]>([]);

  const id_cendis = auth.user?.cnd!;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propias, todas] = await Promise.all([
          getAreasByCendis(id_cendis),
          getAreas(),
        ]);
        setMyAreas(propias ?? []);
        setTodasLasAreas(todas ?? []);
      } catch (error) {
        console.error("error al cargar las areas: ", error);
      }
    };

    const fetchTipos = async () => {
      try {
        const res = await getTipos();
        setTiposSalida(res);
      } catch (error) {
        console.error("no se pudieron cargar tipos: ", error);
      }
    };

    fetchData();
    fetchTipos();
  }, []);

  const areasFiltradas = todasLasAreas.filter(
    (a) => !myAreas.some((m) => m.id_area === a.id_area)
  );

  const handleChangeAreaExtra = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const valor = e.target.value;
    if (valor === "") {
      setAreaExtra(null);
      return;
    }
    const area = todasLasAreas.find((a) => a.id_area === Number(valor)) ?? null;
    setAreaExtra(area);
  };

  return (
    <div className="flex flex-col items-center">
      <Header />
      <UnidosisSubheader />

      <div>
        <h2 className="text-red-500 font-bold text-xl">
          No olvidar calcular las salidas en piezas
        </h2>
      </div>


      {/* Áreas propias del cendis */}
      <div className="w-full flex flex-wrap">
        {myAreas.map((area) => (
          <SalidasArea
            key={area.id_area}
            area={area}
            tipos={tiposSalida}
          />
        ))}
      </div>
      {/* Contenedor área extra — ancho completo */}
      <div className="w-full border-2 border-dashed border-gray-300 rounded-xl p-3 my-3">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-sm font-semibold text-gray-600">Otra área:</label>
          <select
            className="p-2 border rounded-lg text-sm"
            value={areaExtra?.id_area ?? ""}
            onChange={handleChangeAreaExtra}
          >
            <option value="">Ninguna</option>
            {areasFiltradas.map((a) => (
              <option key={a.id_area} value={a.id_area}>
                {a.nombre_area}
              </option>
            ))}
          </select>
        </div>

        {areaExtra && (
          <div className="flex">
            <SalidasArea
              key={areaExtra.id_area}
              area={areaExtra}
              tipos={tiposSalida}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default UnidosisSalidas;