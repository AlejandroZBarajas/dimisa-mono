package colectivosPorPeriodosEntity

type ColectivosPorPeriodoEntity struct {
	FechaInicio                   string `json:"fecha_inicio"`
	FechaFin                      string `json:"fecha_fin"`
	ColectivosMedicamentosTotales int32  `json:"colectivos_medicamentos_totales"`
	ColectivosMaterialTotales     int32  `json:"colectivos_material_totales"`
}
