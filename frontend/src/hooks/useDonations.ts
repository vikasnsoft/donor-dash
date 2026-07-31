import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/axios";

export interface Donation {
  _id: string;
  donor: { _id: string; name: string; phone?: string; type?: string };
  event: { _id: string; name: string; slug?: string };
  campaign?: { _id: string; name: string };
  organisation: string;
  amount: number;
  currency: string;
  method: "cash" | "upi" | "bank_transfer" | "cheque" | "online" | "qr";
  reference?: string;
  status: "received" | "pledged" | "cancelled" | "refunded";
  receiptNumber?: string;
  receiptUrl?: string;
  collectedBy?: { _id: string; name: string };
  notes?: string;
  date: string;
  ledgerEntry?: string;
  createdBy?: { _id: string; name: string };
  createdAt: string;
}

export interface RecordDonationData {
  donorId: string;
  eventId: string;
  campaignId?: string;
  amount: number;
  method: string;
  reference?: string;
  notes?: string;
  collectedBy?: string;
  date?: string;
}

export interface DonationStats {
  byMethod: Array<{ _id: string; total: number; count: number }>;
  byStatus: Array<{ _id: string; total: number; count: number }>;
  daily: Array<{ _id: string; total: number; count: number }>;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

const donationApi = {
  getByEvent: async (
    eventId: string,
    page = 1,
    limit = 20,
    filters?: Record<string, string>
  ): Promise<PaginatedResponse<Donation>> => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (filters?.status) params.set("status", filters.status);
    if (filters?.method) params.set("method", filters.method);
    if (filters?.from) params.set("from", filters.from);
    if (filters?.to) params.set("to", filters.to);
    const response = await apiClient.get(
      `/events/${eventId}/donations?${params}`
    );
    return response.data;
  },

  getByDonor: async (
    donorId: string,
    page = 1,
    limit = 20
  ): Promise<PaginatedResponse<Donation>> => {
    const response = await apiClient.get(
      `/donors/${donorId}/donations?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  getById: async (id: string): Promise<Donation> => {
    const response = await apiClient.get(`/donations/${id}`);
    return response.data.data;
  },

  record: async (data: RecordDonationData): Promise<Donation> => {
    const response = await apiClient.post(
      `/events/${data.eventId}/donations`,
      data
    );
    return response.data.data;
  },

  cancel: async (id: string, reason: string): Promise<Donation> => {
    const response = await apiClient.post(`/donations/${id}/cancel`, { reason });
    return response.data.data;
  },

  getStats: async (eventId: string): Promise<DonationStats> => {
    const response = await apiClient.get(`/events/${eventId}/donations/stats`);
    return response.data.data;
  },
};

export function useDonations(
  eventId: string,
  page = 1,
  limit = 20,
  filters?: Record<string, string>
) {
  return useQuery({
    queryKey: ["donations", eventId, page, limit, filters],
    queryFn: () => donationApi.getByEvent(eventId, page, limit, filters),
    enabled: !!eventId,
  });
}

export function useDonorDonations(donorId: string, page = 1, limit = 20) {
  return useQuery({
    queryKey: ["donations", "donor", donorId, page, limit],
    queryFn: () => donationApi.getByDonor(donorId, page, limit),
    enabled: !!donorId,
  });
}

export function useDonation(id: string) {
  return useQuery({
    queryKey: ["donations", id],
    queryFn: () => donationApi.getById(id),
    enabled: !!id,
  });
}

export function useRecordDonation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: donationApi.record,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["donations"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["financial-summary"] });
      queryClient.invalidateQueries({ queryKey: ["event-overviews"] });
      queryClient.invalidateQueries({ queryKey: ["daily-donations"] });
      queryClient.invalidateQueries({ queryKey: ["donors"] });
    },
  });
}

export function useCancelDonation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      donationApi.cancel(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donations"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["financial-summary"] });
    },
  });
}

export function useDonationStats(eventId: string) {
  return useQuery({
    queryKey: ["donations", "stats", eventId],
    queryFn: () => donationApi.getStats(eventId),
    enabled: !!eventId,
  });
}

export { donationApi };
