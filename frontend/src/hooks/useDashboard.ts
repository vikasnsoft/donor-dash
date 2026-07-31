import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/axios";

// Types
export interface FinancialSummary {
  totalDonations: number;
  totalExpenses: number;
  cashBalance: number;
  bankBalance: number;
  activeEvents: number;
  totalDonors: number;
  lastDonationAt?: string;
  lastExpenseAt?: string;
}

export interface EventOverview {
  _id: string;
  event: string;
  name: string;
  type: string;
  status: string;
  startDate: string;
  endDate?: string;
  totalDonations: number;
  totalExpenses: number;
  balance: number;
  campaignCount: number;
  committeeSize: number;
  donorCount: number;
  budgetAllocated: number;
  budgetUtilisation: number;
  donationCompletion: number;
}

export interface DailyDonation {
  date: string;
  totalAmount: number;
  donationCount: number;
  cumulativeTotal: number;
  byMethod: Record<string, number>;
}

export interface VolunteerPerformance {
  _id: string;
  volunteer: { _id: string; name: string; avatar?: string };
  totalCollected: number;
  donationCount: number;
  uniqueDonors: number;
  routesCompleted: number;
}

export interface CampaignSummary {
  _id: string;
  campaign: string;
  name: string;
  target: number;
  collected: number;
  donationCount: number;
  completionPercentage: number;
  topVolunteer?: { userId: string; name: string; amount: number };
}

export interface DonorRetention {
  totalDonors: number;
  returningDonors: number;
  retentionRate: number;
  topDonors: Array<{
    donor: { _id: string; name: string; phone?: string };
    totalDonated: number;
    eventsAttended: number;
    isReturning: boolean;
  }>;
}

export interface OrganisationDashboard {
  activeEvents: number;
  totalDonors: number;
  recentDonations: DailyDonation[];
  topCampaigns: CampaignSummary[];
}

// API calls
const dashboardApi = {
  getOrganisationDashboard: async (orgId: string): Promise<OrganisationDashboard> => {
    const response = await apiClient.get(`/organisations/${orgId}/projections/dashboard`);
    return response.data.data;
  },

  getFinancialSummary: async (orgId: string): Promise<FinancialSummary> => {
    const response = await apiClient.get(`/organisations/${orgId}/projections/financial`);
    return response.data.data;
  },

  getEventOverviews: async (orgId: string): Promise<EventOverview[]> => {
    const response = await apiClient.get(`/organisations/${orgId}/projections/events`);
    return response.data.data;
  },

  getDailyDonations: async (eventId: string, from?: string, to?: string): Promise<DailyDonation[]> => {
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    const response = await apiClient.get(`/events/${eventId}/projections/daily-donations?${params}`);
    return response.data.data;
  },

  getVolunteerPerformance: async (eventId: string): Promise<VolunteerPerformance[]> => {
    const response = await apiClient.get(`/events/${eventId}/projections/volunteers`);
    return response.data.data;
  },

  getCampaignSummaries: async (eventId: string): Promise<CampaignSummary[]> => {
    const response = await apiClient.get(`/events/${eventId}/projections/campaigns`);
    return response.data.data;
  },

  getDonorRetention: async (orgId: string): Promise<DonorRetention> => {
    const response = await apiClient.get(`/organisations/${orgId}/projections/donor-retention`);
    return response.data.data;
  },
};

// Hooks
export function useOrganisationDashboard(orgId: string) {
  return useQuery({
    queryKey: ["dashboard", orgId],
    queryFn: () => dashboardApi.getOrganisationDashboard(orgId),
    enabled: !!orgId,
    refetchInterval: 60000, // Refetch every minute
  });
}

export function useFinancialSummary(orgId: string) {
  return useQuery({
    queryKey: ["financial-summary", orgId],
    queryFn: () => dashboardApi.getFinancialSummary(orgId),
    enabled: !!orgId,
  });
}

export function useEventOverviews(orgId: string) {
  return useQuery({
    queryKey: ["event-overviews", orgId],
    queryFn: () => dashboardApi.getEventOverviews(orgId),
    enabled: !!orgId,
  });
}

export function useDailyDonations(eventId: string, from?: string, to?: string) {
  return useQuery({
    queryKey: ["daily-donations", eventId, from, to],
    queryFn: () => dashboardApi.getDailyDonations(eventId, from, to),
    enabled: !!eventId,
  });
}

export function useVolunteerPerformance(eventId: string) {
  return useQuery({
    queryKey: ["volunteer-performance", eventId],
    queryFn: () => dashboardApi.getVolunteerPerformance(eventId),
    enabled: !!eventId,
  });
}

export function useCampaignSummaries(eventId: string) {
  return useQuery({
    queryKey: ["campaign-summaries", eventId],
    queryFn: () => dashboardApi.getCampaignSummaries(eventId),
    enabled: !!eventId,
  });
}

export function useDonorRetention(orgId: string) {
  return useQuery({
    queryKey: ["donor-retention", orgId],
    queryFn: () => dashboardApi.getDonorRetention(orgId),
    enabled: !!orgId,
  });
}

export function useEventSummary(eventId: string) {
  return useQuery({
    queryKey: ["event-summary", eventId],
    queryFn: async () => {
      const response = await apiClient.get(`/events/${eventId}/summary`);
      return response.data.data;
    },
    enabled: !!eventId,
  });
}
