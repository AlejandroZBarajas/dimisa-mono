/* import { useState } from "react";
import { capturarEntrada } from "../../../services/entradas_service";
import type { ColectivoDTO } from "../../../entities/colectivo_DTO";
import { useAuth } from "../../../common/auth/auth_context";


interface Props {
  colectivo: ColectivoDTO;
}

export default function ColectivoParaEntrada({ colectivo }: Props) {
  const { auth } = useAuth(); 
  const [open, setOpen] = useState(false);
  const [cantidades, setCantidades] = useState<Record<number, string>>({});
  const [guardando, setGuardando] = useState(false);
  const [piezasEsperadas, setPiezasEsperadas] = useState<Record<number, string>>({});
  const [piezasRecibidas, setPiezasRecibidas] = useState<Record<number, string>>({});

  function handleCantidadChange(id_medicamento: number, valor: string) {
    setCantidades(prev => ({
      ...prev,
      [id_medicamento]: valor
    }));
  }

  function handlePiezasEsperadasChange(id_medicamento: number, valor: string) {
    setPiezasEsperadas(prev => ({ ...prev, [id_medicamento]: valor }));
  }

  function handlePiezasRecibidasChange(id_medicamento: number, valor: string) {
    setPiezasRecibidas(prev => ({ ...prev, [id_medicamento]: valor }));
  }

  async function handleGuardar() {
    setGuardando(true);
    try {
      const detalles = colectivo.claves
        .filter(d => 
          cantidades[d.id_medicamento] !== undefined && cantidades[d.id_medicamento] !== "" &&
          piezasEsperadas[d.id_medicamento] !== undefined && piezasEsperadas[d.id_medicamento] !== "" &&  
          Number(piezasRecibidas[d.id_medicamento]) >= Number(cantidades[d.id_medicamento]) &&
        )
        .map(d => ({
          id_medicamento: d.id_medicamento,
          cantidad: Number(cantidades[d.id_medicamento]), 
          piezas_esperadas: Number(piezasEsperadas[d.id_medicamento] ?? 0),
          piezas_recibidas: Number(piezasRecibidas[d.id_medicamento] ?? 0)
        }));

      await capturarEntrada({
        id_cendis: colectivo.id_cendis,
        id_usuario: auth.user!.user_id,
        id_colectivo: colectivo.id_colectivo!,
        detalles
      });

      alert("Entrada capturada correctamente");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Error al capturar entrada");
    } finally {
      setGuardando(false);
    }
  }

  const todosCapturados = colectivo.claves.every(d => {
  const recibidas = Number(cantidades[d.id_medicamento]);
  const esperadas = Number(piezasEsperadas[d.id_medicamento]);

  return (
    cantidades[d.id_medicamento] !== undefined && cantidades[d.id_medicamento] !== "" &&
    piezasEsperadas[d.id_medicamento] !== undefined && piezasEsperadas[d.id_medicamento] !== "" &&
    esperadas > 0 && esperadas >= recibidas && recibidas >= 0
  );
});

const hayDiscrepancia = colectivo.claves.some(d => {
  const recibidas = cantidades[d.id_medicamento];
  const esperadas = piezasEsperadas[d.id_medicamento];

  if (!recibidas || !esperadas) return false;

  return Number(recibidas) > Number(esperadas);
});

  return (
    <div className="border rounded-lg shadow p-4 mb-4">
      <h1>Colectivo de: {colectivo.tipo}</h1>
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div>
          <h3 className="font-bold text-lg">{colectivo.folio}</h3>
          <p>Fecha: {colectivo.fecha}</p>
          <p>Generado por: {colectivo.nombre_usuario}</p>
        </div>
        <button className="text-sm bg-blue-600 text-white px-3 py-1 rounded">
          {open ? "Cerrar" : "Abrir"}
        </button>
      </div>

      {open && (
        <div className="mt-4">
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Clave</th>
                <th className="border p-2">Descripción</th>
                <th className="border p-2">Cajas solicitadas</th>
                <th className="border p-2">Piezas esperadas</th>
                <th className="border p-2">Piezas recibidas</th>
              </tr>
            </thead>
            <tbody>
              {colectivo.claves.map((d) => (
                <tr key={`${colectivo.id_colectivo}-${d.id_detalle}`}>
                  <td className="border p-2">{d.clave}</td>
                  <td className="border p-2">{d.descripcion}</td>
                  <td className="border p-2">{d.cantidad}</td>
                  <td className="border p-2">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={piezasEsperadas[d.id_medicamento] ?? ""}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, "");
                        handlePiezasEsperadasChange(d.id_medicamento, val);
                      }}
                      className="w-full border rounded p-1"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      min={0}
                      value={cantidades[d.id_medicamento] ?? ""}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, "");
                        handleCantidadChange(d.id_medicamento, val);
                      }}
                      className="w-full border rounded p-1"
                    />
                  </td>

                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end mt-4">
            {hayDiscrepancia && (
              <p className="text-red-500 text-sm mt-2">
                Las piezas recibidas no pueden ser mayores a las esperadas.
              </p>
            )}
            <button
              onClick={handleGuardar}
              disabled={guardando || !todosCapturados}
              className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {guardando ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
} */

  import { useState } from "react";
