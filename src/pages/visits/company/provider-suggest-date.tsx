import { Button, Card, CardBody, CardHeader, Textarea } from '@heroui/react';
import React, { useState } from 'react';
import { TimeSlotPicker } from '../../../components/time-slot-picker';


export function ProviderSuggestDate(){
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [observations, setObservations] = useState('');
  const [loading, setLoading] = useState(false);
  
  // const { updateVisit } = useVisits();

  const handleSuggestDate = async () => {
    if (!selectedDate || !selectedTime) return;

    setLoading(true);

    // Simular chamada API
    await new Promise(resolve => setTimeout(resolve, 1000));

    const [hours, minutes] = selectedTime.split(':');
    const suggestedDate = new Date(selectedDate);
    suggestedDate.setHours(parseInt(hours), parseInt(minutes));

    // updateVisit(visit.id, {
    //   status: 'SUGGESTED',
    //   suggestedDate,
    //   suggestedAt: new Date(),
    //   observations: observations.trim() || undefined,
    // });

    setLoading(false);
    alert('Nova data sugerida com sucesso!');
    // onBack();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="mb-6">
        <CardHeader className="flex-col items-start">
          <div className="flex items-center gap-2 w-full">
            <Button
              variant="light"
              // onPress={onBack}
              className="p-0 min-w-0"
            >
              ← Voltar
            </Button>
          </div>
          <h1 className="text-2xl font-bold">Sugerir Nova Data</h1>
          <p className="text-gray-600">Cliente: {'visit.clientName'}</p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Observações</h2>
            </CardHeader>
            <CardBody>
              <Textarea
                label="Observações (opcional)"
                placeholder="Digite observações sobre a mudança de data..."
                value={observations}
                onValueChange={setObservations}
                maxRows={4}
              />
            </CardBody>
          </Card>

          {selectedDate && (
            <TimeSlotPicker
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onTimeSelect={setSelectedTime}
            />
          )}

          {selectedDate && selectedTime && (
            <Button
              color="primary"
              size="lg"
              className="w-full"
              onPress={handleSuggestDate}
              isLoading={loading}
            >
              Sugerir Nova Data
            </Button>
          )}
        </div>

        <div>
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </div>
      </div>
    </div>
  );
};