import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/axios';

export interface EventBudgetItem {
  category: string;
  allocated: number;
  spent: number;
  notes?: string;
}

export interface CommitteeMember {
  _id: string;
  user: { _id: string; name: string; email: string; avatar?: string };
  role: string;
  assignedAt: string;
  isActive: boolean;
}

export interface OrgEvent {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  type: string;
  organisation: string;
  status: string;
  startDate: string;
  endDate?: string;
  location?: {
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  financialYear: string;
  budget?: {
    totalAllocated: number;
    items: EventBudgetItem[];
  };
  financialStatus: string;
  totalDonations: number;
  totalExpenses: number;
  totalCollections: number;
  committee: CommitteeMember[];
  settings?: {
    visibility?: string;
    receiptPrefix?: string;
    requireExpenseApproval?: boolean;
    largeExpenseThreshold?: number;
  };
  bannerImage?: string;
  tags?: string[];
  createdBy: { _id: string; name: string };
  createdAt: string;
}

export interface CreateEventData {
  name: string;
  description?: string;
  type?: string;
  startDate: string;
  endDate?: string;
  location?: { city?: string; state?: string; pincode?: string };
  settings?: { visibility?: string };
  tags?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

const eventApi = {
  getAll: async (orgId: string, page = 1, limit = 20, status?: string): Promise<PaginatedResponse<OrgEvent>> => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) params.set('status', status);
    const response = await apiClient.get(`/organisations/${orgId}/events?${params}`);
    return response.data;
  },

  getById: async (id: string): Promise<OrgEvent> => {
    const response = await apiClient.get(`/events/${id}`);
    return response.data.data;
  },

  create: async (orgId: string, data: CreateEventData): Promise<OrgEvent> => {
    const response = await apiClient.post(`/organisations/${orgId}/events`, data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<CreateEventData>): Promise<OrgEvent> => {
    const response = await apiClient.put(`/events/${id}`, data);
    return response.data.data;
  },

  changeStatus: async (id: string, status: string): Promise<OrgEvent> => {
    const response = await apiClient.post(`/events/${id}/status`, { status });
    return response.data.data;
  },

  archive: async (id: string): Promise<void> => {
    await apiClient.post(`/events/${id}/archive`);
  },

  addCommitteeMember: async (id: string, userId: string, role: string): Promise<OrgEvent> => {
    const response = await apiClient.post(`/events/${id}/committee`, { userId, role });
    return response.data.data;
  },

  removeCommitteeMember: async (id: string, userId: string): Promise<OrgEvent> => {
    const response = await apiClient.delete(`/events/${id}/committee/${userId}`);
    return response.data.data;
  },

  getSummary: async (id: string) => {
    const response = await apiClient.get(`/events/${id}/summary`);
    return response.data.data;
  },
};

export function useEvents(orgId: string, page = 1, limit = 20, status?: string) {
  return useQuery({
    queryKey: ['events', orgId, page, limit, status],
    queryFn: () => eventApi.getAll(orgId, page, limit, status),
    enabled: !!orgId,
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ['events', id],
    queryFn: () => eventApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateEvent(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateEventData) => eventApi.create(orgId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', orgId] });
    },
  });
}

export function useUpdateEvent(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateEventData> }) =>
      eventApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['events', orgId] });
      queryClient.invalidateQueries({ queryKey: ['events', variables.id] });
    },
  });
}

export function useChangeEventStatus(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      eventApi.changeStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', orgId] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

export function useEventSummary(id: string) {
  return useQuery({
    queryKey: ['events', id, 'summary'],
    queryFn: () => eventApi.getSummary(id),
    enabled: !!id,
  });
}
