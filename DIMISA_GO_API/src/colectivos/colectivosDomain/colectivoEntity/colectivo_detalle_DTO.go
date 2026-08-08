package colectivoEntity

type ColectivoDetalleDTO struct {
	Id_detalle       int32  `json:"id_detalle"`
	Id_colectivo     int32  `json:"id_colectivo"`
	Id_medicamento   int32  `json:"id_medicamento"`
	Clave            string `json:"clave"`
	Descripcion      string `json:"descripcion"`
	Cantidad         int32  `json:"cantidad"`
	Piezas_esperadas *int32 `json:"piezas_esperadas"`
	Piezas_recibidas *int32 `json:"piezas_recibidas"`
}
