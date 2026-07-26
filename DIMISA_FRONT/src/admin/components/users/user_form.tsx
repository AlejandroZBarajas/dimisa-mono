import { useEffect, useState } from "react";
import { useAuth } from "../../../common/auth/auth_context";
import type UserEntity from "../../../entities/user_entity";
import type UserDTO from "../../../entities/user_DTO";
import type UserRolEntity from "../../../entities/user_rol_entity";
import type AreaEntity from "../../../entities/area_entity";
import type CendisEntity from "../../../entities/cendis_entity";
import { getUserRoles } from "../../../services/users_service";
import { getAreas } from "../../../services/areas_service";
import { getAllCendis } from "../../../services/cendis_service";

interface Props {
  initialData?: UserDTO;
  onSubmit: (user: UserEntity) => void;
}

export default function UserForm({ initialData, onSubmit }: Props) {
  const {auth} = useAuth()
  const rol = auth.user?.rol

  const [formData, setFormData] = useState<UserEntity>(
    initialData || {
      nombres: "",
      apellido1: "",
      apellido2: "",
      username: "",
      password: "",
      id_rol: 0,
    }
  );

  const [confirmPassword, setConfirmPassword] = useState(""); 
  const [passwordError, setPasswordError] = useState(""); 

  const [roles, setRoles] = useState<UserRolEntity[]>([]);
  const [areas, setAreas] = useState<AreaEntity[]>([]);
  const [cendis, setCendis] = useState<CendisEntity[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rolesResponse = await getUserRoles();
        const areasResponse = await getAreas();
        const cendisResponse = await getAllCendis();
        setRoles(rolesResponse);
        setAreas(areasResponse);
        setCendis(cendisResponse);
      } catch (error) {
        console.error("Error al cargar roles, áreas o cendis:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!initialData && formData.password !== confirmPassword) {
      setPasswordError("Las contraseñas no coinciden.");
      return;
    }

    setPasswordError("");
    
    const idRol = Number(formData.id_rol);
    const idArea = Number(formData.id_area);
    const idCendis = Number(formData.id_cendis);

    const formattedData: UserEntity = {
      ...formData,
      id_rol: idRol,
    };

    if (idArea > 0) {
      formattedData.id_area = idArea;
    }

    if (idCendis > 0) {
      formattedData.id_cendis = idCendis;
    }

  onSubmit(formattedData);
};

  const renderRoleFields = () => {
    switch (Number(formData.id_rol)) {
      case 5: // Enfermería
        return (
          <div className="mt-3">
            <label className="block text-sm font-medium">Área</label>
            <select
              name="id_area"
              value={formData.id_area || ""}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border p-2"
              required
            >
              <option value="">Selecciona un área</option>
              {areas.map((area) => (
                <option key={area.id_area} value={area.id_area}>
                  {area.nombre_area}
                </option>
              ))}
            </select>
          </div>
        );

      case 6: // Unidosis
        return (
          <div className="mt-3">
            <label className="block text-sm font-medium">Cendis</label>
            <select
              name="id_cendis"
              value={formData.id_cendis || ""}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border p-2"
              required
            >
              <option value="">Selecciona un Cendis</option>
              {cendis.map((c) => (
                <option key={c.id_cendis} value={c.id_cendis}>
                  {c.cendis_nombre}
                </option>
              ))}
            </select>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded-xl p-6 w-full max-w-lg mx-auto"
    >
      <h2 className="text-xl font-bold mb-4">
        {initialData ? "Editar usuario" : "Crear usuario"}
      </h2>

      <div className="grid grid-cols-1 gap-3">
        <label className="block text-sm font-medium">Nombres</label>
        <input
          type="text"
          name="nombres"
          placeholder="Nombres"
          value={formData.nombres}
          onChange={handleChange}
          className="border rounded-lg p-2"
          required
        />

        <label className="block text-sm font-medium">Apellido paterno</label>
        <input
          type="text"
          name="apellido1"
          placeholder="Apellido paterno"
          value={formData.apellido1}
          onChange={handleChange}
          className="border rounded-lg p-2"
          required
        />

        <label className="block text-sm font-medium">Apellido materno</label>
        <input
          type="text"
          name="apellido2"
          placeholder="Apellido materno"
          value={formData.apellido2}
          onChange={handleChange}
          className="border rounded-lg p-2"
        />

        <label className="block text-sm font-medium">Username</label>
        <input
          type="text"
          name="username"
          placeholder="Usuario"
          value={formData.username}
          onChange={handleChange}
          className="border rounded-lg p-2"
          required
        />

        {/* 👇 Solo mostrar los campos de contraseña al crear */}
        {!initialData && (
          <>
            <label className="block text-sm font-medium">Contraseña</label>
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              className="border rounded-lg p-2"
              required
            />

            <label className="block text-sm font-medium">
              Confirmar contraseña
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Repite la contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border rounded-lg p-2"
              required
            />

            {passwordError && (
              <p className="text-red-600 text-sm mt-1">{passwordError}</p>
            )}
          </>
        )}

        {/* <label className="block text-sm font-medium">Rol</label>
        <select
          name="id_rol"
          value={formData.id_rol || ""}
          onChange={handleChange}
          className="border rounded-lg p-2"
          required
        >
          <option value="">Selecciona un rol</option>

          {roles.map((rol) => (
            <option key={rol.id_rol} value={rol.id_rol}>
              {rol.rol}
            </option>
          ))}
        </select> */}
        {(rol === 1 || rol === 2) && (
          <>
            <label className="block text-sm font-medium">Rol</label>
            <select
              name="id_rol"
              value={formData.id_rol || ""}
              onChange={handleChange}
              className="border rounded-lg p-2"
              required
            >
              <option value="">Selecciona un rol</option>

              {roles.map((rol) => (
                <option key={rol.id_rol} value={rol.id_rol}>
                  {rol.rol}
                </option>
              ))}
            </select>
          </>
        )}


      </div>

      {renderRoleFields()}

      <button
        type="submit"
        className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
      >
        {initialData ? "Actualizar" : "Guardar"}
      </button>
    </form>
  );
}
