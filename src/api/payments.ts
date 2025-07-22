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

export interface CreateCustomerSessionProps {
  proposal_id: string;
  
}
export interface CreateCustomerSessionResponse {
  session_url: string;
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

export const createCustomerSession = async ({
  proposal_id,
}: CreateCustomerSessionProps) => {
  const response = await api.post<ResponseAPI<CreateCustomerSessionResponse>>(
    "/payments/customer/session",
    {
      proposal_id,
    }
  );
  return response.data.result;
};
