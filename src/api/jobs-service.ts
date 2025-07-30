import api, { ResponseAPI } from "./axios";
import { Proposal } from "./proposals";

type Job = {
  id:string
  company_id:string
  proposal_id:string
  proposal:Proposal
  status:string
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
  estimate_request_id:string;
  estimate_id:string;
  updated_at:Date
  created_at:Date
  finished_company_at:Date|null
  finished_customer_at:Date|null
};

export type UpdateJobProps={
  
  finished_company_at?:Date
  finished_customer_at?:Date
}

export const getJobsByCompany = async (companyId: string) => {
  const response = await api.get<ResponseAPI<Job[]>>(`/jobs/company/${companyId}`);
  return response.data.result;
};

export const getJobById = async (id: string) => {
  const response = await api.get<ResponseAPI<Job>>(`/jobs/${id}`);
  return response.data.result;
};

export const updateJob = async (proposal_id:string,data: UpdateJobProps) => {
  const response = await api.put<ResponseAPI<Job>>(`/jobs/proposal/${proposal_id}`,data);
  return response.data.result;
};
export const updateJobCompany = async (proposal_id:string,data: UpdateJobProps) => {
  const response = await api.put<ResponseAPI<Job>>(`/jobs/proposal/${proposal_id}/company`,data);
  return response.data.result;
};
