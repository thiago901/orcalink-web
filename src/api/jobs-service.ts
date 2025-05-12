import api from './axios';



export const getJobsByCompany= async (companyId: string) => {
  const response = await api.get(`/jobs/company/${companyId}`);
  return response.data.result;
};



export const getJobById = async (id:string) => {
  const response = await api.get(`/jobs/${id}`);
  return response.data.result;
};