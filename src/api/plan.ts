import api, { ResponseAPI } from "./axios";


type ResourcePlan={
  key:string;
  active:boolean,
  label:string,
  limit?: number;
}
export interface Plan {
  "id": string,
  "actived": boolean,
  "price_month": number,
  "price_year": number,
  "description": string,
  "name": string,
  "price_id_month": string,
  "price_id_year": string,
  "resources": ResourcePlan[],
  "updated_at":Date
  "created_at": Date,
}

export const listAllPlans = async () => {
  const response = await api.get<ResponseAPI<Plan[]>>("/plans");
  return response.data.result;
};

export const getById = async (plan_id: string) => {
  const response = await api.get<ResponseAPI<Plan>>(`/plans/${plan_id}`);
  return response.data.result;
};
