import Header from "../../common/header";
import CapturadorEntradas from "../components/capturador_entradas";
import UnidosisSubheader from "../components/unidosis_subheader";

function UnidosisEntradas(){

    return(
        <div>
            <Header></Header>
            
            <UnidosisSubheader></UnidosisSubheader>
            <CapturadorEntradas></CapturadorEntradas>
        </div>
    )
}
export default UnidosisEntradas