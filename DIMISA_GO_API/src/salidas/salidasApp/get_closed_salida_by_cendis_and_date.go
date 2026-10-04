package salidasApp

import (
	"DIMISA/src/salidas/salidasDomain"
	salidaEntity "DIMISA/src/salidas/salidasDomain/entity"
)

type GetClosedSalidasByCendisAndDate struct {
	Repo salidasDomain.SalidasInterface
}

func (uc *GetClosedSalidasByCendisAndDate) Execute(id_cendis int32, date string) (*[]salidaEntity.SalidaDTO, error) {
	return uc.Repo.GetClosedSalidasByCendisAndDate(id_cendis, date)
}
