import api, { ResponseAPI } from "./axios";


export interface Subscription {
  id: string;
  plan_id: string;
  plan_type: string;
  price: number;
  status: string;
  user_id: string;
  end_date: Date;
  start_date: Date;
  created_at: Date;
}



export const getSubscriptionByUserId = async () => {
  const response = await api.get<ResponseAPI<Subscription>>(`/subscriptions/user`);
  return response.data.result;
};
