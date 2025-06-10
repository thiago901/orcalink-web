import { useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { getCompanyById } from "../../api/companies";
import { getCompanyServices } from "../../api/companyServices";

import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Link,
} from "@heroui/react";
import { Subtitle } from "../../components/ui/Subtitle";
import { FiLoader } from "react-icons/fi";
import { CiMapPin } from "react-icons/ci";
import { FaBuilding } from "react-icons/fa6";
import CompanyServiceForm from "../../components/forms/company-service-create";
import { useCompanyStore } from "../../stores/companyStore";

export function CompanyInformationsPage() {
  const { current_company } = useCompanyStore();
    const id = current_company.id;

  const [isCompanyServiceFormOpen, setIsCompanyServiceFormOpen] =
    useState(false);

  const { data: company, isLoading: isLoadingCompany } = useQuery({
    queryKey: ["company", id],
    queryFn: () => getCompanyById(id!),
    enabled: !!id,
  });

  const { data: services, isLoading: isLoadingServices } = useQuery({
    queryKey: ["companyServices", id],
    queryFn: () => getCompanyServices(id!),
  });

  if (isLoadingCompany || isLoadingServices) {
    return (
      <div className="flex justify-center py-8">
        <FiLoader className="w-8 h-8 animate-spin " />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium mb-2">Empresa não encontrada</h3>
        <p className="text-neutral-600">
          A empresa que você está procurando não existe ou foi removida.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <Subtitle>Informações da Empresa</Subtitle>
                <Button as={Link} href={`/company/profile/edit`}>
                  Editar
                </Button>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar src={company.avatar} name={company.name} size="lg" />

                  <div>
                    <h4 className="text-lg font-medium ">{company.name}</h4>
                    <p>
                      {company.address.city}, {company.address.state}
                    </p>
                  </div>
                </div>

                {company.about && (
                  <div>
                    <h4 className="font-medium mb-2">Sobre</h4>
                    <p>{company.about}</p>
                  </div>
                )}

                <div>
                  <h4 className="font-medium mb-2 ">Endereço</h4>
                  <div className="flex items-center gap-2 ">
                    <CiMapPin size={18} />
                    <span>
                      {company.address.address}
                      <br />
                      {company.address.city}, {company.address.state} -{" "}
                      {company.address.zip}
                    </span>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader className="flex align-center justify-between">
              <Subtitle>Serviços Oferecidos</Subtitle>
              <Button
                color="primary"
                className="mt-4"
                onPress={() => setIsCompanyServiceFormOpen(true)}
              >
                Cadastrar Serviço
              </Button>
            </CardHeader>
            <CardBody>
              {!services?.length ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4 ">
                    <FaBuilding className="w-8 h-8 " />
                  </div>
                  <h3 className="text-lg font-medium mb-2 ">
                    Nenhum serviço cadastrado
                  </h3>
                  <p>Esta empresa ainda não cadastrou seus serviços.</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="p-4 rounded-lg border border-neutral-200 "
                    >
                      <h4 className="font-medium ">{service.name}</h4>
                      <p className="text-sm  mt-1 ">{service.category_name}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <Subtitle>Status</Subtitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div>
                <div className="text-2xl font-semibold">
                  {services?.length || 0}
                </div>
                <div className="text-sm ">Serviços cadastrados</div>
              </div>

              <div className="h-px " />

              <div>
                <h4 className="font-medium mb-2 ">Última atualização</h4>
                <div className="">
                  {/* {new Date(company.updated_at).toLocaleDateString('pt-BR')} */}
                  {new Date().toLocaleDateString("pt-BR")}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      <CompanyServiceForm
        isOpen={isCompanyServiceFormOpen}
        onClose={() => setIsCompanyServiceFormOpen(false)}
        company_id={id!}
        onSuccess={() => {
          console.log("Success");
        }}
      />
    </>
  );
}
