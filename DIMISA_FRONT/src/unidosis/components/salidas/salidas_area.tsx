import type AreaEntity from "../../../entities/area_entity";
import type TipoEntity from "../../../entities/tipo_entity";
import SalidasTipo from "./salidas_tipo";

interface Props{
  area: AreaEntity
  tipos: TipoEntity[]
}

export default function SalidasArea({area, tipos}:Props){
  const authData = JSON.parse(sessionStorage.getItem("auth_data") || "{}");
  const cendis = authData?.user?.cndnm || null;

 // console.log(cendis);

  return (
    <div className="mw-1/4 w-[580px] h-fit max-w-4xl mx-auto p-4 w-1/4 border-2 p-1 m-2 rounded-xl">
      <div className="w-12/12 border-2 bg-azul3 p-1 rounded-xl">
        <h2 className="font-bold text-white text-center text-xl ">{area.nombre_area}</h2>  
      </div>
      
      {tipos.map((tipo) => (
        <SalidasTipo
          key={tipo.id_tipo}
          tipo={tipo.nombre}
          id_tipo={tipo.id_tipo}
          area={area}
          cendis={cendis}
        />
      ))} 
    </div>
  )
}