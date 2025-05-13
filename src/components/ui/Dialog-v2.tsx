

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@heroui/react';
import { ReactNode } from 'react';

type ProposalActionDialogProps= {
  isOpen: boolean;
  onClose: () => void;
  
  title: string;
  isLoading?: boolean;
  
  children:ReactNode
}
type ProposalFooterProps = {
  footer: ReactNode;
  onConfirm?: () => void;
} | {
  footer?: ReactNode;
  onConfirm: () => void;
} 

const DialogV2 = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  isLoading,
  footer,
  children
}: ProposalActionDialogProps &ProposalFooterProps) => {
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
          <ModalBody className="flex flex-col gap-1">
            {children}
            </ModalBody>
          
           <ModalFooter>
            {footer?footer :
            <>
              <Button variant="ghost" onPress={onClose} color='danger'>
                  Cancelar
                </Button>
                <Button
                  onPress={onConfirm}
                  isLoading={isLoading}
                  color='primary'
                >
                  Confirmar
                </Button></> 
                }
              
              </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default DialogV2;