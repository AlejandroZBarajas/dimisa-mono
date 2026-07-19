package userApp

import (
	"DIMISA/src/users/userDomain"
	"DIMISA/src/users/userDomain/usersEntities"
)

type GetUserRolesUseCase struct {
	Repo userDomain.UserInterface
}

func (uc *GetUserRolesUseCase) Execute() ([]*usersEntities.UserRolEntity, error) {
	return uc.Repo.GetUserRoles()

}
