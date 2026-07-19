import { useNavigate } from "react-router-dom";

export default function ReportesSubheader(){
    
    const navigate =useNavigate()
    
    function toReportes(){
        navigate("/reportes")
    }
    function toCPM(){
        navigate("/cpm")
    }


    return(
        <div className="w-full bg-verde2 h-[60px] flex justify-evenly items-center">
            <h2 className="text-bold text-white text-2xl" onClick={toCPM}>CPM</h2>
            <h2 className="text-bold text-white text-2xl" onClick={toReportes}>Reportes</h2>

        </div>
    )
}
