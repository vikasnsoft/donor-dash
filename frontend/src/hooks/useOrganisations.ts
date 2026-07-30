import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/axios';

export interface OrganisationSettings {
  financial: {
    defaultCurrency: string;
    financialYearStart: string;
    gstNumber?: string;
  };
  receipt: {
    prefix: string;
    footer: string;
    showLogo: boolean;
    showSignature: boolean;
  };
  notifications: {
    emailOnDonation: boolean;
    emailOnExpense: boolean;
    emailOnSettlement: boolean;
    dailyDigest: boolean;
  };
  branding: {
    primaryColor: string;
    secondaryColor: string;
    logoUrl?: string;
    letterheadUrl?: string;
    signatureUrl?: string;
  };
  localisation: {
    timezone: string;
    language: string;
    dateFormat: string;
  };
  permissions: {
    allowVolunteerCreateExpense: boolean;
    requireExpenseApproval: boolean;
    requireSettlementConfirmation: boolean;
    largeExpenseThreshold: number;
  };
}

export interface Organisation {
  _id: string;
  name: string;
  slug: string;
  type: 'mandal' | 'ngo' | 'trust' | 'committee' | 'other';
  status: 'draft' | 'active' | 'archived' | 'suspended';
  description?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  registrationNumber?: string;
  website?: string;
  phone?: string;
  email?: string;
  financial: OrganisationSettings['financial'];
  receipt: OrganisationSettings['receipt'];
  notifications: OrganisationSettings['notifications'];
  branding: OrganisationSettings['branding'];
  localisation: OrganisationSettings['localisation'];
  permissions: OrganisationSettings['permissions'];
  members: Array<{
    user: { _id: string; name: string; email: string; avatar?: string };
    role: 'owner' | 'admin' | 'member';
    joinedAt: string;
  }>;
  invites: Array<{
    email: string;
    role: string;
    status: 'pending' | 'accepted' | 'expired';
    createdAt: string;
  }>;
  createdBy: { _id: string; name: string };
  isActive: boolean;
  archivedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrganisationData {
  name: string;
  type?: string;
  description?: string;
  address?: { city?: string; state?: string; pincode?: string };
  registrationNumber?: string;
  website?: string;
  phone?: string;
  email?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const orgApi = {
  getAll: async (page = 1, limit = 20): Promise<PaginatedResponse<Organisation>> => {
    const response = await apiClient.get(`/organisations?page=${page}&limit=${limit}`);
    return response.data;
  },

  getById: async (id: string): Promise<Organisation> => {
    const response = await apiClient.get(`/organisations/${id}`);
    return response.data;
  },

  getBySlug: async (slug: string): Promise<Organisation> => {
    const response = await apiClient.get(`/organisations/slug/${slug}`);
    return response.data;
  },

  create: async (data: CreateOrganisationData): Promise<Organisation> => {
    const response = await apiClient.post('/organisations', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Organisation>): Promise<Organisation> => {
    const response = await apiClient.put(`/organisations/${id}`, data);
    return response.data;
  },

  archive: async (id: string): Promise<void> => {
    await apiClient.post(`/organisations/${id}/archive`);
  },

  addMember: async (id: string, userId: string, role: string): Promise<Organisation> => {
    const response = await apiClient.post(`/organisations/${id}/members`, { userId, role });
    return response.data;
  },

  removeMember: async (id: string, userId: string): Promise<Organisation> => {
    const response = await apiClient.delete(`/organisations/${id}/members/${userId}`);
    return response.data;
  },

  sendInvite: async (id: string, email: string, role: string): Promise<void> => {
    await apiClient.post(`/organisations/${id}/invites`, { email, role });
  },

  acceptInvite: async (id: string, token: string): Promise<void> => {
    await apiClient.post(`/organisations/${id}/invites/${token}/accept`);
  },
};

export function useOrganisations(page = 1, limit = 20) {
  return useQuery({
    queryKey: ['organisations', page, limit],
    queryFn: () => orgApi.getAll(page, limit),
  });
}

export function useOrganisation(id: string) {
  return useQuery({
    queryKey: ['organisations', id],
    queryFn: () => orgApi.getById(id),
    enabled: !!id,
  });
}

export function useOrganisationBySlug(slug: string) {
  return useQuery({
    queryKey: ['organisations', 'slug', slug],
    queryFn: () => orgApi.getBySlug(slug),
    enabled: !!slug,
  });
}

export function useCreateOrganisation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: orgApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organisations'] });
    },
  });
}

export function useUpdateOrganisation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Organisation> }) =>
      orgApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['organisations'] });
      queryClient.invalidateQueries({ queryKey: ['organisations', variables.id] });
    },
  });
}

export function useArchiveOrganisation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: orgApi.archive,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organisations'] });
    },
  });
}

export function useAddMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, userId, role }: { id: string; userId: string; role: string }) =>
      orgApi.addMember(id, userId, role),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['organisations', variables.id] });
    },
  });
}

export function useRemoveMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) =>
      orgApi.removeMember(id, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['organisations', variables.id] });
    },
  });
}

export function useSendInvite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, email, role }: { id: string; email: string; role: string }) =>
      orgApi.sendInvite(id, email, role),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['organisations', variables.id] });
    },
  });
}
