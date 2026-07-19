import Header from "../../../common/header";
import CpmTable from "../components/cpm_table";
import ReportesSubheader from "../components/reportes_subheader";

export default function CPM() {
  return (
    <div>
      <Header />
      <ReportesSubheader />
      <div className="p-6">

        <CpmTable />
      </div>
    </div>
  );
}