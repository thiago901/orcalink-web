import { BreadcrumbItem, Breadcrumbs } from "@heroui/react";
import { CompanyCreateForm } from "../../components/forms/company-create";
import { useCompanyStore } from "../../stores/companyStore";

export function CompanyInformationsCreatePage() {
  const {companies} = useCompanyStore()
  return (
    <div className="space-y-6 fade-in">
      <Breadcrumbs>
        {companies.length? <BreadcrumbItem href="/company">Dashboard</BreadcrumbItem>:<></>}

        <BreadcrumbItem>Criar Empresa</BreadcrumbItem>
      </Breadcrumbs>
      <CompanyCreateForm />
    </div>
  );
}
