import api from './axios';

export interface CreateCompanyServiceProps {
  name:string;
  owner_id:string;
  avatar:string;
  about:string;
  address: {
    name:string
    city:string
    country:string
    state:string
    zip:string
    address:string
    latitude:number
    longitude:number
  }
}

// Company Services API functions
export const getCompanyServices = async (companyId: string) => {
  const response = await api.get(`/companies-services/${companyId}`);
  return response.data.result;
};

export const createCompanyService = async (data: CreateCompanyServiceProps) => {
  const response = await api.post('/companies-services', data);
  return response.data.result;
};

export const getCompanyCategories = async () => {
  const response = await api.get('/companies-categories');
  return response.data.result;
};