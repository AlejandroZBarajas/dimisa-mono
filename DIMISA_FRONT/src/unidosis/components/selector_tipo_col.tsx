import { useState, useEffect } from "react";
import type TipoEntity from "../../entities/tipo_entity";
import { getTipos } from "../../services/tipo_col_sal";

interface SelectorTipoProps {
  value: number | undefined;
  onChange: (tipoId: number) => void;
  label?: string;
  required?: boolean;
}

export default function SelectorTipo({ 
  value, 
  onChange, 
  label = "Tipo",
  required = true 
}: SelectorTipoProps) {
  const [tipos, setTipos] = useState<TipoEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTipos = async () => {
      try {
        setLoading(true);
        const data = await getTipos();
        setTipos(data);
      } catch (err) {
        setError("Error al cargar los tipos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTipos();
  }, []);

  if (loading) return <div>Cargando tipos...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="form-group flex flex-col  p-1 m-1">
      {label && <label htmlFor="tipo-select">{label}</label>}
      <select className="border-[1px] rounded-3xl p-1 w-12/12"
        id="tipo-select"
        value={value || " "}
        onChange={(e) => onChange(Number(e.target.value))}
        required={required}
      >
        <option value="">Seleccionar tipo</option>
        {tipos.map((tipo) => (
          <option key={tipo.id_tipo} value={tipo.id_tipo}>
            {tipo.nombre}
          </option>
        ))}
      </select>
    </div>
  );
}