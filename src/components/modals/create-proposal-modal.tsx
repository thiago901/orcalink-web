import DialogV2 from "../ui/Dialog-v2";
import { Button } from "@heroui/react";

import { EstimateCustomer } from "../../api/estimate";
import { ProposalCreateForm } from "../forms/proposal-create";
import { useMutation } from "@tanstack/react-query";
import { createProposal, CreateProposalProps } from "../../api/proposals";
import toast from "react-hot-toast";

interface CreateEstimateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  customer?: EstimateCustomer | null;
  estimate_request_id: string;
}

export function CreateProposalModal({
  isOpen,
  onClose,
  customer,
  estimate_request_id,
}: CreateEstimateModalProps) {
  const { isPending, mutate } = useMutation({
    mutationFn: (data: CreateProposalProps) => {
      return createProposal({
        ...data,
        estimate_request_id,
      });
    },

    onError: (error) => {
      toast.error(
        "Houve um problema ao enviar a proposta, tente novamente mais tarde"
      );
      console.log("[ProposalCreateForm][createEstimate]", error);
    },
    onSuccess: () => {
      onClose();
      toast.success("Proposta enviada com sucesso");
    },
  });

  return (
    <DialogV2
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      title="Proposta"
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
            isLoading={isPending}
          >
            Criar serviço
          </Button>
        </>
      }
    >
      <ProposalCreateForm
        form="company-proposal-create"
        customer={customer}
        estimate_request_id={estimate_request_id}
        onClose={onClose}
        onSubmit={mutate}
      />
    </DialogV2>
  );
}
