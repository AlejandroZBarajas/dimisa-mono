package entradasInfra

import (
	"DIMISA/src/entradas/entradasDomain/entradaEntity"
	"database/sql"
	"fmt"
	"log"
	"strings"
)

type EntradasRepository struct {
	DB *sql.DB
}

func NewEntradasRepository(db *sql.DB) *EntradasRepository {
	return &EntradasRepository{DB: db}
}

func (r *EntradasRepository) CapturarInventario(inventario *entradaEntity.InventarioRequest) error {
	if len(inventario.Detalles) == 0 {
		return fmt.Errorf("detalles vacíos")
	}

	tx, err := r.DB.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	var idInventario int

	// 1. Obtener o crear inventario
	err = tx.QueryRow(`
		SELECT id_inventario 
		FROM inventarios 
		WHERE id_cendis = ?
	`, inventario.Id_cendis).Scan(&idInventario)

	if err != nil {
		if err == sql.ErrNoRows {
			// crear inventario
			res, err := tx.Exec(`
				INSERT INTO inventarios (id_cendis, updated_at)
				VALUES (?, NOW())
			`, inventario.Id_cendis)
			if err != nil {
				return fmt.Errorf("error creando inventario: %w", err)
			}

			lastID, err := res.LastInsertId()
			if err != nil {
				return err
			}
			idInventario = int(lastID)

		} else {
			return err
		}
	}

	// 2. Bulk insert detalles
	placeholders := make([]string, 0, len(inventario.Detalles))
	args := make([]interface{}, 0, len(inventario.Detalles)*4)

	for _, d := range inventario.Detalles {
		placeholders = append(placeholders, "(?, ?, ?, ?, NOW())")
		args = append(args,
			idInventario,
			d.Id_medicamento,
			d.Cantidad,
			inventario.Id_usuario,
		)
	}

	query := fmt.Sprintf(`
		INSERT INTO inventario_detalle 
		(id_inventario, id_medicamento, cantidad, updated_by, updated_at)
		VALUES %s
		ON DUPLICATE KEY UPDATE
			cantidad = cantidad + VALUES(cantidad),
			updated_by = VALUES(updated_by),
			updated_at = NOW()
	`, strings.Join(placeholders, ", "))

	_, err = tx.Exec(query, args...)
	if err != nil {
		return fmt.Errorf("error insertando detalles: %w", err)
	}

	// 3. actualizar timestamp del inventario
	_, err = tx.Exec(`
		UPDATE inventarios 
		SET updated_at = NOW()
		WHERE id_inventario = ?
	`, idInventario)
	if err != nil {
		return err
	}

	return tx.Commit()
}

func (r *EntradasRepository) CapturarEntrada(entrada *entradaEntity.EntradaRequest) error {
	log.Printf("[CapturarEntrada] detalles recibidos: %+v", entrada.Detalles)
	log.Printf("[CapturarEntrada] START id_colectivo=%d id_cendis=%d id_usuario=%d detalles=%d",
		entrada.Id_colectivo, entrada.Id_cendis, entrada.Id_usuario, len(entrada.Detalles))

	tx, err := r.DB.Begin()
	if err != nil {
		return fmt.Errorf("Begin tx: %w", err)
	}
	defer tx.Rollback()

	if len(entrada.Detalles) > 0 {
		if err := r.actualizarInventario(tx, entrada); err != nil {
			return err
		}
		if err := r.actualizarPiezasEsperadas(tx, entrada); err != nil {
			return err
		}
		if err := r.insertarEntradasColectivo(tx, entrada); err != nil {
			return err
		}
	}

	if err := r.marcarColectivoCapturado(tx, entrada.Id_colectivo); err != nil {
		return err
	}

	if err := tx.Commit(); err != nil {
		return fmt.Errorf("Commit: %w", err)
	}

	log.Printf("[CapturarEntrada] DONE id_colectivo=%d", entrada.Id_colectivo)
	return nil
}

// ── helpers ──────────────────────────────────────────────────────────────────

