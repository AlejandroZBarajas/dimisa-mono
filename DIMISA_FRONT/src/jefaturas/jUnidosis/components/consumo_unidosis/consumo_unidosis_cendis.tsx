import type { ConsumoCendisResponse } from "../../../../entities/consumo_unidosis_entity";
import { ConsumoUnidosisTable } from "./consumo_unidosis_table";

export default function ConsumoCendis({
  data,
}: {
  data: ConsumoCendisResponse;
}) {
  return (
    <div className="space-y-10">
      {data.cendis.map((cendis) => (
        <section key={cendis.cendis_id}>
          <h2 className="text-xl font-semibold mb-4">
            {cendis.cendis}
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-3">
                Medicamentos
              </h3>

              <ConsumoUnidosisTable
                data={cendis.medicamentos}
              />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">
                Material
              </h3>

              <ConsumoUnidosisTable
                data={cendis.material}
              />
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}