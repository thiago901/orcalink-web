import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import { useAuthStore } from "../../stores/authStore";
import {
  getUserById,
  updateUser,
  UpdateUserProps,
  uploadUserImage,
} from "../../api/users";

import { Title } from "../../components/ui/Title";
import { Text } from "../../components/ui/Text";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Image,
  Input,
  Spinner,
} from "@heroui/react";
import { Subtitle } from "../../components/ui/Subtitle";
import { CiMail, CiUser } from "react-icons/ci";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import FileUpload from "../../components/ui/FileUpload";

const ProfilePage = () => {
  const { user, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [changedFile, setChangedFile] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const queryClient = useQueryClient();

  const { data: request } = useQuery({
    queryKey: ["user", user?.id],
    queryFn: () => getUserById(user!.id),
    enabled: !!user,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateUserProps>();

  const uploadImage = useCallback(
    async (user_id: string) => {
      if (selectedFiles.length > 0) {
        const formData = new FormData();
        formData.append("file", selectedFiles[0]);
        await uploadUserImage(user_id, formData);
        toast.success("Imagem enviada com sucesso!");
      }
    },
    [selectedFiles]
  );
  const onSubmit = useCallback(
    async (data: UpdateUserProps) => {
      if (!user?.id) return;

      setIsLoading(true);
      try {
        const response = await updateUser(user.id, data);

        if (changedFile) {
          await uploadImage(user.id);
        }
        queryClient.setQueryData(["user", user.id], response);
        toast.success("Perfil atualizado com sucesso!");
      } catch (error) {
        console.log("error", error);
        toast.error("Erro ao atualizar perfil");
      } finally {
        setIsLoading(false);
      }
    },
    [changedFile, queryClient, uploadImage, user]
  );

  const handleChangeAvatar = useCallback((files: File[]) => {
    setSelectedFiles(files);
    setChangedFile(true);
  }, []);

  return (
    <div className="space-y-6 fade-in max-w-6xl mx-auto px-4 py-6">
      {!request ? (
        <Spinner />
      ) : (
        <>
          <div>
            <Title>Perfil</Title>
            <Text>Gerencie suas informações pessoais</Text>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <Subtitle>Informações Pessoais</Subtitle>
              </CardHeader>
              <CardBody>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="block text-sm font-medium text-neutral-700 mb-2">
                        Foto de perfil (opcional)
                      </span>
                      <div className="flex flex-col gap-4 ">
                        {request?.avatar ? (
                          <div className="flex items-end">
                            <div>
                              <Image
                                src={request.avatar}
                                className="w-32"
                                radius="full"
                              />
                            </div>

                            <div>
                              <FileUpload
                                onFilesSelected={handleChangeAvatar}
                                maxFiles={1}
                                maxSizeInMB={10}
                                multiple={false}
                                accept=".jpg,.jpeg,.png"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="self-center">
                            <FileUpload
                              onFilesSelected={handleChangeAvatar}
                              maxFiles={1}
                              maxSizeInMB={10}
                              multiple={false}
                              accept=".jpg,.jpeg,.png"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium">{request?.name}</h4>
                      <p className="text-sm text-neutral-500">
                        {request?.email}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Nome completo"
                      startContent={<CiUser size={18} />}
                      defaultValue={request?.name}
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
                      isDisabled={true}
                      label="Email"
                      type="email"
                      startContent={<CiMail size={18} />}
                      defaultValue={request?.email}
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
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onPress={() => logout()}
                    >
                      Sair
                    </Button>
                    <Button type="submit" isLoading={isLoading} color="primary">
                      Salvar alterações
                    </Button>
                  </div>
                </form>
              </CardBody>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
