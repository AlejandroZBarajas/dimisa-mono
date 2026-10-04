package consumoUnidosisInfra

import (
	"database/sql"
	"fmt"
	"strings"
	"time"

	consumoUnidosisEntity "DIMISA/src/consumoUnidosis/domain/entity"
	"DIMISA/src/core/config"
)

type ConsumoUnidosisRepository struct {
	DB *sql.DB
}

func NewConsumoUnidosisRepository(db *sql.DB) *ConsumoUnidosisRepository {
	return &ConsumoUnidosisRepository{
		DB: db,
	}
}

// ============================================================
// CONSUMO GLOBAL
// ============================================================

func (r *ConsumoUnidosisRepository) GetConsumoUnidosis() (
	consumoUnidosisEntity.ConsumoEntity,
	error,
) {
	inicio, fin := obtenerRangoSeisMeses()

	query := `
		SELECT
			m.id_medicamento,
			m.clave_med,
			m.descripcion,
			YEAR(s.fecha) AS anio,
			MONTH(s.fecha) AS mes,
			SUM(sd.cantidad) AS consumo
		FROM salidas s
		INNER JOIN salidas_detalle sd
			ON sd.id_salida = s.id_salida
		INNER JOIN medicamentos m
			ON m.id_medicamento = sd.id_medicamento
		WHERE s.pendiente = 0
		  AND s.fecha >= ?
		  AND s.fecha < ?
		GROUP BY
			m.id_medicamento,
			m.clave_med,
			m.descripcion,
			YEAR(s.fecha),
			MONTH(s.fecha)
		ORDER BY
			m.id_medicamento,
			YEAR(s.fecha),
			MONTH(s.fecha)
	`

	rows, err := r.DB.Query(query, inicio, fin)
	if err != nil {
		return consumoUnidosisEntity.ConsumoEntity{},
			fmt.Errorf("error al consultar consumo global: %w", err)
	}
	defer rows.Close()

	filas := make([]consumoUnidosisEntity.ConsumoRow, 0)

	for rows.Next() {
		var fila consumoUnidosisEntity.ConsumoRow

		if err := rows.Scan(
			&fila.IdMedicamento,
			&fila.Clave,
			&fila.Descripcion,
			&fila.Anio,
			&fila.Mes,
			&fila.Consumo,
		); err != nil {
			return consumoUnidosisEntity.ConsumoEntity{},
				fmt.Errorf("error al leer consumo global: %w", err)
		}

		filas = append(filas, fila)
	}

	if err := rows.Err(); err != nil {
		return consumoUnidosisEntity.ConsumoEntity{},
			fmt.Errorf("error recorriendo consumo global: %w", err)
	}

	return construirConsumoGlobal(filas, inicio), nil
}

// ============================================================
// CONSUMO POR CENDIS
// ============================================================

