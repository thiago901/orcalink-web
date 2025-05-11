import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../../stores/authStore';
import { createEstimateRequest, CreateEstimateRequestProps, uploadEstimateRequestFiles } from '../../api/estimateRequests';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import FileUpload from '../../components/ui/FileUpload';
import { MapPin, Phone, Mail, Ruler, FileText } from 'lucide-react';

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
      toast.error('Erro ao criar solicitação de orçamento');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-neutral-800">Nova Solicitação</h1>
        <p className="text-neutral-600">Preencha os dados para solicitar orçamentos</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Projeto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Nome do projeto"
                icon={<FileText size={18} />}
                placeholder="Ex: Reforma do banheiro"
                error={errors.name?.message}
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
                error={errors.description?.message}
                {...register('description', {
                  required: 'Descrição é obrigatória',
                })}
              />

              <Input
                label="Metragem (m²)"
                type="number"
                icon={<Ruler size={18} />}
                placeholder="Ex: 50"
                error={errors.footage?.message}
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Endereço</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="CEP"
                  icon={<MapPin size={18} />}
                  placeholder="00000-000"
                  error={errors.address_postal_code?.message}
                  {...register('address_postal_code', {
                    required: 'CEP é obrigatório',
                  })}
                />

                <Input
                  label="Estado"
                  placeholder="Ex: SP"
                  error={errors.address_state?.message}
                  {...register('address_state', {
                    required: 'Estado é obrigatório',
                  })}
                />
              </div>

              <Input
                label="Cidade"
                placeholder="Ex: São Paulo"
                error={errors.address_city?.message}
                {...register('address_city', {
                  required: 'Cidade é obrigatória',
                })}
              />

              <Input
                label="Bairro"
                placeholder="Ex: Centro"
                error={errors.address_neighborhood?.message}
                {...register('address_neighborhood', {
                  required: 'Bairro é obrigatório',
                })}
              />

              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Rua"
                  placeholder="Ex: Rua Principal"
                  error={errors.address_street?.message}
                  {...register('address_street', {
                    required: 'Rua é obrigatória',
                  })}
                />

                <Input
                  label="Número"
                  placeholder="Ex: 123"
                  error={errors.address_number?.message}
                  {...register('address_number', {
                    required: 'Número é obrigatório',
                  })}
                />
              </div>

              {!position && (
                <div className="mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    icon={<MapPin size={18} />}
                    onClick={getCurrentPosition}
                  >
                    Usar minha localização atual
                  </Button>
                  {geolocationError && (
                    <p className="mt-2 text-sm text-error-500">{geolocationError}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Email"
                  type="email"
                  icon={<Mail size={18} />}
                  placeholder="seu@email.com"
                  error={errors.email?.message}
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
                  icon={<Phone size={18} />}
                  placeholder="(00) 00000-0000"
                  error={errors.phone?.message}
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
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              type="submit"
              isLoading={isLoading}
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