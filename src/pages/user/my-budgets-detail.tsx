import { ReactNode, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

import {
  EstimateRequest,
  getEstimateRequestById,
} from "../../api/estimateRequests";
import {
  getProposalsByEstimateId,
  approveProposal,
  rejectProposal,
  Proposal,
} from "../../api/proposals";

import ProposalActionDialog from "../../components/proposals/ProposalActionDialog";

import { Text } from "../../components/ui/Text";
import {
  Accordion,
  AccordionItem,
  Avatar,
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Progress,
  ScrollShadow,
} from "@heroui/react";
import { Subtitle } from "../../components/ui/Subtitle";
import ImageGallery from "../../components/image-gallery";
import { FiFileText, FiLoader } from "react-icons/fi";
import { CiCalendar, CiMail, CiMapPin, CiPhone } from "react-icons/ci";

import { AiFillStar } from "react-icons/ai";

import { ProposalDetailModal } from "../../components/proposals/proposal-detail-modal";
import {
  MdFlag,
  MdHourglassEmpty,
  MdLightbulbOutline,
  MdMarkEmailUnread,
  MdOutlineKeyboardDoubleArrowRight,
  MdOutlineOpenInNew,
  MdPending,
  MdRequestPage,
  MdWatchLater,
} from "react-icons/md";

import { CheckoutButton } from "../../components/payment/checkout-button";
import { Timeline } from "../../components/timeline/timeline";

import {
  getAllProgressEstimateRequestsByEstimateRequest,
  ProgressEstimateRequest,
} from "../../api/progress-estimate-requests";
import { TimelineStep } from "../../components/timeline/time-types";

import { ScheduleRequested } from "../../components/timeline/components/schedule-requested";
import { useAuthStore } from "../../stores/authStore";
import { AcceptSuggestedScheduled } from "../../components/timeline/components/accept-suggested-scheduled";
import { visitFinished } from "../../api/visits";
import { updateJob } from "../../api/jobs-service";
import { FaBuilding } from "react-icons/fa6";

type UseTimelineStepsDataProps = {
  proposal_id: string;
  estimate_request_id: string;
  customer_id: string;
  company_id: string;

  handleOpenProposalDetail: (proposal_id: string) => void;
  handleVisitFinished: (visit_id: string) => void;
};

export function MyBudgetsDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();

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
  // const { data: estimate_request_message } = useQuery({
  //   queryKey: ["estimateRequestMessage", id],
  //   queryFn: () => getEstimateRequestMessagesGroupedByCompany(id!),
  //   enabled: !!id,
  // });
  const { data: progress_estimate_requests } = useQuery({
    queryKey: ["progress_estimate_requests", id],
    queryFn: () => getAllProgressEstimateRequestsByEstimateRequest(id!),
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
  const handleOpenProposalDetail = useCallback(
    (proposal_id: string) => {
      const proposal = proposals?.find((item) => item.id === proposal_id);
      if (proposal) {
        setSelectedProposal(proposal);
        setEstimateDetail(true);
      }
    },
    [proposals]
  );
  const handleVisitFinished = useCallback(async (visit_id: string) => {
    await visitFinished(visit_id);
  }, []);
  const handleConfirmService = useCallback(async (proposal_id: string) => {
    await updateJob(proposal_id, {
      finished_customer_at: new Date(),
    });
  }, []);

  const useTimelineSteps = (
    items: ProgressEstimateRequest[],
    data: UseTimelineStepsDataProps
  ): TimelineStep[] => {
    return items
      .sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )
      .map((item, index, arr) => {
        const status: TimelineStep["status"] =
          item.type==='FINISHED'? 'completed':
          index < arr.length - 1   ? "completed" : "current";
        let action = null;
        const is_completed = status === "completed";
        let icon = <></>;
        switch (item.type) {
          case "PROPOSALS_WAITING":
            icon = <MdPending />;
            action = (
              <Progress
                isIndeterminate
                aria-label="Loading..."
                className="max-w-md"
                size="sm"
                isStriped
                isDisabled
              />
            );

            break;
          case "PROPOSALS_RECEIVED":
            icon = <MdMarkEmailUnread />;
            action = (
              <Button
                startContent={<MdOutlineOpenInNew size={16} />}
                color="primary"
                size="sm"
                onPress={() => data.handleOpenProposalDetail(data.proposal_id)}
              >
                Ver Proposta
              </Button>
            );
            break;
          case "VISIT_WAITING":
            icon = <MdWatchLater />;
            action = (
              <Button
                size="sm"
                color="primary"
                onPress={() =>
                  data.handleVisitFinished(item?.proporties?.visit_id)
                }
                isDisabled={is_completed}
              >
                Confimar Visita
              </Button>
            );
            break;

          case "VISIT_REQUESTED":
            icon = <MdRequestPage />;
            action = (
              <ScheduleRequested
                company_id={data.company_id}
                customer_id={data.customer_id}
                estimate_request_id={data.estimate_request_id}
                proposal_id={data.proposal_id}
                is_disabled={is_completed}
              />
            );
            break;
          case "VISIT_SUGGESTED":
            icon = <MdLightbulbOutline />;
            action = (
              <AcceptSuggestedScheduled
                visit_id={item?.proporties?.visit_id}
                is_disabled={is_completed}
              />
            );
            break;
          case "PAYMENT_REQUESTED":
            icon = <MdRequestPage />;
            action = (
              <CheckoutButton
                proposal_id={data.proposal_id}
                isDisabled={is_completed}
                size="sm"
              />
            );
            break;
          case "WAITING":
            icon = <MdPending />;
            action = (
              <Progress
                isIndeterminate={!is_completed}
                value={100}
                label={
                  is_completed && <Text type="caption" align="center"></Text>
                }
                aria-label="Loading..."
                className="max-w-md "
                size="sm"
                showValueLabel
              />
            );
            break;
          case "IS_JOB_FINISHED":
            icon = <MdHourglassEmpty />;
            action = (
              <div className="flex flex-col gap-2">
                <Button
                  variant="solid"
                  color="success"
                  size="sm"
                  onPress={() => handleConfirmService(data.proposal_id)}
                  isDisabled={is_completed}
                >
                  Confirmar finalização
                </Button>
              </div>
            );
            break;
          case "FINISHED":
            icon = <MdFlag />;
            action = <Button size="sm">Avaliar prestador</Button>;
            break;
          default:
            action = null;
        }
        return {
          id: item.id,
          title: item.title,
          description: item.description,
          icon: icon,
          status,
          type: item.type,
          date: new Date(item.created_at),
          data,
          actions: action,
        };
      });
  };
  // const steps = useTimelineSteps(
  //   progress_estimate_requests ? progress_estimate_requests : [],
  //   {
  //     proposals,
  //     estimate_request: request,
  //     handleOpenProposalDetail,
  //     customer_id: user?.customer_id || "",
  //     progress_estimate_requests,
  //   },
  //   my_types
  // );

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

  // if (isLoadingRequest || isLoadingProposals) {
  //   return (
  //     <div className="flex justify-center py-8">
  //       <FiLoader className="w-8 h-8 animate-spin text-primary-500" />
  //     </div>
  //   );
  // }
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
    <div className="space-y-6 fade-in max-w-6xl mx-auto px-4 py-6">
      <Breadcrumbs>
        <BreadcrumbItem href="/my-budgets">Meus orçamentos</BreadcrumbItem>
        <BreadcrumbItem>{request.name}</BreadcrumbItem>
      </Breadcrumbs>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          <Card className="flex-1">
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

                      <div className="space-y-2 h-full">
                        <Accordion variant="bordered">
                          <AccordionItem
                            title={<Text>Visualizar Andamento</Text>}
                            indicator={
                              <MdOutlineKeyboardDoubleArrowRight size={20} />
                            }
                          >
                            <ScrollShadow
                              className="max-h-screen"
                              hideScrollBar
                            >
                              {!!proposal?.progress_estimate_requests && (
                                <Timeline
                                  steps={useTimelineSteps(
                                    proposal.progress_estimate_requests,
                                    {
                                      proposal_id: proposal.id,
                                      estimate_request_id: request.id,
                                      customer_id: user?.customer_id || "",
                                      company_id: proposal.company_id,
                                      handleOpenProposalDetail,
                                      handleVisitFinished,
                                    }
                                  )}
                                  showSteps={[
                                    "PROPOSALS_RECEIVED",
                                    "PROPOSALS_WAITING",
                                    "PROPOSALS_ACCEPTED",
                                    "VISIT_CREATED",
                                    "VISIT_REQUESTED",
                                    "VISIT_SUGGESTED",
                                    "VISIT_CONFIRMED",
                                    "VISIT_WAITING",
                                    "VISIT_COMPLETED",
                                    "PAYMENT_REQUESTED",
                                    "PAYMENT_COMPLETED",
                                    "WAITING",
                                    "IS_JOB_FINISHED",
                                    "FINISHED",
                                  ]}
                                />
                              )}
                              {/* {steps && <CompactTimeline steps={steps}  compact={true}/>} */}
                            </ScrollShadow>
                          </AccordionItem>
                        </Accordion>
                      </div>
                      {/* <Divider className="my-4" />
                      <Text type="caption">
                        Enviada em:{" "}
                        {format(proposal.created_at, "dd/MM/yyyy, HH:mm:ss")}
                      </Text> */}
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
              <Subtitle>Ultimas atualizações</Subtitle>
            </CardHeader>
            <ScrollShadow className="max-h-screen" hideScrollBar>
              <CardBody>
                {proposals?.map((proposal) => (
                  <>
                    <Text className="mb-2">
                      Proposta: {proposal.company.name}
                    </Text>
                    {!!proposal?.progress_estimate_requests && (
                      <Timeline
                        key={proposal.id}
                        steps={useTimelineSteps(
                          [
                            proposal.progress_estimate_requests[
                              proposal.progress_estimate_requests.length - 1
                            ],
                          ],
                          {
                            proposal_id: proposal.id,
                            estimate_request_id: request.id,
                            customer_id: user?.customer_id || "",
                            company_id: proposal.company_id,
                            handleOpenProposalDetail,
                            handleVisitFinished,
                          }
                        )}
                      />
                    )}
                  </>
                ))}

                {/* {steps && (
                  <Timeline
                    // steps={mockTimelineSteps}
                    steps={steps}
                  />
                )} */}
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
