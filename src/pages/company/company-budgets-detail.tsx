import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getEstimateRequestById } from "../../api/estimateRequests";
import { getProposalsByEstimateId, Proposal } from "../../api/proposals";

import { Title } from "../../components/ui/Title";

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
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  useDisclosure,
} from "@heroui/react";
import { Subtitle } from "../../components/ui/Subtitle";
import ImageGallery from "../../components/image-gallery";

import { FiFileText, FiLoader, FiMessageCircle } from "react-icons/fi";
import { CiCalendar, CiMail, CiMapPin, CiPhone } from "react-icons/ci";
import { Chat } from "../../components/chat/chat";
import { getEstimateRequestMessagesAndCompany } from "../../api/estimate-requests-messages";
import { useCompanyStore } from "../../stores/companyStore";

import { getUserById } from "../../api/users";

import { CreateProposalModal } from "../../components/modals/create-proposal-modal";
import { MdOutlineOpenInNew } from "react-icons/md";
import { format } from "date-fns";
import { AiFillStar } from "react-icons/ai";
import { ProposalDetailModal } from "../../components/proposals/proposal-detail-modal";
import { HiddenText } from "../../components/hidden-text";

export function CompanyBudgetsDetailPage() {
  const { estimate_request_id } = useParams<{ estimate_request_id: string }>();
  const { current_company } = useCompanyStore();
  const id = current_company.id;

  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(
    null
  );

  const [statusProposals, setStatusProposals] = useState({
    hasProposal: false,
    wasApproved: false,
    hasApprovedSameCompany: false,
    shoudlBlockUntilClientActSameCompany: false,
  });

  const { data: messages } = useQuery({
    queryKey: ["estimateRequestMessages", id, estimate_request_id],
    queryFn: () =>
      getEstimateRequestMessagesAndCompany(estimate_request_id!, id),
    enabled: !!id,
  });

  const {
    data: proposals,
    isLoading: isLoadingProposals,
    refetch: refetchProposals,
  } = useQuery({
    queryKey: ["proposals", estimate_request_id],
    queryFn: () => getProposalsByEstimateId(estimate_request_id!),
    enabled: !!estimate_request_id,
  });

  useEffect(() => {
    const someProposalApproved = proposals?.find(
      (proposal) => !!proposal.approved_at
    );
    const someProposalApprovedSameCompany = proposals?.find(
      (proposal) => !!proposal.approved_at && proposal.company_id === id
    );
    const shoudlBlockUntilClientActSameCompany = proposals?.some(
      (proposal) =>
        (proposal.approved_at || !proposal.reject_at) &&
        proposal.company_id === id
    );

    setStatusProposals({
      hasProposal: !!proposals?.length,
      wasApproved: !!someProposalApproved,
      hasApprovedSameCompany: !!someProposalApprovedSameCompany,
      shoudlBlockUntilClientActSameCompany:
        !!shoudlBlockUntilClientActSameCompany,
    });
  }, [estimate_request_id, id, proposals]);
  const [isProposalFormOpen, setIsProposalFormOpen] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { data: request, isLoading: isLoadingRequest } = useQuery({
    queryKey: ["estimateRequest", estimate_request_id],
    queryFn: () => getEstimateRequestById(estimate_request_id!),
    enabled: !!estimate_request_id,
  });
  const { data: customer } = useQuery({
    queryKey: ["customer", estimate_request_id],
    queryFn: () => (request ? getUserById(request.user_id) : null),
    enabled: !!request && !isLoadingRequest,
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
    <div className="space-y-6 fade-in">
      <Breadcrumbs>
        <BreadcrumbItem href="/company">Dashboard</BreadcrumbItem>
        <BreadcrumbItem href={`/company/budgets`}>Orçamentos</BreadcrumbItem>
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
                      {request.address.street},{" "}
                      <HiddenText block={!request.address.number}>
                        {request.address.number}
                      </HiddenText>{" "}
                      - {request.address.neighborhood}
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
                        <HiddenText block={!request.phone}>
                          <span>{request.phone}</span>
                        </HiddenText>
                      </div>
                      <div className="flex items-center gap-2">
                        <CiMail size={18} />
                        <HiddenText block={!request.email}>
                          <span>{request.email}</span>
                        </HiddenText>
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
            {statusProposals.hasApprovedSameCompany ? (
              <Button variant="ghost" disabled color="success">
                Proposta aprovada pelo cliente
              </Button>
            ) : statusProposals.wasApproved &&
              !statusProposals.hasApprovedSameCompany ? (
              <Button variant="ghost" disabled color="warning">
                Proposta já foi fechada
              </Button>
            ) : statusProposals.shoudlBlockUntilClientActSameCompany ? (
              <Button variant="ghost" disabled color="success">
                Proposta enviada
              </Button>
            ) : (
              <Button
                color="primary"
                onPress={() => {
                  setIsProposalFormOpen(true);
                }}
              >
                Preencher proposta
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="">
            <Button
              onPress={onOpen}
              fullWidth
              radius="full"
              size="lg"
              color="primary"
            >
              <FiMessageCircle size={24} />
              <Text>Falar com o cliente</Text>
            </Button>
            <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
              <DrawerContent>
                {() => (
                  <>
                    <DrawerHeader className="flex flex-col gap-1">
                      Chats
                    </DrawerHeader>
                    <DrawerBody className="p-0">
                      {messages && (
                        <Chat
                          contact={messages}
                          onSend={() => console.log("")}
                          onUpload={() => console.log("")}
                          onBack={() => null}
                          sender="COMPANY"
                        />
                      )}
                      {!messages && (
                        <Chat
                          contact={{
                            company: {
                              id: current_company.id,
                              name: current_company.name,
                            },
                            estimate_request: {
                              id: request.id,
                            },
                            messages: [],
                            unread_amount: 0,
                            user: {
                              id: request.user.id,
                              name: request.user.name,
                            },
                          }}
                          onSend={() => console.log("")}
                          onUpload={() => console.log("")}
                          onBack={() => null}
                          sender="COMPANY"
                        />
                      )}
                    </DrawerBody>
                  </>
                )}
              </DrawerContent>
            </Drawer>
          </div>
          <Card>
            <CardHeader>
              <Subtitle>Última atualização</Subtitle>
            </CardHeader>
            <CardBody>
              {!proposals?.length ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiFileText className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    Nenhuma proposta Enviada
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
                          <Text className="mt-2">
                            {proposal.description.length > 200
                              ? `${proposal.description.slice(0, 200)}...`
                              : proposal.description}
                          </Text>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button
                          startContent={<MdOutlineOpenInNew size={16} />}
                          color="primary"
                          onPress={() => {
                            setSelectedProposal(proposal);
                            // setEstimateDetail(true);
                          }}
                        >
                          Ver detalhes
                        </Button>
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
      </div>

      <CreateProposalModal
        estimate_request_id={request.id}
        isOpen={isProposalFormOpen}
        onClose={() => setIsProposalFormOpen(false)}
        customer={
          customer
            ? {
                document: "fake-document",
                email: customer.email,
                id: customer.id,
                name: customer.name,
                phone: customer.phone,
                avatar: customer.avatar,
              }
            : null
        }
        onSuccess={() => {
          refetchProposals();
        }}
      />

      {selectedProposal && (
        <ProposalDetailModal
          isOpen={!!selectedProposal}
          onClose={() => setSelectedProposal(null)}
          estimate_id={selectedProposal.estimate_id}
          status={renderStatus(selectedProposal)}
          proposal_id={selectedProposal.id}
          sender="COMPANY"
          customer={{
            id:request.user.id,
            name:request.user.name,
            avatar:request.user.avatar,
          }}

        />
      )}
    </div>
  );
}
