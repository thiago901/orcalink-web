import { useEffect, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/authStore';
import { getCompaniesByOwnerId } from '../../api/companies';


import { Button, Card, CardBody, CardHeader, Link, Listbox, ListboxItem } from '@heroui/react';

import { Title } from '../../components/ui/Title';

import { Subtitle } from '../../components/ui/Subtitle';
import { Text } from '../../components/ui/Text';
import { FaArrowRight, FaBuilding } from 'react-icons/fa6';
import { FiLoader } from 'react-icons/fi';


const DashboardPage = () => {
  const { user } = useAuthStore();
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [geolocationError, setGeolocationError] = useState<string | null>(null);


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
          <Title>Dashboard</Title>
          <Text>
            Bem-vindo de volta, {user?.name?.split(' ')[0] || 'Usuário'}!
          </Text>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
  
     
          
          {(companies?.length > 0) && (
            
              <Button as={Link}  startContent={<FaBuilding size={18} />} href="/dashboard/companies">
                Minhas Empresas
              </Button>
            
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Location Status or Companies */}
        {companies?.length > 0 ? (
          <Card>
            <CardHeader>
              <Subtitle>Minhas Empresas</Subtitle>
            </CardHeader>
            <CardBody>
              {isLoadingCompanies ? (
                <div className="flex justify-center py-8">
                  <FiLoader className="w-8 h-8 animate-spin text-primary-500" />
                </div>
              ) : (
                <div className="flex flex-col h-full">
                  <div className='flex-1'>
                  <Listbox >
                  {companies.slice(0, 3).map((company) => (
                    <ListboxItem 
                      key={company.id}
                      href={`/dashboard/companies/${company.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium shrink-0">
                          {company.name.charAt(0)}
                        </div>
                        <div className='flex-1'>
                          <h4 className="font-medium">{company.name}</h4>
                        </div>
                        <div>
                          <FaArrowRight size={16}/>
                        </div>
                      </div>
                     
                    </ListboxItem>
                  ))}
                    
                  </Listbox>
                  </div>
                
                  
                  <div className="text-center pt-2">
                    <Link href="/dashboard/companies" className="text-primary-600 hover:text-primary-700 font-medium">
                      Ver todas as empresas
                    </Link>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <Subtitle>Sua Localização</Subtitle>
            </CardHeader>
            <CardBody>
              {geolocationError ? (
                <div className="p-4 bg-error-50 text-error-700 rounded-md">
                  <p>{geolocationError}</p>
                  <p className="mt-2 text-sm">
                    A localização é importante para encontrar serviços perto de você.
                  </p>
                </div>
              ) : !position ? (
                <div className="flex justify-center py-8">
                  <FiLoader className="w-8 h-8 animate-spin text-primary-500" />
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
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
};



export default DashboardPage;