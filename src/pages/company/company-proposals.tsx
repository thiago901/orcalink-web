import { useQuery } from "@tanstack/react-query";

import { getProposalsByCompanyId } from "../../api/proposals";

import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Link,
  Listbox,
  ListboxItem,
} from "@heroui/react";
import { Subtitle } from "../../components/ui/Subtitle";

import { FiFileText, FiLoader } from "react-icons/fi";
import { useCompanyStore } from "../../stores/companyStore";
import { CiCalendar, CiMapPin } from "react-icons/ci";

export function CompanyProposalsPage() {
  const { current_company } = useCompanyStore();
  const id = current_company.id;

  const { data: proposals, isLoading: isLoadingProposals } = useQuery({
    queryKey: ["companyProposals", id],
    queryFn: () => getProposalsByCompanyId(id!),
    enabled: !!id,
  });

  return (
    <div>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Subtitle>Propostas Enviadas</Subtitle>
          </CardHeader>
          <CardBody>
            {isLoadingProposals ? (
              <div className="flex justify-center py-8">
                <FiLoader className="w-8 h-8 animate-spin " />
              </div>
            ) : !proposals?.length ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiFileText className="w-8 h-8 " />
                </div>
                <h3 className="text-lg font-medium mb-2">
                  Nenhuma proposta enviada
                </h3>
                <p className="text-neutral-600">
                  Você ainda não enviou nenhuma proposta.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <Listbox>
                  {proposals?.map((proposal, index) => (
                    <ListboxItem
                      key={proposal.id}
                      showDivider={proposals.length - 1 !== index}
                      as={Link}
                      href={`/company/budgets/${proposal.estimate_request_id}`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div>
                          <h4 className="font-medium">
                            {proposal.estimate_request.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1 text-sm ">
                            <CiMapPin size={14} />
                            <span>
                              {proposal.estimate_request.address.city},{" "}
                              {proposal.estimate_request.address.state}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-neutral-600">
                            {proposal.description.slice(0, 150)}
                          </p>
                          <div className="mt-4 flex flex-wrap gap-4 text-sm ">
                            <div className="flex items-center gap-1">
                              <CiCalendar size={14} />
                              <span>
                                {new Date(
                                  proposal.created_at
                                ).toLocaleDateString("pt-BR")}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CiMapPin size={14} />
                              <span>{proposal.estimate_request.footage}m²</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <Subtitle>
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(proposal.amount)}
                          </Subtitle>
                          <Chip
                            className="mt-2"
                            color={
                              proposal.approved_at
                                ? "success"
                                : proposal.reject_at
                                ? "danger"
                                : "warning"
                            }
                          >
                            {proposal.approved_at
                              ? "Aprovado"
                              : proposal.reject_at
                              ? "Rejeitado"
                              : "Pendente"}
                          </Chip>
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