func (r *ConsumoUnidosisRepository) GetConsumoUnidosisCendis() (
	consumoUnidosisEntity.ConsumoCendisResponse,
	error,
) {
	inicio, fin := obtenerRangoSeisMeses()

	query := `
		WITH consumo AS (
			SELECT
				s.id_cendis,
				sd.id_medicamento,
				YEAR(s.fecha) AS anio,
				MONTH(s.fecha) AS mes,
				SUM(sd.cantidad) AS consumo
			FROM salidas s
			INNER JOIN salidas_detalle sd
				ON sd.id_salida = s.id_salida
			WHERE s.pendiente = 0
			  AND s.fecha >= ?
			  AND s.fecha < ?
			GROUP BY
				s.id_cendis,
				sd.id_medicamento,
				YEAR(s.fecha),
				MONTH(s.fecha)
		)
		SELECT
			c.id_cendis,
			c.cendis_nombre,

			m.id_medicamento,
			m.clave_med,
			m.descripcion,

			consumo.anio,
			consumo.mes,
			consumo.consumo

		FROM cendis c

		LEFT JOIN consumo
			ON consumo.id_cendis = c.id_cendis

		LEFT JOIN medicamentos m
			ON m.id_medicamento = consumo.id_medicamento

		ORDER BY
			c.id_cendis,
			m.id_medicamento,
			consumo.anio,
			consumo.mes
	`

	rows, err := r.DB.Query(query, inicio, fin)
	if err != nil {
		return consumoUnidosisEntity.ConsumoCendisResponse{},
			fmt.Errorf("error al consultar consumo por CENDIS: %w", err)
	}
	defer rows.Close()

	type grupoCendis struct {
		Id     int32
		Nombre string
		Filas  []consumoUnidosisEntity.ConsumoRow
	}

	grupos := make(map[int32]*grupoCendis)
	orden := make([]int32, 0)

	for rows.Next() {
		var (
			cendisId     int32
			cendisNombre string

			idMedicamento sql.NullInt64
			clave         sql.NullString
			descripcion   sql.NullString

			anio    sql.NullInt64
			mes     sql.NullInt64
			consumo sql.NullInt64
		)

		if err := rows.Scan(
			&cendisId,
			&cendisNombre,
			&idMedicamento,
			&clave,
			&descripcion,
			&anio,
			&mes,
			&consumo,
		); err != nil {
			return consumoUnidosisEntity.ConsumoCendisResponse{},
				fmt.Errorf("error al leer consumo por CENDIS: %w", err)
		}

		if _, existe := grupos[cendisId]; !existe {
			grupos[cendisId] = &grupoCendis{
				Id:     cendisId,
				Nombre: cendisNombre,
				Filas:  make([]consumoUnidosisEntity.ConsumoRow, 0),
			}

			orden = append(orden, cendisId)
		}

		// El CENDIS existe aunque no tenga consumo.
		if !idMedicamento.Valid {
			continue
		}

		fila := consumoUnidosisEntity.ConsumoRow{
			IdMedicamento: int32(idMedicamento.Int64),
			Clave:         clave.String,
			Descripcion:   descripcion.String,
			CendisId:      &cendisId,
			Cendis:        &cendisNombre,
			Anio:          int(anio.Int64),
			Mes:           int(mes.Int64),
			Consumo:       int32(consumo.Int64),
		}

		grupos[cendisId].Filas = append(
			grupos[cendisId].Filas,
			fila,
		)
	}

	if err := rows.Err(); err != nil {
		return consumoUnidosisEntity.ConsumoCendisResponse{},
			fmt.Errorf("error recorriendo consumo por CENDIS: %w", err)
	}

	respuesta := consumoUnidosisEntity.ConsumoCendisResponse{
		Cendis: make([]consumoUnidosisEntity.ConsumoCendisDetalle, 0, len(orden)),
	}

	for _, cendisId := range orden {
		grupo := grupos[cendisId]

		consumo := construirConsumoGlobal(
			grupo.Filas,
			inicio,
		)

		respuesta.Cendis = append(
			respuesta.Cendis,
			consumoUnidosisEntity.ConsumoCendisDetalle{
				CendisId:     grupo.Id,
				Cendis:       grupo.Nombre,
				Medicamentos: consumo.Medicamentos,
				Material:     consumo.Material,
			},
		)
	}

	return respuesta, nil
}

// ============================================================
// CONSUMO POR ÁREA
// ============================================================