func (r *EntradasRepository) actualizarInventario(tx *sql.Tx, entrada *entradaEntity.EntradaRequest) error {
	_, err := tx.Exec(`
        INSERT IGNORE INTO inventarios (id_cendis, updated_at)
        VALUES (?, NOW())
    `, entrada.Id_cendis)
	if err != nil {
		return fmt.Errorf("INSERT IGNORE inventarios: %w", err)
	}

	var idInventario int
	err = tx.QueryRow(`
        SELECT id_inventario FROM inventarios WHERE id_cendis = ?
    `, entrada.Id_cendis).Scan(&idInventario)
	if err != nil {
		return fmt.Errorf("SELECT id_inventario: %w", err)
	}
	log.Printf("[actualizarInventario] id_inventario=%d", idInventario)

	placeholders := make([]string, 0, len(entrada.Detalles))
	args := make([]interface{}, 0, len(entrada.Detalles)*5)
	for _, d := range entrada.Detalles {
		placeholders = append(placeholders, "(?, ?, ?, ?, NOW())")
		args = append(args, idInventario, d.Id_medicamento, d.Cantidad, entrada.Id_usuario)
	}

	_, err = tx.Exec(fmt.Sprintf(`
        INSERT INTO inventario_detalle (id_inventario, id_medicamento, cantidad, updated_by, updated_at)
        VALUES %s
        ON DUPLICATE KEY UPDATE
            cantidad   = cantidad + VALUES(cantidad),
            updated_by = VALUES(updated_by),
            updated_at = NOW()
    `, strings.Join(placeholders, ", ")), args...)
	if err != nil {
		return fmt.Errorf("bulk insert inventario_detalle: %w", err)
	}

	_, err = tx.Exec(`
        DELETE FROM inventario_detalle WHERE id_inventario = ? AND cantidad <= 0
    `, idInventario)
	if err != nil {
		return fmt.Errorf("DELETE cantidad<=0: %w", err)
	}

	_, err = tx.Exec(`
        UPDATE inventarios SET updated_at = NOW() WHERE id_inventario = ?
    `, idInventario)
	if err != nil {
		return fmt.Errorf("UPDATE inventarios updated_at: %w", err)
	}

	log.Printf("[actualizarInventario] OK")
	return nil
}

func (r *EntradasRepository) actualizarPiezasEsperadas(tx *sql.Tx, entrada *entradaEntity.EntradaRequest) error {
	for _, d := range entrada.Detalles {
		resultado, err := tx.Exec(`
			UPDATE colectivo_detalle
			SET piezas_esperadas = ?,
			    piezas_recibidas = ?
			WHERE id_colectivo = ?
			  AND id_medicamento = ?
		`,
			d.PiezasEsperadas,
			d.PiezasRecibidas,
			entrada.Id_colectivo,
			d.Id_medicamento,
		)
		if err != nil {
			return fmt.Errorf(
				"UPDATE piezas id_medicamento=%d: %w",
				d.Id_medicamento,
				err,
			)
		}

		filas, err := resultado.RowsAffected()
		if err != nil {
			return fmt.Errorf(
				"RowsAffected id_medicamento=%d: %w",
				d.Id_medicamento,
				err,
			)
		}

		if filas == 0 {
			return fmt.Errorf(
				"el medicamento %d no pertenece al colectivo %d",
				d.Id_medicamento,
				entrada.Id_colectivo,
			)
		}
	}

	log.Printf("[actualizarPiezasEsperadas] OK")
	return nil
}

func (r *EntradasRepository) marcarColectivoCapturado(tx *sql.Tx, idColectivo int32) error {
	_, err := tx.Exec(`
        UPDATE colectivos SET capturado = 1 WHERE id_colectivo = ?
    `, idColectivo)
	if err != nil {
		return fmt.Errorf("UPDATE colectivos capturado: %w", err)
	}
	log.Printf("[marcarColectivoCapturado] id_colectivo=%d OK", idColectivo)
	return nil
}
func (r *EntradasRepository) insertarEntradasColectivo(
	tx *sql.Tx,
	entrada *entradaEntity.EntradaRequest,
) error {
	resultado, err := tx.Exec(`
		INSERT INTO entradas_colectivo (
			id_colectivo,
			id_cendis,
			id_medicamento,
			cantidad_solicitada,
			cantidad_recibida
		)
		SELECT
			cd.id_colectivo,
			?,
			cd.id_medicamento,
			cd.piezas_esperadas,
			cd.piezas_recibidas
		FROM colectivo_detalle cd
		WHERE cd.id_colectivo = ?
		ON DUPLICATE KEY UPDATE
			cantidad_solicitada = VALUES(cantidad_solicitada),
			cantidad_recibida   = VALUES(cantidad_recibida)
	`,
		entrada.Id_cendis,
		entrada.Id_colectivo,
	)
	if err != nil {
		return fmt.Errorf("INSERT entradas_colectivo: %w", err)
	}

	filas, err := resultado.RowsAffected()
	if err != nil {
		return fmt.Errorf("RowsAffected entradas_colectivo: %w", err)
	}

	log.Printf("[insertarEntradasColectivo] OK filas_afectadas=%d", filas)
	return nil
}
