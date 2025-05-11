import Dialog from '../ui/Dialog';
import Button from '../ui/Button';

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
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            isLoading={isLoading}
          >
            Confirmar
          </Button>
        </>
      }
    >
      <p className="text-neutral-600">{description}</p>
    </Dialog>
  );
};

export default ProposalActionDialog;