import DialogV2 from "../ui/Dialog-v2";
import { Button } from "@heroui/react";
import { useCallback, useState } from "react";

import { DatePicker } from "../date-picker";

interface ScheduleCustomerCreateProps {
  isOpen: boolean;
  onClose: () => void;
  onChange: (date: Date) => void;
  onSuccess: () => void;
}

export function ScheduleCustomerCreateModal({
  isOpen,
  onClose,
  onChange,
  onSuccess
}: ScheduleCustomerCreateProps) {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const handleChangeDate = useCallback(
    (data: Date[]) => {
      

      setSelectedDates(data);
      onChange(data[0])
    },
    [onChange]
  );
  return (
    <DialogV2
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      title="Agendamento de visita"
      isKeyboardDismissDisabled={false}
      isDismissable={false}
      footer={
        <>
          <Button variant="ghost" onPress={onClose}>
            Cancelar
          </Button>
          <Button  color="primary" onPress={onSuccess}>
            Agendar
          </Button>
        </>
      }
    >
      
     

        <DatePicker
          selectedDates={selectedDates}
          onDateSelect={handleChangeDate}
          widthFull
          disabledDates={[new Date()]}
        />
      
    </DialogV2>
  );
}
