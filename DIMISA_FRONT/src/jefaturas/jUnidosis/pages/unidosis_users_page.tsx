import { useEffect, useState } from "react";
import Header from "../../../common/header";
import ReportesSubheader from "../components/reportes_subheader";
import type UserDTO from "../../../entities/user_DTO";
import UserCard from "../../../admin/components/users/user_card";
import UserForm from "../../../admin/components/users/user_form";
import { getUsersByRol, createUser, updateUser } from "../../../services/users_service";
import { MdAdd } from "react-icons/md";

export default function AdminUsers() {

  const [users, setUsers] = useState<UserDTO[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserDTO | null>(null);
  const [selectedCendis, setSelectedCendis] = useState<string>("");


  const availableCendis = [
  ...new Set(users.map((u) => u.cendis_nombre).filter(Boolean)),
];
  

  const loadUsers = async () => {
  try {
    const data = await getUsersByRol(6);
    setUsers(data);
  } catch (error) {
    console.error(error);
  }
};

  useEffect(() => {
    loadUsers();
  }, []);

  const handleEditUser = async (user: UserDTO) => {
    setEditingUser(user); 
    setShowModal(true); 
  }

  const filteredUsers = users.filter((u) => {
  const matchCendis = selectedCendis
    ? u.cendis_nombre === selectedCendis
    : true;

  return matchCendis;
});

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <ReportesSubheader />

      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Gestión de Usuarios
          </h2>

    <div className="flex gap-3 items-center">
     

      <select
        value={selectedCendis}
        onChange={(e) => setSelectedCendis(e.target.value)}
        className="border rounded-lg px-3 py-2"
      >
        <option value="">Todos los cendis</option>

        {availableCendis.map((cendis) => (
          <option key={cendis} value={cendis}>
            {cendis}
          </option>
        ))}
      </select>

      <button
        onClick={() => {
          setEditingUser(null);
          setShowModal(true);
        }}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg"
      >
        <MdAdd size={28} />
      </button>
    </div>
        </div>

        {/* Grid de usuarios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <UserCard 
            key={user.id_usuario} 
            user={user} 
            onEdit={handleEditUser}
            />
          ))}
        </div>
      </div>

      {/* Modal del formulario */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
            >
              &times;
            </button>

          <UserForm
            initialData={editingUser || undefined}
            onSubmit={async (user) => {
              try {
                if (editingUser) {
                  await updateUser(user);
                  setEditingUser(null); 
                } else {
                  await createUser(user);
                }

                // Refrescar la lista de usuarios
                const updated = await getUsersByRol(6);
                setUsers(updated);
                setShowModal(false);
              } catch (error) {
                console.error("Error al guardar usuario:", error);
                alert("Hubo un error al guardar el usuario.");
              }
            }}
          />

          </div>
        </div>
      )}
    </div>
  );
}
