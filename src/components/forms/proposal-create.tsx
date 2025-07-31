import {
  Button,
  Select,
  SelectItem,
  Card,
  CardBody,
  Switch,
  cn,
  Chip,
} from "@heroui/react";
import { FiPlus, FiTrash } from "react-icons/fi";
import { EstimateCustomer } from "../../api/estimate";
import { useFieldArray, useForm } from "react-hook-form";
import { CustomInput } from "../ui/Input";
import { CustomTextArea } from "../ui/Textarea";
import { Text } from "../ui/Text";
import { useCompanyStore } from "../../stores/companyStore";
import { createProposal, CreateProposalProps } from "../../api/proposals";
import { formatCurrency } from "../../utils/format";
import toast from "react-hot-toast";

type EstimateCreateFormProps = {
  customer?: EstimateCustomer | null;
  form?: string;
  estimate_request_id: string;
  onClose:()=>void
};
export function ProposalCreateForm({
  customer,
  form,
  estimate_request_id,
  onClose
}: EstimateCreateFormProps) {
  const { current_company } = useCompanyStore();
  const createEstimate = async (data: CreateProposalProps) => {
    try {
      await createProposal({
      ...data,
      estimate_request_id,
    });
    onClose()
    toast.success("Proposta enviada com sucesso");
    } catch (error) {
      console.log('[ProposalCreateForm][createEstimate]',error);
      
      toast.error("Houve um problema ao enviar a proposta, tente novamente mais tarde");
    }
  };
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<CreateProposalProps>({
    defaultValues: {
      customer: customer || undefined,
      company_id: current_company.id,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const handleAddItem = () => {
    append({
      type: "SERVICE",
      description: "",
      unit: "UNITS",
      price: 0,
      quantity: 0,
    });
  };
  const items = watch("items");

  return (
    <form
      onSubmit={handleSubmit(createEstimate)}
      className="space-y-2 "
      id={form}
    >
      <div className="space-y-2">
        <h2 className="font-medium">Informações do Cliente</h2>

        <CustomInput
          name="customer.name"
          label="Nome do Cliente"
          register={register}
          error_message={errors.customer?.name?.message}
          readOnly={!!customer}
        />
        <CustomInput
          name="customer.email"
          label="Email"
          register={register}
          error_message={errors.customer?.email?.message}
          readOnly={!!customer}
        />
        <CustomInput
          name="customer.phone"
          label="Telefone"
          register={register}
          error_message={errors.customer?.phone?.message}
          readOnly={!!customer}
        />

        <CustomInput
          name="customer.document"
          label="Documento (CPF ou CNPJ)"
          register={register}
          error_message={errors.customer?.document?.message}
          readOnly={!!customer}
        />
      </div>

      <CustomTextArea
        name="description"
        label="Descrição do Orçamento"
        register={register}
        error_message={errors.description?.message}
      />

      {/* Expiração */}
      <CustomInput
        name="expire_at"
        register={register}
        label="Validade do Orçamento"
        type="date"
      />

      {/* Itens */}
      <div className="flex flex-col gap-2">
        <h2 className="font-medium">Itens do Orçamento</h2>
        <div className="flex flex-col gap-4">
          {fields.map((field, index) => {
            const price = Number(items?.[index]?.price ?? 0);
            const quantity = Number(items?.[index]?.quantity ?? 0);
            const total = price * quantity;

            return (
              <Card>
                <CardBody>
                  <div key={field.id} className="flex flex-col gap-2">
                    <div className="flex gap-2 items-center">
                      <Select {...register(`items.${index}.type`)} label="Tipo">
                        <SelectItem key="MATERIAL">Material</SelectItem>
                        <SelectItem key="SERVICE">Mão de Obra</SelectItem>
                        <SelectItem key="OTHER">Outros</SelectItem>
                      </Select>

                      <Select
                        label="Unidade"
                        {...register(`items.${index}.unit`)}
                      >
                        <SelectItem key="UNITS">Unidades</SelectItem>
                        <SelectItem key="HOURS">Horas</SelectItem>
                        <SelectItem key="LITERS">Litros</SelectItem>
                        <SelectItem key="KILOGRAMS">Kg</SelectItem>
                      </Select>

                      <CustomInput
                        label="Preço"
                        defaultValue="0"
                        type="number"
                        name={`items.${index}.price`}
                        register={register}
                        error_message={errors.items?.[index]?.price?.message}
                      />

                      <CustomInput
                        label="Quantidade"
                        type="number"
                        defaultValue="0"
                        name={`items.${index}.quantity`}
                        register={register}
                        error_message={errors.items?.[index]?.quantity?.message}
                      />

                      <Button
                        variant="bordered"
                        color="danger"
                        isIconOnly
                        onPress={() => remove(index)}
                      >
                        <FiTrash />
                      </Button>
                    </div>

                    <CustomTextArea
                      label="Descrição"
                      name={`items.${index}.description`}
                      register={register}
                      error_message={
                        errors.items?.[index]?.description?.message
                      }
                    />
                  </div>
                  <div className="flex items-end gap-2 justify-end mt-2">
                    <Text type="normal" color="muted">
                      Total:
                    </Text>
                    <Text type="normal">{formatCurrency(total)}</Text>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
        <Button onPress={handleAddItem} className="self-end" color="secondary">
          <FiPlus />
          <Text type="normal">Adicionar Item</Text>
        </Button>
      </div>
      <Card className="">
        <CardBody>
          <Switch
            {...register("is_required_visit")}
            name="is_required_visit"
            classNames={{
              base: cn("inline-flex flex-row-reverse"),
            }}
          >
            <div className="flex flex-col gap-1">
              <div className="">
                <Chip color="danger">Atenção</Chip>
              </div>
              <p className="text-medium">Visita é necessaria?</p>
              <p className="text-tiny text-default-400">
                Habilite quando for necessario ir até a residencia do cliente
                avaliar o espaço, antes de informar o valor definitivo
              </p>
            </div>
          </Switch>
        </CardBody>
      </Card>
      {/* Submit */}
      {!form && (
        <Button type="submit" fullWidth color="primary">
          Criar Orçamento
        </Button>
      )}
    </form>
  );
}
