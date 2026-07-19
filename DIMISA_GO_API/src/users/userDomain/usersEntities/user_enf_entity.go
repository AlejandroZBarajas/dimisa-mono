package usersEntities

type UserEnfermeriaEntity struct {
	UserEntity
	Id_user int32 `json:"id_user"`
	Id_area int32 `json:"id_area"`
}
