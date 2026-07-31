import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/axios";

// Types
export interface IncomeStatement {
  period: { from: string; to: string };
  income: {
    items: Array<{ account: { name: string; code: string }; amount: number }>;
    total: number;
  };
  expenses: {
    items: Array<{ account: { name: string; code: string }; amount: number }>;
    total: number;
  };
  surplus: number;
}

export interface CashBookEntry {
  date: string;
  entryNumber: string;
  description: string;
  in: number;
  out: number;
  sourceType: string;
}

export interface CashBook {
  entries: CashBookEntry[];
  totalIn: number;
  totalOut: number;
  balance: number;
}

export interface TrialBalanceEntry {
  account: { _id: string; name: string; code: string; type: string };
  debits: number;
  credits: number;
  balance: number;
}

export interface TrialBalance {
  entries: TrialBalanceEntry[];
  totalDebits: number;
  totalCredits: number;
  balanced: boolean;
}

export interface DonationReport {
  byMethod: Array<{ _id: string; total: number; count: number }>;
  byStatus: Array<{ _id: string; total: number; count: number }>;
  daily: Array<{ _id: string; total: number; count: number }>;
}

export interface EventReport {
  event: { _id: string; name: string; status: string; startDate: string; endDate?: string };
  financial: { totalDonations: number; totalExpenses: number; balance: number };
  ledger: Array<{ _id: { accountType: string; accountName: string }; debits: number; credits: number }>;
  donations: Array<{ _id: string; total: number; count: number }>;
}

export interface VolunteerReportEntry {
  volunteerId: string;
  volunteerName: string;
  totalAmount: number;
  donationCount: number;
}

export interface LedgerEntry {
  _id: string;
  entryNumber: string;
  date: string;
  description: string;
  sourceType: string;
  status: string;
  totalAmount: number;
  lines: Array<{
    account: { _id: string; name: string; code: string; type: string };
    type: "debit" | "credit";
    amount: number;
    description: string;
  }>;
  createdBy?: { _id: string; name: string };
}

// API calls
const reportsApi = {
  getIncomeStatement: async (
    orgId: string,
    from?: string,
    to?: string
  ): Promise<IncomeStatement> => {
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    const response = await apiClient.get(
      `/organisations/${orgId}/reports/income-statement?${params}`
    );
    return response.data.data;
  },

  getCashBook: async (
    orgId: string,
    from?: string,
    to?: string
  ): Promise<CashBook> => {
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    const response = await apiClient.get(
      `/organisations/${orgId}/ledger/cash-book?${params}`
    );
    return response.data.data;
  },

  getTrialBalance: async (
    orgId: string,
    date?: string
  ): Promise<TrialBalance> => {
    const params = new URLSearchParams();
    if (date) params.set("date", date);
    const response = await apiClient.get(
      `/organisations/${orgId}/ledger/trial-balance?${params}`
    );
    return response.data.data;
  },

  getDonationReport: async (
    orgId: string,
    eventId?: string,
    from?: string,
    to?: string
  ): Promise<DonationReport> => {
    const params = new URLSearchParams();
    if (eventId) params.set("eventId", eventId);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    const response = await apiClient.get(
      `/organisations/${orgId}/reports/donations?${params}`
    );
    return response.data.data;
  },

  getEventReport: async (eventId: string): Promise<EventReport> => {
    const response = await apiClient.get(
      `/events/${eventId}/reports/summary`
    );
    return response.data.data;
  },

  getVolunteerReport: async (
    eventId: string
  ): Promise<VolunteerReportEntry[]> => {
    const response = await apiClient.get(
      `/events/${eventId}/reports/volunteers`
    );
    return response.data.data;
  },

  getLedgerEntries: async (
    orgId: string,
    page = 1,
    limit = 20,
    filters?: Record<string, string>
  ) => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (filters?.sourceType) params.set("sourceType", filters.sourceType);
    if (filters?.status) params.set("status", filters.status);
    if (filters?.from) params.set("from", filters.from);
    if (filters?.to) params.set("to", filters.to);
    const response = await apiClient.get(
      `/organisations/${orgId}/ledger/entries?${params}`
    );
    return response.data;
  },

  getLedgerEntry: async (id: string): Promise<LedgerEntry> => {
    const response = await apiClient.get(`/ledger/entries/${id}`);
    return response.data.data;
  },

  voidLedgerEntry: async (id: string, reason: string) => {
    const response = await apiClient.post(`/ledger/entries/${id}/void`, {
      reason,
    });
    return response.data.data;
  },

  exportCsv: async (orgId: string, type: "donors" | "donations" | "ledger") => {
    const response = await apiClient.get(
      `/organisations/${orgId}/data/export/${type}`,
      { responseType: "blob" }
    );
    return response.data;
  },
};

// Hooks
export function useIncomeStatement(orgId: string, from?: string, to?: string) {
  return useQuery({
    queryKey: ["reports", "income-statement", orgId, from, to],
    queryFn: () => reportsApi.getIncomeStatement(orgId, from, to),
    enabled: !!orgId,
  });
}

export function useCashBook(orgId: string, from?: string, to?: string) {
  return useQuery({
    queryKey: ["reports", "cash-book", orgId, from, to],
    queryFn: () => reportsApi.getCashBook(orgId, from, to),
    enabled: !!orgId,
  });
}

export function useTrialBalance(orgId: string, date?: string) {
  return useQuery({
    queryKey: ["reports", "trial-balance", orgId, date],
    queryFn: () => reportsApi.getTrialBalance(orgId, date),
    enabled: !!orgId,
  });
}

export function useDonationReport(
  orgId: string,
  eventId?: string,
  from?: string,
  to?: string
) {
  return useQuery({
    queryKey: ["reports", "donations", orgId, eventId, from, to],
    queryFn: () => reportsApi.getDonationReport(orgId, eventId, from, to),
    enabled: !!orgId,
  });
}

export function useEventReport(eventId: string) {
  return useQuery({
    queryKey: ["reports", "event", eventId],
    queryFn: () => reportsApi.getEventReport(eventId),
    enabled: !!eventId,
  });
}

export function useVolunteerReport(eventId: string) {
  return useQuery({
    queryKey: ["reports", "volunteers", eventId],
    queryFn: () => reportsApi.getVolunteerReport(eventId),
    enabled: !!eventId,
  });
}

export function useLedgerEntries(
  orgId: string,
  page = 1,
  limit = 20,
  filters?: Record<string, string>
) {
  return useQuery({
    queryKey: ["ledger", orgId, page, limit, filters],
    queryFn: () => reportsApi.getLedgerEntries(orgId, page, limit, filters),
    enabled: !!orgId,
  });
}

export function useLedgerEntry(id: string) {
  return useQuery({
    queryKey: ["ledger", id],
    queryFn: () => reportsApi.getLedgerEntry(id),
    enabled: !!id,
  });
}

export { reportsApi };
