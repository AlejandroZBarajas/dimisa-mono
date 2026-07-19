import { useNavigate } from "react-router-dom";
function UnidosisSubheader(){
    
    const navigate =useNavigate()
    
    function toColectivos(){
        navigate("/unidosis/colectivos")
    }
    function toEntradas(){
        navigate("/unidosis/entradas")
    }

    function toSalidas(){
        navigate("/unidosis/salidas")
    }
    function toStock(){
        navigate("/unidosis/stock")
    }
    return(
        <div className="w-full bg-verde2 h-[60px] flex justify-evenly items-center">
            <h2 className="text-bold text-white text-2xl" onClick={toColectivos}>Colectivos</h2>
            <h2 className="text-bold text-white text-2xl" onClick={toEntradas}>Entradas</h2>
            <h2 className="text-bold text-white text-2xl" onClick={toSalidas} >Salidas</h2>
            <h2 className="text-bold text-white text-2xl" onClick={toStock} >Inventario</h2>

        </div>
    )
}

export default UnidosisSubheader 