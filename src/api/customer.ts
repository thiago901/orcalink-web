import api, { ResponseAPI } from "./axios";



export type Customer = {
  id:string,
      created_at:string,
      document:string,
      email:string,
      name:string,
      phone:string,
      user_id:string,
};




// User API functions
export const findCustomerUserById = async (id:string) => {
  const response = await api.get<ResponseAPI<Customer>>(`/customers/user/${id}`);
  return response.data.result;
};

