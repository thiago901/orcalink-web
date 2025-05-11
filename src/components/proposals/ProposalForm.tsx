import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { createProposal, CreateProposalProps } from '../../api/proposals';
import Dialog from '../ui/Dialog';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';

interface ProposalFormProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  estimateRequestId: string;
  onSuccess: () => void;
}

const ProposalForm = ({
  isOpen,
  onClose,
  companyId,
  estimateRequestId,
  onSuccess,
}: ProposalFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateProposalProps>({
    defaultValues: {
      company_id: companyId,
      estimate_request_id: estimateRequestId,
    },
  });


  const onSubmit = async (data: CreateProposalProps) => {
    setIsLoading(true);
    try {
      data.estimate_request_id = estimateRequestId
      
      await createProposal(data);
      toast.success('Proposta enviada com sucesso!');
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Erro ao enviar proposta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Enviar Proposta"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            form="proposal-form"
            isLoading={isLoading}
          >
            Enviar Proposta
          </Button>
        </>
      }
    >
      <form id="proposal-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Valor (R$)"
          type="number"
          step="0.01"
          placeholder="0,00"
          error={errors.amount?.message}
          {...register('amount', {
            required: 'Valor é obrigatório',
            min: {
              value: 0,
              message: 'Valor deve ser maior que 0',
            },
          })}
        />

        <Textarea
          label="Descrição da proposta"
          placeholder="Descreva os detalhes da sua proposta..."
          error={errors.description?.message}
          {...register('description', {
            required: 'Descrição é obrigatória',
            minLength: {
              value: 10,
              message: 'Descrição deve ter pelo menos 10 caracteres',
            },
          })}
        />

        <input type="hidden" {...register('company_id')} />
        <input type="hidden" {...register('estimate_request_id')} />
      </form>
    </Dialog>
  );
};

export default ProposalForm;