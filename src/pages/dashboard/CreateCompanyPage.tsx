
import { useParams } from "react-router-dom";
import { CompanyCreateForm } from "../../components/forms/company-create";
import { useQuery } from "@tanstack/react-query";
import { getCompanyById } from "../../api/companies";

const CreateCompanyPage = () => {
  const { id } = useParams<{ id?: string }>();
  
  const { data: company } = useQuery({
    queryKey: ["company", id],
    queryFn: () => getCompanyById(id!),
    enabled: !!id,
  });
  
  return (
    <div className="space-y-6 fade-in">
     <CompanyCreateForm company={company}/>
    </div>
  );
};

export default CreateCompanyPage;
