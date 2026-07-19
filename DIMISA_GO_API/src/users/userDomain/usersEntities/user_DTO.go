package usersEntities

type UserDTO struct {
	UserEntity
	Rol          string  `json:"rol,omitempty"`
	Id_area      *int32  `json:"id_area,omitempty"`
	NombreArea   *string `json:"nombre_area,omitempty"`
	Id_cendis    *int32  `json:"id_cendis,omitempty"`
	CendisNombre *string `json:"cendis_nombre,omitempty"`
}
