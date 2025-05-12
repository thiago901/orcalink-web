import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { User, Mail, Phone, Camera } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { updateUser, UpdateUserProps } from '../../api/users';


import { Title } from '../../components/ui/Title';
import { Text } from '../../components/ui/Text';
import { Button, Card, CardBody, CardHeader, Input } from '@heroui/react';
import { Subtitle } from '../../components/ui/Subtitle';

const ProfilePage = () => {
  const { user, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateUserProps>({
    defaultValues: {
      name: user?.name,
      email: user?.email,
    },
  });

  const onSubmit = async (data: UpdateUserProps) => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      await updateUser(user.id, data);
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 fade-in">
      <div>
        <Title >Perfil</Title>
        <Text >Gerencie suas informações pessoais</Text>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <Subtitle>Informações Pessoais</Subtitle>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-2xl font-medium">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 p-1.5 rounded-full bg-white border border-neutral-200 text-neutral-700 hover:text-primary-600 transition-colors"
                  >
                    <Camera size={16} />
                  </button>
                </div>
                <div>
                  <h4 className="font-medium">{user?.name}</h4>
                  <p className="text-sm text-neutral-500">{user?.email}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Nome completo"
                  startContent={<User size={18} />}
                  errorMessage={errors.name?.message}
                  isInvalid={!!errors.name?.message}
                  {...register('name', {
                    required: 'Nome é obrigatório',
                    minLength: {
                      value: 2,
                      message: 'Nome deve ter pelo menos 2 caracteres',
                    },
                  })}
                />

                <Input
                  label="Email"
                  type="email"
                  startContent={<Mail size={18} />}
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
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onPress={() => logout()}
                >
                  Sair
                </Button>
                <Button
                  type="submit"
                  isLoading={isLoading}
                  color='primary'
                >
                  Salvar alterações
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default ProfilePage;