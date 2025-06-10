
import { useQuery } from "@tanstack/react-query";

import { getCompanyById } from "../../api/companies";
import { getProposalsByCompanyId } from "../../api/proposals";

import { Card, CardBody, CardHeader, Chip } from "@heroui/react";
import { Subtitle } from "../../components/ui/Subtitle";
import { Text } from "../../components/ui/Text";
import { FiFileText, FiLoader } from "react-icons/fi";
import { useCompanyStore } from "../../stores/companyStore";

export function CompanyProposalsPage() {
  const { current_company } = useCompanyStore();
    const id = current_company.id;
  const { data: company, isLoading: isLoadingCompany } = useQuery({
    queryKey: ["company", id],
    queryFn: () => getCompanyById(id!),
    enabled: !!id,
  });

  const { data: proposals, isLoading: isLoadingProposals } = useQuery({
    queryKey: ["companyProposals", id],
    queryFn: () => getProposalsByCompanyId(id!),
    enabled: !!id,
  });

  if (isLoadingCompany) {
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
                {proposals.map((proposal) => (
                  <div key={proposal.id} className="p-4 rounded-lg ">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="font-medium">
                          {/* {proposal.estimate_request.name} */}
                          {proposal.id}
                        </h4>
                        <p className="text-sm  mt-1">
                          {/* {proposal.estimate_request.address_city}, {proposal.estimate_request.address_state} */}
                          Endereco
                        </p>
                        <Text className="mt-2">{proposal.description}</Text>
                      </div>
                      <div className="text-right">
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
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
