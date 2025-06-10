import { DashboardStats } from "../../components/dashboard/dashboard-stats";
import { useCompanyStore } from "../../stores/companyStore";

export function HomeCompany() {
  const { current_company } = useCompanyStore();
    const id = current_company.id;
  return (
    <div>
      <DashboardStats company_id={id} />
    </div>
  );
}
