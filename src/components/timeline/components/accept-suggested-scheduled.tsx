import { Button, useDisclosure } from "@heroui/react";
import { ScheduleCustomerCreateModal } from "../../modals/schedule-customer-create-modal";

import { useMutation } from "@tanstack/react-query";
import { confirmVisitById, suggestVisitById, suggestVisitByIdCustomer } from "../../../api/visits";
import { useCallback, useState } from "react";
type AcceptSuggestedScheduledProps = {
  visit_id: string;
  is_disabled?:boolean
};
export function AcceptSuggestedScheduled({
  visit_id,
  is_disabled
}: AcceptSuggestedScheduledProps) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [scheduledAt, setScheduledAt] = useState<Date | null>();
  const { isPending, mutate } = useMutation({
    mutationFn: () => {
      return confirmVisitById(visit_id);
    },

    onError: (error) => {
      console.error("Erro ao criar usuário:", error);
    },
  });
  const { isPending: isPendingReschedule, mutate: reschedule } = useMutation({
    mutationFn: () => {
      return suggestVisitByIdCustomer(visit_id, scheduledAt || new Date());
    },

    onError: (error) => {
      console.error("Erro ao criar usuário:", error);
    },
  });

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="solid"
        color="success"
        size="sm"
        isLoading={isPending}
        onPress={() => mutate()}
        className="transition-transform hover:scale-105"
        isDisabled={is_disabled}
      >
        Aceitar
      </Button>
      <Button
        variant="bordered"
        color="danger"
        size="sm"
        onPress={onOpen}
        isLoading={isPendingReschedule}
        className="transition-transform hover:scale-105"
        isDisabled={is_disabled}
      >
        Recusar/Reagendar
      </Button>
      <ScheduleCustomerCreateModal
        isOpen={isOpen}
        onClose={onClose}
        onChange={setScheduledAt}
        onSuccess={reschedule}
      />
    </div>
  );
}
