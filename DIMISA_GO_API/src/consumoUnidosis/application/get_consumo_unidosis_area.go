package consumoUnidosisApp

import (
	consumoUnidosisDomain "DIMISA/src/consumoUnidosis/domain"
	consumoUnidosisEntity "DIMISA/src/consumoUnidosis/domain/entity"
)

type GetConsumoUnidosisArea struct {
	Repo consumoUnidosisDomain.ConsumoUnidosisInterface
}

func (uc *GetConsumoUnidosisArea) Execute() (
	consumoUnidosisEntity.ConsumoAreaResponse,
	error,
) {
	return uc.Repo.GetConsumoUnidosisArea()
}
