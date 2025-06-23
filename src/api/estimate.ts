import api, { ResponseAPI } from "./axios";

type AddressProp = {
  street: string;
  number: string;
  postal_code: string;
  neighborhood: string;
  state: string;
  city: string;
};

export interface EstimateItem {
  id:string
  type: string;
  name: string;
  description: string;
  unit: string;
  price: number;
  quantity: number;
  total: number;

  estimate_id: string;
  created_at: Date;
  updated_at: Date | null;
}

export interface EstimateCustomer {
  id: string;
  name: string;
  phone: string;
  email: string;
  document: string;
  avatar?: string | null;
  // address: AddressProp;
}
export type EstimateCompany ={
    id: string;
    name: string;
    phone: string;
    email: string;
    document: string;
    avatar?: string | null;
    address: AddressProp;
  }
export interface CreateEstimateProps {
  company: EstimateCompany;
  customer: EstimateCustomer;
  description: string;
  name:string;
  items: Omit<EstimateItem,'id'>[];
  expire_at: Date;
  created_at: Date;
  updated_at: Date | null;
}
export type Estimate = {
  id: string;
  company: EstimateCompany;
  customer: EstimateCustomer;
  company_id: string;
  description: string;
  items: EstimateItem[];
  total: number;
  expire_at: Date;
  created_at: Date;
  updated_at: Date;
};

export const createEstimate = async (data: CreateEstimateProps) => {
  const response = await api.post<ResponseAPI>("/estimates", data);
  return response.data.result;
};
export const getAllByEstimateRequestId = async (
  estimate_request_id: string
) => {
  const response = await api.get<ResponseAPI>(
    `/estimates/estimate_request/${estimate_request_id}`
  );
  return response.data.result;
};
export const getAllEstimateById = async (estimate_id: string) => {
  const response = await api.get<ResponseAPI<Estimate>>(`/estimates/${estimate_id}`);
  return response.data.result;
};
