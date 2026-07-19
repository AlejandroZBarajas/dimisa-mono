import { useState } from "react";
import { useAuth } from "../../../common/auth/auth_context";
import type { ClaveEntity } from "../../../entities/clave_entity";
import { createColectivo, addToColectivo } from "../../../services/colectivos_service";
import SelectorTipo from "../selector_tipo_col";
import BuscadorItems from "./buscador_items";
import MedicamentoSeleccionado from "./medicamentos_seleccionados";
import type { ColectivoDTO } from "../../../entities/colectivo_DTO";
import { toItemType } from "../../../common/to_item_type";

interface ColectivoMakerProps{
  colectivosExistentes: ColectivoDTO[]
  onColectivoCreado: () => void
}

interface ItemLista {
  id_medicamento: number;
  clave: string;
  descripcion: string;
  cantidad: number;
}

interface ColectivosPorTipo {
  [tipo_id: number]: ItemLista[];
}

export default function ColectivoMaker({colectivosExistentes, onColectivoCreado}: ColectivoMakerProps) {
  const {auth} = useAuth()
  const [selected, setSelected] = useState<ClaveEntity | null>(null);
  const [cantidad, setCantidad] = useState<number>(1);
  
  const [tipoSeleccionado, setTipoSeleccionado] = useState<number>();
  const [colectivosPorTipo, setColectivosPorTipo] = useState<ColectivosPorTipo>({
    1: [], // Medicamentos
    3: [], // Material de Curación
  });

  const handleSelect = (item: ClaveEntity) => {
    setSelected(item);
  };

 const handleAdd = () => {
  if (!selected || !tipoSeleccionado) return;
  if (cantidad <= 0) return alert("La cantidad debe ser mayor a 0");

  const nuevoItem = {
    id_medicamento: Number(selected.id_medicamento),
    clave: selected.clave_med,
    descripcion: selected.descripcion,
    cantidad,
  };

  setColectivosPorTipo((prev) => {
    const listaActual = prev[tipoSeleccionado];

    const yaExiste = listaActual.some(
      (item) => item.id_medicamento === nuevoItem.id_medicamento
    );

    if (yaExiste) {
      alert("Este medicamento ya fue agregado");
      return prev;
    }

    return {
      ...prev,
      [tipoSeleccionado]: [nuevoItem, ...listaActual],
    };
  });

  setSelected(null);
  setCantidad(1);
};

  const handleCantidadChange = (tipo_id: number, index: number, nuevaCantidad: number) => {
    setColectivosPorTipo((prev) => {
      const lista = [...prev[tipo_id]];
      lista[index].cantidad = nuevaCantidad;
      return { ...prev, [tipo_id]: lista };
    });
  };

  const handleEliminar = (tipo_id: number, index: number) => {
    setColectivosPorTipo((prev) => ({
      ...prev,
      [tipo_id]: prev[tipo_id].filter((_, i) => i !== index),
    }));
  };

  const handleCreateColectivo = async (tipo_id: number) => {
    const lista = colectivosPorTipo[tipo_id];

    if (lista.length === 0) {
      alert("Agrega al menos un artículo antes de generar el colectivo");
      return;
    }

    const user_id = auth.user?.user_id!
    const id_cendis = auth.user?.cnd!

    if (!user_id) {
      alert("No se encontró el usuario en sesión");
      return;
    }

    try{
      const existeColectivoAbierto = colectivosExistentes.some(
        col => col.tipo_id === tipo_id
      )

      const detalles = lista.map((item) => ({
        id_medicamento: item.id_medicamento,
        cantidad : item.cantidad
      }))

      if(existeColectivoAbierto){
  
        try {
          const resultado = await addToColectivo(id_cendis, tipo_id, detalles);
          console.log(resultado)
          alert("Artículos agregados al colectivo existente");
        } catch (error) {
          console.error("Error específico al agregar:", error);
          throw error;
        }
      } else {
        const colectivo = {
          tipo_id,
          fecha: new Date().toISOString().split("T")[0],
          id_user: Number(user_id),
          id_cendis: Number(id_cendis),
          claves: detalles,
        };
        await createColectivo(colectivo);
        alert("Colectivo creado exitosamente");
      }

      setColectivosPorTipo((prev) => ({
        ...prev,
        [tipo_id]: [],
      }));
      onColectivoCreado();
      
    } catch (err) {
      console.error("Error:", err);
      alert("Ocurrió un error al procesar el colectivo")
      }
    }

  return (
    <div className="w-5/12 p-4">
      <h2 className="text-xl font-semibold mb-4">Crear Colectivo</h2>

      <SelectorTipo
        value={tipoSeleccionado}
        onChange={setTipoSeleccionado}
        label="Tipo de Colectivo"
      />

      <BuscadorItems 
        itemType={toItemType(tipoSeleccionado ?? 1)} 
        onSelect={handleSelect} 
        disabled={!tipoSeleccionado}
      />

      {selected && tipoSeleccionado && (
        <MedicamentoSeleccionado
          medicamento={selected}
          cantidad={cantidad}
          onCantidadChange={setCantidad}
          onAdd={handleAdd}
        />
      )}

      <div className="mt-6 space-y-4">
        {Object.entries(colectivosPorTipo).map(([tipo_id, lista]) => {
          if (lista.length === 0) return null;

          const tipoNombres: { [key: string]: string } = {
            "1": "Medicamentos",
            "2": "Soluciones",
            "3": "Material de Curación",
          };

          return (
            <div key={tipo_id} className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-semibold mb-3">Colectivo de : {tipoNombres[tipo_id]}</h3>
              
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-2 py-1 text-left">Clave</th>
                    <th className="border border-gray-300 px-2 py-1 text-left">Descripción</th>
                    <th className="border border-gray-300 px-2 py-1 text-center">Cantidad</th>
                    <th className="border border-gray-300 px-2 py-1 text-center">Eliminar</th>
                  </tr>
                </thead>
                <tbody>
                {lista.map((item: ItemLista, index: number) => (
                    <tr key={index} className="hover:bg-gray-50">
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
                              handleEliminar(Number(tipo_id), index);
                            } else {
                              handleCantidadChange(Number(tipo_id), index, nuevaCantidad);
                            }
                          }}
                          className="w-20 border rounded p-1 text-center"
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-center">
                        <button
                          onClick={() => handleEliminar(Number(tipo_id), index)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button
                onClick={() => handleCreateColectivo(Number(tipo_id))}
                className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition w-full"
              >
                Generar Colectivo de {tipoNombres[tipo_id]}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
} 