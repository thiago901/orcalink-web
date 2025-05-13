import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { createProposal, CreateProposalProps } from '../../api/proposals';




import DialogV2 from '../ui/Dialog-v2';
import { Button, Input, Textarea } from '@heroui/react';

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
    <DialogV2
      isOpen={isOpen}
      onClose={onClose}
      title="Enviar Proposta"
      footer={
        <>
          <Button variant="ghost" onPress={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            form="proposal-form"
            isLoading={isLoading}
            color='primary'
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
          errorMessage={errors.amount?.message}
          isInvalid={!!errors.amount?.message}
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
          errorMessage={errors.description?.message}
          isInvalid={!!errors.description?.message}
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
    </DialogV2>
  );
};

export default ProposalForm;