export type UserType = "client" | "provider";

export interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
  createdAt: Date;
  updatedAt: Date;
}

export interface Client extends User {
  type: "client";
  phone?: string;
  address?: string;
}

export interface Provider extends User {
  type: "provider";
  companies: Company[];
}

export interface Company {
  id: string;
  name: string;
  providerId: string;
  cnpj?: string;
  cpf?: string;
  categories: ServiceCategory[];
  serviceRadius: number; // km
  photos: string[];
  description?: string;
  address: string;
  latitude: number;
  longitude: number;
  status: "active" | "paused" | "inactive";
  rating: number;
  reviewCount: number;
  completedJobs: number;
  createdAt: Date;
  updatedAt: Date;
}

export type ServiceCategory =
  | "painting"
  | "carpentry"
  | "plumbing"
  | "electrical"
  | "cleaning"
  | "landscaping"
  | "renovation"
  | "moving"
  | "handyman"
  | "other";

export type QuoteStatus =
  | "waiting" // aguardando propostas
  | "with_proposals" // com propostas
  | "approved" // aprovado
  | "completed" // concluído
  | "cancelled"; // cancelado

export interface Quote {
  id: string;
  clientId: string;
  client?: Client;
  category: ServiceCategory;
  title: string;
  description: string;
  photos: string[];
  zipCode: string;
  address: string;
  latitude: number;
  longitude: number;
  preferences?: string;
  budget?: {
    min: number;
    max: number;
  };
  status: QuoteStatus;
  proposals: Proposal[];
  selectedProposalId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ProposalStatus =
  | "sent" // enviada
  | "accepted" // aceita
  | "rejected" // rejeitada
  | "in_progress" // em andamento
  | "completed" // concluída
  | "cancelled"; // cancelada

export interface Proposal {
  id: string;
  quoteId: string;
  quote?: Quote;
  companyId: string;
  company?: Company;
  price: number;
  description: string;
  estimatedDuration: string;
  includesMaterials: boolean;
  warranty?: string;
  technicalVisitRequired: boolean;
  status: ProposalStatus;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  proposalId: string;
  senderId: string;
  senderType: UserType;
  content: string;
  attachments?: string[];
  createdAt: Date;
}

export interface TechnicalVisit {
  id: string;
  proposalId: string;
  scheduledDate: Date;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  proposalId: string;
  clientId: string;
  companyId: string;
  rating: number; // 1-5
  comment?: string;
  createdAt: Date;
}

export interface CompanyStats {
  totalProposals: number;
  acceptedProposals: number;
  completedJobs: number;
  averageRating: number;
  totalReviews: number;
  revenue: number;
}

export interface PartnerFilters {
  name?: string;
  category?: ServiceCategory;
  city?: string;
  minRating?: number;
  minReviews?: number;
}
