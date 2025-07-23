// src/api/visits.ts
import api from './axios';

// Types
export interface CreateVisitProps {
  customer_id: string;
  company_id: string;
  scheduled_at: Date;
  notes?: string;
}

export interface UpdateVisitProps {
  id: string;
  status?: 'CONFIRMED' | 'SUGGESTED' | 'RESCHEDULED' | 'CANCELED' | 'COMPLETED';
  suggested_at?: Date;
  scheduled_at?: Date;
}

export interface VisitResponse {
  id: string;
  customer_id: string;
  company_id: string;
  scheduled_at: string;
  status: string;
  suggested_at?: string;
  notes?: string;
}

// API functions
export const createVisit = async (data: CreateVisitProps) => {
  const response = await api.post('/scheduled-visits', data);
  return response.data.result as VisitResponse;
};

export const getVisitById = async (id: string) => {
  const response = await api.get(`/scheduled-visits/${id}`);
  return response.data.result as VisitResponse;
};

export const updateVisit = async (data: UpdateVisitProps) => {
  const response = await api.patch(`/scheduled-visits/${data.id}`, data);
  return response.data.result as VisitResponse;
};

export const deleteVisit = async (id: string) => {
  const response = await api.delete(`/scheduled-visits/${id}`);
  return response.data.result;
};

export const listPendingVisitsByCompany = async (companyId: string) => {
  const response = await api.get(`/scheduled-visits/company/${companyId}/pending`);
  return response.data.result as VisitResponse[];
};

export const listSuggestedVisitsByCustomer = async (customerId: string) => {
  const response = await api.get(`/scheduled-visits/customer/${customerId}/suggested`);
  return response.data.result as VisitResponse[];
};
