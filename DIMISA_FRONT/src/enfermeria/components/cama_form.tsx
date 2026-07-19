import { useState } from "react";
import type CamaEntity from "../../entities/cama_entity";

interface Props {
  cama?: CamaEntity;
  onSave: (cama: CamaEntity) => void;
  onCancel: () => void;
}

export default function CamaForm({ cama, onSave, onCancel }: Props) {
  const [form, setForm] = useState<CamaEntity>({
    id_area: 0,
    numero_cama: 0,
    nombres: "",
    apellido1: "",
    apellido2: "",
    fecha_nac: "",
    expediente: "",
    riesgo_caida: "",
    riesgo_ulcera:"",
    habilitada: true,
    occupied: true,
    ...cama,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const expedienteRegex = /^\d{5}-\d{4}$/;
    if (!expedienteRegex.test(form.expediente)) {
      alert("El número de expediente debe tener el formato 12345-6789.");
      return;
    }
 const updatedForm = { ...form, occupied: true };

  onSave(updatedForm);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded w-[300px]">
        <h2 className="text-xl font-bold mb-2">Datos del paciente</h2>

        <label>Nombre(s)</label>
        <input
          type="text"
          name="nombres"
          value={form.nombres}
          onChange={handleChange}
          className="border p-1 w-full mb-2"
        />

        <label>Apellido P.</label>
        <input
          type="text"
          name="apellido1"
          value={form.apellido1}
          onChange={handleChange}
          className="border p-1 w-full mb-2"
        />

        <label>Apellido M.</label>
        <input
          type="text"
          name="apellido2"
          value={form.apellido2}
          onChange={handleChange}
          className="border p-1 w-full mb-2"
        />

        <label>Fecha de nacimiento</label>
        <input
          type="date"
          name="fecha_nac"
          value={form.fecha_nac}
          onChange={handleChange}
          className="border p-1 w-full mb-2"
        />

        <label>Expediente</label>
        <input
          type="text"
          name="expediente"
          value={form.expediente}
          onChange={handleChange}
          className="border p-1 w-full mb-2"
          placeholder="12345-6789"
        />

        <label>Riesgo de caída</label>
        <select
          name="riesgo_caida"
          value={form.riesgo_caida}
          onChange={handleChange}
          className="border p-1 w-full mb-2"
        >
          <option >Seleccione una opción</option>
          <option value="Alto">Alto</option>
          <option value="Medio">Medio</option>
          <option value="Bajo">Bajo</option>
        </select>

        <label>Úlcera por presión</label>
        <select
          name="riesgo_ulcera"
          value={form.riesgo_ulcera}
          onChange={handleChange}
          className="border p-1 w-full mb-2"
        >
          <option >Seleccione una opción</option>
          <option value="Alto">Alto</option>
          <option value="Medio">Medio</option>
          <option value="Bajo">Bajo</option>
        </select>

        <div className="flex justify-between mt-3">
          <button className="bg-gray-400 text-white p-1 rounded" onClick={onCancel}>
            Cancelar
          </button>

          <button className="bg-green-600 text-white p-1 rounded" onClick={handleSubmit}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
