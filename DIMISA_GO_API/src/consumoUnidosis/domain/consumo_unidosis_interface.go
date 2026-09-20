package consumoUnidosisDomain

import (
	consumoUnidosisEntity "DIMISA/src/consumoUnidosis/domain/entity"
)

type ConsumoUnidosisInterface interface {
	GetConsumoUnidosis() (
		consumoUnidosisEntity.ConsumoEntity,
		error,
	)

	GetConsumoUnidosisCendis() (
		consumoUnidosisEntity.ConsumoCendisResponse,
		error,
	)

	GetConsumoUnidosisArea() (
		consumoUnidosisEntity.ConsumoAreaResponse,
		error,
	)
}
