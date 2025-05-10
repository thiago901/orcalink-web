import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Loader2, MapPin, Calendar } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { getEstimateRequestsByUserId } from '../../api/estimateRequests';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const EstimateRequestsPage = () => {
  const { user } = useAuthStore();

  const { data: requests, isLoading } = useQuery({
    queryKey: ['estimateRequests', user?.id],
    queryFn: () => getEstimateRequestsByUserId(user?.id || ''),
    enabled: !!user?.id,
  });

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Orçamentos</h1>
          <p className="text-neutral-600">Gerencie suas solicitações de orçamento</p>
        </div>

        <Link to="/dashboard/estimate-requests/new">
          <Button icon={<Plus size={18} />}>
            Novo Orçamento
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Solicitações</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
          ) : !requests?.length ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Nenhum orçamento solicitado</h3>
              <p className="text-neutral-600 mb-6">
                Você ainda não tem nenhuma solicitação de orçamento.
                Crie uma agora mesmo!
              </p>
              <Link to="/dashboard/estimate-requests/new">
                <Button icon={<Plus size={18} />}>
                  Solicitar Orçamento
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <Link
                  key={request.id}
                  to={`/dashboard/estimate-requests/${request.id}`}
                  className="block"
                >
                  <div className="p-4 rounded-lg border border-neutral-200 hover:border-primary-300 hover:shadow-sm transition-all">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="font-medium">{request.name}</h4>
                        <div className="flex items-center gap-2 mt-1 text-sm text-neutral-500">
                          <MapPin size={14} />
                          <span>{request.address_city}, {request.address_state}</span>
                        </div>
                      </div>
                      <div className="text-sm font-medium px-2 py-1 rounded-full bg-primary-50 text-primary-700">
                        {request.proposals?.length || 0} propostas
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-neutral-600 line-clamp-2">
                      {request.description}
                    </p>
                    <div className="mt-4 flex items-center gap-4 text-sm text-neutral-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>
                          {new Date(request.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EstimateRequestsPage;