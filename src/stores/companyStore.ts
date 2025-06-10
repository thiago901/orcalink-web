import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getCompaniesByOwnerId } from "../api/companies";

type Address= {
  name: string;
  city: string;
  country: string;
  state: string;
  zip: string;
  address: string;
  latitude: number;
  longitude: number;
}

 type Company = {
  id: string;
  name: string;
  owner_id: string;
  avatar?: string;
  about: string | null;
  address: Address;
  ratting: number;
  created_at:Date;
  phone: string | null;
  email: string | null;
  website: string | null;
  services: {
    id: string,
    name: string,
    category_id: string
    category_name: string
  }[]
}

interface CompanyState {
  current_company: Company;
  companies: Company[];
  isLoading: boolean;
  error: string | null;
  getCompanies: (user_id: string) => Promise<void>;
  setCompany: (company: Company) => void;
}

export const useCompanyStore = create<CompanyState>()(
  persist(
    (set, get) => ({
      current_company: {
        id: "",
        name: "",
        owner_id: "",
        avatar: undefined,
        about: null,
        address: {
          name: "",
          city: "",
          country: "",
          state: "",
          zip: "",
          address: "",
          latitude: 0,
          longitude: 0,
        },
        ratting: 0,
        created_at: new Date(),
        phone: null,
        email: null,
        website: null,
        services: [],
      },
      companies: [],
      isLoading: false,
      error: null,
      setCompany: (company) => set({ current_company: company }),
      getCompanies: async (user_id: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await getCompaniesByOwnerId(user_id);
          const companies = response;
          
          if (companies.length > 0) {
            set({ current_company: companies[0], isLoading: false,companies });
          } else {
            set({ isLoading: false, error: "No companies found" });
          }
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "Failed to fetch companies",
          });
        }
      },
    }),
    {
      name: "company-storage",
    }
  )
);
// try {
//   const response = await getCompaniesByOwnerId(user_id);

//   const companies = response;

  
// } catch (error) {
//   console.log("error", error);

//   set({
//     isLoading: false,
//     error: error instanceof Error ? error.message : "Failed to login",
//   });
// }