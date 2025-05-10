import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Building2, Calendar, FileText, Loader2 } from 'lucide-react';
import { getProposalById } from '../../api/proposals';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

const ProposalDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data: proposal, isLoading } = useQuery({
    queryKey: ['proposal', id],
    queryFn: () => getProposalById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium mb-2">Proposta não encontrada</h3>
        <p className="text-neutral-600">
          A proposta que você está procurando não existe ou foi removida.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-neutral-800">Detalhes da Proposta</h1>
        <p className="text-neutral-600">Visualize as informações da proposta enviada</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Proposta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Valor</h4>
                  <div className="text-2xl font-semibold text-neutral-800">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(proposal.amount)}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Descrição</h4>
                  <p className="text-neutral-600">{proposal.description}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Empresa</h4>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium">
                      {proposal.company.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-medium">{proposal.company.name}</h4>
                      <p className="text-sm text-neutral-500">
                        {proposal.company.address.city}, {proposal.company.address.state}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Solicitação de Orçamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">{proposal.estimate_request.name}</h4>
                  <p className="text-neutral-600">
                    {proposal.estimate_request.description}
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Metragem</h4>
                    <p className="text-neutral-600">
                      {proposal.estimate_request.footage}m²
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Localização</h4>
                    <div className="flex items-center gap-2 text-neutral-600">
                      <MapPin size={18} />
                      <span>
                        {proposal.estimate_request.address_city}, {proposal.estimate_request.address_state}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-lg font-medium px-3 py-1.5 rounded-full bg-primary-50 text-primary-700 inline-block">
                  {proposal.status}
                </div>
              </div>

              <div className="h-px bg-neutral-200" />

              <div>
                <h4 className="font-medium mb-2">Data de envio</h4>
                <div className="flex items-center gap-2 text-neutral-600">
                  <Calendar size={18} />
                  <span>
                    {new Date(proposal.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Última atualização</h4>
                <div className="flex items-center gap-2 text-neutral-600">
                  <Calendar size={18} />
                  <span>
                    {new Date(proposal.updated_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProposalDetailPage;