package colectivosApp

import (
	"DIMISA/src/colectivos/colectivosDomain"
	"DIMISA/src/colectivos/colectivosDomain/colectivoEntity"
)

type GetColectivoById struct {
	Repo colectivosDomain.ColectivoInterface
}

func (uc *GetColectivoById) Execute(id int32) (*colectivoEntity.ColectivoDTO, error) {
	return uc.Repo.GetColectivoById(id)
}
