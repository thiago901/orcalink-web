import api, { ResponseAPI } from './axios';

export interface CreateEstimateRequestProps {
  name: string;
  description: string;
  footage: number;
  email: string;
  phone: string;
  user_id?: string;
  address_city: string;
  address_neighborhood: string;
  address_number: string;
  address_postal_code: string;
  address_state: string;
  address_street: string;
  category: string;
  lat: string;
  long: string;
}

export interface GeolocationQuery {
  latitude: number;
  longitude: number;
  radiusInMeters: number;
  category?:string[]
}
export type EstimateRequest={
  id: string
  description:string,
  email:string,
  footage:string,
  name:string,
  phone:string,
  user_id:string,
  user: {
    avatar:string;
    email:string;
    name:string;
    phone:string;
    id:string;
  },
  proposals:{
    id: string
    company_id: string
    estimate_request_id: string
    created_at: Date
    updated_at: Date
    amount: string
    approved_at: string
    reject_at: string
  }[]
  proposals_amount:number,
  estimate_request_files: {
    id:string
    estimate_request_id:string
    url:string
    created_at:Date
  }[]
  address:{
    city:string;
    state:string
    postal_code:string
    neighborhood:string;
    street:string;
    number:number
  },
  created_at:Date,
  updated_at:Date,
  finished_at:Date
};
export type ResponseEstimateRequests ={
  estimate_requests:EstimateRequest[]
  proposals_amout:number
  finished_amount:number
}

// Estimate Request API functions
export const getEstimateRequests = async (params: GeolocationQuery) => {
  
  
  const response = await api.get('/estimate-requests', { params });
  return response.data.result;
};

export const getEstimateRequestById = async (id: string) => {
  const response = await api.get<ResponseAPI<EstimateRequest>>(`/estimate-requests/${id}`);
  return response.data.result;
};

export const getEstimateRequestsByUserId = async (userId: string) => {
  const response = await api.get<ResponseAPI<ResponseEstimateRequests>>(`/estimate-requests/user/${userId}`);
  return response.data.result;
};

export const createEstimateRequest = async (data: CreateEstimateRequestProps) => {
  const response = await api.post('/estimate-requests', data);
  return response.data.result;
};

export const getEstimateRequestFiles = async (requestId: string) => {
  const response = await api.get(`/estimate-requests/${requestId}/files`);
  return response.data.result;
};

export const uploadEstimateRequestFiles = async (requestId: string, files: FormData) => {
  const response = await api.post(`/estimate-requests/${requestId}/files`, files, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.result;
};