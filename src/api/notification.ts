import api, { ResponseAPI } from "./axios";

export type NotificationProps = {
  title: string;
  type: string;
  message: string;
};
export type Notification = {
  id: string;
  message: string;
  read: string;
  title: string;
  type: string;
  recipient_id: string;
  created_at: Date;
  updated_at: Date;
};

export const getByUserId = async (id: string) => {
  const response = await api.get<ResponseAPI<Notification[]>>(
    `/notifications/user/${id}`
  );
  return response.data.result;
};
export const readNotification = async (id: string) => {
  const response = await api.put<ResponseAPI<Notification>>(
    `/notifications/${id}`
  );
  return response.data.result;
};
export const create = async (data: NotificationProps) => {
  const response = await api.get<ResponseAPI<Notification>>(`/notifications`, {
    data,
  });
  return response.data.result;
};
