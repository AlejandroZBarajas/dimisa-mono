import type UserEntity from "../entities/user_entity";
import type UserDTO from "../entities/user_DTO";
import type UserRolEntity from "../entities/user_rol_entity";

const API_URL = import.meta.env.VITE_API_URL + "/users/";

export async function getUsers(): Promise<UserDTO[]> {
  const res = await fetch(`${API_URL}all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("Error al obtener usuarios");
  return await res.json();
}

export async function createUser(user: UserEntity): Promise< number > {
  
  const res = await fetch(`${API_URL}create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!res.ok) throw new Error("Error al crear usuario");
  return await res.json();
}

export async function updateUser(user: UserEntity): Promise<UserDTO> {
  const res = await fetch(`${API_URL}update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!res.ok) throw new Error("Error al actualizar usuario");
  return await res.json();
}

export async function deleteUser(id_usuario: number): Promise<void> {
  console.log(id_usuario)
  /* const res = await fetch(`${API_URL}/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id_usuario }),
  });

  if (!res.ok) throw new Error("Error al eliminar usuario"); */
}

export async function getUserRoles(): Promise<UserRolEntity[]> {
  const URL = ` ${API_URL}get-roles`;
  const res = await fetch(URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Error al obtener roles de usuario");
  return await res.json();
}