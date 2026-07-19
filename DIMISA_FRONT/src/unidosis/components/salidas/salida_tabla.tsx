interface ItemLista {
  id_medicamento: number;
  clave: string;
  descripcion: string;
  cantidad: number;
  stock: number;
}

interface Props {
  lista: ItemLista[];
  onCantidadChange: (index: number, cantidad: number) => void;
  onEliminar: (index: number) => void;
  toPrint: () => void;
  isProcessing?: boolean;
}

export default function SalidaTabla({
  lista,
  onCantidadChange,
  onEliminar,
  toPrint,
  isProcessing = false,
}: Props) {
  if (lista.length === 0) return null;

  return (
    <div className="">
      <div id="tabla">
        <table className="w-full mt-6 border-collapse border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-2 py-1 text-left">Clave</th>
              <th className="border border-gray-300 px-2 py-1 text-left">Descripción</th>
              <th className="border border-gray-300 px-2 py-1 text-center">Cantidad (piezas)</th>
              <th className="border border-gray-300 px-2 py-1 text-center">Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {lista.map((item, index) => (
              <tr key={item.id_medicamento} className="hover:bg-gray-50">
                <td className="border border-gray-300 bg-white px-2 py-1">{item.clave}</td>
                <td className="border border-gray-300 bg-white px-2 py-1">{item.descripcion}</td>
                <td className="border border-gray-300 bg-white px-2 py-1 text-center">
                  <input
                    type="number"
                    min={1}
                    max={item.stock}
                    value={item.cantidad}
                    onChange={(e) => {
                      const val = Math.min(Number(e.target.value), item.stock); 
                      if (val < 0) onEliminar(index);
                      else onCantidadChange(index, val);
                    }}
                    disabled={isProcessing}
                    className="w-20 border rounded p-1 text-center disabled:bg-gray-100"
                  />
                </td>
                <td className="border border-gray-300 bg-white px-2 py-1 text-center">
                  <button
                    onClick={() => onEliminar(index)}
                    disabled={isProcessing}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <button
          onClick={toPrint}
          disabled={isProcessing}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Procesando...
            </>
          ) : (
            "Imprimir y cerrar salida"
          )}
        </button>
      </div>
    </div>
  );
}