import api from "./axios";
import z from "zod";

export const CreateReviewSchema = z.object({
  title: z.string().min(1, "Título obrigatório"),
  comment: z.string().min(10, "Texto muito curto"),
});

export type CreateReviewForm = z.infer<typeof CreateReviewSchema>;

export interface CreateReviewProps {
  title: string;
  comment: string;

  job_id: string;
  rating: number;
}

type FileData = {
  id: string;
  company_review_id: string;
  url: string;
};
export interface Review {
  id: string;
  title: string;
  comment: string;
  rating: number;
  user_id: string;
  company_id: string;
  files?: FileData[];
  created_at: string;
}
export interface Response<T = unknown> {
  result: T;
}

// Company API functions
export const createReview = async (data: CreateReviewProps) => {
  const response = await api.post<Response<Review>>("/reviews", data);

  return response.data.result;
};
export const listAllReviewByCompany = async (company_id: string) => {
  const response = await api.get<Response<Review[]>>(
    `/reviews/company/${company_id}`
  );

  return response.data.result;
};
