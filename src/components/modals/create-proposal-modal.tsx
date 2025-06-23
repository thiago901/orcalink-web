
import DialogV2 from "../ui/Dialog-v2";
import { Button } from "@heroui/react";

import { EstimateCustomer } from "../../api/estimate";
import { ProposalCreateForm } from "../forms/proposal-create";

interface CreateEstimateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  customer?:EstimateCustomer | null
  estimate_request_id:string
}

export function CreateProposalModal({
  isOpen,
  onClose,
  customer,
  estimate_request_id
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
            form="company-proposal-create"
            color="primary"
          >
            Criar servico
          </Button>
        </>
      }
    >
     <ProposalCreateForm form="company-proposal-create" customer={customer} estimate_request_id={estimate_request_id}/>
    </DialogV2>
  );
};


