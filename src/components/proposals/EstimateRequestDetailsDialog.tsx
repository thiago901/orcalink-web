import { MapPin, Phone, Mail, Calendar } from 'lucide-react';
import Dialog from '../ui/Dialog';
import Button from '../ui/Button';

interface EstimateRequestDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  request: any;
  onSubmitProposal: () => void;
  hasSubmittedProposal?: boolean;
}

const EstimateRequestDetailsDialog = ({
  isOpen,
  onClose,
  request,
  onSubmitProposal,
  hasSubmittedProposal,
}: EstimateRequestDetailsDialogProps) => {
  if (!request) return null;


  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Detalhes do Orçamento"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          {!hasSubmittedProposal && (
            <Button onClick={onSubmitProposal}>
              Enviar Proposta
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">{request.name}</h4>
          <p className="text-neutral-600">{request.description}</p>
        </div>

        <div>
          <h4 className="font-medium mb-2">Metragem</h4>
          <p className="text-neutral-600">{request.footage}m²</p>
        </div>

        <div>
          <h4 className="font-medium mb-2">Endereço</h4>
          <div className="flex items-center gap-2 text-neutral-600">
            <MapPin size={18} />
            <span>
              {request.address_street}, {request.address_number}
              <br />
              {request.address_city}, {request.address_state}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">Contato</h4>
            <div className="space-y-2 text-neutral-600">
              <div className="flex items-center gap-2">
                <Phone size={18} />
                <span>{request.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={18} />
                <span>{request.email}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Data da solicitação</h4>
            <div className="flex items-center gap-2 text-neutral-600">
              <Calendar size={18} />
              <span>
                {new Date(request.created_at).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default EstimateRequestDetailsDialog;