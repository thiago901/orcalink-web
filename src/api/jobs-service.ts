import api, { ResponseAPI } from "./axios";

type Job = {
  id:string
  company_id:string
  proposal_id:string
  proposal:string
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
};

export const getJobsByCompany = async (companyId: string) => {
  const response = await api.get<ResponseAPI<Job[]>>(`/jobs/company/${companyId}`);
  return response.data.result;
};

export const getJobById = async (id: string) => {
  const response = await api.get<ResponseAPI<Job>>(`/jobs/${id}`);
  return response.data.result;
};
export const updateJobStatus = async (id: string,status:string) => {
  const response = await api.patch<ResponseAPI<Job>>(`/jobs/status/${id}/${status}`);
  return response.data.result;
};
