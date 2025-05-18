import api from './axios';

export interface Address {
  name: string;
  city: string;
  country: string;
  state: string;
  zip: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface CreateCompanyProps {
  name: string;
  owner_id: string;
  avatar?: string;
  about: string | null;
  address: Address;
}

export interface Company {
  id: string;
  name: string;
  owner_id: string;
  avatar?: string;
  about: string | null;
  address: Address;
  ratting: number;
  services: {
    id: string,
    name: string,
    category_id: string
  }[]
}
export interface Response<T=unknown> {
  result:T
}

// Company API functions
export const getCompanies = async () => {
  const response = await api.get<Response<Company[]>>('/companies');
  return response.data.result;
};

export const getCompanyById = async (id: string) => {
  const response = await api.get<Response<Company>>(`/companies/${id}`);
  return response.data.result;
};

export const getCompaniesByOwnerId = async (ownerId: string) => {
  
  const response = await api.get<Response<Company[]>>(`/companies/owner/${ownerId}`);
  
  return response.data.result;
};

export const createCompany = async (data: CreateCompanyProps) => {
  const response = await api.post('/companies', data);
  return response.data.result;
};
export const uploadCompanyImage = async (company_id: string, files: FormData) => {
  const response = await api.patch(`/companies/${company_id}/file`, files,{
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.result;
};