import { capturarEntrada } from "../../../services/entradas_service";
import type { EntradaRequest } from "../../../entities/entrada_request_entity";
import type { ColectivoDTO } from "../../../entities/colectivo_DTO";
import { useAuth } from "../../../common/auth/auth_context";

interface Props {
  colectivo: ColectivoDTO;
}

export default function ColectivoParaEntrada({ colectivo }: Props) {
  const { auth } = useAuth();

  const [open, setOpen] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const [piezasEsperadas, setPiezasEsperadas] = useState<
    Record<number, string>
  >({});

  const [piezasRecibidas, setPiezasRecibidas] = useState<
    Record<number, string>
  >({});

  function handlePiezasEsperadasChange(
    idMedicamento: number,
    valor: string,
  ): void {
    setPiezasEsperadas((prev) => ({
      ...prev,
      [idMedicamento]: valor,
    }));
  }

  function handlePiezasRecibidasChange(
    idMedicamento: number,
    valor: string,
  ): void {
    setPiezasRecibidas((prev) => ({
      ...prev,
      [idMedicamento]: valor,
    }));
  }

  const todosCapturados = colectivo.claves.every((detalle) => {
    const esperadasTexto =
      piezasEsperadas[detalle.id_medicamento];

    const recibidasTexto =
      piezasRecibidas[detalle.id_medicamento];

    if (
      esperadasTexto === undefined ||
      esperadasTexto === "" ||
      recibidasTexto === undefined ||
      recibidasTexto === ""
    ) {
      return false;
    }

    const esperadas = Number(esperadasTexto);
    const recibidas = Number(recibidasTexto);

    return (
      Number.isInteger(esperadas) &&
      Number.isInteger(recibidas) &&
      esperadas > 0 &&
      recibidas >= 0
    );
  });

  async function handleGuardar(): Promise<void> {
    if (!auth.user) {
      alert("No se pudo identificar al usuario.");
      return;
    }

    if (!todosCapturados) {
      alert(
        "Captura las piezas esperadas y recibidas de todos los medicamentos.",
      );
      return;
    }

    setGuardando(true);

    try {
      const detalles = colectivo.claves.map((detalle) => {
        const esperadasTexto =
          piezasEsperadas[detalle.id_medicamento];

        const recibidasTexto =
          piezasRecibidas[detalle.id_medicamento];

        if (
          esperadasTexto === undefined ||
          esperadasTexto === ""
        ) {
          throw new Error(
            `Faltan piezas esperadas para el medicamento ${detalle.id_medicamento}`,
          );
        }

        if (
          recibidasTexto === undefined ||
          recibidasTexto === ""
        ) {
          throw new Error(
            `Faltan piezas recibidas para el medicamento ${detalle.id_medicamento}`,
          );
        }

        const esperadas = Number(esperadasTexto);
        const recibidas = Number(recibidasTexto);

        if (!Number.isInteger(esperadas) || esperadas <= 0) {
          throw new Error(
            `Las piezas esperadas del medicamento ${detalle.id_medicamento} deben ser mayores a 0.`,
          );
        }

        if (!Number.isInteger(recibidas) || recibidas < 0) {
          throw new Error(
            `Las piezas recibidas del medicamento ${detalle.id_medicamento} no pueden ser menores a 0.`,
          );
        }

        return {
          id_medicamento: detalle.id_medicamento,
          cantidad: Number(detalle.cantidad ?? 0),
          piezas_esperadas: esperadas,
          piezas_recibidas: recibidas,
        };
      });

      const payload: EntradaRequest = {
        id_cendis: colectivo.id_cendis,
        id_usuario: auth.user.user_id,
        id_colectivo: colectivo.id_colectivo,
        detalles,
      };

      console.log(
        "[ColectivoParaEntrada] payload:",
        JSON.stringify(payload, null, 2),
      );

      await capturarEntrada(payload);

      alert("Entrada capturada correctamente");
      window.location.reload();
    } catch (error) {
      console.error(
        "[ColectivoParaEntrada] error:",
        error,
      );

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Error al capturar entrada.");
      }
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="mb-4 rounded-lg border p-4 shadow">
      <h1>Colectivo de: {colectivo.tipo}</h1>

      <div
        className="flex cursor-pointer items-center justify-between"
        onClick={() => setOpen((prev) => !prev)}
      >
        <div>
          <h3 className="text-lg font-bold">
            {colectivo.folio}
          </h3>

          <p>Fecha: {colectivo.fecha}</p>

          <p>
            Generado por: {colectivo.nombre_usuario}
          </p>
        </div>

        <button
          type="button"
          className="rounded bg-blue-600 px-3 py-1 text-sm text-white"
          onClick={(event) => {
            event.stopPropagation();
            setOpen((prev) => !prev);
          }}
        >
          {open ? "Cerrar" : "Abrir"}
        </button>
      </div>

      {open && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">
                  Clave
                </th>

                <th className="border p-2">
                  Descripción
                </th>

                <th className="border p-2">
                  Cajas solicitadas
                </th>

                <th className="border p-2">
                  Piezas esperadas
                </th>

                <th className="border p-2">
                  Piezas recibidas
                </th>
              </tr>
            </thead>

            <tbody>
              {colectivo.claves.map((detalle) => (
                <tr
                  key={`${colectivo.id_colectivo}-${
                    detalle.id_detalle ??
                    detalle.id_medicamento
                  }`}
                >
                  <td className="border p-2">
                    {detalle.clave}
                  </td>

                  <td className="border p-2">
                    {detalle.descripcion}
                  </td>

                  <td className="border p-2">
                    {detalle.cantidad}
                  </td>

                  <td className="border p-2">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={
                        piezasEsperadas[
                          detalle.id_medicamento
                        ] ?? ""
                      }
                      onChange={(event) => {
                        const valor =
                          event.target.value.replace(
                            /[^0-9]/g,
                            "",
                          );

                        handlePiezasEsperadasChange(
                          detalle.id_medicamento,
                          valor,
                        );
                      }}
                      className="w-full rounded border p-1"
                    />
                  </td>

                  <td className="border p-2">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={
                        piezasRecibidas[
                          detalle.id_medicamento
                        ] ?? ""
                      }
                      onChange={(event) => {
                        const valor =
                          event.target.value.replace(
                            /[^0-9]/g,
                            "",
                          );

                        handlePiezasRecibidasChange(
                          detalle.id_medicamento,
                          valor,
                        );
                      }}
                      className="w-full rounded border p-1"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={handleGuardar}
              disabled={
                guardando || !todosCapturados
              }
              className="rounded bg-green-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {guardando
                ? "Guardando..."
                : "Guardar"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}