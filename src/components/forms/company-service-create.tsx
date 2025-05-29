import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import DialogV2 from "../ui/Dialog-v2";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import {
  CompanyService,
  createCompanyService,
} from "../../api/companyServices";
import { getCategories } from "../../api/category";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface CompanyServiceProps {
  isOpen: boolean;
  company_id: string;
  onClose: () => void;

  onSuccess: () => void;
}

const CompanyServiceForm = ({
  isOpen,
  onClose,
  onSuccess,
  company_id,
}: CompanyServiceProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CompanyService>();

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });
  const onSubmit = async (data: CompanyService) => {
    setIsLoading(true);
    try {
      data.category_name = categories!.find(
        (cat) => cat.id === data.category_id
      )!.name;
      data.company_id = company_id;
      await createCompanyService(data);
      toast.success("Proposta enviada com sucesso!");
      reset();
      onSuccess();
      onClose();
      queryClient.invalidateQueries({ queryKey: ["companyServices"] });
    } catch (error) {
      toast.error("Erro ao enviar proposta");
      console.log("error", error);
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
            form="company-service-form"
            isLoading={isLoading}
            color="primary"
          >
            Criar servico
          </Button>
        </>
      }
    >
      <form
        id="company-service-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        {isLoadingCategories ? (
          <>Carregando...</>
        ) : (
          <>
            <Select
              {...register("category_id")}
              label="Categoria"
              placeholder="Selecione uma categoria"
            >
              {categories!.map((cat) => (
                <SelectItem key={cat.id}>{cat.name}</SelectItem>
              ))}
            </Select>
            <Input
              placeholder="Serviços Gerais"
              errorMessage={errors.name?.message}
              isInvalid={!!errors.name?.message}
              {...register("name", {
                required: "Nome é obrigatório",
              })}
            />
          </>
        )}
      </form>
    </DialogV2>
  );
};

export default CompanyServiceForm;
