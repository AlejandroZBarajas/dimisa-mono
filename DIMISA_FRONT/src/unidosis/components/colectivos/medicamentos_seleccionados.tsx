import type { ClaveEntity } from "../../../entities/clave_entity";

interface MedicamentoSeleccionadoProps {
  medicamento: ClaveEntity;
  cantidad: number;
  onCantidadChange: (cantidad: number) => void;
  onAdd: () => void;
}

export default function MedicamentoSeleccionado({
  medicamento,
  cantidad,
  onCantidadChange,
  onAdd,
}: MedicamentoSeleccionadoProps) {
  return (
    <div className="mt-4 p-3 border rounded-lg bg-gray-50">
      <p>
        <strong>Seleccionado:</strong> {medicamento.clave_med} — {medicamento.descripcion}
      </p>

      <div className="flex items-center gap-3 mt-2">
        <input
          type="number"
          min={1}
          value={cantidad}
          onChange={(e) => onCantidadChange(Number(e.target.value))}
          className="w-24 border rounded-lg p-1"
        />
        <button
          onClick={onAdd}
          className="bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700 transition"
        >
          Añadir
        </button>
      </div>
    </div>
  );
}