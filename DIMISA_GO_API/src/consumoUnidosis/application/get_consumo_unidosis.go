package consumoUnidosisApp

import (
	consumoUnidosisDomain "DIMISA/src/consumoUnidosis/domain"
	consumoUnidosisEntity "DIMISA/src/consumoUnidosis/domain/entity"
)

type GetConsumoUnidosisCendis struct {
	Repo consumoUnidosisDomain.ConsumoUnidosisInterface
}

func (uc *GetConsumoUnidosisCendis) Execute() (
	consumoUnidosisEntity.ConsumoCendisResponse,
	error,
) {
	return uc.Repo.GetConsumoUnidosisCendis()
}
