import Header from "../../common/header";
import UnidosisSubheader from "../components/unidosis_subheader";
import EntradaManualInventario from "../components/entrada_manual_inventario";
import TablaInventario from "../inventario/tabla_inventario";
import { useAuth } from "../../common/auth/auth_context";
import BuscadorInventario from "../components/colectivos/buscador_inventario";

function UnidosisStock(){

    const { auth } = useAuth();
    
    const id_cendis = auth.user?.cnd
    //console.log("CENDIS DEL USUARIO:", id_cendis)

    return(
        <div>
            <Header></Header>
            
            <UnidosisSubheader></UnidosisSubheader>
            <div className="flex">
                <div className="w-2/3 p-10">
                    <BuscadorInventario cendisId={auth.user?.cnd!} itemType="all"></BuscadorInventario>

                    <TablaInventario idCendis={id_cendis!}></TablaInventario>
                </div>
                <div className="w-1/3">
                    <EntradaManualInventario></EntradaManualInventario>
                </div>
            </div>
        </div>
    )
}
export default UnidosisStock