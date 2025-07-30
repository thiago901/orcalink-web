import api, { ResponseAPI } from './axios';


export type ProgressEstimateRequestType =
  | 'CREATED'
  | 'PROPOSALS_WAITING'
  | 'PROPOSALS_RECEIVED'
  | 'PROPOSALS_ACCEPTED'
  | 'VISIT_REQUESTED'
  | 'VISIT_CONFIRMED'
  | 'VISIT_SUGGESTED'
  | 'VISIT_WAITING'
  | 'VISIT_COMPLETED'
  | 'PAYMENT_REQUESTED'
  | 'PAYMENT_COMPLETED'
  | 'WAITING'
  | 'IS_JOB_FINISHED'
  | 'FINISHED';

export type ProgressEstimateRequest={
  id: string
    estimate_request_id: string;
  title: string;
  description: string;
  proposal_id?: string;
  type: ProgressEstimateRequestType;
  created_at: Date;
};

export const getAllProgressEstimateRequestsByEstimateRequest = async (estimate_request_id: string) => {
  const response = await api.get<ResponseAPI<ProgressEstimateRequest[]>>(`/progress-estimate-requests/estimate_request/${estimate_request_id}`);
  return response.data.result;
};
