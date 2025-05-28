import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../../stores/authStore";

import { CreateCompanyServiceProps } from "../../api/companyServices";
import { createCompany } from "../../api/companies";
import { CompanyCreateForm } from "../../components/forms/company-create";

const CreateCompanyPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [geolocationError, setGeolocationError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCompanyServiceProps>({
    defaultValues: {},
  });

  // Get user's current position
  const getCurrentPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition(pos);
          setGeolocationError(null);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setGeolocationError("Não foi possível obter sua localização.");
        }
      );
    } else {
      setGeolocationError("Geolocalização não é suportada pelo seu navegador.");
    }
  };

  const onSubmit = async (data: CreateCompanyServiceProps) => {
    if (!position) {
      toast.error("É necessário permitir o acesso à sua localização");
      return;
    }

    setIsLoading(true);
    try {
      console.log("address", data);

      const requestData = {
        ...data,
        address: {
          ...data.address,
          name: data.name,
          country: "Brasil",
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        owner_id: user?.id as string,
      };

      const response = await createCompany(requestData);

      toast.success("Empresa criada com sucesso!");
      navigate(`/dashboard/companies/${response.id}`);
    } catch (error) {
      toast.error("Erro ao criar empresa");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 fade-in">
     <CompanyCreateForm/>
    </div>
  );
};

export default CreateCompanyPage;
