
import { useParams } from 'react-router-dom';
import { useQuery} from '@tanstack/react-query';


import { Title } from '../../components/ui/Title';

import { Text } from '../../components/ui/Text';
import { Accordion, AccordionItem, BreadcrumbItem, Breadcrumbs, Card, CardBody, CardHeader } from '@heroui/react';
import { Subtitle } from '../../components/ui/Subtitle';
import ImageGallery from '../../components/image-gallery';
import { getJobById } from '../../api/jobs-service';
import { FiLoader } from 'react-icons/fi';
import { CiCalendar, CiMail, CiMapPin, CiPhone } from 'react-icons/ci';


const JobDetailPage = () => {
  const { id } = useParams<{ id:string }>();

  
  const { data: request, isLoading: isLoadingRequest } = useQuery({
    queryKey: ['job', id],
    queryFn: () => getJobById(id!),
    enabled: !!id,
  });




  if (isLoadingRequest) {
    return (
      <div className="flex justify-center py-8">
        <FiLoader className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium mb-2">Trabalho não encontrado</h3>
        <p className="text-neutral-600">
          O orçamento que você está procurando não existe ou foi removido.
        </p>
      </div>
    );
  }
  


  return (
    <div className="space-y-6 fade-in">
       <Breadcrumbs>
        <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
        <BreadcrumbItem href={`dashboard/companies/${request.company_id}`}>
          Orçamentos
        </BreadcrumbItem>
        <BreadcrumbItem>{request.estimate_request.name}</BreadcrumbItem>
      </Breadcrumbs>
      <div>
        <Title >{request.estimate_request.name}</Title>
        <Text>Detalhes da solicitação de orçamento</Text>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <Subtitle>Informações do Projeto</Subtitle>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Descrição</h4>
                  <p className="text-neutral-600">{request.estimate_request.description}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Metragem</h4>
                  <p className="text-neutral-600">{request.estimate_request.footage}m²</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Endereço</h4>
                  <div className="flex items-center gap-2 text-neutral-600">
                    <CiMapPin size={18} />
                    <span>
                      {request.estimate_request.address.street}, {request.estimate_request.address.number} - {request.estimate_request.address.neighborhood}
                      <br />
                      {request.estimate_request.address.city}, {request.estimate_request.address.state} - {request.estimate_request.address.postal_code}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Contato</h4>
                    <div className="space-y-2 text-neutral-600">
                      <div className="flex items-center gap-2">
                        <CiPhone size={18} />
                        <span>{request.estimate_request.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CiMail size={18} />
                        <span>{request.estimate_request.email}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Data da solicitação</h4>
                    <div className="flex items-center gap-2 text-neutral-600">
                      <CiCalendar size={18} />
                      <span>
                        {new Date(request.estimate_request.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
          
            <Accordion variant="splitted" className='p-0'>
              <AccordionItem key="1" aria-label="Imagens enviadas" title="Imagens">
                <ImageGallery images={request?.estimate_request_files||[]}/>
              </AccordionItem>
            </Accordion>
          
  
         
        </div>

        <Card>
          <CardHeader>
            <Subtitle>Status</Subtitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-neutral-500">Projeto confirmado</div>
                <div className="text-sm text-neutral-500">
                {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(request.proposal.amount)}
                </div>

              </div>

              <div className="h-px bg-neutral-200" />

              <div>
                <h4 className="font-medium mb-2">Última atualização</h4>
                <div className="flex items-center gap-2 text-neutral-600">
                  <CiCalendar size={18} />
                  <span>
                    {new Date(request.estimate_request.updated_at ?? request.estimate_request.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

    </div>

  );
};

export default JobDetailPage;