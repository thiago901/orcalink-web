import api, { ResponseAPI } from "./axios";

type Job = {
  id:string
  company_id:string
  proposal_id:string
  proposal:string
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
  updated_at:Date
  created_at:Date
};

export const getJobsByCompany = async (companyId: string) => {
  const response = await api.get<ResponseAPI<Job[]>>(`/jobs/company/${companyId}`);
  return response.data.result;
};

export const getJobById = async (id: string) => {
  const response = await api.get(`/jobs/${id}`);
  return response.data.result;
};
