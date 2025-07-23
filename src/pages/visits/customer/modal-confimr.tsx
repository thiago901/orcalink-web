import React from 'react';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  date: Date;
  time: string;
  loading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  date,
  time,
  loading = false,
}) => {
  const formattedDate = format(date, "dd/MM/yyyy", { locale: ptBR });

  return (
    <Modal isOpen={isOpen} onClose={onClose} placement="center">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Confirmar Agendamento
        </ModalHeader>
        <ModalBody>
          <p className="text-center">
            Deseja solicitar agendamento para o dia{' '}
            <span className="font-semibold">{formattedDate}</span> às{' '}
            <span className="font-semibold">{time}</span>?
          </p>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="light"
            onPress={onClose}
            isDisabled={loading}
          >
            Cancelar
          </Button>
          <Button
            color="primary"
            onPress={onConfirm}
            isLoading={loading}
          >
            Confirmar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};