import api from './axios';

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
  lat: string;
  long: string;
}

export interface GeolocationQuery {
  latitude: number;
  longitude: number;
  radiusInMeters: number;
}

// Estimate Request API functions
export const getEstimateRequests = async (params: GeolocationQuery) => {
  const response = await api.get('/estimate-requests', { params });
  return response.data.result;
};

export const getEstimateRequestById = async (id: string) => {
  const response = await api.get(`/estimate-requests/${id}`);
  return response.data.result;
};

export const getEstimateRequestsByUserId = async (userId: string) => {
  const response = await api.get(`/estimate-requests/user/${userId}`);
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