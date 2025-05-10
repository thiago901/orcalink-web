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

// Company API functions
export const getCompanies = async () => {
  const response = await api.get('/companies');
  return response.data;
};

export const getCompanyById = async (id: string) => {
  const response = await api.get(`/companies/${id}`);
  return response.data;
};

export const getCompaniesByOwnerId = async (ownerId: string) => {
  console.log('respo',ownerId);
  const response = await api.get(`/companies/owner/${ownerId}`);
  
  return response.data.result;
};

export const createCompany = async (data: CreateCompanyProps) => {
  const response = await api.post('/companies', data);
  return response.data;
};