import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/axios";

export interface Donor {
  _id: string;
  name: string;
  type: "individual" | "family" | "corporate";
  phone?: string;
  alternatePhone?: string;
  email?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  familyMembers?: Array<{
    _id: string;
    name: string;
    phone?: string;
    email?: string;
    relation?: string;
  }>;
  tags?: string[];
  preferredLanguage?: string;
  notes?: string;
  stats: {
    totalDonated: number;
    donationCount: number;
    lastDonationDate?: string;
    firstDonationDate?: string;
  };
  createdBy?: { _id: string; name: string };
  createdAt: string;
  updatedAt: string;
}

export interface CreateDonorData {
  name: string;
  type?: string;
  phone?: string;
  alternatePhone?: string;
  email?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  tags?: string[];
  preferredLanguage?: string;
  notes?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

const donorApi = {
  getAll: async (
    orgId: string,
    page = 1,
    limit = 20,
    filters?: Record<string, string>
  ): Promise<PaginatedResponse<Donor>> => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (filters?.type) params.set("type", filters.type);
    if (filters?.tag) params.set("tag", filters.tag);
    if (filters?.sort) params.set("sort", filters.sort);
    const response = await apiClient.get(
      `/organisations/${orgId}/donors?${params}`
    );
    return response.data;
  },

  search: async (orgId: string, query: string): Promise<PaginatedResponse<Donor>> => {
    const response = await apiClient.get(
      `/organisations/${orgId}/donors/search?q=${encodeURIComponent(query)}`
    );
    return response.data;
  },

  getById: async (id: string): Promise<Donor> => {
    const response = await apiClient.get(`/donors/${id}`);
    return response.data.data;
  },

  create: async (orgId: string, data: CreateDonorData): Promise<Donor> => {
    const response = await apiClient.post(`/organisations/${orgId}/donors`, data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<CreateDonorData>): Promise<Donor> => {
    const response = await apiClient.put(`/donors/${id}`, data);
    return response.data.data;
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/donors/${id}`);
  },

  getTopDonors: async (orgId: string, limit = 10): Promise<Donor[]> => {
    const response = await apiClient.get(
      `/organisations/${orgId}/donors/top?limit=${limit}`
    );
    return response.data.data;
  },
};

export function useDonors(
  orgId: string,
  page = 1,
  limit = 20,
  filters?: Record<string, string>
) {
  return useQuery({
    queryKey: ["donors", orgId, page, limit, filters],
    queryFn: () => donorApi.getAll(orgId, page, limit, filters),
    enabled: !!orgId,
  });
}

export function useDonorSearch(orgId: string, query: string) {
  return useQuery({
    queryKey: ["donors", "search", orgId, query],
    queryFn: () => donorApi.search(orgId, query),
    enabled: !!orgId && query.length >= 2,
  });
}

export function useDonor(id: string) {
  return useQuery({
    queryKey: ["donors", id],
    queryFn: () => donorApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateDonor(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDonorData) => donorApi.create(orgId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donors", orgId] });
    },
  });
}

export function useUpdateDonor(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateDonorData> }) =>
      donorApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["donors"] });
      queryClient.invalidateQueries({ queryKey: ["donors", variables.id] });
    },
  });
}

export function useDeleteDonor(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => donorApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donors", orgId] });
    },
  });
}

export function useTopDonors(orgId: string, limit = 10) {
  return useQuery({
    queryKey: ["donors", "top", orgId, limit],
    queryFn: () => donorApi.getTopDonors(orgId, limit),
    enabled: !!orgId,
  });
}

export { donorApi };
