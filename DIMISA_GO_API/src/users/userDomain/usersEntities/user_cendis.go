package usersEntities

type UserCendisEntity struct {
	UserEntity
	Id_user   int32 `json:"id_user"`
	Id_cendis int32 `json:"id_cendis"`
}
