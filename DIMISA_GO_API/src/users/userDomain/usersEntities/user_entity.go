package usersEntities

type UserRolEntity struct {
	Id_rol int32  `json:"id_rol"`
	Rol    string `json:"rol"`
}

type UserEntity struct {
	Id_usuario int32  `json:"id_usuario"`
	Nombres    string `json:"nombres"`
	Apellido1  string `json:"apellido1"`
	Apellido2  string `json:"apellido2"`
	Username   string `json:"username"`
	Password   string `json:"-" db:"password"`
	Id_rol     int32  `json:"id_rol"`
}
