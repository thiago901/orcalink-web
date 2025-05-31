import api from './axios';



export interface Category {
  id: string,
  created_at:Date,
  name:string,
  updated_at:Date,
}
export interface Response<T=unknown> {
  result:T
}

// Company API functions
export const getCategories = async () => {
  const response = await api.get<Response<Category[]>>('/companies-categories');
  console.log('responses',response.data);
  
  return response.data.result;
};


