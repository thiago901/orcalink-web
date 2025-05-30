import api from "./axios";

export interface Dashboard {
  totalProposals: number;
  acceptedProposals: number;
  rejectedProposals: number;
  pendingProposals: number;
  acceptanceRate: number;
  totalAcceptedAmount: number;
  nearbyEstimateRequestsCount: number;
  proposalsLastWeek: {
    day: Date;
    total: number;
  }[];
}
export interface Response<T = unknown> {
  result: T;
}


export const getDashboardStats = async (company_id:string) => {
  const response = await api.get<Response<Dashboard>>(`/dashboard/${company_id}`);
  return response.data.result;
};
