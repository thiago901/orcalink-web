

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button, Card, CardBody, CardHeader, Chip } from '@heroui/react';


export const mockVisits: Visit[] = [
  {
    id: '1',
    clientName: 'João Silva',
    clientPhone: '(11) 99999-1111',
    clientEmail: 'joao@email.com',
    requestedDate: new Date('2024-12-20T10:00:00'),
    status: 'PENDING',
    createdAt: new Date('2024-12-15T14:30:00'),
  },
  {
    id: '2',
    clientName: 'Maria Santos',
    clientPhone: '(11) 99999-2222',
    clientEmail: 'maria@email.com',
    requestedDate: new Date('2024-12-22T14:00:00'),
    status: 'CONFIRMED',
    createdAt: new Date('2024-12-16T09:15:00'),
  },
  {
    id: '3',
    clientName: 'Pedro Costa',
    clientPhone: '(11) 99999-3333',
    clientEmail: 'pedro@email.com',
    requestedDate: new Date('2024-12-21T09:00:00'),
    suggestedDate: new Date('2024-12-23T15:00:00'),
    status: 'SUGGESTED',
    createdAt: new Date('2024-12-17T11:20:00'),
    suggestedAt: new Date('2024-12-18T16:45:00'),
    observations: 'Cliente solicitou horário da manhã, mas temos disponibilidade apenas à tarde.',
  },
];
export function ProviderPendingRequests(){
  
  
  const pendingVisits = mockVisits.filter(visit => visit.status === 'PENDING');
  

  const handleConfirmVisit = (visitId: string) => {
    // updateVisit(visitId, { status: 'CONFIRMED' });
    alert('Visita confirmada com sucesso!');
  };

  if (pendingVisits.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardBody className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">Nenhuma solicitação pendente</h2>
            <p className="text-gray-600">Todas as solicitações foram processadas.</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <h1 className="text-2xl font-bold">Solicitações Pendentes</h1>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {pendingVisits.map(visit => (
          <Card key={visit.id} className="w-full">
            <CardBody className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{visit.clientName}</h3>
                    <Chip color="warning" variant="flat" size="sm">
                      Pendente
                    </Chip>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Data e horário solicitado:</p>
                      <p className="font-medium">
                        {format(visit.requestedDate, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-gray-600">Contato:</p>
                      <p className="font-medium">{visit.clientPhone}</p>
                      <p className="text-sm text-gray-500">{visit.clientEmail}</p>
                    </div>
                  </div>

                  <div className="mt-2">
                    <p className="text-gray-600 text-sm">Solicitado em:</p>
                    <p className="text-sm">
                      {format(visit.createdAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    color="success"
                    variant="solid"
                    onPress={() => handleConfirmVisit(visit.id)}
                  >
                    Confirmar
                  </Button>
                  <Button
                    color="primary"
                    variant="bordered"
                    // onPress={() => onSuggestNewDate(visit.id)}
                  >
                    Sugerir Nova Data
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};