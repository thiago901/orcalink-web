import { useQuery } from '@tanstack/react-query';


import { useAuthStore } from '../../stores/authStore';
import { getEstimateRequestsByUserId } from '../../api/estimateRequests';


import { Button, Card, CardBody, CardHeader, Divider, Link, Listbox, ListboxItem } from '@heroui/react';
import { Subtitle } from '../../components/ui/Subtitle';
import { FiLoader, FiPlus } from 'react-icons/fi';
import { CiCalendar, CiMapPin } from 'react-icons/ci';

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
          <h1 className="text-2xl font-bold ">Orçamentos</h1>
          <p className="text-neutral-600">Gerencie suas solicitações de orçamento</p>
        </div>

  
          <Button startContent={<FiPlus size={18} />} color='primary' as={Link} href="/dashboard/estimate-requests/new">
            Novo Orçamento
          </Button>
       
      </div>

      <Card>
        <CardHeader >
          <Subtitle>Solicitações</Subtitle>
        </CardHeader>
          <Divider/>
        <CardBody className='p-0'>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <FiLoader className="w-8 h-8 animate-spin text-primary-500" />
            </div>
          ) : !requests?.length ? (
            <div className="text-center py-8">
              <div className="w-16 h-16  rounded-full flex items-center justify-center mx-auto mb-4">
                <CiMapPin className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Nenhum orçamento solicitado</h3>
              <p className="text-neutral-600 mb-6">
                Você ainda não tem nenhuma solicitação de orçamento.
                Crie uma agora mesmo!
              </p>
              
                <Button as={Link} startContent={<FiPlus size={18} />} color='primary' href="/dashboard/estimate-requests/new">
                  Solicitar Orçamento
                </Button>
              
            </div>
          ) : (
            <div className="space-y-4">
              <Listbox >
               {requests.map((request) => (
                <ListboxItem
                  key={request.id}
                  href={`/dashboard/estimate-requests/${request.id}`}
                  
                >
                  <div className="py-2">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="font-medium">{request.name}</h4>
                        <div className="flex items-center gap-2 mt-1 text-sm text-neutral-500">
                          <CiMapPin size={14} />
                          <span>{request.address.city}, {request.address.state}</span>
                        </div>
                      </div>
                      <div className="text-sm font-medium px-2 py-1 rounded-full text-primary-700">
                        {request.proposals?.length || 0} propostas
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-neutral-600 line-clamp-2">
                      {request.description}
                    </p>
                    <div className="mt-4 flex items-center gap-4 text-sm text-neutral-500">
                      <div className="flex items-center gap-1">
                        <CiCalendar size={14} />
                        <span>
                          {new Date(request.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* <Divider className='mt-2' /> */}
                </ListboxItem>
              ))}
              </Listbox>
            
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default EstimateRequestsPage;