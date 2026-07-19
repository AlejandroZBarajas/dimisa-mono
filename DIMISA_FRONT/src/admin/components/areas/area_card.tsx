import { MdEdit, MdDelete } from "react-icons/md";
import type AreaEntity from "../../../entities/area_entity";

interface Props {
  area: AreaEntity;
  onEdit: (area :AreaEntity) => void;
  onDelete: (id: number) => void;
}

export default function AreaCard({ area, onEdit, onDelete }: Props) {

  return (
    <div className="w-fit border-verde1 border-2 rounded-lg shadow-md p-2  flex flex-col justify-around">
      <h3 className="text-xl font-bold text-morado">{area.nombre_area}</h3>
      <h4 className="text-gray-600">{area.alias}</h4>


      <div className="flex gap-2 mt-3">
       {  <button
          onClick={() => onEdit(area)}
          className="w-[100px] flex-1 bg-azul3 text-white p-2 rounded flex items-center justify-center gap-1"
        >
          <MdEdit /> Editar
        </button> }
        <button
          onClick={() => onDelete(area.id_area!)}
          className="w-[100px] flex-1 bg-rojo text-white p-2 rounded flex items-center justify-center gap-1"
        >
          <MdDelete /> Eliminar
        </button>
      </div>
    </div>
  );
}