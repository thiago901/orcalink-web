import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../../stores/authStore";
import { Title } from "../../components/ui/Title";
import { Text } from "../../components/ui/Text";
import { Subtitle } from "../../components/ui/Subtitle";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Textarea,
  Tooltip,
} from "@heroui/react";
import {
  Company,
  createCompany,
  CreateCompanyProps,
  uploadCompanyImage,
} from "../../api/companies";
import FileUpload from "../../components/ui/FileUpload";
import { FiFileText } from "react-icons/fi";
import { CiMapPin } from "react-icons/ci";
import { searchByZipCode } from "../../utils/search-zip-address";
import { useNavigate } from "react-router-dom";

type CompanyCreateFormProp = {
  company?: Company;
};

export function CompanyCreateForm({ company }: CompanyCreateFormProp) {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<CreateCompanyProps>({
    defaultValues: {
      about: company?.about,
      address: company?.address,
      avatar: company?.avatar,
      email: company?.email,
      name: company?.name,
      owner_id: company?.owner_id,
      phone: company?.phone,
      website: company?.website,
    },
  });

  const uploadImage = useCallback(async () => {
    if (!companyId) {
      toast.error("Crie a empresa antes de fazer o upload da imagem");
      return;
    }
    if (selectedFiles.length > 0) {
      const formData = new FormData();
      formData.append("file", selectedFiles[0]);
      await uploadCompanyImage(companyId, formData);
      toast.success("Imagem enviada com sucesso!");
    }
  }, [companyId, selectedFiles]);

  const onSubmit = async (data: CreateCompanyProps) => {
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        address: {
          ...data.address,
          name: data.name,
          country: "Brasil",
        },
        owner_id: user?.id as string,
      };

      if (company) {
        // await updateCompany(id, payload);
        toast.success("Empresa atualizada com sucesso!");
      } else {
        const response = await createCompany(payload);
        setCompanyId(response.id);
        toast.success("Empresa criada com sucesso!");
      }

      navigate("/dashboard/companies");
    } catch (err) {
      console.error(err);
      toast.error(
        company ? "Erro ao atualizar empresa" : "Erro ao criar empresa"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchZip = useCallback(
    async (e: React.FocusEvent<HTMLInputElement>) => {
      const { logradouro, estado, uf } = await searchByZipCode(e.target.value);
      setValue("address.address", logradouro);
      setValue("address.city", estado);
      setValue("address.state", uf);
    },
    [setValue]
  );

  return (
    <div className="space-y-6">
      <Breadcrumbs>
        <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
        {company?.id ? (
          <BreadcrumbItem href={`dashboard/companies/${company?.id}`}>
            Empresa
          </BreadcrumbItem>
        ) : (
          <BreadcrumbItem href={`dashboard/companies`}>
            Criar Empresa
          </BreadcrumbItem>
        )}
      </Breadcrumbs>
      <div>
        <Title>{company ? "Editar Empresa" : "Nova Empresa"}</Title>
        <Text className="text-neutral-600">
          {company
            ? "Atualize os dados da empresa"
            : "Preencha os dados para criar uma nova empresa"}
        </Text>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Empresa */}
        <Card>
          <CardHeader>
            <Subtitle>Informações da Empresa</Subtitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex gap-6 flex-col sm:flex-row">
              <div className="w-full sm:w-1/3">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Foto de perfil (opcional)
                </label>
                <div className="flex flex-col gap-4">
                  <FileUpload
                    onFilesSelected={setSelectedFiles}
                    maxFiles={1}
                    maxSizeInMB={10}
                    multiple={false}
                    accept=".jpg,.jpeg,.png"
                  />
                  <Tooltip content="Salvar imagem apenas após criar a empresa">
                    <Button disabled={!companyId} onPress={uploadImage}>
                      Salvar
                    </Button>
                  </Tooltip>
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <Input
                  label="Nome"
                  placeholder="Nome da empresa"
                  startContent={<FiFileText />}
                  errorMessage={errors.name?.message}
                  isInvalid={!!errors.name}
                  {...register("name", { required: "Campo obrigatório" })}
                />
                <Controller
                  control={control}
                  name="about"
                  rules={{ required: "Campo obrigatório" }}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      label="Sobre"
                      placeholder="Descreva sua empresa"
                      value={field.value ?? ""}
                      errorMessage={errors.about?.message}
                      isInvalid={!!errors.about}
                    />
                  )}
                />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Contato */}
        <Card>
          <CardHeader>
            <Subtitle>Contato</Subtitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input
              label="Telefone"
              placeholder="(11) 91234-5678"
              {...register("phone", { required: "Campo obrigatório" })}
              isInvalid={!!errors.phone}
              errorMessage={errors.phone?.message}
            />
            <Input
              label="Email"
              type="email"
              placeholder="exemplo@email.com"
              {...register("email", { required: "Campo obrigatório" })}
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message}
            />
            <Input
              label="Website"
              placeholder="https://suaempresa.com"
              {...register("website", { required: "Campo obrigatório" })}
              isInvalid={!!errors.website}
              errorMessage={errors.website?.message}
            />
          </CardBody>
        </Card>

        {/* Endereço */}
        <Card>
          <CardHeader>
            <Subtitle>Endereço</Subtitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="CEP"
                placeholder="00000-000"
                startContent={<CiMapPin />}
                {...register("address.zip", { required: "Campo obrigatório" })}
                isInvalid={!!errors.address?.zip}
                errorMessage={errors.address?.zip?.message}
                onBlur={handleSearchZip}
              />
              <Input label="Estado" isDisabled {...register("address.state")} />
            </div>
            <Input label="Cidade" isDisabled {...register("address.city")} />
            <Input label="Rua" isDisabled {...register("address.address")} />
          </CardBody>
        </Card>

        <div className="flex justify-end">
          <Button color="primary" type="submit" isLoading={isLoading}>
            {company ? "Salvar alterações" : "Criar empresa"}
          </Button>
        </div>
      </form>
    </div>
  );
}
