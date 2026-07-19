import type { ClaveEntity } from "../../entities/clave_entity";
import { useState } from "react";
import MedicamentoSeleccionado from "./colectivos/medicamentos_seleccionados";
import { useAuth } from "../../common/auth/auth_context";
import { cargarAInventario } from "../../services/entradas_service";
import BuscadorItems from "./colectivos/buscador_items";

type ItemLista = {
  id_medicamento: number;
  clave: string;
  descripcion: string;
  cantidad: number;
};

export default function EntradaManualInventario() {
  const { auth } = useAuth();
  const [selected, setSelected] = useState<ClaveEntity | null>(null);
  const [cantidad, setCantidad] = useState<number>(1);
  const [lista, setLista] = useState<ItemLista[]>([]);
  const [cargando, setCargando] = useState(false);

  const handleSelect = (item: ClaveEntity) => setSelected(item);

  const handleAdd = () => {
    if (!selected) return;
    if (cantidad <= 0) return alert("La cantidad debe ser mayor a 0");

    const id = Number(selected.id_medicamento);

    setLista((prev) => {
      const existe = prev.find((item) => item.id_medicamento === id);
      if (existe) {
        return prev.map((item) =>
          item.id_medicamento === id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      }
      return [
        ...prev,
        {
          id_medicamento: id,
          clave: selected.clave_med,
          descripcion: selected.descripcion,
          cantidad,
        },
      ];
    });

    setSelected(null);
    setCantidad(1);
  };

  const handleEliminar = (id: number) => {
    setLista((prev) => prev.filter((item) => item.id_medicamento !== id));
  };

  const handleCantidadChange = (id: number, nuevaCantidad: number) => {
    setLista((prev) =>
      prev.map((item) =>
        item.id_medicamento === id ? { ...item, cantidad: nuevaCantidad } : item
      )
    );
  };

 const handleCargarInventario = async () => {
  if (!auth.user?.cnd) return alert("No se pudo obtener el cendis del usuario");
  if (lista.length === 0) return alert("La lista está vacía");

  setCargando(true);
  try {
    await cargarAInventario({
      id_cendis: auth.user.cnd,  // ✅
      id_usuario: auth.user.user_id, // ✅
      detalles: lista.map(({ id_medicamento, cantidad }) => ({
        id_medicamento,
        cantidad,
      })),
    });
    alert("Inventario cargado correctamente");
    setLista([]);
  } catch {
    alert("Error al cargar el inventario");
  } finally {
    setCargando(false);
  }
};
  return (
    <div className="flex flex-col gap-4 mx-auto p-4">
      <div>
        <h1 className="font-bold text-xl text-red-500">Cargar por Piezas</h1>
        <BuscadorItems onSelect={handleSelect} itemType="all"/>

        {selected && (
          <MedicamentoSeleccionado
            medicamento={selected}
            cantidad={cantidad}
            onCantidadChange={setCantidad}
            onAdd={handleAdd}
          />
        )}
      </div>

      {lista.length > 0 && (
        <>
          <div className="border border-gray-300 rounded max-h-80 overflow-y-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="border border-gray-300 px-2 py-1 text-left">Clave</th>
                  <th className="border border-gray-300 px-2 py-1 text-left">Descripción</th>
                  <th className="border border-gray-300 px-2 py-1 text-center">Cantidad</th>
                  <th className="border border-gray-300 px-2 py-1 text-center">Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {lista.map((item) => (
                  <tr key={item.id_medicamento} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-2 py-1">{item.clave}</td>
                    <td className="border border-gray-300 px-2 py-1">{item.descripcion}</td>
                    <td className="border border-gray-300 px-2 py-1 text-center">
                      <input
                        type="number"
                        min={0}
                        value={item.cantidad}
                        onChange={(e) => {
                          const nuevaCantidad = Number(e.target.value);
                          if (nuevaCantidad <= 0) {
                            handleEliminar(item.id_medicamento);
                          } else {
                            handleCantidadChange(item.id_medicamento, nuevaCantidad);
                          }
                        }}
                        className="w-20 border rounded p-1 text-center"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-center">
                      <button
                        onClick={() => handleEliminar(item.id_medicamento)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Botón de carga */}
          <button
            onClick={handleCargarInventario}
            disabled={cargando}
            className="bg-green-600 text-white font-semibold px-6 py-2 rounded hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed self-end"
          >
            {cargando ? "Cargando..." : `Cargar inventario (${lista.length} medicamentos)`}
          </button>
        </>
      )}
    </div>
  );
}