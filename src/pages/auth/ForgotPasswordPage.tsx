import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import { forgotPassword, RecoverPasswordProps } from '../../api/auth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { CiMail } from "react-icons/ci";
import { FaArrowLeft } from "react-icons/fa6";

const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RecoverPasswordProps>();

  const onSubmit = async (data: RecoverPasswordProps) => {
    setIsLoading(true);
    try {
      await forgotPassword(data);
      setIsSubmitted(true);
      toast.success('Instruções de recuperação enviadas para seu email!');
    } catch (error) {
      console.log('error',error);
      toast.error('Erro ao enviar instruções. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-700">OrçaLink</h1>
          <p className="text-neutral-600 mt-2">
            Recupere o acesso à sua conta
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm border border-neutral-200">
          {isSubmitted ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-success-50 text-success-500 rounded-full mx-auto flex items-center justify-center mb-4">
                <CiMail size={32} />
              </div>
              <h2 className="text-xl font-semibold mb-2">Email enviado!</h2>
              <p className="text-neutral-600 mb-6">
                Enviamos instruções de recuperação para seu email.
                Verifique sua caixa de entrada.
              </p>
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
              >
                <FaArrowLeft size={16} className="mr-1" />
                Voltar para login
              </Link>
            </div>
          ) : (
            <>
              <p className="text-neutral-600 mb-6">
                Informe seu email de cadastro para receber instruções de recuperação 
                de senha.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                  label="Email"
                  type="email"
                  icon={<CiMail size={18} />}
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

                <Button
                  type="submit"
                  isLoading={isLoading}
                  className="w-full"
                >
                  Enviar instruções
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  to="/login"
                  className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
                >
                  <FaArrowLeft size={16} className="mr-1" />
                  Voltar para login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;