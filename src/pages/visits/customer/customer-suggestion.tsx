import React from 'react';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { mockVisits } from '../../../components/time-slot-picker';
import { Button, Card, CardBody, CardHeader, Chip } from '@heroui/react';


export const ClientSuggestions: React.FC = () => {
//   const { visits, updateVisit } = useVisits();
  
  const suggestedVisits = mockVisits.filter(visit => visit.status === 'SUGGESTED');

  const handleAcceptSuggestion = (visitId: string) => {
    // updateVisit(visitId, { status: 'RESCHEDULED' });
    alert('Sugestão aceita! Sua visita foi reagendada.');
  };

  const handleRejectSuggestion = (visitId: string) => {
    // updateVisit(visitId, { status: 'PENDING' });
    alert('Sugestão recusada. Seu agendamento retornou ao status pendente.');
  };

  if (suggestedVisits.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardBody className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">Nenhuma sugestão disponível</h2>
            <p className="text-gray-600">Você não possui visitas com novas datas sugeridas.</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <h1 className="text-2xl font-bold">Visitas com Sugestões</h1>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {suggestedVisits.map(visit => (
          <Card key={visit.id} className="w-full">
            <CardBody className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{visit.clientName}</h3>
                    <Chip color="warning" variant="flat" size="sm">
                      Nova data sugerida
                    </Chip>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Data original solicitada:</p>
                      <p className="font-medium">
                        {format(visit.requestedDate, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                    
                    {visit.suggestedDate && (
                      <div>
                        <p className="text-gray-600">Nova data sugerida:</p>
                        <p className="font-medium text-primary">
                          {format(visit.suggestedDate, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </p>
                      </div>
                    )}
                  </div>

                  {visit.observations && (
                    <div className="mt-3">
                      <p className="text-gray-600 text-sm mb-1">Observações:</p>
                      <p className="text-sm bg-gray-50 p-2 rounded">{visit.observations}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    color="success"
                    variant="solid"
                    onPress={() => handleAcceptSuggestion(visit.id)}
                  >
                    Aceitar Sugestão
                  </Button>
                  <Button
                    color="danger"
                    variant="bordered"
                    onPress={() => handleRejectSuggestion(visit.id)}
                  >
                    Recusar Sugestão
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