import type UserEntity from "./user_entity";

export default interface UserDTO extends UserEntity {
  rol?: string;
  cendis_nombre?: string;
  nombre_area?: string;
}