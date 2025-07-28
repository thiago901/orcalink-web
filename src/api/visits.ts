// src/api/visits.ts
import api, { ResponseAPI } from './axios';

// Types
export interface CreateVisitProps {
  customer_id: string;
  company_id: string;
  estimate_request_id: string;
  proposal_id: string;
  scheduled_at: Date;
  notes?: string;
}
export type VisitStatus = 
    | 'PENDING'
    | 'CONFIRMED'
    | 'SUGGESTED'
    | 'RESCHEDULED'
    | 'CANCELED'
    | 'COMPLETED';
export interface UpdateVisitProps {
  id: string;
  status?: VisitStatus;
  suggested_at?: Date;
  scheduled_at?: Date;
}

export interface Visit {
  id: string;
  customer_id: string;
  company_id: string;
  scheduled_at: string;
  status: VisitStatus;
  suggested_at?: string;
  created_at: string;
  notes?: string;
}

// API functions
export const createVisit = async (data: CreateVisitProps) => {
  const response = await api.post('/scheduled-visits', data);
  return response.data.result as Visit;
};

export const getVisitById = async (id: string) => {
  const response = await api.get(`/scheduled-visits/${id}`);
  return response.data.result as Visit;
};

export const updateVisit = async (data: UpdateVisitProps) => {
  const response = await api.patch(`/scheduled-visits/${data.id}`, data);
  return response.data.result as Visit;
};

export const deleteVisit = async (id: string) => {
  const response = await api.delete(`/scheduled-visits/${id}`);
  return response.data.result;
};

export const listPendingVisitsByCompany = async (companyId: string) => {
  const response = await api.get(`/scheduled-visits/company/${companyId}/pending`);
  return response.data.result as Visit[];
};

export const listSuggestedVisitsByCustomer = async (customerId: string) => {
  const response = await api.get(`/scheduled-visits/customer/${customerId}/suggested`);
  return response.data.result as Visit[];
};

export const getAllVisitByCompany = async (company_id: string) => {
  const response = await api.get<ResponseAPI<Visit[]>>(`/scheduled-visits/company/${company_id}`);
  return response.data.result;
};
export const confirmVisitById = async (id: string) => {
  const response = await api.patch<ResponseAPI<Visit[]>>(`/scheduled-visits/${id}/confirm`);
  return response.data.result;
};
export const suggestVisitById = async (id: string,date:Date) => {
  const timestamp = date.toISOString();
  const response = await api.patch<ResponseAPI<Visit[]>>(`/scheduled-visits/${id}/suggest-new-date/${timestamp}`);
  return response.data.result;
};
export const suggestVisitByIdCustomer = async (id: string,date:Date) => {
  const timestamp = date.toISOString();
  const response = await api.patch<ResponseAPI<Visit[]>>(`/scheduled-visits/${id}/suggest-new-date/${timestamp}/customer`);
  return response.data.result;
};
export const visitFinished= async (id: string) => {
  
  const response = await api.post<ResponseAPI<Visit[]>>(`/scheduled-visits/${id}/complete`);
  return response.data.result;
};
