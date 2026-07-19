import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./auth/auth_context";
import type { AuthUser } from "./auth/auth_entity";
import Header from "./header";


export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL + "/login";


  const handleLogin = async () => {
    setError("");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      //console.log(data)

      if (!res.ok) {
        throw new Error(data.message || "Error al iniciar sesión");
      }

      const user: AuthUser = {
        user_id: data.id_usuario,
        nombre_usuario: data.nombre_usuario,
        rol: data.id_rol,
        cnd: data.id_cendis,
        cndnm: data.cendis,
        ar: data.id_area,
        arnm: data.area,
      };
      const token = data.token
      
      login(token, user);

      switch (data.id_rol){
        case 1:
          navigate("/admin/users")
          break
        case 2:
        navigate("/admin/users")
        break
        case 3:
          navigate("/cpm")
          break
          case 4:
          navigate("/admision")
          break
        case 5:
          navigate("/enfermeria/camas")
          break
        case 6:
          navigate("/unidosis/colectivos")
          break
        default:
        setError("Rol no reconocido");
        break;
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error desconocido al iniciar sesión");
      }
    }
  }

  return (
    <div className="flex flex-col h-screen bg-white items-center">
      <Header></Header>

      <div className="flex flex-1 w-full justify-center items-center ">

        <div className="flex flex-col justify-center bg-[#002B24]/30 border-2 border-solid border-verde1 p-8 rounded-lg shadow-lg max-w-sm text-center min-w-[300px]">
          <h2 className="text-verde1 text-3xl font-bold m-2">Nombre de usuario</h2>
          <input
            type="email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border-2 border-solid border-morado bg-gris-clarito rounded-lg mb-4 p-2"
          />

          <h2 className="text-3xl text-verde1 font-bold m-2">Contraseña</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-2 border-solid b-verde1 bg-gris-clarito rounded-lg mb-4 p-2"
          />

          {error && <p className="text-red-600 mb-2">{error}</p>}

          <button
            onClick={handleLogin}
            className="bg-[#002B24] text-white text-3xl font-black p-2 rounded-xl hover:bg-morado-dark"
          >
            Ingresar
          </button>
        </div>
      </div>
    </div>
  );
}