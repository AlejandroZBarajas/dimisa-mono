import type { EntradaRequest, CargarInventarioRequest } from "../entities/entrada_request_entity";

const API_URL = import.meta.env.VITE_API_URL+"/entradas/"

export async function capturarEntrada(entrada: EntradaRequest): Promise<void> {

  const res = await fetch(`${API_URL}capturar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entrada),
  });
  
  if (!res.ok) {
    throw new Error("Error al capturar entrada");
  }
}

export async function cargarAInventario(
  inventario: CargarInventarioRequest
): Promise<void> {
  console.log("========== CARGA DE INVENTARIO ==========");
  console.log(`Cendis: ${inventario.id_cendis}`);
  console.log(`Usuario: ${inventario.id_usuario}`);
  console.log(`Total de claves enviadas: ${inventario.detalles.length}`);

  inventario.detalles.forEach((detalle, index) => {
    console.log(
      `[${index + 1}/${inventario.detalles.length}] ` +
      `id_medicamento=${detalle.id_medicamento}, ` +
      `cantidad=${detalle.cantidad}`
    );
  });

  console.log("Payload completo:", inventario);
  console.log("========================================");

  const res = await fetch(`${API_URL}inventario`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(inventario),
  });

  if (!res.ok) {
    throw new Error("Error al cargar inventario");
  }
}