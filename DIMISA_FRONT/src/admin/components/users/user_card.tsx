import type UserDTO from "../../../entities/user_DTO";

interface Props {
  user: UserDTO;
  onEdit?: (user: UserDTO) => void;
  onDelete?: (id: number) => void;
}

export default function UserCard({ user, onEdit, onDelete }: Props) {


  return (
    <div className="bg-white shadow-md rounded-xl p-4 flex flex-col gap-2 border hover:shadow-lg transition-all">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">
          {user.nombres} {user.apellido1} {user.apellido2}
        </h3>
        <span className="text-sm text-gray-500">
          #{user.id_usuario ?? "Nuevo"}
        </span>
      </div>

      <p className="text-gray-700">
        <span className="font-medium">Usuario:</span> {user.username}
      </p>

      <p className="text-gray-700 font-medium">
        {user.rol}

        {user.rol === "Cendis" && user.cendis_nombre && (
          <> - {user.cendis_nombre}</>
        )}

        {user.rol === "Enfermeria" && user.nombre_area && (
          <> - {user.nombre_area}</>
        )}
      </p>

     

     

      {(onEdit || onDelete) && (
        <div className="flex gap-3 mt-3">
          {onEdit && (
            <button
              onClick={() => onEdit(user)}
              className="bg-azul3 hover:bg-azul4 text-white px-3 py-1 rounded-lg text-sm font-medium"
            >
              Editar
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(user.id_usuario!)}
              className="bg-white text-white"
              //className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-medium"
            >
              Deshabilitar
            </button>
          )}
        </div>
      )}
    </div>
  );
}
