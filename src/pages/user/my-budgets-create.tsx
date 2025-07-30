import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../../stores/authStore";
import {
  createEstimateRequest,
  CreateEstimateRequestProps,
  uploadEstimateRequestFiles,
} from "../../api/estimateRequests";

import FileUpload from "../../components/ui/FileUpload";

import { Title } from "../../components/ui/Title";
import { Text } from "../../components/ui/Text";
import { Subtitle } from "../../components/ui/Subtitle";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { FiAlertTriangle, FiFileText } from "react-icons/fi";
import { CiMail, CiMapPin, CiPhone, CiRuler } from "react-icons/ci";
import { searchByZipCode } from "../../utils/search-zip-address";
import { getCategories } from "../../api/category";
import { useQuery } from "@tanstack/react-query";
import { getCompaniesByLocation } from "../../api/companies";

const urgencies = [
  {
    label: "O mais rápido possível",
    value: 0,
  },
  {
    label: "Ainda esta semana",
    value: 1,
  },
  {
    label: "Dentro deste mês",
    value: 2,
  },
  {
    label: "Sem data definida",
    value: 3,
  },
];

export function MyBudgetsCreatePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isCompaniesError, setIsCompaniesError] = useState(false);
  const [isLoadingPostalCode, setIsLoadingPostalCode] = useState(false);
  const [address, setAddress] = useState(
    {} as {
      address_state: string;
      address_city: string;
      address_neighborhood: string;
      address_street: string;
    }
  );

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const defaultCategory = searchParams.get("category");
  const defaultPostalCode = searchParams.get("postal_code");

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<CreateEstimateRequestProps>({
    defaultValues: {
      email: user?.email,
      phone: user?.phone,
    },
  });
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  const handleSearchZip = useCallback(async (): Promise<{
    city: string;
    postal_code: string;
    state: string;
    street: string;
  }> => {
    try {
      const postal_code = getValues("address_postal_code");
      setIsLoadingPostalCode(true);

      if (!postal_code.trim()) {
        toast.error("Preencha o campo de CEP");
        throw new Error("CEP não pode ser vazio");
      }
      const { logradouro, estado, uf, bairro, cep } = await searchByZipCode(
        postal_code.trim()
      );
      setValue("address_state", uf, { shouldDirty: true, shouldTouch: true });
      setValue("address_city", estado, {
        shouldDirty: true,
        shouldTouch: true,
      });
      setValue("address_neighborhood", bairro, {
        shouldDirty: true,
        shouldTouch: true,
      });
      setValue("address_street", logradouro, {
        shouldDirty: true,
        shouldTouch: true,
      });
      setAddress({
        address_state: uf,
        address_city: estado,
        address_neighborhood: bairro,
        address_street: logradouro,
      });

      return {
        city: estado,
        postal_code: cep,
        state: uf,
        street: logradouro,
      };
    } catch (error) {
      console.log("erros", error);
      toast.error(
        "Erro ao buscar CEP, verifique se o CEP está correto e tente novamente"
      );
      throw error;
    } finally {
      setIsLoadingPostalCode(false);
    }
  }, [getValues, setValue]);

  const verifyHasCompanies = async () => {
    const { city, postal_code, state, street } = await handleSearchZip();
    if (defaultCategory && defaultPostalCode) {
      return;
    }
    const category = getValues("category");
    const existePrestador = await getCompaniesByLocation({
      address: {
        city,
        country: "Brasil",
        postal_code,
        state,
        street,
      },
      categories: [category],
    });
    const hasCompanies = existePrestador.length > 0;
    if (!hasCompanies) {
      setIsCompaniesError(true);
      toast.error("Não há prestadores disponíveis na sua região");
      return;
    }
    setIsCompaniesError(false);
  };
  const onSubmit = async (data: CreateEstimateRequestProps) => {
    // if (!position) {
    //   toast.error('É necessário permitir o acesso à sua localização');
    //   return;
    // }

    try {
      const requestData = {
        ...data,
        footage: Number(data.footage),
        user_id: user?.id,
        // lat: position.coords.latitude.toString(),
        // long: position.coords.longitude.toString(),
      };

      const response = await createEstimateRequest(requestData);

      // Upload files if any are selected
      if (selectedFiles.length > 0) {
        const formData = new FormData();
        selectedFiles.forEach((file) => {
          formData.append("files", file);
        });

        await uploadEstimateRequestFiles(response.id, formData);
      }

      toast.success("Solicitação de orçamento criada com sucesso!");
      navigate(`/my-budgets/${response.id}`);
    } catch (error) {
      console.log("error", error);
      toast.error("Erro ao criar solicitação de orçamento");
    } finally {
      setIsLoading(false);
    }
  };

  const postalCode = watch("address_postal_code");

  return (
    <div className="space-y-6 fade-in max-w-6xl mx-auto px-4 py-6">
      <div>
        <Title>Nova Solicitação</Title>
        <Text className="text-neutral-600">
          Preencha os dados para solicitar orçamentos
        </Text>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <Subtitle>Informações do Projeto</Subtitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <Input
                label="Nome do projeto"
                startContent={<FiFileText size={18} />}
                placeholder="Ex: Reforma do banheiro"
                errorMessage={errors.name?.message}
                isInvalid={!!errors.name?.message}
                {...register("name", {
                  required: "Nome do projeto é obrigatório",
                  minLength: {
                    value: 2,
                    message: "Nome deve ter pelo menos 2 caracteres",
                  },
                })}
              />

              {categories && categories.length && (
                <Select
                  {...register("category")}
                  label="Categoria"
                  placeholder="Selecione uma categoria"
                  defaultSelectedKeys={defaultCategory ? [defaultCategory] : []}
                >
                  {categories.map((cat) => (
                    <SelectItem key={cat.name}>{cat.name}</SelectItem>
                  ))}
                </Select>
              )}
              {urgencies.length && (
                <Select
                  {...register("urgency")}
                  label="Urgencia"
                  placeholder="Qual a urgencia"
                  
                >
                  {urgencies.map((item) => (
                    <SelectItem key={item.value}>{item.label}</SelectItem>
                  ))}
                </Select>
              )}
              

              <Textarea
                label="Descrição"
                placeholder="Descreva os detalhes do seu projeto..."
                errorMessage={errors.description?.message}
                isInvalid={!!errors.description?.message}
                {...register("description", {
                  required: "Descrição é obrigatória",
                })}
              />

              <Input
                label="Metragem (m²)"
                type="number"
                startContent={<CiRuler size={18} />}
                placeholder="Ex: 50"
                errorMessage={errors.footage?.message}
                isInvalid={!!errors.footage?.message}
                {...register("footage", {
                  required: "Metragem é obrigatória",
                  min: {
                    value: 1,
                    message: "Metragem deve ser maior que 0",
                  },
                })}
              />

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Arquivos do projeto (opcional)
                </label>
                <FileUpload
                  onFilesSelected={setSelectedFiles}
                  maxFiles={5}
                  maxSizeInMB={10}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <Subtitle>Endereço</Subtitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <Input
                label="CEP"
                startContent={<CiMapPin size={18} />}
                placeholder="00000-000"
                defaultValue={defaultPostalCode ? defaultPostalCode : ""}
                errorMessage={errors.address_postal_code?.message}
                isInvalid={!!errors.address_postal_code?.message}
                {...register("address_postal_code", {
                  required: "CEP é obrigatório",
                })}
              />
              {isCompaniesError && (
                <div className="flex items-center gap-2">
                  <FiAlertTriangle size={24} className="text-red-500" />
                  <Text className="text-red-500">
                    No momento não temos prestadores na sua região, mas não se
                    preocupe, em breve teremos novos parceiros disponíveis.
                  </Text>
                </div>
              )}
              <Button
                onPress={verifyHasCompanies}
                isDisabled={!postalCode}
                color="primary"
                isLoading={isLoadingPostalCode}
              >
                Pesquisar
              </Button>

              <Input
                label="Rua"
                isDisabled
                placeholder="Ex: Rua Principal"
                value={address.address_street}
                errorMessage={errors.address_street?.message}
                isInvalid={!!errors.address_street?.message}
                {...register("address_street", {
                  required: "Rua é obrigatória",
                })}
              />
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Estado"
                  isDisabled
                  placeholder="Ex: SP"
                  value={address.address_state}
                  errorMessage={errors.address_state?.message}
                  isInvalid={!!errors.address_state?.message}
                  {...register("address_state", {
                    required: "Estado é obrigatório",
                  })}
                />
                <Input
                  label="Cidade"
                  placeholder="Ex: São Paulo"
                  isDisabled
                  value={address.address_city}
                  errorMessage={errors.address_city?.message}
                  isInvalid={!!errors.address_city?.message}
                  {...register("address_city", {
                    required: "Cidade é obrigatória",
                  })}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Bairro"
                  isDisabled
                  placeholder="Ex: Centro"
                  value={address.address_neighborhood}
                  errorMessage={errors.address_neighborhood?.message}
                  isInvalid={!!errors.address_neighborhood?.message}
                  {...register("address_neighborhood", {
                    required: "Bairro é obrigatório",
                  })}
                />

                <Input
                  label="Número"
                  placeholder="Ex: 123"
                  errorMessage={errors.address_number?.message}
                  isInvalid={!!errors.address_number?.message}
                  {...register("address_number", {
                    required: "Número é obrigatório",
                  })}
                />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <Subtitle>Contato</Subtitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Email"
                  type="email"
                  startContent={<CiMail size={18} />}
                  placeholder="seu@email.com"
                  errorMessage={errors.email?.message}
                  isInvalid={!!errors.email?.message}
                  {...register("email", {
                    required: "Email é obrigatório",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Email inválido",
                    },
                  })}
                />

                <Input
                  label="Telefone"
                  startContent={<CiPhone size={18} />}
                  placeholder="(00) 00000-0000"
                  errorMessage={errors.phone?.message}
                  isInvalid={!!errors.phone?.message}
                  {...register("phone", {
                    required: "Telefone é obrigatório",
                    minLength: {
                      value: 10,
                      message: "Telefone deve ter pelo menos 10 dígitos",
                    },
                    maxLength: {
                      value: 15,
                      message: "Telefone deve ter no máximo 15 dígitos",
                    },
                  })}
                />
              </div>
            </CardBody>
          </Card>

          <div className="flex justify-end">
            <Button
              type="submit"
              isLoading={isLoading}
              color="primary"
              isDisabled={isCompaniesError}
            >
              Solicitar orçamentos
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
