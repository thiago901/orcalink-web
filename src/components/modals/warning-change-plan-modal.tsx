import DialogV2 from "../ui/Dialog-v2";
import { Button } from "@heroui/react";
import { FaX } from "react-icons/fa6";
import { FiCheck } from "react-icons/fi";
import { useCallback } from "react";

import { Text } from "../ui/Text";
import toast from "react-hot-toast";

interface WarningChangePlanModalProps {
  isOpen: boolean;
  onClose: () => void;

  onAccept?: (() => Promise<void>) | null;
}

export function WarningChangePlanModal({
  isOpen,
  onClose,

  onAccept,
}: WarningChangePlanModalProps) {
  const handleAccept = useCallback(async () => {
    if (onAccept) {
      try {
        await onAccept();
        toast.success('Operação realizada com sucesso')
        onClose()
      } catch (error) {
        toast.error('Não foi possivel realizar a operação tente novamente mais tarde')
        console.error("[WarningChangePlanModal]",error);
        
      }
      
    }
  }, [onAccept]);

  return (
    <DialogV2
      size="3xl"
      isOpen={isOpen}
      onClose={onClose}
      title={
        <Text type="subtitle" weight="semibold">
          Quer mesmo fazer essa operação?
        </Text>
      }
      footer={
        <>
          {
            <Button
              variant="ghost"
              startContent={<FaX size={16} />}
              color="default"
              onPress={onClose}
            >
              Voltar
            </Button>
          }

          {
            <Button
              color="danger"
              startContent={<FiCheck size={16} />}
              onPress={handleAccept}
            >
              Sim
            </Button>
          }
        </>
      }
    >
      <div>
        <Text className="inline">
          Se aceitar sua assinatura atual será cancelada{" "}
          <Text weight="bold" className="inline">ao final do periodo</Text> e a nova assinatura
          entrará em vigor
        </Text>
      </div>
    </DialogV2>
  );
}
