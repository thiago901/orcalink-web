import api from './axios';

// Types based on the Swagger schema
export interface AuthenticateUserProps {
  email: string;
  password: string;
}

export interface RecoverPasswordProps {
  email: string;
}

export interface CreateUserProps {
  name: string;
  email: string;
  password: string;
  phone: string;
  avatar?: string;
}





// Auth API functions
export const loginUser = async (data: AuthenticateUserProps) => {
  const response = await api.post('/sessions', data);
  return response.data.result;
};

export const registerUser = async (data: CreateUserProps) => {
  const response = await api.post('/users', data);
  return response.data.result;
};

export const forgotPassword = async (data: RecoverPasswordProps) => {
  const response = await api.post('/forgot-password', data);
  return response.data.result;
};