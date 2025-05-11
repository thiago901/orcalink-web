import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Building2, Calendar, FileText, Loader2, Filter, ArrowUpDown } from 'lucide-react';
import { getCompanyById } from '../../api/companies';
import { getCompanyServices } from '../../api/companyServices';
import { getEstimateRequests } from '../../api/estimateRequests';
import { getProposalsByCompanyId } from '../../api/proposals';



import ProposalForm from '../../components/proposals/ProposalForm';
import EstimateRequestDetailsDialog from '../../components/proposals/EstimateRequestDetailsDialog';
import { Button, Card, CardBody, CardHeader, Listbox, ListboxItem, Select, SelectItem, Tab, Tabs } from '@heroui/react';
import { Subtitle } from '../../components/ui/Subtitle';

const RADIUS_OPTIONS = [
  { key: '5000', label: '5 km' },
  { key: '10000', label: '10 km' },
  { key: '20000', label: '20 km' },
  { key: '50000', label: '50 km' },
];

const CompanyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  
  const [radius, setRadius] = useState(10000);
  const [sortBy, setSortBy] = useState<'date' | 'distance'>('date');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isProposalFormOpen, setIsProposalFormOpen] = useState(false);

  const { data: company, isLoading: isLoadingCompany } = useQuery({
    queryKey: ['company', id],
    queryFn: () => getCompanyById(id!),
    enabled: !!id,
  });
  
  
  const { data: services, isLoading: isLoadingServices } = useQuery({
    queryKey: ['companyServices', id],
    queryFn: () => getCompanyServices(id!),
    enabled: !!id,
  });

  const { data: requests, isLoading: isLoadingRequests } = useQuery({
    queryKey: ['estimateRequests', company?.address.latitude, company?.address.longitude, radius],
    queryFn: () => getEstimateRequests({
      latitude: company!.address.latitude,
      longitude: company!.address.longitude,
      radiusInMeters: radius,
    }),
    enabled: !!company?.address.latitude && !!company?.address.longitude,
  });

  const { data: proposals, isLoading: isLoadingProposals, refetch: refetchProposals } = useQuery({
    queryKey: ['companyProposals', id],
    queryFn: () => getProposalsByCompanyId(id!),
    enabled: !!id,
  });

  if (isLoadingCompany || isLoadingServices) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin " />
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

  const sortedRequests = requests?.sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    return 0;
  });

  const handleViewDetails = (request: any) => {
    setSelectedRequest(request);
    setIsDetailsOpen(true);
  };

  const handleSubmitProposal = () => {
    setIsDetailsOpen(false);
    setIsProposalFormOpen(true);
  };

  const hasSubmittedProposal = (requestId: string) => {
    return proposals?.some(proposal => proposal.estimate_request_id === requestId);
  };
console.log('request',sortedRequests);


