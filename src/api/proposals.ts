import api from './axios';

export interface CreateProposalProps {
  amount: number;
  company_id: string;
  description: string;
  estimate_request_id: string;
}

// Proposal API functions
export const getProposalById = async (id: string) => {
  const response = await api.get(`/proposals/${id}`);
  return response.data.result;
};

export const getProposalsByCompanyId = async (companyId: string) => {
  const response = await api.get(`/proposals/company/${companyId}`);
  return response.data.result;
};

export const getProposalsByEstimateId = async (estimateId: string) => {
  const response = await api.get(`/proposals/estimate/${estimateId}`);
  return response.data.result;
};

export const createProposal = async (data: CreateProposalProps) => {
  const response = await api.post('/proposals', data);
  return response.data.result;
};

export const approveProposal = async (id: string) => {
  const response = await api.patch(`/proposals/${id}/approve`);
  return response.data.result;
};

export const rejectProposal = async (id: string) => {
  const response = await api.patch(`/proposals/${id}/reject`);
  return response.data.result;
};