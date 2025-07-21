import { useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Select,
  SelectItem,
} from "@heroui/react";
import { CardTitle } from "../../components/ui/Card";
import {
  FindCompanyLocationForm,
  FindCompanyLocationSchema,
  getCompaniesByLocation,
} from "../../api/companies";
import { searchByZipCode } from "../../utils/search-zip-address";

import { CustomInput } from "../../components/ui/Input";
import { getCategories } from "../../api/category";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { FiAlertTriangle } from "react-icons/fi";
import { Text } from "../../components/ui/Text";

export function FindCompanies() {
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });
  const navigate = useNavigate();
  const [tela, setTela] = useState<"form" | "semPrestador">("form");

  const {
    register,
    handleSubmit,
    formState: { errors,isSubmitting },
  } = useForm<FindCompanyLocationForm>({
    resolver: zodResolver(FindCompanyLocationSchema),
  });

  const onSubmit = async (data: FindCompanyLocationForm) => {
    
    const category = categories?.find((cat) => cat.id === data.category);
    if (!category) {
      console.error("Categoria não encontrada");
      return;
    }

    const findAddress = await searchByZipCode(data.postal_code);
    const existePrestador = await getCompaniesByLocation({
      address: {
        street: findAddress.logradouro,
        city: findAddress.localidade,
        country: findAddress.uf,
        state: findAddress.uf,
        postal_code: data.postal_code,
      },
      categories: [category.name],
    });
    const hasCompanies = existePrestador.length > 0;

    if (!hasCompanies) {
      setTela("semPrestador");
      return;
    }

    navigate(`/login`, {
      state: {
        from: {
          pathname: "/find-partners",
          search: `?category=${category.name}&postal_code=${data.postal_code}`,
        },
      },
    });
  };

  return (
    <div className="flex justify-center min-h-[100vh] md:min-h-0 md:mt-10">
      {tela === "form" ? (
        <Card className="max-w-md w-full p-6 ">
          <CardHeader>
            <CardTitle>Buscar Prestador</CardTitle>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <CustomInput
                  name="postal_code"
                  label="CEP"
                  register={register}
                  error_message={errors.postal_code?.message}
                />
              </div>

              <div>
                {categories && (
                  <Select
                    {...register("category")}
                    label="Categoria"
                    placeholder="Selecione uma categoria"
                  >
                    {categories!.map((cat) => (
                      <SelectItem key={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </Select>
                )}
              </div>

              <Button color="primary" type="submit" fullWidth isLoading={isSubmitting}>
                Buscar
              </Button>
            </form>
          </CardBody>
        </Card>
      ) : (
        <Card className="max-w-md w-full p-6 ">
          <CardBody>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <FiAlertTriangle size={50} />
                <Text type="normal" weight="semibold">
                  Ops! Ainda não temos prestadores na sua região.
                </Text>
              </div>

              <Text>
                Não encontramos prestadores no <strong>raio de 10km</strong>, mas não se preocupe! Estamos sempre buscando novos parceiros
                para atender você melhor.
              </Text>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
