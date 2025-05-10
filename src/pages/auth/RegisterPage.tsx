import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Mail, Lock, User, Phone, UserPlus } from 'lucide-react';
import { registerUser, CreateUserProps } from '../../api/auth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserProps>();

  const onSubmit = async (data: CreateUserProps) => {
    setIsLoading(true);
    try {
      await registerUser(data);
      toast.success('Conta criada com sucesso! Faça login para continuar.');
      navigate('/login');
    } catch (error) {
      toast.error('Erro ao criar conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-700">OrçaFacil</h1>
          <p className="text-neutral-600 mt-2">
            Crie sua conta para começar
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm border border-neutral-200">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Nome completo"
              type="text"
              icon={<User size={18} />}
              placeholder="Seu nome completo"
              error={errors.name?.message}
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
              type="tel"
              icon={<Phone size={18} />}
              placeholder="(00) 00000-0000"
              error={errors.phone?.message}
              {...register('phone', {
                required: 'Telefone é obrigatório',
                minLength: {
                  value: 8,
                  message: 'Telefone deve ter pelo menos 8 caracteres',
                },
              })}
            />

            <Input
              label="Senha"
              type="password"
              icon={<Lock size={18} />}
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password', {
                required: 'Senha é obrigatória',
                minLength: {
                  value: 6,
                  message: 'A senha deve ter pelo menos 6 caracteres',
                },
              })}
            />

            <Button
              type="submit"
              isLoading={isLoading}
              icon={<UserPlus size={18} />}
              className="w-full"
            >
              Criar conta
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-neutral-600">
              Já tem uma conta?{' '}
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Faça login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;