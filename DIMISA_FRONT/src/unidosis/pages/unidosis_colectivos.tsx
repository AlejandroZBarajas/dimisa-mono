import { useState, useEffect } from "react";
import { useAuth } from "../../common/auth/auth_context";
import type { ColectivoDTO } from "../../entities/colectivo_DTO";
import Header from "../../common/header";
import UnidosisSubheader from "../components/unidosis_subheader";

import ColectivoMaker from "../components/colectivos/colectivo_maker";
import { getColectivosEditablesByCendis } from "../../services/colectivos_service";
import ColectivoCard from "../components/colectivos/colectivo_card";

export default function UnidosisColectivos(){
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
        <div className="flex flex-col items-center">
            <Header></Header>
            <UnidosisSubheader></UnidosisSubheader>
            <div className="flex flex-row w-12/12 justify-center">
              <ColectivoMaker
                colectivosExistentes={colectivos}
                onColectivoCreado={fetchColectivos}
              />
              <div className="flex flex-col p-4 w-7/12 ">

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

        </div>
    )
}