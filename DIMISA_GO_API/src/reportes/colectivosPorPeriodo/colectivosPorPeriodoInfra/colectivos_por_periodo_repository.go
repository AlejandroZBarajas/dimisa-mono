package colectivosPorPeriodoInfra

import (
	entity "DIMISA/src/reportes/colectivosPorPeriodo/colectivosPorPeriodoDomain/colectivosPorPeriodoEntity"
	"database/sql"
)

type ColectivosPorPeriodoRepository struct {
	DB *sql.DB
}

func (r *ColectivosPorPeriodoRepository) GetColectivosPorPeriodo(fechaInicio string, fechaFin string) (entity.ColectivosPorPeriodoEntity, error) {
	query := `
		SELECT
			COALESCE(SUM(CASE WHEN tipo_id = 1 THEN 1 ELSE 0 END), 0) AS colectivos_medicamentos_totales,
			COALESCE(SUM(CASE WHEN tipo_id = 3 THEN 1 ELSE 0 END), 0) AS colectivos_material_totales
		FROM colectivos
		WHERE editable = 0
		  AND fecha BETWEEN ? AND ?
	`

	var result entity.ColectivosPorPeriodoEntity
	result.FechaInicio = fechaInicio
	result.FechaFin = fechaFin

	err := r.DB.QueryRow(query, fechaInicio, fechaFin).Scan(
		&result.ColectivosMedicamentosTotales,
		&result.ColectivosMaterialTotales,
	)
	if err != nil {
		return entity.ColectivosPorPeriodoEntity{}, err
	}

	return result, nil
}
