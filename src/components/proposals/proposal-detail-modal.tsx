import DialogV2 from "../ui/Dialog-v2";
import { Button, Spinner } from "@heroui/react";
import { EstimateDetail } from "../estimate-detail";
import { FaX } from "react-icons/fa6";
import { FiCheck } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import { getAllEstimateById } from "../../api/estimate";
import { ReactNode, useCallback } from "react";

import { Text } from "../ui/Text";
import { ProposalChatButton } from "../chat/proposal-chat-button";


interface ProposalFormProps {
  isOpen: boolean;
  onClose: () => void;
  estimate_id: string;
  proposal_id: string;
  status?: ReactNode;
  onReject?: (() => void) | null;
  onAccept?: (() => void) | null;
  sender:'COMPANY'|'CLIENT'
}

export function ProposalDetailModal({
  isOpen,
  onClose,
  estimate_id,
  status,
  onAccept,
  proposal_id,
  onReject,
  sender
}: ProposalFormProps) {
  const { data: estimate, isLoading: isLoadingProposals } = useQuery({
    queryKey: ["estimate", estimate_id],
    queryFn: () => getAllEstimateById(estimate_id),
    enabled: isOpen,
  });


    
  const handleAccept = useCallback(async () => {
    if (onAccept) {
      onAccept();
    }
  }, [onAccept]);
  const handleReject = useCallback(async () => {
    if (onReject) {
      onReject();
    }
  }, [onReject]);

  return (
    <DialogV2
      size="3xl"
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center justify-between px-4">
          <Text>Detalhe do Orcamento</Text>
          {!!status && status}
        </div>
      }
      footer={
        <>
          {!!onReject && <Button
            variant="ghost"
            startContent={<FaX size={16} />}
            color="danger"
            onPress={handleReject}
          >
            Recusar
          </Button>}
          {!!proposal_id && <ProposalChatButton proposal_id={proposal_id} sender={sender}/>}
          
          {!!onAccept && <Button
            color="success"
            startContent={<FiCheck size={16} />}
            onPress={handleAccept}
          >
            Aceitar
          </Button>}
        </>
      }
    >
      {!estimate || isLoadingProposals ? (
        <Spinner />
      ) : (
        <EstimateDetail estimate={estimate} />
      )}
    </DialogV2>
  );
}
