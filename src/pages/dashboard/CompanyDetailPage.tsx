import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Building2, Calendar, FileText, Loader2, Filter, ArrowUpDown } from 'lucide-react';
import { getCompanyById } from '../../api/companies';
import { getCompanyServices } from '../../api/companyServices';
import { getEstimateRequests } from '../../api/estimateRequests';
import { getProposalsByCompanyId } from '../../api/proposals';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import ProposalForm from '../../components/proposals/ProposalForm';
import EstimateRequestDetailsDialog from '../../components/proposals/EstimateRequestDetailsDialog';

const RADIUS_OPTIONS = [
  { value: '5000', label: '5 km' },
  { value: '10000', label: '10 km' },
  { value: '20000', label: '20 km' },
  { value: '50000', label: '50 km' },
];

const CompanyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'info' | 'requests' | 'proposals'>('info');
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
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
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

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-neutral-800">{company.name}</h1>
        <p className="text-neutral-600">Detalhes da empresa</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-neutral-200">
        <button
          onClick={() => setActiveTab('info')}
          className={`pb-2 px-1 font-medium transition-colors ${
            activeTab === 'info'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-neutral-600 hover:text-neutral-800'
          }`}
        >
          Informações
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`pb-2 px-1 font-medium transition-colors ${
            activeTab === 'requests'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-neutral-600 hover:text-neutral-800'
          }`}
        >
          Orçamentos Disponíveis
        </button>
        <button
          onClick={() => setActiveTab('proposals')}
          className={`pb-2 px-1 font-medium transition-colors ${
            activeTab === 'proposals'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-neutral-600 hover:text-neutral-800'
          }`}
        >
          Propostas Enviadas
        </button>
      </div>

      {activeTab === 'info' ? (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Info content */}
        </div>
      ) : activeTab === 'requests' ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle>Orçamentos Disponíveis</CardTitle>
                <div className="flex gap-2">
                  <Select
                    value={radius.toString()}
                    onChange={(e) => setRadius(Number(e.target.value))}
                    options={RADIUS_OPTIONS}
                  />
                  <Button
                    variant="outline"
                    icon={<ArrowUpDown size={16} />}
                    onClick={() => setSortBy(sortBy === 'date' ? 'distance' : 'date')}
                  >
                    {sortBy === 'date' ? 'Data' : 'Distância'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingRequests ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                </div>
              ) : !sortedRequests?.length ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Nenhum orçamento disponível</h3>
                  <p className="text-neutral-600">
                    Não há solicitações de orçamento na sua região no momento.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedRequests.map((request) => (
                    <div
                      key={request.id}
                      className="p-4 rounded-lg border border-neutral-200 hover:border-primary-300 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div>
                          <h4 className="font-medium">{request.name}</h4>
                          <div className="flex items-center gap-2 mt-1 text-sm text-neutral-500">
                            <MapPin size={14} />
                            <span>{request.address_city}, {request.address_state}</span>
                          </div>
                          <p className="mt-2 text-sm text-neutral-600">
                            {request.description}
                          </p>
                          <div className="mt-4 flex flex-wrap gap-4 text-sm text-neutral-500">
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
                              <Button onClick={() => handleViewDetails(request)}>
                                Ver Detalhes
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setIsProposalFormOpen(true);
                                }}
                              >
                                Enviar Proposta
                              </Button>
                            </>
                          ) : (
                            <Button variant="outline" disabled>
                              Proposta Enviada
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Propostas Enviadas</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingProposals ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                </div>
              ) : !proposals?.length ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-primary-600" />
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
                            {proposal.estimate_request.name}
                          </h4>
                          <p className="text-sm text-neutral-500 mt-1">
                            {proposal.estimate_request.address_city}, {proposal.estimate_request.address_state}
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
                          <div className="mt-2 text-sm font-medium px-2 py-1 rounded-full bg-primary-50 text-primary-700">
                            {proposal.status}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

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
  );
};

export default CompanyDetailPage;