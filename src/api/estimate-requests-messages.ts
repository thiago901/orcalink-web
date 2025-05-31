import api, { ResponseAPI } from "./axios";

export interface CreateEstimateRequestMessageProps {
  company_id: string;
  content: string;
  estimate_request_id: string;
  sender: string;
  type: string;
}
export interface EstimateRequestMessage {
  id: string;
  company_id: string;
  company_name: string;
  content: string;
  estimate_request_id: string;
  sender: string;
  type: string;
  user_name: string;
  created_at: Date;
  updated_at: Date;
}

export const getEstimateRequestMessages = async (
  estimate_request_id: string
) => {
  const response = await api.get<ResponseAPI<EstimateRequestMessage[]>>(
    `/estimate-requests-message/${estimate_request_id}`
  );
  return response.data.result;
};
export const getEstimateRequestMessagesByCompany = async (
  estimate_request_id: string,
  company_id: string
) => {
  console.log('estimate_request_id',estimate_request_id,company_id);
  
  const response = await api.get<ResponseAPI<EstimateRequestMessage[]>>(
    `/estimate-requests-message/${estimate_request_id}/company/${company_id}`
  );
  return response.data.result;
};

export const createEstimateRequestMessage = async (
  data: CreateEstimateRequestMessageProps
) => {
  const response = await api.post(`/estimate-requests-message`, data);
  return response.data.result;
};
