import { useQuery } from "@tanstack/react-query";

import {
  Card,
  CardBody,
  CardHeader,
  Link,
  Listbox,
  ListboxItem,
} from "@heroui/react";
import { Subtitle } from "../../components/ui/Subtitle";
import { getJobsByCompany } from "../../api/jobs-service";

import { CiCalendar, CiMapPin } from "react-icons/ci";
import { useCompanyStore } from "../../stores/companyStore";

export function CompanyJobsPage() {
  const { current_company } = useCompanyStore();
  const id = current_company.id;

  const { data: jobs } = useQuery({
    queryKey: ["jobs", id],
    queryFn: () => getJobsByCompany(id!),
    enabled: !!id,
  });

  if (!current_company.id) {
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
    <div>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <Subtitle>Trabalhos confirmados</Subtitle>
            </div>
          </CardHeader>
          <CardBody>
            {!jobs?.length ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CiMapPin className="w-8 h-8 " />
                </div>
                <h3 className="text-lg font-medium mb-2">
                  Nenhum trabalho disponível
                </h3>
                <p className="">
                  Não há solicitações de orçamento na sua região no momento.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <Listbox>
                  {jobs.map((request) => (
                    <ListboxItem
                      key={request.i}
                      as={Link}
                      href={`/company/budgets/${request.estimate_request.id}`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div>
                          <h4 className="font-medium">
                            {request.estimate_request.name}
                          </h4>

                          <p className="mt-2 text-sm text-neutral-600">
                            {request.estimate_request.description.slice(0, 300)}
                            {request.estimate_request.description.length >
                              300 && "..."}
                          </p>
                          <div className="mt-4 flex flex-wrap gap-4 text-sm ">
                            <div className="flex items-center gap-1">
                              <CiCalendar size={14} />
                              <span>
                                {new Date(
                                  request.created_at
                                ).toLocaleDateString("pt-BR")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </ListboxItem>
                  ))}
                </Listbox>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
