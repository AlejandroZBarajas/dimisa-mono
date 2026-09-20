package consumoUnidosisEntity

type ConsumoRow struct {
	IdMedicamento int32
	Clave         string
	Descripcion   string

	CendisId *int32
	Cendis   *string

	AreaId *int32
	Area   *string

	Anio    int
	Mes     int
	Consumo int32
}
