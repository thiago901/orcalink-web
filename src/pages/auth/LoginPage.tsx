import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { toast } from 'react-hot-toast';

import { useAuthStore } from '../../stores/authStore';
import { AuthenticateUserProps } from '../../api/auth';
import { Button, Card, CardBody, CardHeader, Input, Link } from '@heroui/react';
import { FiLock, FiMail } from 'react-icons/fi';
import { CiLogin } from 'react-icons/ci';


const LoginPage = () => {
  const { login} = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);


  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthenticateUserProps>();

  const onSubmit = async (data: AuthenticateUserProps) => {
    setIsLoading(true);
    try {
      
      await login(data.email, data.password);
      toast.success('Login realizado com sucesso!');
      
    } catch (error) {
      console.error('LoginPage:onSubmit',error);
      toast.error('Falha ao realizar login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-lg">
        
        <CardHeader>
          <div className="my-0 mx-auto text-center">
            <h1 className="text-3xl font-bold text-primary-700">OrçaFacil</h1>
            <p className="text-neutral-600 mt-1">Faça login para acessar sua conta</p>
          </div>
        </CardHeader>
        <CardBody className="px-6 pb-6 pt-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Email"
              type="email"
              startContent={<FiMail size={18} />}
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
              label="Senha"
              type="password"
              startContent={<FiLock size={18} />}
              errorMessage={errors.password?.message}
              isInvalid={!!errors.password?.message}
              placeholder="••••••••"
              
              {...register('password', {
                required: 'Senha é obrigatória',
                minLength: {
                  value: 6,
                  message: 'A senha deve ter pelo menos 6 caracteres',
                },
              })}
            />

            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Esqueceu sua senha?
              </Link>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              startContent={<CiLogin size={18} />}
              className="w-full"
              color='primary'
            >
              Entrar
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-neutral-600">
              Não tem uma conta?{' '}
              <Link
                href="/register"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Registre-se
              </Link>
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default LoginPage;