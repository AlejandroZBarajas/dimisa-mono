import { useEffect, useState } from "react";
import { useAuth } from "../../common/auth/auth_context";
import type CamaEntity from "../../entities/cama_entity";
import { getCamasByArea, occupyCama } from "../../services/camas_service";
import CamaCard from "../components/cama_card";
import Header from "../../common/header";
import EnfermeriaSubheader from "../components/enfermeria_subheader";
import CamaForm from "../components/cama_form";

function EnfermeriaCamas() {
  const {auth} = useAuth()
  const [camas, setCamas] = useState<CamaEntity[]>([]);
  const [selectedCama, setSelectedCama] = useState<CamaEntity | null>(null);
  const [showForm, setShowForm] = useState(false);


  const id_area = auth.user?.ar!

  const fetchCamas = async () => {
    try {
      const data = await getCamasByArea(id_area);
      const sorted = data
        .filter(c => c.habilitada)
        .sort((a, b) => (b.occupied ? 1 : 0) - (a.occupied ? 1 : 0));
      setCamas(sorted);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (cama: CamaEntity) => {
    setSelectedCama(cama);
    setShowForm(true);
  };

  const handleCancel = () => {
    setSelectedCama(null);
    setShowForm(false);
  };

  const handleSave = async (updatedCama: CamaEntity) => {
    try {
      await occupyCama(updatedCama);
      setShowForm(false);
      setSelectedCama(null);
      await fetchCamas();
    } catch (error) {
      console.error("Error al guardar la cama:", error);
    }
  };

  useEffect(() => {
    fetchCamas();
  }, []);

  return (
    <div>
      <Header />
      <EnfermeriaSubheader />
      <h1>Camas del Área {id_area}</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {camas.map(cama => (
          <CamaCard
            key={cama.id_cama}
            cama={cama}
            onEdit={() => handleEdit(cama)}
            onRefresh={fetchCamas}
          />

        ))}
      </div>

      {showForm && selectedCama && (
        <CamaForm
          cama={selectedCama}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}

export default EnfermeriaCamas;
