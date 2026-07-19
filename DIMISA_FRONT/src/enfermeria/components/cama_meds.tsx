/* import { useEffect, useState } from "react";
//import { CamaMedicamento, getCamaMedicamentos } from "../../services/camas_service";

interface Props {
  id_cama: number;
  onRefresh: () => void;
}

export default function CamaMeds({ id_cama, onRefresh }: Props) {
 // const [meds, setMeds] = useState<CamaMedicamento[]>([]);
  const [editing, setEditing] = useState(false);

  const fetchMeds = async () => {
    try {
      const data = await getCamaMedicamentos(id_cama);
      setMeds(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchMeds(); }, []);

  return (
    <div style={{ marginTop: "0.5rem", borderTop: "1px dashed #999", paddingTop: "0.5rem" }}>
      <h4>Medicamentos</h4>
      <ul>
        {meds.map(m => (
          <li key={m.id_cama_medicamento}>
            Medicamento {m.id_medicamento} - Cantidad: {m.cantidad}
          </li>
        ))}
      </ul>
      <button onClick={() => setEditing(!editing)}>
        {editing ? "Cerrar Formulario" : "Editar / Añadir"}
      </button>
      {editing && (
        <div>
 
        </div>
      )}
    </div>
  );
}
 */