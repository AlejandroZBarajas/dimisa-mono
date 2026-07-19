import { useState } from "react";

interface Props {
  areaId: number;
  areaName: string;
  onSubmit: (data: {
    id_area: number;
    cama_1: number;
    cama_n?: number;
  }) => void;
  onCancel: () => void;
}

export default function CamaForm({ areaId, areaName, onSubmit, onCancel }: Props) {
  const [cama1, setCama1] = useState<number | "">("");
  const [caman, setCamaN] = useState<number | "">("");
  const [error, setError] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (cama1 === "" || cama1 <= 0) {
      setError("El número de cama inicial debe ser mayor a 0.");
      return;
    }

    if (caman !== "" && caman <= cama1) {
      setError("El número de cama final debe ser mayor que el inicial.");
      return;
    }

    setError("");

    onSubmit({
      id_area: areaId,
      cama_1: Number(cama1),
      cama_n: caman === "" ? undefined : Number(caman),
    });

    setCama1("");
    setCamaN("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 border border-gray-300 rounded-xl p-4 max-w-md bg-white shadow-md"
    >
      <h2 className="text-xl font-semibold text-gray-700">
        Crear camas en: {areaName}
      </h2>

      {/* Cama 1 */}
      <div className="flex flex-col">
        <label className="font-medium text-gray-600">Cama inicial</label>
        <input
          type="number"
          value={cama1}
          onChange={(e) => setCama1(Number(e.target.value))}
          placeholder="Ej. 1"
          className="border rounded-md p-2"
          required
        />
      </div>

      {/* Cama N */}
      <div className="flex flex-col">
        <label className="font-medium text-gray-600">Cama final (opcional)</label>
        <input
          type="number"
          value={caman}
          onChange={(e) =>
            e.target.value === "" ? setCamaN("") : setCamaN(Number(e.target.value))
          }
          placeholder="Ej. 10"
          className="border rounded-md p-2"
        />
      </div>

      {/* Mensaje de error */}
      {error && <p className="text-red-500 font-medium">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-verde1 text-white font-semibold rounded-lg p-2 hover:bg-verde2 transition-colors flex-1"
        >
          Crear camas
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-rojo text-white font-semibold rounded-lg p-2 hover:bg-red-700 transition-colors flex-1"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
