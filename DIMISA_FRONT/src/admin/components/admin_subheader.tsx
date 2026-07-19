import { useNavigate } from "react-router-dom";
function AdminSubheader(){
    const navigate =useNavigate()

    function toUsers(){
        navigate("/admin/users")
    }

    function toAreas(){
        navigate("/admin/areas")
    }

     function toCendis(){
        navigate("/admin/cendis")
    }
     function toCamas(){
        navigate("/admin/camas")
    }
     function toClaves(){
        navigate("/admin/claves")
    }
    return(
        <div className="w-full bg-verde2 h-[60px] flex justify-evenly items-center">
            <h2 className="text-bold text-white text-2xl" onClick={toUsers}>Usuarios</h2>
            <h2 className="text-bold text-white text-2xl" onClick={toAreas}>Areas</h2>
            <h2 className="text-bold text-white text-2xl" onClick={toCendis}>Cendis</h2>
            <h2 className="text-bold text-white text-2xl" onClick={toCamas}>Camas</h2>
            <h2 className="text-bold text-white text-2xl" onClick={toClaves}>Claves</h2>
        </div>
    )
}

export default AdminSubheader