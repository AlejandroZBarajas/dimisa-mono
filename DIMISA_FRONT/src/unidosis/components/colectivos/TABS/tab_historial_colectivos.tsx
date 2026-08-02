import { useState } from "react";
import type { FormEvent } from "react";
import ColectivoCard from "../colectivo_card";
import { getColectivoById } from "../../../../services/colectivos_service";
import type { ColectivoDTO } from "../../../../entities/colectivo_DTO";

export default function TabHistorialColectivos() {
  const [idColectivo, setIdColectivo] = useState("");
  const [colectivo, setColectivo] = useState<ColectivoDTO | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleBuscar(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    const id = Number(idColectivo);

    if (!Number.isInteger(id) || id <= 0) {
      setError("Ingresa un ID de colectivo válido.");
      setColectivo(null);
      return;
    }

    setCargando(true);
    setError(null);
    setColectivo(null);

    try {
      const colectivoObtenido = await getColectivoById(id);
      setColectivo(colectivoObtenido);
    } catch (error) {
      console.error(
        "[TabHistorialColectivos] Error al buscar colectivo:",
        error,
      );

      setError("No se pudo obtener el colectivo solicitado.");
    } finally {
      setCargando(false);
    }
  }

  function handleIdChange(valor: string): void {
    const valorNumerico = valor.replace(/[^0-9]/g, "");

    setIdColectivo(valorNumerico);

    if (error) {
      setError(null);
    }
  }

  return (
    <div className="flex w-full flex-col items-center">
      <h2 className="mb-4 text-2xl font-bold">
        Historial de Colectivos
      </h2>

      <form
        onSubmit={handleBuscar}
        className="mb-6 flex w-full max-w-md gap-2 items-center"
      >
        <h1 className="text-xl">F-</h1>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={idColectivo}
          onChange={(event) =>
            handleIdChange(event.target.value)
          }
          placeholder="Folio del colectivo"
          className="w-full rounded border px-3 py-2"
        />

        <button
          type="submit"
          disabled={cargando || idColectivo === ""}
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {cargando ? "Buscando..." : "Buscar"}
        </button>
      </form>

      {error && (
        <p className="mb-4 text-sm text-red-600">
          {error}
        </p>
      )}

      {!cargando && !error && !colectivo && (
        <p className="text-gray-600">
          Ingresa el folio del colectivo
        </p>
      )}

      {colectivo && (
        <ColectivoCard colectivo={colectivo} />
      )}
    </div>
  );
}