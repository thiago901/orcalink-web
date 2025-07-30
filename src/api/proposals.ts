import api, { ResponseAPI } from "./axios";

export interface CreateProposalProps {
  name: string;
  description: string;
  company_id: string;
  customer: {
    name: string;
    phone: string;
    email: string;
    document: string;
  };

  items: {
    type: string;
    description: string;
    unit: string;
    price: number;
    quantity: number;
  }[];

  estimate_request_id: string;
  expire_at: Date;
  is_required_visit: boolean;
}
export type ProposalMessagesProps={
    company_id: string;
    company_name: string;
    content: string;
    estimate_request_id: string;
    id: string;
    proposal_id: string;
    read: boolean;
    sender: string;
    type: string;
    user_id: string;
    user_name: string;
    created_at: Date;
    updated_at: Date;
  }

export type Proposal = {
  id: string;
  amount: number;
  company_id: string;
  description: string;
  estimate_request_id: string;
  estimate_id: string;
  created_at: Date;
  updated_at: Date;
  reject_at: Date;
  approved_at: Date;
  messages: ProposalMessagesProps[];
  estimate_request: {
    id: string;
    footage: string;
    address: {
      latitude: number;
      longitude: number;
      city: string;
      neighborhood: string;
      number: string;
      postal_code: string;
      state: string;
      street: string;
    };
    description: string;
    email: string;
    name: string;
    phone: string;
    created_at: Date;
    updated_at: Date;
  };
  company: {
    about: string;
    avatar: string;
    id: string;
    name: string;
    ratting: number;
  };

  progress_estimate_requests: {
    title: string;
    estimate_request_id: string;
    description: string;
    type: string;
    created_at: string;
    proposal_id: string;
    proporties: string;
  }[];
  is_required_visit: boolean;
};

// Proposal API functions
export const getProposalById = async (id: string) => {
  const response = await api.get<ResponseAPI<Proposal>>(`/proposals/${id}`);
  return response.data.result;
};

export const getProposalsByCompanyId = async (companyId: string) => {
  const response = await api.get<ResponseAPI<Proposal[]>>(
    `/proposals/company/${companyId}`
  );

  return response.data.result;
};
export const getProposalsByUserId = async (companyId: string) => {
  const response = await api.get(`/proposals/${companyId}`);

  return response.data.result;
};

export const getProposalsByEstimateId = async (estimateId: string) => {
  const response = await api.get<ResponseAPI<Proposal[]>>(
    `/proposals/estimate/${estimateId}`
  );
  return response.data.result;
};

export const createProposal = async (data: CreateProposalProps) => {
  const response = await api.post("/proposals", data);
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
