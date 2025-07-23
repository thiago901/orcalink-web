import { Button, Card, CardBody, CardHeader } from '@heroui/react';
import React from 'react';


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

export interface Visit {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  requestedDate: Date;
  suggestedDate?: Date;
  status: 'PENDING' | 'CONFIRMED' | 'SUGGESTED' | 'RESCHEDULED' | 'CANCELLED';
  createdAt: Date;
  suggestedAt?: Date;
  observations?: string;
}

export interface TimeSlot {
  hour: string;
  available: boolean;
}

export const availableTimeSlots: TimeSlot[] = [
  { hour: '08:00', available: true },
  { hour: '09:00', available: true },
  { hour: '10:00', available: true },
  { hour: '11:00', available: true },
  { hour: '14:00', available: true },
  { hour: '15:00', available: true },
  { hour: '16:00', available: true },
  { hour: '17:00', available: true },
];
interface TimeSlotPickerProps {
  selectedDate: Date;
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
}

export const getAvailableTimeSlotsForDate = (date: Date): TimeSlot[] => {
  const dateString = date.toDateString();
  const bookedSlots = mockVisits
    .filter(visit => 
      (visit.status === 'CONFIRMED' || visit.status === 'PENDING') &&
      visit.requestedDate.toDateString() === dateString
    )
    .map(visit => visit.requestedDate.toTimeString().substring(0, 5));

  return availableTimeSlots.map(slot => ({
    ...slot,
    available: !bookedSlots.includes(slot.hour)
  }));
};

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  selectedDate,
  selectedTime,
  onTimeSelect,
}) => {
  const timeSlots = getAvailableTimeSlotsForDate(selectedDate);

  return (
    <Card className="w-full">
      <CardHeader>
        <h3 className="text-lg font-semibold">Horários Disponíveis</h3>
      </CardHeader>
      <CardBody className="pt-0">
        <div className="grid grid-cols-2 gap-2">
          {timeSlots.map(slot => (
            <Button
              key={slot.hour}
              variant={selectedTime === slot.hour ? 'solid' : 'bordered'}
              color={selectedTime === slot.hour ? 'primary' : 'default'}
              isDisabled={!slot.available}
              onPress={() => slot.available && onTimeSelect(slot.hour)}
              className="h-12"
            >
              {slot.hour}
            </Button>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};