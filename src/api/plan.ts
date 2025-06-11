import api, { ResponseAPI } from "./axios";


type ResourcePlan={
  key:string;
  active:boolean,
  label:string
}
export interface Plan {
  id: string;
  actived: string;
  name: string;
  resources: ResourcePlan[];
  price_month:number;
  price_year:number;
  description:string;
  created_at: Date;
  updated_at: Date;
}

export const listAllPlans = async () => {
  const response = await api.get<ResponseAPI<Plan[]>>("/plans");
  return response.data.result;
};

export const getById = async (plan_id: string) => {
  const response = await api.get<ResponseAPI<Plan>>(`/plans/${plan_id}`);
  return response.data.result;
};
