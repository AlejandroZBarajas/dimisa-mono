package cpmInfra

import (
	"DIMISA/src/core/config"
	cpmEntity "DIMISA/src/cpm/cpmDomain/cpmEntity"
	"database/sql"
	"fmt"
	"math"
	"strings"
	"time"
)

type CpmRepository struct {
	DB *sql.DB
}

func NewCpmRepository(db *sql.DB) *CpmRepository {
	return &CpmRepository{DB: db}
}

func (r *CpmRepository) GetCpm() (cpmEntity.CpmEntity, error) {
	meses, err := r.obtenerMesesConDatos()
	if err != nil {
		return cpmEntity.CpmEntity{}, err
	}
	if len(meses) == 0 {
		return cpmEntity.CpmEntity{}, nil
	}

	// Construir el IN dinámico según cuántos meses haya
	placeholders := strings.Repeat("ROW(?,?),", len(meses))
	placeholders = placeholders[:len(placeholders)-1] // quitar última coma

	query := fmt.Sprintf(`
		SELECT
			m.id_medicamento,
			m.clave_med,
			m.descripcion,
			MONTH(s.fecha),
			YEAR(s.fecha),
			SUM(sd.cantidad)
		FROM medicamentos m
		INNER JOIN salidas_detalle sd ON sd.id_medicamento = m.id_medicamento
		INNER JOIN salidas s          ON s.id_salida = sd.id_salida
		WHERE (YEAR(s.fecha), MONTH(s.fecha)) IN (%s)
		GROUP BY m.id_medicamento, m.clave_med, m.descripcion, MONTH(s.fecha), YEAR(s.fecha)
		ORDER BY m.id_medicamento
	`, placeholders)

	args := make([]interface{}, 0, len(meses)*2)
	for _, m := range meses {
		args = append(args, m.Anio, m.Mes)
	}

	rows, err := r.DB.Query(query, args...)
	if err != nil {
		return cpmEntity.CpmEntity{}, err
	}
	defer rows.Close()

	type key = int32
	detallesMap := make(map[key]*cpmEntity.CpmDetalle)
	var orden []key

	for rows.Next() {
		var (
			idMed       int32
			clave       string
			descripcion string
			mes         int
			anio        int
			consumo     int32
		)
		if err := rows.Scan(&idMed, &clave, &descripcion, &mes, &anio, &consumo); err != nil {
			return cpmEntity.CpmEntity{}, err
		}

		if _, existe := detallesMap[idMed]; !existe {
			d := &cpmEntity.CpmDetalle{
				IdMedicamento: idMed,
				Clave:         clave,
				Descripcion:   descripcion,
				Meses:         inicializarMeses(meses),
			}
			detallesMap[idMed] = d
			orden = append(orden, idMed)
		}

		for i, m6 := range meses {
			if m6.Mes == mes && m6.Anio == anio {
				detallesMap[idMed].Meses[i].Consumo = consumo
				break
			}
		}
	}
	if err := rows.Err(); err != nil {
		return cpmEntity.CpmEntity{}, err
	}

	medicamentos := make([]cpmEntity.CpmDetalle, 0)
	material := make([]cpmEntity.CpmDetalle, 0)

	for _, id := range orden {
		d := detallesMap[id]

		var suma int32
		for _, m := range d.Meses {
			suma += m.Consumo
		}

		numMeses := float64(len(meses))
		promMensual := float64(suma) / numMeses
		promDiario := promMensual / 30.0
		diez := promDiario * 0.10
		consumoDiario := promDiario + diez
		consumoMensual := consumoDiario * 30.0

		d.Sumatoria = suma
		d.PromedioMensual = round2(promMensual)
		d.PromedioDiario = round2(promDiario)
		d.Diez = round2(diez)
		d.ConsumoDiario = round2(consumoDiario)
		d.ConsumoMensual = round2(consumoMensual)

		if esMedicamento(d.Clave) {
			medicamentos = append(medicamentos, *d)
		} else {
			material = append(material, *d)
		}
	}

	return cpmEntity.CpmEntity{
		Medicamentos: medicamentos,
		Material:     material,
	}, nil
}

// ---------- helpers ----------

type mesAnio struct {
	Mes    int
	Anio   int
	Nombre string
}

var nombresMes = [...]string{
	"", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
	"Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
}

func calcularUltimos6Meses() []mesAnio {
	now := time.Now()
	meses := make([]mesAnio, 6)
	for i := 5; i >= 0; i-- {
		t := now.AddDate(0, -(5 - i), 0)
		mes := int(t.Month())
		meses[i] = mesAnio{
			Mes:    mes,
			Anio:   t.Year(),
			Nombre: nombresMes[mes],
		}
	}
	return meses
}

func inicializarMeses(meses []mesAnio) []cpmEntity.DetalleMes {
	out := make([]cpmEntity.DetalleMes, 6)
	for i, m := range meses {
		out[i] = cpmEntity.DetalleMes{
			Mes:     m.Mes,
			Anio:    m.Anio,
			Nombre:  m.Nombre,
			Consumo: 0,
		}
	}
	return out
}

func round2(v float64) float64 {
	return math.Round(v*100) / 100
}

func esMedicamento(clave string) bool {
	for _, prefix := range config.MedPrefixes {
		if strings.HasPrefix(clave, prefix) {
			return true
		}
	}
	for _, exact := range config.MedExactKeys {
		if clave == exact {
			return true
		}
	}
	return false
}

func (r *CpmRepository) obtenerMesesConDatos() ([]mesAnio, error) {
	query := `
		SELECT DISTINCT MONTH(s.fecha), YEAR(s.fecha)
		FROM salidas s
		INNER JOIN salidas_detalle sd ON sd.id_salida = s.id_salida
		ORDER BY YEAR(s.fecha) DESC, MONTH(s.fecha) DESC
		LIMIT 6
	`
	rows, err := r.DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var meses []mesAnio
	for rows.Next() {
		var m mesAnio
		if err := rows.Scan(&m.Mes, &m.Anio); err != nil {
			return nil, err
		}
		m.Nombre = nombresMes[m.Mes]
		meses = append(meses, m)
	}
	return meses, rows.Err()
}
