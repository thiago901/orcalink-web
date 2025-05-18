import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../../stores/authStore";

import { Title } from "../../components/ui/Title";
import { Text } from "../../components/ui/Text";
import { Subtitle } from "../../components/ui/Subtitle";
import {
  avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Textarea,
  Tooltip,
} from "@heroui/react";
import { CreateCompanyServiceProps } from "../../api/companyServices";
import { createCompany, uploadCompanyImage } from "../../api/companies";
import { FileText, MapPin } from "lucide-react";
import FileUpload from "../../components/ui/FileUpload";

export function CompanyCreateForm() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [geolocationError, setGeolocationError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [companyId, setCompanyId] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCompanyServiceProps>({
    defaultValues: {},
  });

  // Get user's current position
  const getCurrentPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition(pos);
          setGeolocationError(null);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setGeolocationError("Não foi possível obter sua localização.");
        }
      );
    } else {
      setGeolocationError("Geolocalização não é suportada pelo seu navegador.");
    }
  };
  const uploadImage= useCallback(async()=>{
    
    
    if (!companyId) {
      toast.error("Crie a empresa antes de fazer o upload da imagem");
      return;
    }
    console.log('companyId', selectedFiles[0]);
    if (selectedFiles.length > 0) {
        const formData = new FormData();
        formData.append('file', selectedFiles[0]);

        await uploadCompanyImage(companyId,formData)
      // Call your upload API here
    }

  },[companyId, selectedFiles])
  const onSubmit = async (data: CreateCompanyServiceProps) => {
    if (!position) {
      toast.error("É necessário permitir o acesso à sua localização");
      return;
    }

    setIsLoading(true);
    try {
      const requestData = {
        ...data,
        address: {
          ...data.address,
          name: data.name,
          country: "Brasil",
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        owner_id: user?.id as string,
      };

      const response = await createCompany(requestData);
      setCompanyId(response.id);
      toast.success("Empresa criada com sucesso!");
    //   navigate(`/dashboard/companies/${response.id}`);
    } catch (error) {
      toast.error("Erro ao criar empresa");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div>
        <Title>Nova Empresa</Title>
        <Text className="text-neutral-600">
          Preencha os dados para criar uma nova empresa
        </Text>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <Subtitle>Informações da Empresa</Subtitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="flex align-start">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Foto de perfil (opcional)
                  </label>
                  <div className="flex flex-col gap-4">
                    <FileUpload
                      onFilesSelected={setSelectedFiles}
                      maxFiles={5}
                      maxSizeInMB={10}
                      multiple={false}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                    <Tooltip content="Salvar imagem apenas após criar a empresa">
                      <Button disabled={!companyId} onPress={uploadImage}>Salvar</Button>
                    </Tooltip>
                  </div>
                </div>
                <div className="flex-1 ml-4 flex flex-col gap-4">
                  <Input
                    label="Nome da empresa"
                    startContent={<FileText size={18} />}
                    placeholder="Ex: Reforma LTDA"
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

                  <Textarea
                    label="Descrição"
                    placeholder="Descreva sobre sua empresa"
                    errorMessage={errors.about?.message}
                    isInvalid={!!errors.about?.message}
                    {...register("about", {
                      required: "Descrição é obrigatória",
                    })}
                  />
                </div>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <Subtitle>Informações de Contato</Subtitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <Input
                label="Telefone"
                startContent={<FileText size={18} />}
                placeholder="+55 11 91234-5678"
                errorMessage={errors.phone?.message}
                isInvalid={!!errors.phone?.message}
                {...register("phone", {
                  required: "Nome do projeto é obrigatório",
                  minLength: {
                    value: 2,
                    message: "Nome deve ter pelo menos 2 caracteres",
                  },
                })}
              />
              <Input
                label="E-mail"
                startContent={<FileText size={18} />}
                placeholder="john@mail.com"
                errorMessage={errors.email?.message}
                isInvalid={!!errors.email?.message}
                type="email"
                {...register("email", {
                  required: "Nome do projeto é obrigatório",
                  minLength: {
                    value: 2,
                    message: "Nome deve ter pelo menos 2 caracteres",
                  },
                })}
              />
              <Input
                label="Site"
                startContent={<FileText size={18} />}
                placeholder="https://www.seusite.com"
                errorMessage={errors.website?.message}
                isInvalid={!!errors.website?.message}
                {...register("website", {
                  required: "Nome do projeto é obrigatório",
                  minLength: {
                    value: 2,
                    message: "Nome deve ter pelo menos 2 caracteres",
                  },
                })}
              />
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <Subtitle>Endereço</Subtitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="CEP"
                  startContent={<MapPin size={18} />}
                  placeholder="00000-000"
                  errorMessage={errors.address?.zip?.message}
                  isInvalid={!!errors.address?.zip?.message}
                  {...register("address.zip", {
                    required: "CEP é obrigatório",
                  })}
                />

                <Input
                  label="Estado"
                  placeholder="Ex: SP"
                  errorMessage={errors.address?.state?.message}
                  isInvalid={!!errors.address?.state?.message}
                  {...register("address.state", {
                    required: "Estado é obrigatório",
                  })}
                />
              </div>

              <Input
                label="Cidade"
                placeholder="Ex: São Paulo"
                errorMessage={errors.address?.city?.message}
                isInvalid={!!errors.address?.city?.message}
                {...register("address.city", {
                  required: "Cidade é obrigatória",
                })}
              />

              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Rua"
                  placeholder="Ex: Rua Principal"
                  errorMessage={errors.address?.address?.message}
                  isInvalid={!!errors.address?.address?.message}
                  {...register("address.address", {
                    required: "Rua é obrigatória",
                  })}
                />
              </div>

              {!position && (
                <div className="mt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    startContent={<MapPin size={18} />}
                    onPress={getCurrentPosition}
                  >
                    Usar minha localização atual
                  </Button>
                  {geolocationError && (
                    <p className="mt-2 text-sm text-error-500">
                      {geolocationError}
                    </p>
                  )}
                </div>
              )}
            </CardBody>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" isLoading={isLoading} color="primary" isDisabled={!!companyId}>
              Criar empresa
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
