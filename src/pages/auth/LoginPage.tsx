import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { AuthenticateUserProps } from '../../api/auth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const LoginPage = () => {
  const { login ,isAuthenticated} = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  // Get the return URL from location state or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';
  if(isAuthenticated){
    navigate(from, { replace: true });
  }
  
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
      navigate(from, { replace: true });
    } catch (error) {
      toast.error('Falha ao realizar login. Verifique suas credenciais.');
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
            Faça login para acessar sua conta
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm border border-neutral-200">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Esqueceu sua senha?
              </Link>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              icon={<LogIn size={18} />}
              className="w-full"
            >
              Entrar
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-neutral-600">
              Não tem uma conta?{' '}
              <Link
                to="/register"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Registre-se
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;