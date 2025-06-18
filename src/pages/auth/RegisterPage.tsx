import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { registerUser, CreateUserProps } from "../../api/auth";
import { Button, Card, CardBody, CardHeader, Input, Link } from "@heroui/react";
import { CiLock, CiMail, CiUser } from "react-icons/ci";
import { FiPhone } from "react-icons/fi";
import { FaUserPlus } from "react-icons/fa6";
import { Text } from "../../components/ui/Text";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<"customer" | "company" | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserProps>();

  const handleRegister = async (data: CreateUserProps) => {
    setIsLoading(true);
    try {
      data.role = role ?? "customer";
      await registerUser(data);
      toast.success("Conta criada com sucesso! Faça login para continuar.");
      navigate("/login");
    } catch (error) {
      console.error("error", error);
      toast.error("Erro ao criar conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!role) {
    return (

      <div className="max-w-md mx-auto mt-12 text-center space-y-6">
        <Card>
          <CardHeader className="flex flex-col gap-2">
            <Text type="subtitle" align="center" weight="semibold" color="primary">
              Criar Conta
            </Text>
            <Text type="normal" align="center">
              Escolha o tipo de conta que melhor se adequa a você
            </Text>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <Button
                color="primary"
                variant="ghost"
                className="h-auto p-6 flex flex-col items-center space-y-3 hover:bg-brand-50 hover:border-brand-300"
                onPress={() => setRole("customer")}
              >
                {/* <Users className="h-8 w-8 text-brand-600" /> */}
                <div className="text-center">
                  <Text type="normal" align="center" weight="semibold" >Sou Cliente</Text>
                  <div>Quero solicitar orçamentos para serviços</div>
                </div>
              </Button>

              <Button
                color="primary"
                variant="ghost"
                className="h-auto p-6 flex flex-col items-center space-y-3 hover:bg-brand-50 hover:border-brand-300"
                onPress={() => setRole("company")}
              >
                {/* <Briefcase className="h-8 w-8 text-brand-600" /> */}
                <div className="text-center">
                <Text type="normal" align="center" weight="semibold" >Sou Prestador</Text>
                  <div className="">
                    Quero oferecer meus serviços e enviar propostas
                  </div>
                </div>
              </Button>
            </div>

            <div className="text-center text-sm text-gray-600">
              Já tem uma conta?{" "}
              <Link color="primary" href="/login" className="">
                Fazer login
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  const isCompany = role === "company";

  return (
    <div className="w-[400px] m-auto mt-6">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <h1 className="text-3xl font-bold text-primary-700">OrçaLink</h1>
          <p className="text-neutral-600 mt-1">
            {isCompany
              ? "Crie sua conta empresarial para começar"
              : "Crie sua conta para começar"}
          </p>
        </CardHeader>
        <CardBody className="px-6 pb-6 pt-2">
          <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
            <Input
              label={isCompany ? "Nome do Responsável" : "Nome completo"}
              type="text"
              startContent={<CiUser size={18} />}
              placeholder="Seu nome"
              errorMessage={errors.name?.message}
              isInvalid={!!errors.name?.message}
              {...register("name", {
                required: "Nome é obrigatório",
                minLength: {
                  value: 2,
                  message: "Nome deve ter pelo menos 2 caracteres",
                },
              })}
            />
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
              type="tel"
              startContent={<FiPhone size={18} />}
              placeholder="(00) 00000-0000"
              errorMessage={errors.phone?.message}
              isInvalid={!!errors.phone?.message}
              {...register("phone", {
                required: "Telefone é obrigatório",
                minLength: {
                  value: 8,
                  message: "Telefone deve ter pelo menos 8 caracteres",
                },
              })}
            />
            <Input
              label="Senha"
              type="password"
              startContent={<CiLock size={18} />}
              placeholder="••••••••"
              errorMessage={errors.password?.message}
              isInvalid={!!errors.password?.message}
              {...register("password", {
                required: "Senha é obrigatória",
                minLength: {
                  value: 6,
                  message: "A senha deve ter pelo menos 6 caracteres",
                },
              })}
            />
            <input hidden value={role} {...register("role")} />
            <Button
              type="submit"
              isLoading={isLoading}
              startContent={<FaUserPlus size={18} />}
              className="w-full"
              color="primary"
            >
              Criar conta
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-neutral-600">
              Já tem uma conta?{" "}
              <Link
                href="/login"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Faça login
              </Link>
            </p>
            <button
              className="mt-4 text-sm text-neutral-500 underline hover:text-neutral-700"
              onClick={() => setRole(null)}
            >
              Voltar
            </button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default RegisterPage;
