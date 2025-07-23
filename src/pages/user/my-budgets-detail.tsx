import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

import { getEstimateRequestById } from "../../api/estimateRequests";
import {
  getProposalsByEstimateId,
  approveProposal,
  rejectProposal,
  Proposal,
} from "../../api/proposals";

import ProposalActionDialog from "../../components/proposals/ProposalActionDialog";

import { Text } from "../../components/ui/Text";
import {
  Avatar,
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  ScrollShadow,
} from "@heroui/react";
import { Subtitle } from "../../components/ui/Subtitle";
import ImageGallery from "../../components/image-gallery";
import { FiFileText, FiLoader } from "react-icons/fi";
import { CiCalendar, CiMail, CiMapPin, CiPhone } from "react-icons/ci";

import { AiFillStar } from "react-icons/ai";
import { getEstimateRequestMessagesGroupedByCompany } from "../../api/estimate-requests-messages";
import { ProposalDetailModal } from "../../components/proposals/proposal-detail-modal";
import { MdOutlineOpenInNew } from "react-icons/md";
import { Chats } from "../../components/chat/chats";
import { CheckoutButton } from "../../components/payment/checkout-button";
import { Timeline } from "../../components/timeline/timeline";
import { mockTimelineSteps } from "../../components/timeline/mocks";

export function MyBudgetsDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(
    null
  );
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [estimateDetail, setEstimateDetail] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const { data: request, isLoading: isLoadingRequest } = useQuery({
    queryKey: ["estimateRequest", id],
    queryFn: () => getEstimateRequestById(id!),
    enabled: !!id,
  });
  const { data: estimate_request_message } = useQuery({
    queryKey: ["estimateRequestMessage", id],
    queryFn: () => getEstimateRequestMessagesGroupedByCompany(id!),
    enabled: !!id,
  });

  const {
    data: proposals,
    isLoading: isLoadingProposals,
    refetch: refetchProposals,
  } = useQuery({
    queryKey: ["proposals", id],
    queryFn: () => getProposalsByEstimateId(id!),
    enabled: !!id,
  });

  const handleApprove = async () => {
    if (!selectedProposal) return;

    setIsActionLoading(true);
    try {
      await approveProposal(selectedProposal.id);

      setIsApproveDialogOpen(false);
      setSelectedProposal((old) =>
        old ? { ...old, approved_at: new Date() } : null
      );
      await refetchProposals();
    } catch (error) {
      console.error("Error approving proposal:", error);
      console.log("error", error);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedProposal) return;

    setIsActionLoading(true);
    try {
      await rejectProposal(selectedProposal.id);

      setSelectedProposal((old) =>
        old ? { ...old, reject_at: new Date() } : null
      );
      setIsRejectDialogOpen(false);
      await refetchProposals();
    } catch (error) {
      console.error("Error rejecting proposal:", error);
    } finally {
      setIsActionLoading(false);
    }
  };

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

  function renderStatus(proposal: Proposal, size?: "sm" | "md" | "lg") {
    return (
      <Chip
        color={
          proposal.approved_at
            ? "success"
            : proposal.reject_at
            ? "danger"
            : "warning"
        }
        size={size || "sm"}
      >
        {proposal.approved_at
          ? "Aprovado"
          : proposal.reject_at
          ? "Rejeitado"
          : "Pendente"}
      </Chip>
    );
  }
  return (
    <div className="space-y-6 fade-in max-w-6xl mx-auto px-4 py-6">
      <Breadcrumbs>
        <BreadcrumbItem href="/my-budgets">Meus orçamentos</BreadcrumbItem>
        <BreadcrumbItem>{request.name}</BreadcrumbItem>
      </Breadcrumbs>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <Subtitle>{request.name}</Subtitle>
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

          <Card>
            <CardHeader>
              <Subtitle>Propostas Recebidas</Subtitle>
            </CardHeader>
            <CardBody>
              {!proposals?.length ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiFileText className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    Nenhuma proposta recebida
                  </h3>
                  <p className="text-neutral-600">
                    Aguarde enquanto as empresas analisam sua solicitação.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {proposals.map((proposal) => (
                    <div key={proposal.id} className="p-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                          <Avatar
                            name={proposal.company.name.charAt(0).toUpperCase()}
                            src={proposal.company.avatar}
                          />

                          <div className="flex-1">
                            <h4 className="font-medium">
                              {proposal.company.name}
                            </h4>
                            <div className="flex items-center gap-1">
                              <AiFillStar color="#f1c40f" />
                              <Text type="small">
                                {proposal.company.ratting}
                              </Text>
                            </div>
                          </div>
                          <div className="flex gap-2 flex-col items-end">
                            {renderStatus(proposal)}
                            <Text type="subtitle" weight="semibold">
                              {new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              }).format(proposal.amount)}
                            </Text>
                          </div>
                        </div>
                        <div className="my-4">
                          <Text type="normal" weight="semibold">
                            Descrição da Proposta
                          </Text>
                          <Text className="mt-2">{proposal.description}</Text>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button
                          startContent={<MdOutlineOpenInNew size={16} />}
                          color="primary"
                          onPress={() => {
                            setSelectedProposal(proposal);
                            setEstimateDetail(true);
                          }}
                        >
                          Ver detalhes
                        </Button>
                        <CheckoutButton proposal_id={proposal.id} />
                      </div>

                      <Divider className="my-4" />
                      <Text type="caption">
                        Enviada em:{" "}
                        {format(proposal.created_at, "dd/MM/yyyy, HH:mm:ss")}
                      </Text>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        <div className="space-y-2 h-full">
       
          <Card>
            <CardHeader>
              <Subtitle>Progresso do Serviço</Subtitle>
            </CardHeader>
            <ScrollShadow className="max-h-screen" hideScrollBar>
              <CardBody>
                <Timeline steps={mockTimelineSteps} />
              </CardBody>
            </ScrollShadow>
          </Card>
        </div>
      </div>

      {/* Action Dialogs */}
      <ProposalActionDialog
        isOpen={isApproveDialogOpen}
        onClose={() => setIsApproveDialogOpen(false)}
        onConfirm={handleApprove}
        title="Aceitar Proposta"
        description="Tem certeza que deseja aceitar esta proposta? Esta ação não pode ser desfeita."
        isLoading={isActionLoading}
      />

      <ProposalActionDialog
        isOpen={isRejectDialogOpen}
        onClose={() => setIsRejectDialogOpen(false)}
        onConfirm={handleReject}
        title="Recusar Proposta"
        description="Tem certeza que deseja recusar esta proposta? Esta ação não pode ser desfeita."
        isLoading={isActionLoading}
      />
      {selectedProposal && (
        <ProposalDetailModal
          isOpen={estimateDetail}
          onClose={() => setEstimateDetail(false)}
          estimate_id={selectedProposal.estimate_id}
          status={renderStatus(selectedProposal)}
          onAccept={
            !!selectedProposal.approved_at || !!selectedProposal.reject_at
              ? null
              : () => setIsApproveDialogOpen(true)
          }
          onReject={
            !!selectedProposal.approved_at || !!selectedProposal.reject_at
              ? null
              : () => setIsRejectDialogOpen(true)
          }
        />
      )}
    </div>
  );
}
