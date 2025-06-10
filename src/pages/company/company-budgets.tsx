/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { getCompanyById } from "../../api/companies";
import { getCompanyServices } from "../../api/companyServices";
import { getEstimateRequests } from "../../api/estimateRequests";

import {
  Card,
  CardBody,
  CardHeader,
  Link,
  Listbox,
  ListboxItem,
  Select,
  SelectItem,
} from "@heroui/react";
import { Subtitle } from "../../components/ui/Subtitle";
import { FiLoader } from "react-icons/fi";
import { CiCalendar, CiMapPin } from "react-icons/ci";
import { useCompanyStore } from "../../stores/companyStore";

const RADIUS_OPTIONS = [
  { key: "5000", label: "5 km" },
  { key: "10000", label: "10 km" },
  { key: "20000", label: "20 km" },
  { key: "50000", label: "50 km" },
];

export function CompanyBudgetPage() {
  const { current_company } = useCompanyStore();
  const id = current_company.id;

  const [radius, setRadius] = useState(RADIUS_OPTIONS[0].key);

  const { data: company, isLoading: isLoadingCompany } = useQuery({
    queryKey: ["company", id],
    queryFn: () => getCompanyById(id!),
    enabled: !!id,
  });

  const { data: services, isLoading: isLoadingServices } = useQuery({
    queryKey: ["companyServices", id],
    queryFn: () => getCompanyServices(id!),
  });

  const { data: requests, isLoading: isLoadingRequests } = useQuery({
    queryKey: [
      "estimateRequests",
      company?.address.latitude,
      company?.address.longitude,
      radius,
    ],
    queryFn: () =>
      getEstimateRequests({
        latitude: company!.address.latitude,
        longitude: company!.address.longitude,
        radiusInMeters: radius ? Number(radius) : Number(RADIUS_OPTIONS[0].key),
        category: services ? services.map((s) => s.category_name) : undefined,
      }),
    enabled:
      !!company?.address.latitude &&
      !!company?.address.longitude &&
      !isLoadingServices,
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

  const sortedRequests = requests?.sort((a: any, b: any) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <Subtitle>Orçamentos Disponíveis</Subtitle>
              <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                <Select
                  defaultSelectedKeys={[RADIUS_OPTIONS[0].key]}
                  label="Selecione a Distância"
                  selectionMode="single"
                  selectedKeys={[radius]}
                  onSelectionChange={(e) => setRadius(String(e?.currentKey))}
                >
                  {RADIUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.key}>{opt.label}</SelectItem>
                  ))}
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardBody>
            {isLoadingRequests ? (
              <div className="flex justify-center py-8">
                <FiLoader className="w-8 h-8 animate-spin " />
              </div>
            ) : !sortedRequests?.length ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CiMapPin className="w-8 h-8 " />
                </div>
                <h3 className="text-lg font-medium mb-2">
                  Nenhum orçamento disponível
                </h3>
                <p className="">
                  Não há solicitações de orçamento na sua região no momento.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <Listbox>
                  {sortedRequests.map((request: any, index: number) => (
                    <ListboxItem
                      key={request.id}
                      showDivider={sortedRequests.length - 1 !== index}
                      as={Link}
                      href={`/company/budgets/${request.id}`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div>
                          <h4 className="font-medium">{request.name}</h4>
                          <div className="flex items-center gap-2 mt-1 text-sm ">
                            <CiMapPin size={14} />
                            <span>
                              {request.address.city}, {request.address.state}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-neutral-600">
                            {request.description.slice(0, 150)}
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
                            <div className="flex items-center gap-1">
                              <CiMapPin size={14} />
                              <span>{request.footage}m²</span>
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
