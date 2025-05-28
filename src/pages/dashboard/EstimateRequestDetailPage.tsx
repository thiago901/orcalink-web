import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { getEstimateRequestById } from '../../api/estimateRequests';
import { getProposalsByEstimateId, approveProposal, rejectProposal } from '../../api/proposals';


import ProposalActionDialog from '../../components/proposals/ProposalActionDialog';
import { Title } from '../../components/ui/Title';

import { Text } from '../../components/ui/Text';
import { Accordion, AccordionItem, Button, Card, CardBody, CardHeader, Chip } from '@heroui/react';
import { Subtitle } from '../../components/ui/Subtitle';
import ImageGallery from '../../components/image-gallery';
import { FiCheck, FiFileText, FiLoader } from 'react-icons/fi';
import { CiCalendar, CiMail, CiMapPin, CiPhone } from 'react-icons/ci';

const EstimateRequestDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [selectedProposal, setSelectedProposal] = useState<any>(null);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const { data: request, isLoading: isLoadingRequest } = useQuery({
    queryKey: ['estimateRequest', id],
    queryFn: () => getEstimateRequestById(id!),
    enabled: !!id,
  });

  const { data: proposals, isLoading: isLoadingProposals } = useQuery({
    queryKey: ['proposals', id],
    queryFn: () => getProposalsByEstimateId(id!),
    enabled: !!id,
  });
console.log('proposals',proposals);


  const handleApprove = async () => {
    if (!selectedProposal) return;
    
    setIsActionLoading(true);
    try {
      await approveProposal(selectedProposal.id);
      queryClient.invalidateQueries(['proposals', id]);
      setIsApproveDialogOpen(false);
    } catch (error) {
      console.error('Error approving proposal:', error);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedProposal) return;
    
    setIsActionLoading(true);
    try {
      await rejectProposal(selectedProposal.id);
      queryClient.invalidateQueries(['proposals', id]);
      setIsRejectDialogOpen(false);
    } catch (error) {
      console.error('Error rejecting proposal:', error);
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
  console.log('request?.estimate_request_files',request?.estimate_request_files);
  
  return (
    <div className="space-y-6 fade-in">
      <div>
        <Title >{request.name}</Title>
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
                      {request.address.street}, {request.address.number} - {request.address.neighborhood}
                      <br />
                      {request.address.city}, {request.address.state} - {request.address.postal_code}
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
                        {new Date(request.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
          
            <Accordion variant="splitted" className='p-0'>
              <AccordionItem key="1" aria-label="Imagens enviadas" title="Imagens">
                <ImageGallery images={request?.estimate_request_files}/>
              </AccordionItem>
            </Accordion>
          
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
                  <h3 className="text-lg font-medium mb-2">Nenhuma proposta recebida</h3>
                  <p className="text-neutral-600">
                    Aguarde enquanto as empresas analisam sua solicitação.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {proposals.map((proposal) => (
                    <div
                      key={proposal.id}
                      className="p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium">
                              {proposal.company.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-medium">{proposal.company.name}</h4>
                              <p className="text-sm text-neutral-500">
                                {/* {proposal.company.address.city}, {proposal.company.address.state} */}
                                Endereço
                              </p>
                            </div>
                          </div>
                          <Text className="mt-2">{proposal.description}</Text>
                        </div>
                     
                          <div className="flex gap-2">
                           
                           <Subtitle>
                            {new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                              }).format(proposal.amount)}

                           </Subtitle>
                           <Chip color={proposal.approved_at ? "success": proposal.reject_at? "danger":"warning" } size='sm'>
                              {proposal.approved_at ? "Aprovado": proposal.reject_at? "Rejeitado":"Pendente" }
                            </Chip>
                          </div>
                         
                          
                        
                       
                      </div>
                      <div className='flex justify-end'>
                        {(!proposal.approved_at && !proposal.reject_at )&& (
                            <div className="mt-4 flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                startContent={<X size={16} />}
                                color='danger'
                                onPress={() => {
                                  setSelectedProposal(proposal);
                                  setIsRejectDialogOpen(true);
                                }}
                              >
                                Recusar
                              </Button>
                              <Button
                                size="sm"
                                color='success'
                                startContent={<FiCheck size={16} />}
                                onPress={() => {
                                  setSelectedProposal(proposal);
                                  setIsApproveDialogOpen(true);
                                }}
                              >
                                Aceitar
                              </Button>
                            </div>
                          )}
                      </div>
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
                <div className="text-2xl font-semibold text-neutral-800">
                  {proposals?.length || 0}
                </div>
                <div className="text-sm text-neutral-500">Propostas recebidas</div>
              </div>

              <div className="h-px bg-neutral-200" />

              <div>
                <h4 className="font-medium mb-2">Última atualização</h4>
                <div className="flex items-center gap-2 text-neutral-600">
                  <CiCalendar size={18} />
                  <span>
                    {new Date(request.updated_at ?? request.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
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
    </div>
  );
};

export default EstimateRequestDetailPage;