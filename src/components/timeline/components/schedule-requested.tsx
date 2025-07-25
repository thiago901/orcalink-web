import { Button, useDisclosure } from "@heroui/react";
import { ScheduleCustomerCreateModal } from "../../modals/schedule-customer-create-modal";

import { useMutation } from "@tanstack/react-query";
import { createVisit } from "../../../api/visits";
import { useState } from "react";
type ScheduleRequestedProps={
  company_id?:string
   customer_id:string
   
   notes?:string
}
export function ScheduleRequested({company_id,customer_id,notes,}:ScheduleRequestedProps) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [scheduledAt,setScheduledAt] = useState<Date|null>()

  const { isPending ,mutate} = useMutation({
    mutationFn: () =>{
      
        return createVisit({ company_id:company_id!, customer_id, scheduled_at:scheduledAt|| new Date(), notes })

      
    },


    onError: (error) => {
      console.error("Erro ao criar usuário:", error);
    },
  });
  console.log('scheduledAt',scheduledAt);
  
  
  return (
    <>
      <Button
        variant="solid"
        color="primary"
        size="sm"
        onPress={onOpen}
        isLoading={isPending}
        
        className="transition-transform hover:scale-105"
      >
        Agendar uma visita
      </Button>
      <ScheduleCustomerCreateModal isOpen={isOpen} onClose={onClose} onChange={setScheduledAt} onSuccess={mutate}/>
    </>
  );
}
