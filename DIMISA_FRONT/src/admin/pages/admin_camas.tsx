import { useState, useEffect } from "react";
import Header from "../../common/header";
import AdminSubheader from "../components/admin_subheader";
import CamaIOswitch from "../components/camas/cama_IO_switch";
import CamaForm from "../components/camas/cama_form";
import type CamaEntity from "../../entities/cama_entity";
import type AreaEntity from "../../entities/area_entity";
import { getCamasByArea, enableCama, disableCama, deleteCama, createCamas } from "../../services/camas_service";
import { getAreas } from "../../services/areas_service";
import { MdAdd } from "react-icons/md";

function AdminCamas() {
  const [areas, setAreas] = useState<AreaEntity[]>([]);
  const [camasByArea, setCamasByArea] = useState<Record<number, CamaEntity[]>>({});
  const [formOpen, setFormOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<{ id: number; name: string } | null>(null);

  const fetchCamasByArea = async (areaId: number) => {
    try {
      const data = await getCamasByArea(areaId);
      setCamasByArea((prev) => ({
        ...prev,
        [areaId]: data,
      }));
    } catch (error) {
      console.error(`Error al cargar camas del área ${areaId}`, error);
    }
  };

  const fetchAreas = async () => {
    try {
      const data = await getAreas();
      setAreas(data);
      for (const area of data) {
        await fetchCamasByArea(area.id_area!);
      }
    } catch (error) {
      console.error("error al cargar áreas", error);
    }
  };

  const handleCreateCamas = async (data: { id_area: number; cama_1: number; cama_n?: number }) => {
    try {
      await createCamas(data);
      await fetchCamasByArea(data.id_area);
      setFormOpen(false); // cerrar el formulario al crear camas
    } catch (error) {
      console.error("Error al crear camas", error);
    }
  };

  const handleDeleteCama = async (id_cama: number) => {
    try {
      await deleteCama(id_cama);
      // refrescar lista
      for (const areaId in camasByArea) {
        if (camasByArea[areaId].some(c => c.id_cama === id_cama)) {
          await fetchCamasByArea(Number(areaId));
          break;
        }
      }
    } catch (error) {
      console.error(`Error al eliminar cama ${id_cama}`, error);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  return (
    <div>
      <Header />
      <AdminSubheader />

      <h2 className="text-2xl font-bold mb-4">Gestión de Camas</h2>

      {areas.map((area) => (
        <div key={area.id_area} className="mb-6 border border-gray-300 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-semibold text-morado">{area.nombre_area}</h3>
            <button
              onClick={() => {
                setSelectedArea({ id: area.id_area!, name: area.nombre_area });
                setFormOpen(true);
              }}
              className="bg-azul3 text-white p-2 rounded-full hover:bg-azul4 transition-colors items-center"
            >
              <MdAdd size={28}/>
            </button>
          </div>

          {/* Formulario */}
          {formOpen && selectedArea && selectedArea.id === area.id_area && (
            <CamaForm
              areaId={selectedArea.id}
              areaName={selectedArea.name}
              onSubmit={handleCreateCamas}
              onCancel={() => setFormOpen(false)}
            />
          )}


          <div className="flex flex-wrap gap-4 mt-4">
            {camasByArea[area.id_area!]?.map((cama) => (
              <CamaIOswitch
                key={cama.id_cama}
                id_cama={cama.id_cama!}
                numero_cama={cama.numero_cama}
                habilitada={cama.habilitada}
                turnOn={enableCama}
                turnOff={disableCama}
                onDelete={() => handleDeleteCama(cama.id_cama!)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminCamas;
