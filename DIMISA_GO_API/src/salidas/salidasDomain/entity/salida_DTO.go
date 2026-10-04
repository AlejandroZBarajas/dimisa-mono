package salidaEntity

type SalidaDetalleDTO struct {
	Clave       string `json:"clave"`
	Descripcion string `json:"descripcion"`
	Cantidad    int32  `json:"cantidad"`
}

type SalidaDTO struct {
	Folio   string             `json:"folio"`
	Tipo    string             `json:"tipo"`
	Cendis  string             `json:"cendis"`
	Area    string             `json:"area"`
	Usuario string             `json:"usuario"`
	Fecha   string             `json:"fecha"`
	Claves  []SalidaDetalleDTO `json:"claves"`
}
