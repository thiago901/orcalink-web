import { useQuery } from '@tanstack/react-query';


import { useAuthStore } from '../../stores/authStore';
import { getCompaniesByOwnerId } from '../../api/companies';
import { Button, Card, CardBody, CardHeader, Link } from '@heroui/react';
import { Subtitle } from '../../components/ui/Subtitle';
import { Title } from '../../components/ui/Title';
import { Text } from '../../components/ui/Text';
import { FiLoader, FiPlus } from 'react-icons/fi';
import { FaBuilding } from 'react-icons/fa6';




const CompaniesPage = () => {
  const { user } = useAuthStore();
  
  
  const { data: companies, isLoading} = useQuery({
    queryKey: ['companies', user?.id],
    queryFn: () => getCompaniesByOwnerId(user?.id || ''),
    enabled: !!user?.id,
  });
  console.log('companies',companies);
  

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Title >Empresas</Title>
          <Text >Gerencie suas empresas cadastradas</Text>
        </div>

        
          <Button startContent={<FiPlus size={18} />} color='primary' as={Link} href="/dashboard/companies/new">
            Nova Empresa
          </Button>
        
      </div>

      <Card>
        <CardHeader>
          <Subtitle>Minhas Empresas</Subtitle>
        </CardHeader>
        <CardBody>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <FiLoader className="w-8 h-8 animate-spin text-primary-500" />
            </div>
          ) : !companies?.length ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaBuilding className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Nenhuma empresa cadastrada</h3>
              <p className="text-neutral-600 mb-6">
                Você ainda não tem nenhuma empresa cadastrada.
                Cadastre uma agora mesmo!
              </p>
              
                <Button startContent={<FiPlus size={18} />} color='primary' as={Link} href="/dashboard/companies/new">
                  Cadastrar Empresa
                </Button>
              
            </div>
          ) : (
            <div className="space-y-4">
              {companies.map((company) => (
                <Link
                  key={company.id}
                  href={`/dashboard/companies/${company.id}`}
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
        </CardBody>
      </Card>
    </div>
  );
};

export default CompaniesPage;