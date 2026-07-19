package colectivosPorPeriodoApp

import (
	colectivosPorPeriodo "DIMISA/src/reportes/colectivosPorPeriodo/colectivosPorPeriodoDomain"
	entity "DIMISA/src/reportes/colectivosPorPeriodo/colectivosPorPeriodoDomain/colectivosPorPeriodoEntity"
)

type GetColectivosPorPeriodo struct {
	Repo colectivosPorPeriodo.ColectivosPorPeriodoInterface
}

func (uc *GetColectivosPorPeriodo) Execute(fechaInicio string, fechaFin string) (entity.ColectivosPorPeriodoEntity, error) {
	return uc.Repo.GetColectivosPorPeriodo(fechaInicio, fechaFin)
}
