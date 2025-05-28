import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../../stores/authStore';
import { createEstimateRequest, CreateEstimateRequestProps, uploadEstimateRequestFiles } from '../../api/estimateRequests';




import FileUpload from '../../components/ui/FileUpload';

import { Title } from '../../components/ui/Title';
import { Text } from '../../components/ui/Text';
import { Subtitle } from '../../components/ui/Subtitle';
import { Button, Card, CardBody, CardHeader, Input, Textarea } from '@heroui/react';
import { FiFileText } from 'react-icons/fi';
import { CiMail, CiMapPin, CiPhone, CiRuler } from 'react-icons/ci';

const CreateEstimateRequestPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [geolocationError, setGeolocationError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateEstimateRequestProps>({
    defaultValues: {
      email: user?.email,
    },
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
          console.error('Geolocation error:', error);
          setGeolocationError('Não foi possível obter sua localização.');
        }
      );
    } else {
      setGeolocationError('Geolocalização não é suportada pelo seu navegador.');
    }
  };

  const onSubmit = async (data: CreateEstimateRequestProps) => {
    if (!position) {
      toast.error('É necessário permitir o acesso à sua localização');
      return;
    }

    setIsLoading(true);
    try {
      const requestData = {
        ...data,
        footage:Number(data.footage),
        user_id: user?.id,
        lat: position.coords.latitude.toString(),
        long: position.coords.longitude.toString(),
      };

      const response = await createEstimateRequest(requestData);

      // Upload files if any are selected
      if (selectedFiles.length > 0) {
        const formData = new FormData();
        selectedFiles.forEach(file => {
          formData.append('files', file);
        });

        await uploadEstimateRequestFiles(response.id, formData);
      }

      toast.success('Solicitação de orçamento criada com sucesso!');
      navigate(`/dashboard/estimate-requests/${response.id}`);
    } catch (error) {
      console.log('error',error);
      toast.error('Erro ao criar solicitação de orçamento');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 fade-in">
      <div>
        <Title >Nova Solicitação</Title>
        <Text className="text-neutral-600">Preencha os dados para solicitar orçamentos</Text>
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
                {...register('name', {
                  required: 'Nome do projeto é obrigatório',
                  minLength: {
                    value: 2,
                    message: 'Nome deve ter pelo menos 2 caracteres',
                  },
                })}
              />

              <Textarea
                label="Descrição"
                placeholder="Descreva os detalhes do seu projeto..."
                errorMessage={errors.description?.message}
                isInvalid={!!errors.description?.message}
                {...register('description', {
                  required: 'Descrição é obrigatória',
                })}
              />

              <Input
                label="Metragem (m²)"
                type="number"
                startContent={<CiRuler size={18} />}
                placeholder="Ex: 50"
                errorMessage={errors.footage?.message}
                isInvalid={!!errors.footage?.message}
                {...register('footage', {
                  required: 'Metragem é obrigatória',
                  min: {
                    value: 1,
                    message: 'Metragem deve ser maior que 0',
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
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="CEP"
                  startContent={<CiMapPin size={18} />}
                  placeholder="00000-000"
                  errorMessage={errors.address_postal_code?.message}
                  isInvalid={!!errors.address_postal_code?.message}
                  {...register('address_postal_code', {
                    required: 'CEP é obrigatório',
                  })}
                />

                <Input
                  label="Estado"
                  placeholder="Ex: SP"
                  errorMessage={errors.address_state?.message}
                  isInvalid={!!errors.address_state?.message}
                  {...register('address_state', {
                    required: 'Estado é obrigatório',
                  })}
                />
              </div>

              <Input
                label="Cidade"
                placeholder="Ex: São Paulo"
                errorMessage={errors.address_city?.message}
                isInvalid={!!errors.address_city?.message}
                {...register('address_city', {
                  required: 'Cidade é obrigatória',
                })}
              />

              <Input
                label="Bairro"
                placeholder="Ex: Centro"
                errorMessage={errors.address_neighborhood?.message}
                isInvalid={!!errors.address_neighborhood?.message}
                {...register('address_neighborhood', {
                  required: 'Bairro é obrigatório',
                })}
              />

              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Rua"
                  placeholder="Ex: Rua Principal"
                  errorMessage={errors.address_street?.message}
                  isInvalid={!!errors.address_street?.message}
                  {...register('address_street', {
                    required: 'Rua é obrigatória',
                  })}
                />

                <Input
                  label="Número"
                  placeholder="Ex: 123"
                  errorMessage={errors.address_number?.message}
                  isInvalid={!!errors.address_number?.message}
                  {...register('address_number', {
                    required: 'Número é obrigatório',
                  })}
                />
              </div>

              {!position && (
                <div className="mt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    startContent={<CiMapPin size={18} />}
                    onPress={getCurrentPosition}
                  >
                    Usar minha localização atual
                  </Button>
                  {geolocationError && (
                    <p className="mt-2 text-sm text-error-500">{geolocationError}</p>
                  )}
                </div>
              )}
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
                  {...register('email', {
                    required: 'Email é obrigatório',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Email inválido',
                    },
                  })}
                />

                <Input
                  label="Telefone"
                  startContent={<CiPhone size={18} />}
                  placeholder="(00) 00000-0000"
                  errorMessage={errors.phone?.message}
                  isInvalid={!!errors.phone?.message}
                  {...register('phone', {
                    required: 'Telefone é obrigatório',
                    minLength: {
                      value: 10,
                      message: 'Telefone deve ter pelo menos 10 dígitos',
                    },
                    maxLength: {
                      value: 15,
                      message: 'Telefone deve ter no máximo 15 dígitos',
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
              color='primary'
            >
              Solicitar orçamentos
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateEstimateRequestPage;