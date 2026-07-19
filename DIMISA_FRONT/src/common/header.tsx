import { useNavigate } from "react-router-dom"
import { useAuth } from "./auth/auth_context"
import logo from './../assets/LOGO.png'

export default function Header(){
    const {auth, logout} = useAuth()

    const rol = auth.user?.rol
    const name = auth.user?.nombre_usuario
    const navigate =useNavigate()

    function byebye(){
        logout()
        navigate("/")
    } 


    return(
        <div id="header" className="w-full flex flex-row justify-evenly bg-verde1 h-[130px] w-full items-center"> 
            <div className="w-3/12 flex items-center justify-evenly">
                <img className="pt-2 pb-2" src={logo} alt="" />
            </div>
            <div className="w-6/12 b-2 b-white">
                <h1 className='text-center text-white font-bold text-3xl'>Sistema DIMISA <br/>Dosis, Insumos, Medicamentos, Inventario,<br/>Seguimiento, Administración</h1>
            </div> 


            <div className="w-3/12 flex justify-end flex-col items-end">
            {
                rol!==undefined &&(
                    <h4 className='text-white p-4'>Bienvenido, {name}</h4>
                )
            }
            {
                rol!==undefined &&( 
                    <h4 className='text-white p-4' onClick={byebye}>Cerrar sesión</h4>
                )
            }
            </div>            
        </div>
    )
}