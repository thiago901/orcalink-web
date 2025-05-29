import api from './axios';

export interface CreateCompanyServiceProps {
  name:string;
  category_id:string;
  company_id:string;
}
export interface CompanyService {
  id: string;
  name: string;
  category_id: string;
  company_id: string;
  category_name: string;
}
export interface Response<T=unknown> {
  result:T
}


export const getCompanyServices = async (companyId: string) => {
  const response = await api.get<Response<CompanyService[]>>(`/companies-services/${companyId}`);
  return response.data.result;
};

export const createCompanyService = async (data: CreateCompanyServiceProps) => {
  const response = await api.post('/companies-services', data);
  return response.data.result;
};
