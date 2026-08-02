import { useState, useEffect } from "react";
import { useAuth } from "../../../../common/auth/auth_context";
import type { ColectivoDTO } from "../../../../entities/colectivo_DTO";
import ColectivoMaker from "../colectivo_maker";
import { getColectivosEditablesByCendis } from "../../../../services/colectivos_service";
import ColectivoCard from "../colectivo_card";


export default function TabNuevoColectivo(){

  const {auth} = useAuth()
  const [colectivos, setColectivos] = useState<ColectivoDTO[]>([]);

  const id_cendis = auth.user?.cnd!

  const fetchColectivos = async () => {
    try {
      const res = await getColectivosEditablesByCendis(id_cendis); 
      setColectivos(res ?? []);
    } catch (err) {
      console.error("Error cargando colectivos:", err);
    } 
  }
  
  useEffect(() => {
     fetchColectivos();
   }, []);
  
    return(
        <div className="flex flex-row items-start p-4 m-4 w-full">
 
              <ColectivoMaker
                colectivosExistentes={colectivos}
                onColectivoCreado={fetchColectivos}
              />
              <div className="flex flex-col w-6/12">

              {
                  colectivos.map((c) => (
                  <ColectivoCard
                      key={c.id_colectivo} 
                      colectivo={c} 
                      onColectivoImpreso={fetchColectivos}
                  />
                  ))
              }
              </div>
            </div>


    )
}