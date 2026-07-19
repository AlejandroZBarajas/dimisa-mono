import { useEffect, useState } from "react";
import Header from "../../common/header";
import AdminSubheader from "../components/admin_subheader";
import CendisCard from "../components/cendis/cendis_card";
import CendisForm from "../components/cendis/cendis_form";
import type CendisEntity from "../../entities/cendis_entity";
import type AreaEntity from "../../entities/area_entity";
import { getAllCendis, createCendis, updateCendis, deleteCendis } from "../../services/cendis_service";
import { getFreeAreas } from "../../services/areas_service";
import { MdAdd } from "react-icons/md";

export default function AdminCendis() {
  const [cendisList, setCendisList] = useState<CendisEntity[]>([]);
  const [areas, setAreas] = useState<AreaEntity[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCendis, setEditingCendis] = useState<CendisEntity | null>(null);
  
    useEffect(() => {
      fetchCendis();
      fetchAreas();
    }, []);
  
  const fetchCendis = async () => {
    try {
      const data = await getAllCendis();
      setCendisList(data);
    } catch (error) {
      console.error("Error al cargar los cendis:", error);
    }
  };

  const fetchAreas = async () => {
    try {
      const data = await getFreeAreas();
      setAreas(data);
    } catch (error) {
      console.error("Error al cargar áreas:", error);
    }
  };

  const handleSave = async (payload: { id_cendis?: number; cendis_nombre: string; areas: number[] }) => {
    try {
      if (payload.id_cendis) {
        const updated = await updateCendis(payload);
        setCendisList((prev) =>
          prev.map((c) => (c.id_cendis === updated.id_cendis ? updated : c))
        );
      } else {
        const created = await createCendis(payload);
        setCendisList((prev) => [...prev, created]);
      }
      setFormOpen(false);
      setEditingCendis(null);
    } catch (error) {
      console.error("Error al guardar el cendis:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCendis(id);
      setCendisList((prev) => prev.filter((c) => c.id_cendis !== id));
    } catch (error) {
      console.error("Error al eliminar el cendis:", error);
    }
  };

  return (
    <div>
      <Header />
      <AdminSubheader />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-morado">Gestión de Cendis</h2>

      {(areas??[]).length > 0 && (
        <button
          onClick={() => {
            setEditingCendis(null);
            setFormOpen(true);
          }}
          className="bg-azul3 text-white p-3 rounded-full hover:bg-azul4 transition flex items-center gap-1"
          title="Agregar nuevo Cendis"
        >
          <MdAdd  size={24} /> 
        </button>
      )}
      </div>

      {formOpen && (
        <CendisForm
          cendis={editingCendis}
          areas={areas}
          onSave={handleSave}
          onCancel={() => setFormOpen(false)}
        />
      )}

      <div className="flex flex-wrap gap-4 mt-6">
        {cendisList.map((cendis) => (
          <CendisCard
            key={cendis.id_cendis}
            cendis={cendis}
            onEdit={(c) => {
              setEditingCendis(c);
              setFormOpen(true);
            }}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
