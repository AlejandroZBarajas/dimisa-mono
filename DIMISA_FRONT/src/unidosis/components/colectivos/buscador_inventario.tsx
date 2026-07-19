import { useEffect, useState } from "react";
import { useSearchInInventory } from "../../../hooks/useSearchInInventoryHook";
import type { ClaveInventarioEntity } from "../../../entities/clave_inventario_entity";

interface BuscadorInventarioProps {
  cendisId: number;
  itemType: "med" | "mat" | "all"
  onSelect?: (clave: ClaveInventarioEntity) => void;
}

export default function BuscadorInventario({ cendisId, itemType, onSelect }: BuscadorInventarioProps) {
  const [query, setQuery] = useState("");
  const { results, loading, error } = useSearchInInventory(query, cendisId, itemType);

 const placeholder = itemType === "med" 
  ? "Buscar medicamento..." 
  : itemType === "mat" 
    ? "Buscar material de curación..." 
    : "Buscar en inventario..."

  // Limpiar al cambiar tipo
  useEffect(() => {
    setQuery("");
  }, [itemType]);

  const handleSelect = (item: ClaveInventarioEntity) => {
    if (item.cantidad_actual === 0) return;
    onSelect?.(item);
    setQuery("");
  };

  return (
    <div className="relative mb-4 w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {query.length >= 2 && (
        <div className="absolute w-full bg-white border rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg z-10">
          {loading && <p className="p-2 text-gray-500">Buscando...</p>}
          {error && <p className="p-2 text-red-500">{error}</p>}
          {!loading &&
            results
              .filter((clave) => clave.cantidad_actual !== undefined && clave.cantidad_actual > 0)
              .map((clave) => (
                <div
                  key={clave.id_medicamento}
                  onClick={() => handleSelect(clave)}
                  className="p-2 cursor-pointer hover:bg-blue-50"
                >
                  <div className="flex justify-between items-center">
                    <strong>{clave.clave_med}</strong>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium">
                      Stock: {clave.cantidad_actual}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{clave.descripcion}</p>
                </div>
              ))}
        </div>
      )}
    </div>
  );
}