package consumoUnidosisInfra

import (
	consumoUnidosisApp "DIMISA/src/consumoUnidosis/application"
	"encoding/json"
	"net/http"
)

type ConsumoUnidosisController struct {
	GetConsumoUC       *consumoUnidosisApp.GetConsumoUnidosis
	GetConsumoCendisUC *consumoUnidosisApp.GetConsumoUnidosisCendis
	GetConsumoAreaUC   *consumoUnidosisApp.GetConsumoUnidosisArea
}

func NewConsumoUnidosisController(
	getConsumoUC *consumoUnidosisApp.GetConsumoUnidosis,
	getConsumoCendisUC *consumoUnidosisApp.GetConsumoUnidosisCendis,
	getConsumoAreaUC *consumoUnidosisApp.GetConsumoUnidosisArea,
) *ConsumoUnidosisController {
	return &ConsumoUnidosisController{
		GetConsumoUC:       getConsumoUC,
		GetConsumoCendisUC: getConsumoCendisUC,
		GetConsumoAreaUC:   getConsumoAreaUC,
	}
}

func (c *ConsumoUnidosisController) GetConsumoHandler(
	w http.ResponseWriter,
	r *http.Request,
) {
	consumo, err := c.GetConsumoUC.Execute()
	if err != nil {
		http.Error(
			w,
			"Error al obtener consumo: "+err.Error(),
			http.StatusInternalServerError,
		)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	if err := json.NewEncoder(w).Encode(consumo); err != nil {
		http.Error(
			w,
			"Error al generar respuesta: "+err.Error(),
			http.StatusInternalServerError,
		)
	}
}

func (c *ConsumoUnidosisController) GetConsumoCendisHandler(
	w http.ResponseWriter,
	r *http.Request,
) {
	consumo, err := c.GetConsumoCendisUC.Execute()
	if err != nil {
		http.Error(
			w,
			"Error al obtener consumo por CENDIS: "+err.Error(),
			http.StatusInternalServerError,
		)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	if err := json.NewEncoder(w).Encode(consumo); err != nil {
		http.Error(
			w,
			"Error al generar respuesta: "+err.Error(),
			http.StatusInternalServerError,
		)
	}
}

func (c *ConsumoUnidosisController) GetConsumoAreaHandler(
	w http.ResponseWriter,
	r *http.Request,
) {
	consumo, err := c.GetConsumoAreaUC.Execute()
	if err != nil {
		http.Error(
			w,
			"Error al obtener consumo por área: "+err.Error(),
			http.StatusInternalServerError,
		)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	if err := json.NewEncoder(w).Encode(consumo); err != nil {
		http.Error(
			w,
			"Error al generar respuesta: "+err.Error(),
			http.StatusInternalServerError,
		)
	}
}
