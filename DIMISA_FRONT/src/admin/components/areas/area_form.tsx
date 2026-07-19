import { useState } from "react";
import type AreaEntity from "../../../entities/area_entity";
interface Props {
  area?: AreaEntity | null;
  onSave: (area: AreaEntity) => void;
  onCancel: () => void;
}

export default function AreaForm({ area, onSave, onCancel }: Props) {
  const [formData, setFormData] = useState<AreaEntity>(
    area || {
      nombre_area: "",
      alias:"",
    }
  );


const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};




  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <h2 className="text-2xl font-bold text-morado">
        {area ? "Editar Area" : "Nueva Area"}
      </h2>

      <label className="text-sm font-semibold">Nombre del área</label>
      <input
        type="text"
        name="nombre_area"
        placeholder="Nombre del area"
        value={formData.nombre_area}
        onChange={handleChange}
        className="border p-2 rounded border-verde1"
        required
      />

      <label className="text-sm font-semibold">Alias del área</label>
      <input
        type="text"
        name="alias"
        placeholder="Alias del area"
        value={formData.alias}
        onChange={handleChange}
        className="border p-2 rounded border-verde1"
        required
      /> 

      <div className="flex gap-2">
        <button type="submit" className="flex-1 bg-azul3 text-white p-2 rounded">
          Guardar
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-rojo text-white p-2 rounded"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}