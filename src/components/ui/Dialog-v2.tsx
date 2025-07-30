

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@heroui/react';
import { ReactNode } from 'react';

type ProposalActionDialogProps= {
  isOpen: boolean;
  onClose: () => void;
  size?:"xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full" 
  title: string | ReactNode;
  isLoading?: boolean;
  isKeyboardDismissDisabled?:boolean
  isDismissable?:boolean
  
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
  children,
  size,
  isKeyboardDismissDisabled,
  isDismissable
  
}: ProposalActionDialogProps &ProposalFooterProps) => {
  const { onOpenChange} = useDisclosure();
  return (
    <Modal 
      onOpenChange={onOpenChange}
      isOpen={isOpen}
      onClose={onClose}
      // title={title}
      size={size}
      isDismissable={isDismissable}
      isKeyboardDismissDisabled={isKeyboardDismissDisabled}
      aria-label='model-container'
      scrollBehavior='inside'
     
    >
      <ModalContent aria-label='model-content'>
        {(onClose) => (
         <>
          <ModalHeader aria-label='model-header' className="flex flex-col gap-1">{title}</ModalHeader>
          <ModalBody aria-label='model-body' className="flex flex-col gap-1">
            {children}
            </ModalBody>
          
           <ModalFooter aria-label='model-footer' >
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