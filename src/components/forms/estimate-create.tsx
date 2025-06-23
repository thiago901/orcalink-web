import { Button, Select, SelectItem, Card, CardBody } from "@heroui/react";
import { FiPlus, FiTrash } from "react-icons/fi";
import { EstimateCustomer, CreateEstimateProps } from "../../api/estimate";
import { useFieldArray, useForm } from "react-hook-form";
import { CustomInput } from "../../components/ui/Input";
import { CustomTextArea } from "../../components/ui/Textarea";
import { Text } from "../../components/ui/Text";
import { useCompanyStore } from "../../stores/companyStore";


type EstimateCreateFormProps = {
  customer?: EstimateCustomer | null;
  form?: string;
};
export function EstimateCreateForm({
  customer,
  form,
}: EstimateCreateFormProps) {
  const { current_company } = useCompanyStore();
  const createEstimate = async (data: CreateEstimateProps) => {
    
    await createEstimate(data);
  };
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateEstimateProps>({
    defaultValues: {
      customer: customer || undefined,
      company: {
        address: {
          city: current_company.address.city,
          neighborhood: "fake-bairro",
          number: "0",
          postal_code: current_company.address.zip,
          state: current_company.address.state,
          street: current_company.address.address,
        },
        avatar: current_company.avatar,
        document: "fake-document",
        email: current_company.email || "",
        id: current_company.id,
        name: current_company.name,
        phone: current_company.phone || "",
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });
  const handleAddItem = () => {
    append({
      type: "SERVICE",
      name: "",
      description: "",
      unit: "UNITS",
      price: 0,
      quantity: 1,
      total: 0,
      created_at: new Date(),
      updated_at: new Date(),
      estimate_id: "",
    });
  };
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

        {/* Endereço */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <CustomInput
            name="customer.address.street"
            label="Rua"
            register={register}
            error_message={errors.customer?.address?.street?.message}
          />

          <CustomInput
            name="customer.address.number"
            label="Numero"
            register={register}
            error_message={errors.customer?.address?.number?.message}
          />

          <CustomInput
            name="customer.address.postal_code"
            label="CEP"
            register={register}
            error_message={errors.customer?.address?.postal_code?.message}
          />
          <CustomInput
            name="customer.address.neighborhood"
            label="Bairro"
            register={register}
            error_message={errors.customer?.address?.neighborhood?.message}
          />
          <CustomInput
            name="customer.address.city"
            label="Bairro"
            register={register}
            error_message={errors.customer?.address?.city?.message}
          />

          <CustomInput
            name="customer.address.state"
            label="Estado"
            register={register}
            error_message={errors.customer?.address?.state?.message}
          />
        </div> */}
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
          {fields.map((field, index) => (
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
                      name={`items.${index}.price`}
                      register={register}
                      error_message={errors.items?.[index]?.price?.message}
                    />

                    <CustomInput
                      label="Quantidade"
                      name={`items.${index}.quantity`}
                      register={register}
                      error_message={errors.items?.[index]?.quantity?.message}
                    />

                    <CustomInput
                      label="Total"
                      name={`items.${index}.total`}
                      register={register}
                      error_message={errors.items?.[index]?.total?.message}
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
                    error_message={errors.items?.[index]?.description?.message}
                  />
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
        <Button onPress={handleAddItem} className="self-end" color="secondary">
          <FiPlus />
          <Text type="normal">Adicionar Item</Text>
        </Button>
      </div>

      {/* Submit */}
      {!form && (
        <Button type="submit" fullWidth color="primary">
          Criar Orçamento
        </Button>
      )}
    </form>
  );
}
