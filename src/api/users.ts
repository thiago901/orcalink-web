import api, { ResponseAPI } from "./axios";
import { CreateUserProps } from "./auth";

export interface UpdateUserProps {
  name?: string;
  email?: string;
  password?: string;
  avatar?: string;
}

export type User = {
  id: string;
  email: string;
  name: string;
  phone: string;
  avatar: string;
  created_at: Date;
  updated_at: Date;
  plan_id: string;
  role: 'company' | 'customer';
};

// User API functions
export const getUsers = async () => {
  const response = await api.get("/users");
  return response.data.result;
};

export const getUserById = async (id: string) => {
  const response = await api.get<ResponseAPI<User>>(`/users/${id}`);
  return response.data.result;
};
export const getProfile = async () => {
  const response = await api.get<ResponseAPI<User>>(`/users/profile/me`);
  return response.data.result;
};

export const createUser = async (data: CreateUserProps) => {
  const response = await api.post("/users", data);
  return response.data.result;
};

export const updateUser = async (id: string, data: UpdateUserProps) => {
  const response = await api.put<ResponseAPI<User>>(`/users/${id}`, data);
  return response.data.result;
};

export const deleteUser = async (id: string) => {
  const response = await api.delete(`/users/${id}`);
  return response.data.result;
};

export const uploadUserImage = async (user_id: string, files: FormData) => {
  const response = await api.patch(`/users/${user_id}/file`, files, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.result;
};
