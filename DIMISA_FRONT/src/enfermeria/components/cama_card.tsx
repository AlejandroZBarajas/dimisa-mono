import type CamaEntity from "../../entities/cama_entity";
import {setCamaFree } from "../../services/camas_service"

interface Props {
  cama: CamaEntity
  onEdit: () => void
  onRefresh: () => void
}

const getRiskColor = (risk: string | null | undefined) => {
  switch (risk) {
    case "Bajo": return "#1EFF00";
    case "Medio": return "#FFF600";
    case "Alto": return "#FF0000";
    default: return "#CCCCCC";
  }
};

export default function CamaCard({ cama, onEdit, onRefresh }: Props) {

  const liberarCama = async () => {
  await setCamaFree(cama.id_cama!);
  onRefresh();
};

  const color = cama.occupied ? "#AFD8FF" : "#1EFF00";
  const caida = getRiskColor(cama.riesgo_caida);
  const ulcera = getRiskColor(cama.riesgo_ulcera);

  return (
    <div
      className="flex flex-col justify-between border-solid rounded-xl border-2 border-azul4 p-1 w-[250px]"
      style={{ width: "250px", backgroundColor: color }}
    >
      <div className="flex w-full justify-center text-center rounded-[5px]">
        <h3 className="w-1/2  font-bold text-6xl">
          {cama.numero_cama}
        </h3>
        <div className="flex flex-col  w-1/2 justify-evenly items-center">
          <div
            className="border-2 w-5/6 h-1/3 font-bold text-[10px] m-2 text-center"
            style={{ backgroundColor: caida }}
          >
            Caída
          </div>
          <div
            className="border-2 w-5/6 h-1/3 font-bold text-[10px] m-2 text-center"
            style={{ backgroundColor: ulcera }}
          >
            Úlcera p/p
          </div>
        </div>
      </div>
    <div className="w-full h-[2px] border-2 border-solid border-black"></div>
    <h2 className="font-bold" >Nombres</h2>
      <h3>{cama.nombres}</h3>
      <h2 className="font-bold">Apellido 1</h2>
      <h3>{cama.apellido1}</h3>
      <h2 className="font-bold">Apellido 2</h2>
      <h3>{cama.apellido2}</h3>
      <h2 className="font-bold">Fecha nac.</h2>
      <h3>{cama.fecha_nac}</h3>
      <h2 className="font-bold">Expediente</h2>
      <h3>{cama.expediente}</h3>

 {cama.occupied ? (
        <div className="flex w-full gap-2 mt-2">
          <button
            className="text-white rounded font-bold text-xl w-1/2 bg-azul3"
            onClick={onEdit}
          >
            Editar
          </button>

          <button
            className="text-white rounded font-bold text-xl w-1/2 bg-red-600"
            onClick={liberarCama}
          >
            Liberar
          </button>
        </div>
      ) : (
        <button
          className="text-white rounded font-bold text-3xl w-full bg-azul3 mt-2"
          onClick={onEdit}
        >
          Ocupar cama
        </button>
      )}
    </div>
  );
}