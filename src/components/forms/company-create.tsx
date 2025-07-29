import { useCallback, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../../stores/authStore";
import { Title } from "../../components/ui/Title";
import { Text } from "../../components/ui/Text";
import { Subtitle } from "../../components/ui/Subtitle";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import {
  Company,
  createCompany,
  CreateCompanyProps,
  updateCompany,
  uploadCompanyImage,
} from "../../api/companies";
import FileUpload from "../../components/ui/FileUpload";
import { FiFileText, FiPlus, FiTrash } from "react-icons/fi";
import { CiMapPin, CiSearch } from "react-icons/ci";
import { searchByZipCode } from "../../utils/search-zip-address";
import { useNavigate } from "react-router-dom";
import { useCompanyStore } from "../../stores/companyStore";
import { CustomTextArea } from "../ui/Textarea";
import { CustomInput } from "../ui/Input";
import { getCategories } from "../../api/category";
import { useQuery } from "@tanstack/react-query";

type CompanyCreateFormProp = {
  company?: Company;
};

export function CompanyCreateForm({ company }: CompanyCreateFormProp) {
  const { user } = useAuthStore();
  const { getCompanies } = useCompanyStore();
  const [isLoading, setIsLoading] = useState(false);
  const [changedFile, setChangedFile] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const navigate = useNavigate();
  const [isLoadingPostalCode, setIsLoadingPostalCode] = useState(false);

  const [address, setAddress] = useState(
    {} as {
      address_state: string;
      address_city: string;

      address_street: string;
    }
  );

  const {
    register,
    handleSubmit,
    setValue,
    control,
    getValues,
    watch,
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

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });
  const postalCode = watch("address.zip");
  const uploadImage = useCallback(
    async (company_id: string) => {
      if (selectedFiles.length > 0) {
        const formData = new FormData();
        formData.append("file", selectedFiles[0]);
        await uploadCompanyImage(company_id, formData);
        toast.success("Imagem enviada com sucesso!");
      }
    },
    [selectedFiles]
  );

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
        await updateCompany(company.id, payload);
        if (changedFile) {
          await uploadImage(company.id);
        }

        toast.success("Empresa atualizada com sucesso!");
      } else {
        const response = await createCompany(payload);

        toast.success("Empresa criada com sucesso!");
        if (changedFile) {
          await uploadImage(response.id);
        }
      }

      if (user) {
        await getCompanies(user.id);
      }
      navigate("/company");
    } catch (err) {
      console.error(err);
      toast.error(
        company ? "Erro ao atualizar empresa" : "Erro ao criar empresa"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchZip = useCallback(async () => {
    try {
      const postal_code = getValues("address.zip");
      if (!postal_code.trim()) {
        toast.error("Preencha o campo de CEP");
        return;
      }
      setIsLoadingPostalCode(true);
      const { logradouro, estado, uf } = await searchByZipCode(
        postal_code.trim()
      );
      setValue("address.address", logradouro, {
        shouldDirty: true,
        shouldTouch: true,
      });
      setValue("address.city", estado, {
        shouldDirty: true,
        shouldTouch: true,
      });
      setValue("address.state", uf, {
        shouldDirty: true,
        shouldTouch: true,
      });
      setAddress({
        address_city: estado,

        address_state: uf,
        address_street: logradouro,
      });
    } catch (error) {
      console.log("erros", error);
      toast.error(
        "Erro ao buscar CEP, verifique se o CEP está correto e tente novamente"
      );
    } finally {
      setIsLoadingPostalCode(false);
    }
  }, [getValues, setValue]);

  const handleChangeAvatar = useCallback((files: File[]) => {
    setSelectedFiles(files);
    setChangedFile(true);
  }, []);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "categories",
  });
  const handleAddItem = () => {
    append({
      name: "",
      category_id: "",
      category_name: "",
    });
  };
  return (
    <div className="space-y-6">
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
              <div className="flex flex-col">
                <span className="block text-sm font-medium text-neutral-700 mb-2">
                  Foto de perfil (opcional)
                </span>
                <div className="flex flex-col gap-4 ">
                  {company?.avatar ? (
                    <div className="flex items-end">
                      <div>
                        <Image
                          src={company.avatar}
                          className="w-32"
                          radius="full"
                        />
                      </div>

                      <div>
                        <FileUpload
                          onFilesSelected={handleChangeAvatar}
                          maxFiles={1}
                          maxSizeInMB={10}
                          multiple={false}
                          accept=".jpg,.jpeg,.png"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="self-center">
                      <FileUpload
                        onFilesSelected={handleChangeAvatar}
                        maxFiles={1}
                        maxSizeInMB={10}
                        multiple={false}
                        accept=".jpg,.jpeg,.png"
                      />
                    </div>
                  )}
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
        {/* Serviços */}
        <Card>
          <CardHeader>
            <Subtitle>Serviços</Subtitle>
          </CardHeader>
          <CardBody className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                  <Select
                    {...register(`categories.${index}.category_id`)}
                    label="Categoria"
                    placeholder="Selecione uma categoria"
                  >
                    {categories!.map((cat) => (
                      <SelectItem key={cat.id} onPress={()=>{
                        setValue(`categories.${index}.category_name`,cat.name)
                      }}>{cat.name}</SelectItem>
                      
                    ))}
                  </Select>
                  <CustomInput
                    label="Serviço"
                    name={`categories.${index}.name`}
                    error_message={errors.categories?.[index]?.name?.message}
                    register={register}
                    
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
              </div>
            ))}
          </CardBody>
          <CardFooter>
            <Button
              onPress={handleAddItem}
              className="self-end"
              color="secondary"
            >
              <FiPlus />
              <Text type="normal">Adicionar Item</Text>
            </Button>
          </CardFooter>
        </Card>

        {/* Endereço */}
        <Card>
          <CardHeader>
            <Subtitle>Endereço</Subtitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4 ">
              <Input
                label="CEP"
                placeholder="00000-000"
                startContent={<CiMapPin />}
                {...register("address.zip", { required: "Campo obrigatório" })}
                isInvalid={!!errors.address?.zip}
                errorMessage={errors.address?.zip?.message}
              />
              <Button
                onPress={handleSearchZip}
                isDisabled={!postalCode}
                color="primary"
                isLoading={isLoadingPostalCode}
                isIconOnly
                size="lg"
              >
                <CiSearch size={20} />
              </Button>
            </div>
            <Input
              label="Estado"
              isDisabled
              {...register("address.state")}
              value={address.address_state}
            />
            <Input
              label="Cidade"
              isDisabled
              {...register("address.city")}
              value={address.address_city}
            />
            <Input
              label="Rua"
              isDisabled
              {...register("address.address")}
              value={address.address_street}
            />
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
