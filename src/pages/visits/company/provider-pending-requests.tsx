import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button, Card, CardBody, Chip, useDisclosure } from "@heroui/react";
import {
  confirmVisitById,
  getAllVisitByCompany,
  suggestVisitById,
  VisitStatus,
} from "../../../api/visits";
import { useCompanyStore } from "../../../stores/companyStore";
import { useQuery } from "@tanstack/react-query";
import { DatePicker } from "../../../components/date-picker";
import { Text } from "../../../components/ui/Text";
import { useCallback, useState } from "react";

import { RescheduleCompanyUpdateModal } from "../../../components/modals/reschedule-company-update-modal";

export function ProviderPendingRequests() {
  const behaviorByStatus: Record<VisitStatus, object> = {
    CANCELED: {
      color: "danger",
      variant: "light",
      label: "Cancelado",
      isSuggested: true,
      isConfirmed: true,
    },
    COMPLETED: {
      color: "",
      variant: "",
      label: "",
      isSuggested: true,
      isConfirmed: true,
    },
    CONFIRMED: {
      color: "success",
      variant: "solid",
      label: "Confirmado",
      isSuggested: true,
      isConfirmed: true,
    },
    PENDING: {
      color: "warning",
      variant: "light",
      label: "Pendente",
      isSuggested: false,
      isConfirmed: false,
    },
    RESCHEDULED: {
      color: "secondary",
      variant: "dot",
      label: "Reagendado",
      isSuggested: false,
      isConfirmed: false,
    },
    SUGGESTED: {
      color: "primary",
      variant: "light",
      label: "Sugerido",
      isSuggested: true,
      isConfirmed: true,
    },
  };

  const { current_company } = useCompanyStore();

  const { isOpen, onClose, onOpen } = useDisclosure();
  const [scheduledAt, setScheduledAt] = useState<Date | null>();
  const [currentVisit, setCurrentVisit] = useState<string | null>();
  const {
    data: visits,
    isLoading: isLoadingVisits,
    refetch,
  } = useQuery({
    queryKey: ["schedule-visits", current_company.id],
    queryFn: () => getAllVisitByCompany(current_company.id),
  });

  const handleConfirmVisit = useCallback(
    async (id: string) => {
      try {
        await confirmVisitById(id);
        await refetch();
        alert("Visita confirmada com sucesso!");
      } catch (error) {
        alert("Erro ao confirmar visita!");
      }
    },
    [refetch]
  );
  const handleSuggestNewDate = useCallback(async () => {
    try {
      if (!scheduledAt || !currentVisit) {
        throw new Error("");
      }
      console.log("scheduledAt", scheduledAt);
      console.log("currentVisit", currentVisit);
      await suggestVisitById(currentVisit, scheduledAt);
      await refetch();
    } catch (error) {
      alert("Erro ao sugerir data de  visita!");
    }
  }, [scheduledAt, currentVisit, refetch]);
  const handleOpenSuggestNewDate = useCallback(
    async (id: string) => {
      onOpen();
      setCurrentVisit(id);
    },
    [onOpen]
  );

  return (
    <div className="p-6 flex gap-8">
      <div>
        <DatePicker />
      </div>

      <div className="w-full">
        <Card>
          <CardBody>
            <Text type="subtitle" weight="medium">
              Agendamento
            </Text>
          </CardBody>
        </Card>

        <div className="flex flex-col gap-4 w-full mt-4">
          {visits &&
            visits.map((visit) => (
              <Card key={visit.id} className="w-full">
                <CardBody className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">Meu Cliente</h3>
                        <Chip
                          color={behaviorByStatus[visit.status].color}
                          variant={behaviorByStatus[visit.status].type}
                          size="sm"
                        >
                          {behaviorByStatus[visit.status].label}
                        </Chip>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">
                            Data e horário solicitado:
                          </p>
                          <p className="font-medium">
                            {format(
                              visit.scheduled_at,
                              "dd/MM/yyyy 'às' HH:mm",
                              {
                                locale: ptBR,
                              }
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-gray-600">Contato:</p>
                          <p className="font-medium">Meu TELEFONE</p>
                          <p className="text-sm text-gray-500">MEU email</p>
                        </div>
                      </div>

                      <div className="mt-2">
                        <p className="text-gray-600 text-sm">Solicitado em:</p>
                        <p className="text-sm">
                          {format(visit.created_at, "dd/MM/yyyy 'às' HH:mm", {
                            locale: ptBR,
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        color="success"
                        variant="solid"
                        onPress={() => handleConfirmVisit(visit.id)}
                        isDisabled={behaviorByStatus[visit.status].isConfirmed}
                      >
                        Confirmar
                      </Button>
                      <Button
                        color="primary"
                        variant="bordered"
                        isDisabled={behaviorByStatus[visit.status].isSuggested}
                        onPress={() => handleOpenSuggestNewDate(visit.id)}
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
      <RescheduleCompanyUpdateModal
        isOpen={isOpen}
        onChange={setScheduledAt}
        onClose={onClose}
        onSuccess={handleSuggestNewDate}
      />
    </div>
  );
}
