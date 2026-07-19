import { useState } from "react";
import { useAuth } from "../../../common/auth/auth_context";
import SalidaTabla from "./salida_tabla";
import type AreaEntity from "../../../entities/area_entity";
import { createSalida, cerrarSalida } from "../../../services/salidas_service";
import { TemplateSalida } from "../../../imprimir/template_salida";
import { PrintColSal } from "../../../imprimir/printer";
import type SalidaEntity from "../../../entities/salida_entity";
import BuscadorInventario from "../colectivos/buscador_inventario";
import type { ClaveInventarioEntity } from "../../../entities/clave_inventario_entity";
import { toItemType } from "../../../common/to_item_type";

interface ItemLista {
  id_medicamento: number;
  clave: string;
  descripcion: string;
  cantidad: number;
  stock: number;
}

interface Props {
  area: AreaEntity;
  cendis: string;
  tipo: string;
  id_tipo: number;
}

export default function SalidasTipo({ area, cendis, tipo, id_tipo }: Props) {
  const {auth} = useAuth()
  const [lista, setLista] = useState<ItemLista[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSelectMedicamento = (clave: ClaveInventarioEntity) => {
    const yaExiste = lista.some(
      (item) => item.id_medicamento === clave.id_medicamento
    );

    if (yaExiste) {
      alert("Este medicamento ya está en la lista");
      return;
    }

    const nuevoItem: ItemLista = {
      id_medicamento: clave.id_medicamento,
      clave: clave.clave_med,
      descripcion: clave.descripcion,
      cantidad: 1,
      stock: clave.cantidad_actual || 1
    };

    setLista((prevLista) => [nuevoItem, ...prevLista]);
  };

  const handleCantidadChange = (index: number, cantidad: number) => {
    const nuevaLista = [...lista];
    nuevaLista[index].cantidad = cantidad;
    setLista(nuevaLista);
  };

  const handleEliminar = (index: number) => {
    const nuevaLista = lista.filter((_, i) => i !== index);
    setLista(nuevaLista);
  };

  const handlePrint = async () => {
    if (lista.length === 0) {
      alert("Debes agregar al menos un medicamento antes de imprimir");
      return;
    }

    if (!window.confirm("¿Estás seguro de imprimir y cerrar esta salida? Esta acción no se puede deshacer.")) {
      return;
    }

    setIsProcessing(true);

    try {
      const id_cendis = auth.user?.cnd! 
      const id_usuario = auth.user?.user_id!
      
      const claves = lista.map(item => ({
        id_medicamento: item.id_medicamento,
        cantidad: item.cantidad
      }));

      const salidaData: SalidaEntity = {
        id_cendis,
        id_area: area.id_area!,
        id_usuario,
        tipo_id: id_tipo!,
        fecha: new Date().toISOString().split('T')[0],
        claves,
        editable: 1,
        pendiente: 1,
      };


      const response = await createSalida(salidaData);
      const idSalidaCreada = response.id_salida;

      const folio = `SAL-${idSalidaCreada.toString().padStart(4, '0')}`;

      // 5. Preparar datos para el template
      const templateData = {
        encabezado: "Salida",
        tipo_nombre: tipo,
        usuario_nombre: sessionStorage.getItem("auth_data") ? JSON.parse(sessionStorage.getItem("auth_data")!).user.nombre_usuario : "",
        folio: folio,
        fecha: new Date().toLocaleDateString('es-MX', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        cendis_nombre: cendis,
        area_nombre: area.nombre_area,
        lista: lista.map(item => ({
          clave: item.clave,
          descripcion: item.descripcion,
          cantidad: item.cantidad
        }))
      };

      const html = TemplateSalida(templateData);

      PrintColSal(html);

    console.log("antes de cerrarSalida, id:", idSalidaCreada)
    await cerrarSalida(idSalidaCreada);
    console.log("después de cerrarSalida")

      console.log("cerrarSalida completado") 

      setLista([]);
      setIsExpanded(false);

      alert("Salida impresa y cerrada exitosamente");

    } catch (error) {
      console.error("Error en el proceso:", error);
      alert(`Error al procesar la salida: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const bgColor = lista.length > 0 ? "bg-green-100" : "bg-gray-200";
  const borderColor = lista.length > 0 ? "border-green-500" : "border-verde1";

  return (
    <div className={`p-2 rounded-xl m-2 border-2 ${borderColor} ${bgColor}`}>
      {/* Header clickeable para expandir/colapsar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between cursor-pointer hover:bg-opacity-80 transition-colors p-2 rounded"
      >
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-l">{tipo}</h3>
          {lista.length > 0 && (
            <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
              {lista.length} item{lista.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        
        {/* Indicador visual de expandido/colapsado */}
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${
            isExpanded ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {/* Contenido expandible */}
      {isExpanded && (
        <div className="mt-3">
          <BuscadorInventario 
            cendisId={auth.user?.cnd!} 
            onSelect={handleSelectMedicamento} 
            itemType={toItemType(id_tipo)}
          />
          
          <SalidaTabla
            lista={lista}
            onCantidadChange={handleCantidadChange}
            onEliminar={handleEliminar}
            toPrint={handlePrint}
            isProcessing={isProcessing}
          />
        </div>
      )}
    </div>
  );
}