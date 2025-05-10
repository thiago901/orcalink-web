import api from './axios';
import { CreateUserProps } from './auth';

export interface UpdateUserProps {
  name?: string;
  email?: string;
  password?: string;
  avatar?: string;
}

// User API functions
export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const getUserById = async (id: string) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const createUser = async (data: CreateUserProps) => {
  const response = await api.post('/users', data);
  return response.data;
};

export const updateUser = async (id: string, data: UpdateUserProps) => {
  const response = await api.put(`/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};