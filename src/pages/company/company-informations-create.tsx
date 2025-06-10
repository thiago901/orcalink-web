import { BreadcrumbItem, Breadcrumbs } from "@heroui/react";
import { CompanyCreateForm } from "../../components/forms/company-create";

export function CompanyInformationsCreatePage() {
  return (
    <div className="space-y-6 fade-in">
      <Breadcrumbs>
        <BreadcrumbItem href="/company">Dashboard</BreadcrumbItem>

        <BreadcrumbItem>Criar Empresa</BreadcrumbItem>
      </Breadcrumbs>
      <CompanyCreateForm />
    </div>
  );
}
