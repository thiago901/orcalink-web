import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Loader2, Building2 } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { getCompaniesByOwnerId } from '../../api/companies';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';


const CompaniesPage = () => {
  const { user } = useAuthStore();
  
  
  const { data: companies, isLoading} = useQuery({
    queryKey: ['companies', user?.id],
    queryFn: () => getCompaniesByOwnerId(user?.id || ''),
    enabled: !!user?.id,
  });

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Empresas</h1>
          <p className="text-neutral-600">Gerencie suas empresas cadastradas</p>
        </div>

        <Link to="/dashboard/companies/new">
          <Button icon={<Plus size={18} />}>
            Nova Empresa
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Minhas Empresas</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
          ) : !companies?.length ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Nenhuma empresa cadastrada</h3>
              <p className="text-neutral-600 mb-6">
                Você ainda não tem nenhuma empresa cadastrada.
                Cadastre uma agora mesmo!
              </p>
              <Link to="/dashboard/companies/new">
                <Button icon={<Plus size={18} />}>
                  Cadastrar Empresa
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {companies.map((company) => (
                <Link
                  key={company.id}
                  to={`/dashboard/companies/${company.id}`}
                  className="block"
                >
                  <div className="p-4 rounded-lg border border-neutral-200 hover:border-primary-300 hover:shadow-sm transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium text-lg shrink-0">
                        {company.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-medium">{company.name}</h4>
                        <p className="text-sm text-neutral-500">
                          {company.address.city}, {company.address.state}
                        </p>
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

export default CompaniesPage;