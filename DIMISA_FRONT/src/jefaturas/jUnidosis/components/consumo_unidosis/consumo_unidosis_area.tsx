import type { ConsumoAreaResponse } from "../../../../entities/consumo_unidosis_entity";
import { ConsumoUnidosisTable } from "./consumo_unidosis_table";

export default function ConsumoArea({
  data,
}: {
  data: ConsumoAreaResponse;
}) {
  return (
    <div className="space-y-10">
      {data.areas.map((area) => (
        <section key={area.area_id}>
          <h2 className="text-xl font-semibold mb-4">
            {area.area}
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-3">
                Medicamentos
              </h3>

              <ConsumoUnidosisTable
                data={area.medicamentos}
              />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">
                Material
              </h3>

              <ConsumoUnidosisTable
                data={area.material}
              />
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}