import { BreadcrumbItem, Breadcrumbs } from "@heroui/react";
import { CompanyCreateForm } from "../../components/forms/company-create";
import { useCompanyStore } from "../../stores/companyStore";

export function CompanyInformationsEditPage() {
  const { current_company } = useCompanyStore();

  return (
    <div className="space-y-6 fade-in">
      <Breadcrumbs>
        <BreadcrumbItem href="/company">Dashboard</BreadcrumbItem>

        <BreadcrumbItem>{current_company.name}</BreadcrumbItem>
      </Breadcrumbs>
      <CompanyCreateForm company={current_company} />
    </div>
  );
}
