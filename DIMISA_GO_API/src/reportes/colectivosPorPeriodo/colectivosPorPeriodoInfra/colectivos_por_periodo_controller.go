package colectivosPorPeriodoInfra

import (
	"encoding/json"
	"net/http"

	colectivosPorPeriodoApp "DIMISA/src/reportes/colectivosPorPeriodo/colectivosPorPeriodoApp"
)

type ColectivosPorPeriodoController struct {
	GetColectivosPorPeriodoUC *colectivosPorPeriodoApp.GetColectivosPorPeriodo
}

func NewColectivosPorPeriodoController(getColectivosPorPeriodoUC *colectivosPorPeriodoApp.GetColectivosPorPeriodo) *ColectivosPorPeriodoController {
	return &ColectivosPorPeriodoController{GetColectivosPorPeriodoUC: getColectivosPorPeriodoUC}
}
func (c *ColectivosPorPeriodoController) GetColectivosPorPeriodo(w http.ResponseWriter, r *http.Request) {
	fechaInicio := r.URL.Query().Get("fecha_inicio")
	fechaFin := r.URL.Query().Get("fecha_fin")

	if fechaInicio == "" || fechaFin == "" {
		http.Error(w, `{"error": "fecha de inicio y fecha de fin son requeridos"}`, http.StatusBadRequest)
		return
	}

	result, err := c.GetColectivosPorPeriodoUC.Execute(fechaInicio, fechaFin)
	if err != nil {
		http.Error(w, `{"error": "error al consultar colectivos"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}
