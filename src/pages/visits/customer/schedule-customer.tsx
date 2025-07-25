import {
  Button,
  Calendar,
  Card,
  CardBody,
  CardHeader,
  Input,
  useDisclosure,
} from "@heroui/react";
import React, { useState } from "react";
import { TimeSlotPicker } from "../../../components/time-slot-picker";
import { ConfirmationModal } from "./modal-confimr";
import { parseDate } from "@internationalized/date";

export const ClientScheduling: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleConfirm = async () => {
    if (
      !selectedDate ||
      !selectedTime ||
      !clientName ||
      !clientPhone ||
      !clientEmail
    )
      return;

    setLoading(true);

    // Simular chamada API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const [hours, minutes] = selectedTime.split(":");
    const requestedDate = new Date(selectedDate);
    requestedDate.setHours(parseInt(hours), parseInt(minutes));

    // addVisit({
    //   clientName,
    //   clientPhone,
    //   clientEmail,
    //   requestedDate,
    //   status: 'PENDING',
    // });

    setLoading(false);
    onClose();

    // Reset form
    setSelectedDate(null);
    setSelectedTime(null);
    setClientName("");
    setClientPhone("");
    setClientEmail("");

    alert("Solicitação de agendamento enviada com sucesso!");
  };

  const canOpenModal =
    selectedDate && selectedTime && clientName && clientPhone && clientEmail;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <h1 className="text-2xl font-bold">Agendamento de Visita Técnica</h1>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Dados do Cliente</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <Input
                label="Nome Completo"
                placeholder="Digite seu nome"
                value={clientName}
                onValueChange={setClientName}
                isRequired
              />
              <Input
                label="Telefone"
                placeholder="(11) 99999-9999"
                value={clientPhone}
                onValueChange={setClientPhone}
                isRequired
              />
              <Input
                label="E-mail"
                placeholder="seu@email.com"
                type="email"
                value={clientEmail}
                onValueChange={setClientEmail}
                isRequired
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
        </div>

        <div className="space-y-6">
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />

          {canOpenModal && (
            <Button
              color="primary"
              size="lg"
              className="w-full"
              onPress={onOpen}
            >
              Solicitar Agendamento
            </Button>
          )}
        </div>
      </div>

      {selectedDate && selectedTime && (
        <ConfirmationModal
          isOpen={isOpen}
          onClose={onClose}
          onConfirm={handleConfirm}
          date={selectedDate}
          time={selectedTime}
          loading={loading}
        />
      )}
    </div>
  );

};
