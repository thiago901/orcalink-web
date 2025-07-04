import api, { ResponseAPI } from "./axios";

type CreateCustomer = {
  email: string;
  name?: string | null;
};
export interface Customer {
  id: string;
  email: string;

  name?: string | null;
}

export const createCustomer = async ({ email, name }: CreateCustomer) => {
  const response = await api.post<ResponseAPI<Customer>>("/payments/customer", {
    email,
    name,
  });
  return response.data.result;
};
export const cancelSubscription = async (email: string) => {
  const response = await api.delete<ResponseAPI<void>>(
    "/payments/cancel/subscription",
    { data: { email } }
  );
  return response.data.result;
};
