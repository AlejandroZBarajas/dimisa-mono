package consumoUnidosisApp

import (
	consumoUnidosisDomain "DIMISA/src/consumoUnidosis/domain"
	consumoUnidosisEntity "DIMISA/src/consumoUnidosis/domain/entity"
)

type GetConsumoUnidosis struct {
	Repo consumoUnidosisDomain.ConsumoUnidosisInterface
}

func (uc *GetConsumoUnidosis) Execute() (
	consumoUnidosisEntity.ConsumoEntity,
	error,
) {
	return uc.Repo.GetConsumoUnidosis()
}
