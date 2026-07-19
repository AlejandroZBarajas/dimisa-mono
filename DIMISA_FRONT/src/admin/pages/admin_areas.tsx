import { useEffect, useState } from "react";
import Header from "../../common/header"
import AdminSubheader from "../components/admin_subheader"
import type AreaEntity from "../../entities/area_entity"
import AreaCard from "../components/areas/area_card"
import AreaForm from "../components/areas/area_form"
import { MdAdd } from "react-icons/md";
import { getAreas, createArea, updateArea, deleteArea } from "../../services/areas_service";

function AdminAreas(){

    const [areas, setAreas] = useState<AreaEntity[]>([])
    const [modalAbierto, setModalAbierto] =useState(false)
    const [areaEditando, setAreaEditando]=useState<AreaEntity | null>(null)

    const fetchAreas = async () => {
        try{
            const data = await getAreas()
            setAreas(data)
        }catch(error){
            console.log("error al cargar areas", error)
        }
    }

    useEffect(() => {
        fetchAreas()
    }, [])

    const handleSave = async (nuevo: AreaEntity) => {
        try{
            if(areaEditando){
                const actualizado = await updateArea(nuevo)
                setAreas(
                    areas.map((a) =>
                    a.id_area === areaEditando.id_area ? actualizado : a
                    )
                )
            }else{
                const creado = await createArea(nuevo)
                setAreas([...areas, creado])
            }
            setModalAbierto(false);
            setAreaEditando(null)

        } catch (error){
            console.log("error al guardar: ", error)
        }
    }

    const handleEdit = (area: AreaEntity) => {
        setAreaEditando (area)
        setModalAbierto(true)
    }

    const handleDelete = async (id: number) => {
        
        try{
            await deleteArea(id)
            setAreas(areas.filter((a) => a.id_area !== id))
        } catch (err){
            console.log("error al eliminar: ",err)
        }
    }
    return(
        <div className="relative">
            <Header/>
            <AdminSubheader></AdminSubheader>
            
            <div>
                <h2 className="text-verde1 font-black text-4xl ">Areas</h2>
                
            
                <button
                    onClick={() => {
                    setAreaEditando(null);
                    setModalAbierto(true);
                    }}
                    className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg"
                >
                    <MdAdd size={28} />
                </button>
            </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {areas.map((a) => (
                    <AreaCard
                        key={a.id_area  /* areaEditando?.id_area */}
                        area={a}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                    ))}
                </div>

                {modalAbierto && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                        <AreaForm
                        area={areaEditando}
                        onSave={handleSave}
                        onCancel={() => setModalAbierto(false)}
                        />
                    </div>
                    </div>
                )}

        </div>
    )
}
export default AdminAreas
