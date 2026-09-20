package consumoUnidosisEntity

type DetalleMes struct {
	Mes     int    `json:"mes"`
	Anio    int    `json:"anio"`
	Nombre  string `json:"nombre"`
	Consumo int32  `json:"consumo"`
}

type UnidosisConsumoDetalle struct {
	IdMedicamento   int32        `json:"id_medicamento"`
	Clave           string       `json:"clave"`
	Descripcion     string       `json:"descripcion"`
	Meses           []DetalleMes `json:"meses"`
	Sumatoria       int32        `json:"sumatoria"`
	PromedioMensual float64      `json:"promedio_mensual"`
	PromedioDiario  float64      `json:"promedio_diario"`
	Diez            float64      `json:"diez_pct"`
	ConsumoDiario   float64      `json:"consumo_diario"`
	ConsumoMensual  float64      `json:"consumo_mensual"`
}

type ConsumoEntity struct {
	Medicamentos []UnidosisConsumoDetalle `json:"medicamentos"`
	Material     []UnidosisConsumoDetalle `json:"material"`
}

type ConsumoCendisDetalle struct {
	CendisId int32  `json:"cendis_id"`
	Cendis   string `json:"cendis"`

	Medicamentos []UnidosisConsumoDetalle `json:"medicamentos"`
	Material     []UnidosisConsumoDetalle `json:"material"`
}

type ConsumoCendisResponse struct {
	Cendis []ConsumoCendisDetalle `json:"cendis"`
}

type ConsumoAreaDetalle struct {
	AreaId int32  `json:"area_id"`
	Area   string `json:"area"`

	Medicamentos []UnidosisConsumoDetalle `json:"medicamentos"`
	Material     []UnidosisConsumoDetalle `json:"material"`
}

type ConsumoAreaResponse struct {
	Areas []ConsumoAreaDetalle `json:"areas"`
}
