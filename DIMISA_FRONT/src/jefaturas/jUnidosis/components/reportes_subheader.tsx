import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../common/auth/auth_context"

export default function ReportesSubheader(){

    const {auth} = useAuth()

    const rol=auth.user?.rol
    
    const navigate =useNavigate()
    
    function toReportes(){
        navigate("/reportes")
    }
    function toCPM(){
        navigate("/cpm")
    }

    function toUsers(){
        navigate("/coord_users")
    }


    return(
        <div className="w-full bg-verde2 h-[60px] flex justify-evenly items-center">
            <h2 className="text-bold text-white text-2xl" onClick={toCPM}>CPM</h2>
            <h2 className="text-bold text-white text-2xl" onClick={toReportes}>Reportes</h2>
            {rol === 7 && (
                <h2 className="text-bold text-white text-2xl" onClick={toUsers}>
                    Usuarios
                </h2>
            )}

        </div>
    )
}
