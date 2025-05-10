import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/authStore';
import { getEstimateRequestsByUserId } from '../../api/estimateRequests';
import { getCompaniesByOwnerId } from '../../api/companies';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Plus, ArrowRight, Loader2 } from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuthStore();
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [geolocationError, setGeolocationError] = useState<string | null>(null);

  // Get user's estimate requests
  const { 
    data: estimateRequests,
    isLoading: isLoadingRequests 
  } = useQuery({
    queryKey: ['estimateRequests', user?.id],
    queryFn: () => getEstimateRequestsByUserId(user?.id || ''),
    enabled: !!user?.id,
  });

  // Get user's companies
  const { 
    data: companies,
    isLoading: isLoadingCompanies 
  } = useQuery({
    queryKey: ['companies', user?.id],
    queryFn: () => getCompaniesByOwnerId(user?.id || ''),
    enabled: !!user?.id,
  });

  // Get user's current position
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPosition(position);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setGeolocationError('Não foi possível obter sua localização.');
        }
      );
    } else {
      setGeolocationError('Geolocalização não é suportada pelo seu navegador.');
    }
  }, []);

  return (
    <div className="space-y-8 fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Dashboard</h1>
          <p className="text-neutral-600">
            Bem-vindo de volta, {user?.name?.split(' ')[0] || 'Usuário'}!
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Link to="/dashboard/estimate-requests/new">
            <Button icon={<Plus size={18} />}>
              Solicitar Orçamento
            </Button>
          </Link>
          
          {(companies?.length > 0) && (
            <Link to="/dashboard/companies">
              <Button variant="outline" icon={<Building2 size={18} />}>
                Minhas Empresas
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Estimate Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Orçamentos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingRequests ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
              </div>
            ) : estimateRequests?.length > 0 ? (
              <div className="space-y-4">
                {estimateRequests.slice(0, 3).map((request) => (
                  <div 
                    key={request.id}
                    className="p-4 rounded-md border border-neutral-200 hover:border-primary-300 hover:shadow-sm transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{request.name}</h4>
                        <p className="text-sm text-neutral-500 mt-1">{request.address_city}, {request.address_state}</p>
                      </div>
                      <div className="text-sm font-medium px-2 py-1 rounded-full bg-primary-50 text-primary-700">
                        {request.proposals?.length || 0} propostas
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Link to={`/dashboard/estimate-requests/${request.id}`}>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-primary-600"
                          icon={<ArrowRight size={16} />}
                        >
                          Ver detalhes
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
                
                <div className="text-center pt-2">
                  <Link to="/dashboard/estimate-requests" className="text-primary-600 hover:text-primary-700 font-medium">
                    Ver todos os orçamentos
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-neutral-500 mb-4">Você ainda não tem nenhum orçamento solicitado.</p>
                <Link to="/dashboard/estimate-requests/new">
                  <Button icon={<Plus size={18} />}>
                    Solicitar Orçamento
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Location Status or Companies */}
        {companies?.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Minhas Empresas</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingCompanies ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                </div>
              ) : (
                <div className="space-y-4">
                  {companies.slice(0, 3).map((company) => (
                    <div 
                      key={company.id}
                      className="p-4 rounded-md border border-neutral-200 hover:border-primary-300 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium shrink-0">
                          {company.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-medium">{company.name}</h4>
                          <p className="text-sm text-neutral-500">{company.address?.city}, {company.address?.state}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Link to={`/dashboard/companies/${company.id}`}>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-primary-600"
                            icon={<ArrowRight size={16} />}
                          >
                            Gerenciar
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                  
                  <div className="text-center pt-2">
                    <Link to="/dashboard/companies" className="text-primary-600 hover:text-primary-700 font-medium">
                      Ver todas as empresas
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Sua Localização</CardTitle>
            </CardHeader>
            <CardContent>
              {geolocationError ? (
                <div className="p-4 bg-error-50 text-error-700 rounded-md">
                  <p>{geolocationError}</p>
                  <p className="mt-2 text-sm">
                    A localização é importante para encontrar serviços perto de você.
                  </p>
                </div>
              ) : !position ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                </div>
              ) : (
                <div>
                  <div className="p-4 bg-success-50 text-success-700 rounded-md mb-4">
                    <p>Localização obtida com sucesso!</p>
                    <p className="mt-1 text-sm">
                      Latitude: {position.coords.latitude.toFixed(6)}<br />
                      Longitude: {position.coords.longitude.toFixed(6)}
                    </p>
                  </div>
                  <p className="text-neutral-600 text-sm">
                    Sua localização será usada para encontrar prestadores de serviço próximos a você.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

// Import inside the component to avoid circular dependency
import { Building2 } from 'lucide-react';

export default DashboardPage;