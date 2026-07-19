import { useNavigate } from "react-router-dom";
function EnfermeriaSubheader(){
    const navigate =useNavigate()
    
     function toCamas(){
        navigate("/enfermeria/camas")
    }
     function toSolicitud(){
        navigate("/enfermeria/solicitar")
    }
    return(
        <div className="w-full bg-verde2 h-[60px] flex justify-evenly items-center">
            <h2 className="text-bold text-white text-2xl" onClick={toCamas}>Camas</h2>
            <h2 className="text-bold text-white text-2xl" onClick={toSolicitud}>Solicitar medicamentos</h2>

        </div>
    )
}

export default EnfermeriaSubheader