return (
  <div>
    <Tabs>
      <Tab key="informations" title="Informações">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Subtitle>Informações da Empresa</Subtitle>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center  text-2xl font-medium ">
                      {company.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-lg font-medium ">{company.name}</h4>
                      <p >
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
                      <MapPin size={18} />
                      <span>
                        {company.address.address}
                        <br />
                        {company.address.city}, {company.address.state} - {company.address.zip}
                      </span>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <Subtitle>Serviços Oferecidos</Subtitle>
              </CardHeader>
              <CardBody>
                {!services?.length ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4 ">
                      <Building2 className="w-8 h-8 " />
                    </div>
                    <h3 className="text-lg font-medium mb-2 ">Nenhum serviço cadastrado</h3>
                    <p >
                      Esta empresa ainda não cadastrou seus serviços.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className="p-4 rounded-lg border border-neutral-200 "
                      >
                        <h4 className="font-medium ">{service.name}</h4>
                        <p className="text-sm  mt-1 ">
                          {service.category.name}
                        </p>
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
                    {new Date().toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </Tab>
      <Tab key="available-requests" title="Orçamentos Disponíveis">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <Subtitle>Orçamentos Disponíveis</Subtitle>
                <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                  <Select defaultSelectedKeys={[RADIUS_OPTIONS[0].key]} label="Select filter">
                    {RADIUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.key}>{opt.label}</SelectItem>
                    ))}
                  </Select>
         
                  <Button
                    variant="ghost"
                    startContent={<ArrowUpDown size={16} />}
                    onPress={() => setSortBy(sortBy === 'date' ? 'distance' : 'date')}
                  >
                    {sortBy === 'date' ? 'Data' : 'Distância'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              {isLoadingRequests ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin " />
                </div>
              ) : !sortedRequests?.length ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 " />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Nenhum orçamento disponível</h3>
                  <p className="">
                    Não há solicitações de orçamento na sua região no momento.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Listbox  >
                    
                      {sortedRequests.map((request,index) => (
                        <ListboxItem
                          key={request.id}
                          showDivider={sortedRequests.length-1!==index}
                         
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div>
                              <h4 className="font-medium">{request.name}</h4>
                              <div className="flex items-center gap-2 mt-1 text-sm ">
                                <MapPin size={14} />
                                <span>{request.address_city}, {request.address_state}</span>
                              </div>
                              <p className="mt-2 text-sm text-neutral-600">
                                
                                {request.description.slice(0,150)}
                              </p>
                              <div className="mt-4 flex flex-wrap gap-4 text-sm ">
                                <div className="flex items-center gap-1">
                                  <Calendar size={14} />
                                  <span>
                                    {new Date(request.created_at).toLocaleDateString('pt-BR')}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin size={14} />
                                  <span>{request.footage}m²</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              {!hasSubmittedProposal(request.id) ? (
                                <>
                                  <Button onPress={() => handleViewDetails(request)} color='primary' variant='ghost'>
                                    Ver Detalhes
                                  </Button>
                                  <Button
                                    
                                    color='primary'
                                    onPress={() => {
                                      setSelectedRequest(request);
                                      setIsProposalFormOpen(true);
                                    }}
                                  >
                                    Enviar Proposta
                                  </Button>
                                </>
                              ) : (
                                <Button variant="ghost" disabled color='success'>
                                  Proposta Enviada
                                </Button>
                              )}
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
      </Tab>
      <Tab key="proposals-sent" title="Propostas Enviadas">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Subtitle>Propostas Enviadas</Subtitle>
            </CardHeader>
            <CardBody>
              {isLoadingProposals ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin " />
                </div>
              ) : !proposals?.length ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 " />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Nenhuma proposta enviada</h3>
                  <p className="text-neutral-600">
                    Você ainda não enviou nenhuma proposta.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {proposals.map((proposal) => (
                    <div
                      key={proposal.id}
                      className="p-4 rounded-lg border border-neutral-200"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h4 className="font-medium">
                            {/* {proposal.estimate_request.name} */}
                            {'proposal.estimate_request.name'}
                          </h4>
                          <p className="text-sm  mt-1">
                            {/* {proposal.estimate_request.address_city}, {proposal.estimate_request.address_state} */}
                            Endereco
                          </p>
                          <p className="mt-2 text-neutral-600">
                            {proposal.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-neutral-800">
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            }).format(proposal.amount)}
                          </div>
                          <div className="mt-2 text-sm font-medium px-2 py-1 rounded-full bg-primary-50 ">
                          {proposal.approved_at ? "Aprovado": proposal.reject_at? "Rejeitado":"Pendente" }
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </Tab>
    </Tabs>
     {/* Dialogs */}
     <EstimateRequestDetailsDialog
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        request={selectedRequest}
        onSubmitProposal={handleSubmitProposal}
        hasSubmittedProposal={selectedRequest && hasSubmittedProposal(selectedRequest.id)}
      />

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
)
 
};

export default CompanyDetailPage;