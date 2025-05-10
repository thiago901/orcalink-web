import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Mail, Phone, Building2, Loader2 } from 'lucide-react';
import { getCompanyById } from '../../api/companies';
import { getCompanyServices } from '../../api/companyServices';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

const CompanyDetailPage = () => {
  const { id } = useParams<{ id: string }>();

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

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-neutral-800">{company.name}</h1>
        <p className="text-neutral-600">Detalhes da empresa</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Empresa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-2xl font-medium">
                    {company.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-lg font-medium">{company.name}</h4>
                    <p className="text-neutral-500">
                      {company.address.city}, {company.address.state}
                    </p>
                  </div>
                </div>

                {company.about && (
                  <div>
                    <h4 className="font-medium mb-2">Sobre</h4>
                    <p className="text-neutral-600">{company.about}</p>
                  </div>
                )}

                <div>
                  <h4 className="font-medium mb-2">Endereço</h4>
                  <div className="flex items-center gap-2 text-neutral-600">
                    <MapPin size={18} />
                    <span>
                      {company.address.address}
                      <br />
                      {company.address.city}, {company.address.state} - {company.address.zip}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Serviços Oferecidos</CardTitle>
            </CardHeader>
            <CardContent>
              {!services?.length ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Nenhum serviço cadastrado</h3>
                  <p className="text-neutral-600">
                    Esta empresa ainda não cadastrou seus serviços.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="p-4 rounded-lg border border-neutral-200"
                    >
                      <h4 className="font-medium">{service.name}</h4>
                      <p className="text-sm text-neutral-500 mt-1">
                        {service.category.name}
                      </p>
                    </div>
                  ))}
                </div>
              )}
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
                <div className="text-2xl font-semibold text-neutral-800">
                  {services?.length || 0}
                </div>
                <div className="text-sm text-neutral-500">Serviços cadastrados</div>
              </div>

              <div className="h-px bg-neutral-200" />

              <div>
                <h4 className="font-medium mb-2">Última atualização</h4>
                <div className="text-neutral-600">
                  {new Date(company.updated_at).toLocaleDateString('pt-BR')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompanyDetailPage;