import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { registerUser, CreateUserProps } from "../../api/auth";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Input,
  Link,
  Tab,
  Tabs,
} from "@heroui/react";
import { CiLock, CiMail, CiUser } from "react-icons/ci";
import { FiPhone } from "react-icons/fi";
import { FaUserPlus } from "react-icons/fa6";
import { Text } from "../../components/ui/Text";

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
      toast.success("Conta criada com sucesso! Faça login para continuar.");
      navigate("/login");
    } catch (error) {
      console.log("error", error);
      toast.error("Erro ao criar conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };
  const onSubmitCompany = async (data: CreateUserProps) => {
    setIsLoading(true);
    try {
      data.role='company'
      
      
      await registerUser(data);
      toast.success("Conta criada com sucesso! Faça login para continuar.");
      navigate("/login");
    } catch (error) {
      console.log("error", error);
      toast.error("Erro ao criar conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[400px] m-auto mt-4">
      <div>
        <Tabs fullWidth color="primary">
          <Tab key="customer" title="Sou Cliente">
            <Card className="w-full  shadow-lg">
              <CardHeader>
                <div className="my-0 mx-auto text-center">
                  <h1 className="text-3xl font-bold text-primary-700">
                    OrçaFacil
                  </h1>
                  <p className="text-neutral-600 mt-1">
                    Crie sua conta para começar
                  </p>
                </div>
              </CardHeader>

              <CardBody className="px-6 pb-6 pt-2">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <Input
                    label="Nome completo"
                    type="text"
                    startContent={<CiUser size={18} />}
                    placeholder="Seu nome completo"
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

                  <input hidden value={"customer"} {...register("role")} />

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
                </div>
              </CardBody>
            </Card>
          </Tab>
          <Tab key="company" title="Sou empresa" >
            <Card className="w-full shadow-lg">
              <CardHeader>
                <div className="my-0 mx-auto text-center">
                  <h1 className="text-3xl font-bold text-primary-700">
                    OrçaFacil
                  </h1>
                  <p className="text-neutral-600 mt-1">
                    Crie sua conta empresarial para começar
                  </p>
                </div>
              </CardHeader>

              <CardBody className="px-6 pb-6 pt-2">
                <form onSubmit={handleSubmit(onSubmitCompany)} className="space-y-4">
                  <Input
                    label="Nome completo"
                    type="text"
                    startContent={<CiUser size={18} />}
                    placeholder="Nome do Responsável"
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
                    label="Email do Responsável"
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
                  <input hidden value={"company"} {...register("role")} />
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
                </div>
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default RegisterPage;
