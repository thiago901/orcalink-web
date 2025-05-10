import api from './axios';

export interface CreateCompanyServiceProps {
  name: string;
  category_id: string;
  company_id: string;
}

// Company Services API functions
export const getCompanyServices = async (companyId: string) => {
  const response = await api.get(`/companies-services/${companyId}`);
  return response.data;
};

export const createCompanyService = async (data: CreateCompanyServiceProps) => {
  const response = await api.post('/companies-services', data);
  return response.data;
};

export const getCompanyCategories = async () => {
  const response = await api.get('/companies-categories');
  return response.data;
};