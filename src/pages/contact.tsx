import { useForm } from "react-hook-form";
import { Button, Card, CardBody, Select, SelectItem } from "@heroui/react";

import { toast } from "react-hot-toast";
import { CustomInput } from "../components/ui/Input";
import { CustomTextArea } from "../components/ui/Textarea";
import {
  ContactFormData,
  ContactFormDataSchema,
  sendSupportMessage,
} from "../api/users";
import { zodResolver } from "@hookform/resolvers/zod";

const labelOptions = [
  { key: "suporte", label: "Suporte Técnico" },
  { key: "planos", label: "Dúvidas sobre Planos" },
  { key: "pagamento", label: "Problemas com Pagamento" },
  { key: "bug", label: "Reportar Bug" },
  { key: "sugestao", label: "Sugestões" },
  { key: "outro", label: "Outro" },
  { key: "reclamação", label: "reclamação" },
];

export function Contact() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(ContactFormDataSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      // await sendContactMessage(data); // sua função de API aqui
      console.log("Enviado:", data);
      await sendSupportMessage(data);
      toast.success("Mensagem enviada com sucesso!");
      reset();
    } catch (err) {
      toast.error("Erro ao enviar mensagem");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-xl mx-auto space-y-4"
    >
      <Card>
        <CardBody className="space-y-4">
          <h2 className="text-lg font-semibold">Entre em Contato</h2>

          <CustomInput
            label="Título"
            name="title"
            register={register}
            error_message={errors.title?.message}
          />

          <Select
            {...register("label")}
            label="Categoria"
            errorMessage={errors.label?.message}
            isInvalid={!!errors.label?.message}
          >
            {labelOptions.map((opt) => (
              <SelectItem key={opt.key}>{opt.label}</SelectItem>
            ))}
          </Select>

          <CustomTextArea
            name="body"
            label="Mensagem"
            register={register}
            error_message={errors.body?.message}
          />

          <Button type="submit" color="primary" fullWidth>
            Enviar Mensagem
          </Button>
        </CardBody>
      </Card>
    </form>
  );
}
