
import DialogV2 from "../ui/Dialog-v2";
import { Button } from "@heroui/react";
import { EstimateCreateForm } from "../forms/estimate-create";
import { EstimateCustomer } from "../../api/estimate";

interface CreateEstimateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  customer?:EstimateCustomer | null
}

export function CreateEstimateModal({
  isOpen,
  onClose,
  customer
}: CreateEstimateModalProps) {
 

  return (
    <DialogV2
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      title="Criar novo orçamento"
      isKeyboardDismissDisabled={false}
      isDismissable={false}
      footer={
        <>
          <Button variant="ghost" onPress={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            form="company-estimate-create"
            
            color="primary"
          >
            Criar servico
          </Button>
        </>
      }
    >
     <EstimateCreateForm form="company-estimate-create" customer={customer}/>
    </DialogV2>
  );
};


