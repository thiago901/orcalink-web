

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@heroui/react';

interface ProposalActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  isLoading?: boolean;
}

const ProposalActionDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  isLoading,
}: ProposalActionDialogProps) => {
  const { onOpenChange} = useDisclosure();
  return (
    <Modal 
      onOpenChange={onOpenChange}
      isOpen={isOpen}
      onClose={onClose}
      title={title}
     
    >
      <ModalContent>
        {(onClose) => (
         <>
          <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
          <ModalBody className="flex flex-col gap-1">{description}</ModalBody>
          
           <ModalFooter>
           <Button variant="ghost" onPress={onClose} color='danger'>
              Cancelar
            </Button>
            <Button
              onPress={onConfirm}
              isLoading={isLoading}
              color='primary'
            >
              Confirmar
            </Button>
           </ModalFooter>
         </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ProposalActionDialog;