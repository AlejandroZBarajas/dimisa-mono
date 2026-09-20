import type { ConsumoUnidosisEntity } from "../../../../entities/consumo_unidosis_entity";
import { ConsumoUnidosisTable } from "./consumo_unidosis_table";

export default function ConsumoGlobal({
  data,
}: {
  data: ConsumoUnidosisEntity;
}) {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-lg font-semibold mb-4">
          Medicamentos
        </h2>

        <ConsumoUnidosisTable data={data.medicamentos} />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">
          Material
        </h2>

        <ConsumoUnidosisTable data={data.material} />
      </section>
    </div>
  );
}