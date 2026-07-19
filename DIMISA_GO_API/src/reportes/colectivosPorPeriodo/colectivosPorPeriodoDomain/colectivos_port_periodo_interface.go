package colectivosPorPeriodoDomain

import entity "DIMISA/src/reportes/colectivosPorPeriodo/colectivosPorPeriodoDomain/colectivosPorPeriodoEntity"

type ColectivosPorPeriodoInterface interface {
	GetColectivosPorPeriodo(fechaInicio string, fechaFin string) (entity.ColectivosPorPeriodoEntity, error)
}