func (r *ConsumoUnidosisRepository) GetConsumoUnidosisArea() (
	consumoUnidosisEntity.ConsumoAreaResponse,
	error,
) {
	inicio, fin := obtenerRangoSeisMeses()

	query := `
		WITH consumo AS (
			SELECT
				s.id_area,
				sd.id_medicamento,
				YEAR(s.fecha) AS anio,
				MONTH(s.fecha) AS mes,
				SUM(sd.cantidad) AS consumo
			FROM salidas s
			INNER JOIN salidas_detalle sd
				ON sd.id_salida = s.id_salida
			WHERE s.pendiente = 0
			  AND s.fecha >= ?
			  AND s.fecha < ?
			GROUP BY
				s.id_area,
				sd.id_medicamento,
				YEAR(s.fecha),
				MONTH(s.fecha)
		)
		SELECT
			a.id_area,
			a.nombre_area,

			m.id_medicamento,
			m.clave_med,
			m.descripcion,

			consumo.anio,
			consumo.mes,
			consumo.consumo

		FROM areas a

		LEFT JOIN consumo
			ON consumo.id_area = a.id_area

		LEFT JOIN medicamentos m
			ON m.id_medicamento = consumo.id_medicamento

		ORDER BY
			a.id_area,
			m.id_medicamento,
			consumo.anio,
			consumo.mes
	`

	rows, err := r.DB.Query(query, inicio, fin)
	if err != nil {
		return consumoUnidosisEntity.ConsumoAreaResponse{},
			fmt.Errorf("error al consultar consumo por área: %w", err)
	}
	defer rows.Close()

	type grupoArea struct {
		Id     int32
		Nombre string
		Filas  []consumoUnidosisEntity.ConsumoRow
	}

	grupos := make(map[int32]*grupoArea)
	orden := make([]int32, 0)

	for rows.Next() {
		var (
			areaId     int32
			areaNombre string

			idMedicamento sql.NullInt64
			clave         sql.NullString
			descripcion   sql.NullString

			anio    sql.NullInt64
			mes     sql.NullInt64
			consumo sql.NullInt64
		)

		if err := rows.Scan(
			&areaId,
			&areaNombre,
			&idMedicamento,
			&clave,
			&descripcion,
			&anio,
			&mes,
			&consumo,
		); err != nil {
			return consumoUnidosisEntity.ConsumoAreaResponse{},
				fmt.Errorf("error al leer consumo por área: %w", err)
		}

		if _, existe := grupos[areaId]; !existe {
			grupos[areaId] = &grupoArea{
				Id:     areaId,
				Nombre: areaNombre,
				Filas:  make([]consumoUnidosisEntity.ConsumoRow, 0),
			}

			orden = append(orden, areaId)
		}

		// El área existe aunque no tenga consumo.
		if !idMedicamento.Valid {
			continue
		}

		fila := consumoUnidosisEntity.ConsumoRow{
			IdMedicamento: int32(idMedicamento.Int64),
			Clave:         clave.String,
			Descripcion:   descripcion.String,
			AreaId:        &areaId,
			Area:          &areaNombre,
			Anio:          int(anio.Int64),
			Mes:           int(mes.Int64),
			Consumo:       int32(consumo.Int64),
		}

		grupos[areaId].Filas = append(
			grupos[areaId].Filas,
			fila,
		)
	}

	if err := rows.Err(); err != nil {
		return consumoUnidosisEntity.ConsumoAreaResponse{},
			fmt.Errorf("error recorriendo consumo por área: %w", err)
	}

	respuesta := consumoUnidosisEntity.ConsumoAreaResponse{
		Areas: make([]consumoUnidosisEntity.ConsumoAreaDetalle, 0, len(orden)),
	}

	for _, areaId := range orden {
		grupo := grupos[areaId]

		consumo := construirConsumoGlobal(
			grupo.Filas,
			inicio,
		)

		respuesta.Areas = append(
			respuesta.Areas,
			consumoUnidosisEntity.ConsumoAreaDetalle{
				AreaId:       grupo.Id,
				Area:         grupo.Nombre,
				Medicamentos: consumo.Medicamentos,
				Material:     consumo.Material,
			},
		)
	}

	return respuesta, nil
}

// ============================================================
// CONSTRUCCIÓN DE RESULTADOS
// ============================================================

func construirConsumoGlobal(
	filas []consumoUnidosisEntity.ConsumoRow,
	inicio time.Time,
) consumoUnidosisEntity.ConsumoEntity {

	agrupados := make(map[int32][]consumoUnidosisEntity.ConsumoRow)
	orden := make([]int32, 0)

	for _, fila := range filas {
		if _, existe := agrupados[fila.IdMedicamento]; !existe {
			agrupados[fila.IdMedicamento] = make(
				[]consumoUnidosisEntity.ConsumoRow,
				0,
			)

			orden = append(orden, fila.IdMedicamento)
		}

		agrupados[fila.IdMedicamento] = append(
			agrupados[fila.IdMedicamento],
			fila,
		)
	}

	respuesta := consumoUnidosisEntity.ConsumoEntity{
		Medicamentos: make(
			[]consumoUnidosisEntity.UnidosisConsumoDetalle,
			0,
		),
		Material: make(
			[]consumoUnidosisEntity.UnidosisConsumoDetalle,
			0,
		),
	}

	for _, idMedicamento := range orden {
		filasMedicamento := agrupados[idMedicamento]

		detalle := construirDetalle(
			filasMedicamento,
			inicio,
		)

		if esMedicamento(detalle.Clave) {
			respuesta.Medicamentos = append(
				respuesta.Medicamentos,
				detalle,
			)
		} else if esMaterial(detalle.Clave) {
			respuesta.Material = append(
				respuesta.Material,
				detalle,
			)
		}
	}

	return respuesta
}

