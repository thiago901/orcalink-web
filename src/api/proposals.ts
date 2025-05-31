import api, { ResponseAPI } from "./axios";

export interface CreateProposalProps {
  amount: number;
  company_id: string;
  description: string;
  estimate_request_id: string;
}

export type Proposal = {
  id: string;
  amount: string;
  company_id: string;
  description: string;
  estimate_request_id: string;
  created_at: Date;
  updated_at: Date;
  reject_at: Date;
  approved_at: Date;
  company: {
    about: string;
    avatar: string;
    id: string;
    name: string;
    ratting: number;
  };
};

// Proposal API functions
export const getProposalById = async (id: string) => {
  const response = await api.get<ResponseAPI<Proposal>>(`/proposals/${id}`);
  return response.data.result;
};

export const getProposalsByCompanyId = async (companyId: string) => {
  const response = await api.get(`/proposals/company/${companyId}`);

  return response.data.result;
};
export const getProposalsByUserId = async (companyId: string) => {
  const response = await api.get(`/proposals/${companyId}`);

  return response.data.result;
};

export const getProposalsByEstimateId = async (estimateId: string) => {
  const response = await api.get<ResponseAPI<Proposal[]>>(`/proposals/estimate/${estimateId}`);
  return response.data.result;
};

export const createProposal = async (data: CreateProposalProps) => {
  const response = await api.post("/proposals", {
    ...data,
    amount: Number(data.amount),
    name: "OLaskjdklashdjkashkjdhaskjhdk",
  });
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
