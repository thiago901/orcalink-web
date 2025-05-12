import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../../stores/authStore';

import { Title } from '../../components/ui/Title';
import { Text } from '../../components/ui/Text';
import { Subtitle } from '../../components/ui/Subtitle';
import { avatar, Button, Card, CardBody, CardHeader, Input, Textarea } from '@heroui/react';
import { CreateCompanyServiceProps } from '../../api/companyServices';
import { createCompany } from '../../api/companies';
import { FileText, MapPin } from 'lucide-react';

const CreateCompanyPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [geolocationError, setGeolocationError] = useState<string | null>(null);
  

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCompanyServiceProps>({
    defaultValues: {}
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

  const onSubmit = async (data: CreateCompanyServiceProps) => {
    if (!position) {
      toast.error('É necessário permitir o acesso à sua localização');
      return;
    }

    setIsLoading(true);
    try {
      console.log('address',data);
      
      const requestData = {
        ...data,
        address:{
          ...data.address,
          name: data.name,
          country:'Brasil',
          latitude:position.coords.latitude,
          longitude:position.coords.longitude,

        },
        owner_id: user?.id as string,
        
      };

      const response = await createCompany(requestData);


      toast.success('Empresa criada com sucesso!');
      navigate(`/dashboard/companies/${response.id}`);
    } catch (error) {
      toast.error('Erro ao criar empresa');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 fade-in">
      <div>
        <Title >Nova Empresa</Title>
        <Text className="text-neutral-600">Preencha os dados para criar uma nova empresa</Text>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <Subtitle>Informações da Empresa</Subtitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <Input
                label="Nome da empresa"
                startContent={<FileText size={18} />}
                placeholder="Ex: Reforma LTDA"
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
                placeholder="Descreva sobre sua empresa"
                errorMessage={errors.about?.message}
                isInvalid={!!errors.about?.message}
                {...register('about', {
                  required: 'Descrição é obrigatória',
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
                  {...register('address.zip', {
                    required: 'CEP é obrigatório',
                  })}
                />

                <Input
                  label="Estado"
                  placeholder="Ex: SP"
                  errorMessage={errors.address?.state?.message}
                  isInvalid={!!errors.address?.state?.message}
                  {...register('address.state', {
                    required: 'Estado é obrigatório',
                  })}
                />
              </div>

              <Input
                label="Cidade"
                placeholder="Ex: São Paulo"
                errorMessage={errors.address?.city?.message}
                isInvalid={!!errors.address?.city?.message}
                {...register('address.city', {
                  required: 'Cidade é obrigatória',
                })}
              />

             

              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Rua"
                  placeholder="Ex: Rua Principal"
                  errorMessage={errors.address?.address?.message}
                  isInvalid={!!errors.address?.address?.message}
                  {...register('address.address', {
                    required: 'Rua é obrigatória',
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
                    <p className="mt-2 text-sm text-error-500">{geolocationError}</p>
                  )}
                </div>
              )}
            </CardBody>
          </Card>


          <div className="flex justify-end">
            <Button
              type="submit"
              isLoading={isLoading}
              color='primary'
            >
              Criar empresa
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateCompanyPage;