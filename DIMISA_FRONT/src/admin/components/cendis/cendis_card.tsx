import { MdEdit, MdDelete } from "react-icons/md";
import type CendisEntity from "../../../entities/cendis_entity";

interface Props {
  cendis: CendisEntity;
  onEdit: (cendis: CendisEntity) => void;
  onDelete: (id: number) => void;
}

export default function CendisCard({ cendis, onDelete, onEdit }: Props) {
  return (
    <div className="w-fit border-verde1 border-2 rounded-lg shadow-md p-2 flex flex-col justify-around">
      <h2 className="text-xl font-bold text-morado">{cendis.cendis_nombre}</h2>

       {/* Lista simple de áreas */}
      {cendis.areas.length > 0 && (
        <ul className="mt-2 list-disc list-inside text-sm text-gray-700">
          {cendis.areas.map((area) => (
            <li key={area.id_area}>{area.nombre_area}</li>
          ))}
        </ul>
      )}
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => onEdit(cendis)}
          className="w-[100px] flex-1 bg-azul3 text-white p-2 rounded flex items-center justify-center gap-1"
        >
          <MdEdit /> Editar
        </button>
        <button
          onClick={() => onDelete(cendis.id_cendis!)}
          className="w-[100px] flex-1 bg-rojo text-white p-2 rounded flex items-center justify-center gap-1"
        >
          <MdDelete /> Eliminar
        </button>
      </div>
    </div>
  );
}