func construirDetalle(
	filas []consumoUnidosisEntity.ConsumoRow,
	inicio time.Time,
) consumoUnidosisEntity.UnidosisConsumoDetalle {

	primera := filas[0]

	meses := construirMeses(inicio)

	for _, fila := range filas {
		for i := range meses {
			if meses[i].Anio == fila.Anio &&
				meses[i].Mes == fila.Mes {

				meses[i].Consumo = fila.Consumo
				break
			}
		}
	}

	var sumatoria int32

	for _, mes := range meses {
		sumatoria += mes.Consumo
	}

	promedioMensual := float64(sumatoria) / 6.0
	promedioDiario := promedioMensual / 30.0
	diez := promedioDiario * 0.10
	consumoDiario := promedioDiario + diez
	consumoMensual := consumoDiario * 30.0

	return consumoUnidosisEntity.UnidosisConsumoDetalle{
		IdMedicamento:   primera.IdMedicamento,
		Clave:           primera.Clave,
		Descripcion:     primera.Descripcion,
		Meses:           meses,
		Sumatoria:       sumatoria,
		PromedioMensual: promedioMensual,
		PromedioDiario:  promedioDiario,
		Diez:            diez,
		ConsumoDiario:   consumoDiario,
		ConsumoMensual:  consumoMensual,
	}
}

// ============================================================
// MESES
// ============================================================

func construirMeses(inicio time.Time) []consumoUnidosisEntity.DetalleMes {
	meses := make([]consumoUnidosisEntity.DetalleMes, 0, 6)

	for i := 0; i < 6; i++ {
		fecha := inicio.AddDate(0, i, 0)

		meses = append(
			meses,
			consumoUnidosisEntity.DetalleMes{
				Mes:     int(fecha.Month()),
				Anio:    fecha.Year(),
				Nombre:  nombreMes(fecha.Month()),
				Consumo: 0,
			},
		)
	}

	return meses
}

func obtenerRangoSeisMeses() (time.Time, time.Time) {
	hoy := time.Now()

	inicioMesActual := time.Date(
		hoy.Year(),
		hoy.Month(),
		1,
		0,
		0,
		0,
		0,
		hoy.Location(),
	)

	inicio := inicioMesActual.AddDate(0, -5, 0)
	fin := inicioMesActual.AddDate(0, 1, 0)

	return inicio, fin
}

func nombreMes(mes time.Month) string {
	switch mes {
	case time.January:
		return "enero"
	case time.February:
		return "febrero"
	case time.March:
		return "marzo"
	case time.April:
		return "abril"
	case time.May:
		return "mayo"
	case time.June:
		return "junio"
	case time.July:
		return "julio"
	case time.August:
		return "agosto"
	case time.September:
		return "septiembre"
	case time.October:
		return "octubre"
	case time.November:
		return "noviembre"
	case time.December:
		return "diciembre"
	default:
		return ""
	}
}

// ============================================================
// CLASIFICACIÓN
// ============================================================

func esMedicamento(clave string) bool {
	for _, exacta := range config.MedExactKeys {
		if clave == exacta {
			return true
		}
	}

	for _, prefijo := range config.MedPrefixes {
		if strings.HasPrefix(clave, prefijo) {
			return true
		}
	}

	return false
}

func esMaterial(clave string) bool {
	for _, exclusion := range config.MatExclusions {
		if clave == exclusion {
			return false
		}
	}

	for _, prefijo := range config.MatPrefixes {
		if strings.HasPrefix(clave, prefijo) {
			return true
		}
	}

	return false
}
