import { Button, useDisclosure } from "@heroui/react";
import { ScheduleCustomerCreateModal } from "../../modals/schedule-customer-create-modal";

import { useMutation } from "@tanstack/react-query";
import {
  confirmVisitById,
  suggestVisitByIdCustomer,
} from "../../../api/visits";
import { useState } from "react";
import toast from "react-hot-toast";
type AcceptSuggestedScheduledProps = {
  visit_id: string;
  is_disabled?: boolean;
  onSuccess?: () => Promise<unknown>;
};
export function AcceptSuggestedScheduled({
  visit_id,
  is_disabled,
  onSuccess,
}: AcceptSuggestedScheduledProps) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [scheduledAt, setScheduledAt] = useState<Date | null>();
  const { isPending, mutate } = useMutation({
    mutationFn: () => {
      return confirmVisitById(visit_id);
    },
    onSuccess: async () => {
      onClose();
      if (onSuccess) {
        await onSuccess();
      }
    },

    onError: (error) => {
      toast.error("Erro ao aceitar visita agendada");
      console.error("[AcceptSuggestedScheduled][confirmVisitById]", error);
    },
  });
  const { isPending: isPendingReschedule, mutate: reschedule } = useMutation({
    mutationFn: () => {
      return suggestVisitByIdCustomer(visit_id, scheduledAt || new Date());
    },
    onSuccess: async () => {
      onClose();
      if (onSuccess) {
        await onSuccess();
      }
    },

    onError: (error) => {
      toast.error("Erro ao reagendar visita");
      console.error("[AcceptSuggestedScheduled][reschedule]", error);
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
