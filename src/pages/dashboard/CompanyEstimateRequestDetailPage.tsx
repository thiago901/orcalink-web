/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getEstimateRequestById } from "../../api/estimateRequests";
import { getProposalsByEstimateId } from "../../api/proposals";

import { Title } from "../../components/ui/Title";

import { Text } from "../../components/ui/Text";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Card,
  CardBody,
  CardHeader,
} from "@heroui/react";
import { Subtitle } from "../../components/ui/Subtitle";
import ImageGallery from "../../components/image-gallery";
import ProposalForm from "../../components/proposals/ProposalForm";
import { FiLoader } from "react-icons/fi";
import { CiCalendar, CiMail, CiMapPin, CiPhone } from "react-icons/ci";
import { Chat } from "../../components/chat/chat";
import { getEstimateRequestMessagesByCompany } from "../../api/estimate-requests-messages";

const CompanyEstimateRequestDetailPage = () => {
  const { estimate_id, id } = useParams<{ estimate_id: string; id: string }>();

  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [statusProposals, setStatusProposals] = useState({
    hasProposal: false,
    wasApproved: false,
    isSameCompany: false,
  });

    const {
      data: estimate_request_messages,
      
    } = useQuery({
      queryKey: ["estimateRequestMessages", id, estimate_id],
      queryFn: () =>
        getEstimateRequestMessagesByCompany(estimate_id!, id!),
      enabled: !!id,
    });
  
  
  
  const {
    data: proposals,
    isLoading: isLoadingProposals,
    refetch: refetchProposals,
  } = useQuery({
    queryKey: ["proposals", estimate_id],
    queryFn: () => getProposalsByEstimateId(estimate_id!),
    enabled: !!estimate_id,
  });

  useEffect(() => {
    const proposal = proposals?.find(
      (proposal: any) => proposal.estimate_request_id === estimate_id
    );

    setStatusProposals({
      hasProposal: !!proposal,
      wasApproved: !!proposal?.approved_at,
      isSameCompany: proposal?.company_id === id,
    });
  }, [estimate_id, id, proposals]);
  const [isProposalFormOpen, setIsProposalFormOpen] = useState(false);
  const { data: request, isLoading: isLoadingRequest } = useQuery({
    queryKey: ["estimateRequest", estimate_id],
    queryFn: () => getEstimateRequestById(estimate_id!),
    enabled: !!estimate_id,
  });

  if (isLoadingRequest || isLoadingProposals) {
    return (
      <div className="flex justify-center py-8">
        <FiLoader className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium mb-2">Orçamento não encontrado</h3>
        <p className="text-neutral-600">
          O orçamento que você está procurando não existe ou foi removido.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      <Breadcrumbs>
        <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
        <BreadcrumbItem href={`dashboard/companies/${id}`}>
          Orçamentos
        </BreadcrumbItem>
        <BreadcrumbItem>{request.name}</BreadcrumbItem>
      </Breadcrumbs>
      <div>
        <Title>{request.name}</Title>
        <Text>Detalhes da solicitação de orçamento</Text>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <Subtitle>Informações do Projeto</Subtitle>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Descrição</h4>
                  <p className="text-neutral-600">{request.description}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Metragem</h4>
                  <p className="text-neutral-600">{request.footage}m²</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Endereço</h4>
                  <div className="flex items-center gap-2 text-neutral-600">
                    <CiMapPin size={18} />
                    <span>
                      {request.address.street}, {request.address.number} -{" "}
                      {request.address.neighborhood}
                      <br />
                      {request.address.city}, {request.address.state} -{" "}
                      {request.address.postal_code}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Contato</h4>
                    <div className="space-y-2 text-neutral-600">
                      <div className="flex items-center gap-2">
                        <CiPhone size={18} />
                        <span>{request.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CiMail size={18} />
                        <span>{request.email}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Data da solicitação</h4>
                    <div className="flex items-center gap-2 text-neutral-600">
                      <CiCalendar size={18} />
                      <span>
                        {new Date(request.created_at).toLocaleDateString(
                          "pt-BR"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <ImageGallery
                images={request?.estimate_request_files}
                layout="carousel"
              />
            </CardBody>
          </Card>

          <div className="flex flex-col gap-2">
            {/* STATUS PRINCIPAL */}
            {statusProposals.wasApproved &&
            statusProposals.hasProposal &&
            statusProposals.isSameCompany ? (
              <Button variant="ghost" disabled color="success">
                Proposta aprovada pelo cliente
              </Button>
            ) : statusProposals.wasApproved ? (
              <Button variant="ghost" disabled color="warning">
                Proposta já foi fechada
              </Button>
            ) : statusProposals.hasProposal && statusProposals.isSameCompany ? (
              <Button variant="ghost" disabled color="success">
                Proposta enviada
              </Button>
            ) : (
              <Button
                color="primary"
                onPress={() => {
                  setSelectedRequest(request);
                  setIsProposalFormOpen(true);
                }}
              >
                Enviar proposta
              </Button>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Card>
            <CardHeader>
              <Subtitle>Status</Subtitle>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div>
                  <div className="text-2xl font-semibold text-neutral-800">
                    {proposals?.length || 0}
                  </div>
                  <div className="text-sm text-neutral-500">
                    Propostas recebidas
                  </div>
                </div>

                <div className="h-px bg-neutral-200" />

                <div>
                  <h4 className="font-medium mb-2">Última atualização</h4>
                  <div className="flex items-center gap-2 text-neutral-600">
                    <CiCalendar size={18} />
                    <span>
                      {new Date(
                        request.updated_at ?? request.created_at
                      ).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
          <Chat
            companyId={id!}
            contact={{ id: request.user.id, name: request.user.name, avatar: request.user.avatar,unread_amount:0}}
            messages={estimate_request_messages?estimate_request_messages:[]}
            estimate_request_id={estimate_id!}
            onSend={() => console.log("")}
            onUpload={() => console.log("")}
            onBack={() => null}
            sender="COMPANY"
          />
        </div>
      </div>

      <ProposalForm
        isOpen={isProposalFormOpen}
        onClose={() => setIsProposalFormOpen(false)}
        companyId={id!}
        estimateRequestId={selectedRequest?.id}
        onSuccess={() => {
          refetchProposals();
          setSelectedRequest(null);
        }}
      />
    </div>
  );
};

export default CompanyEstimateRequestDetailPage;
