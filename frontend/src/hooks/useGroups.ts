import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/axios";

export interface GroupMember {
  user: { _id: string; name: string; email?: string; avatar?: string };
  role: "admin" | "member";
  joinedAt: string;
}

export interface Group {
  _id: string;
  name: string;
  description?: string;
  type: "trip" | "home" | "couple" | "committee" | "event" | "other";
  defaultCurrency: string;
  event?: string;
  organisation?: string;
  members: GroupMember[];
  inviteCode?: string;
  totalExpenses: number;
  isArchived: boolean;
  createdBy: { _id: string; name: string };
  createdAt: string;
}

export interface Expense {
  _id: string;
  description: string;
  amount: number;
  currency: string;
  paidBy: { _id: string; name: string; avatar?: string };
  group: string;
  splitType: "equal" | "exact" | "percentage" | "shares";
  splits: Array<{
    user: { _id: string; name: string; avatar?: string };
    amount: number;
  }>;
  category?: string;
  notes?: string;
  date: string;
  isDeleted: boolean;
  createdBy?: { _id: string; name: string };
  createdAt: string;
}

export interface Balance {
  _id: string;
  group: string;
  from: { _id: string; name: string; avatar?: string };
  to: { _id: string; name: string; avatar?: string };
  amount: number;
}

export interface SimplifiedDebt {
  from: { _id: string; name: string };
  to: { _id: string; name: string };
  amount: number;
}

export interface Settlement {
  _id: string;
  group: string;
  paidBy: { _id: string; name: string; avatar?: string };
  paidTo: { _id: string; name: string; avatar?: string };
  amount: number;
  method: string;
  status: string;
  notes?: string;
  createdAt: string;
}

export interface CreateGroupData {
  name: string;
  description?: string;
  type?: string;
  defaultCurrency?: string;
  event?: string;
  organisation?: string;
}

export interface CreateExpenseData {
  description: string;
  amount: number;
  group: string;
  paidBy?: string;
  splitType?: string;
  splits?: Array<{ user: string; amount?: number; percentage?: number; shares?: number }>;
  category?: string;
  notes?: string;
}

export interface CreateSettlementData {
  group: string;
  paidBy: string;
  paidTo: string;
  amount: number;
  method?: string;
  notes?: string;
}

// Group API
const groupApi = {
  getAll: async (page = 1, limit = 20) => {
    const response = await apiClient.get(`/groups?page=${page}&limit=${limit}`);
    return response.data;
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/groups/${id}`);
    return response.data.data;
  },
  create: async (data: CreateGroupData) => {
    const response = await apiClient.post("/groups", data);
    return response.data.data;
  },
  update: async (id: string, data: Partial<CreateGroupData>) => {
    const response = await apiClient.put(`/groups/${id}`, data);
    return response.data.data;
  },
  addMember: async (id: string, userId: string, role = "member") => {
    const response = await apiClient.post(`/groups/${id}/members`, { userId, role });
    return response.data.data;
  },
  removeMember: async (id: string, userId: string) => {
    const response = await apiClient.delete(`/groups/${id}/members/${userId}`);
    return response.data.data;
  },
  generateInvite: async (id: string) => {
    const response = await apiClient.post(`/groups/${id}/invite`);
    return response.data.data;
  },
  joinByInvite: async (code: string) => {
    const response = await apiClient.post(`/groups/join/${code}`);
    return response.data.data;
  },
};

// Expense API
const expenseApi = {
  create: async (data: CreateExpenseData) => {
    const response = await apiClient.post("/expenses", data);
    return response.data.data;
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/expenses/${id}`);
    return response.data.data;
  },
  getByGroup: async (groupId: string, page = 1, limit = 20) => {
    const response = await apiClient.get(`/expenses/group/${groupId}?page=${page}&limit=${limit}`);
    return response.data;
  },
  getGroupBalances: async (groupId: string) => {
    const response = await apiClient.get(`/expenses/group/${groupId}/balances`);
    return response.data.data;
  },
  getSimplifiedDebts: async (groupId: string) => {
    const response = await apiClient.get(`/expenses/group/${groupId}/simplify`);
    return response.data.data;
  },
  getUserBalanceSummary: async () => {
    const response = await apiClient.get("/expenses/me/balances");
    return response.data.data;
  },
};

// Settlement API
const settlementApi = {
  create: async (data: CreateSettlementData) => {
    const response = await apiClient.post("/settlements", data);
    return response.data.data;
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/settlements/${id}`);
    return response.data.data;
  },
  getByGroup: async (groupId: string, page = 1, limit = 20) => {
    const response = await apiClient.get(`/settlements/group/${groupId}?page=${page}&limit=${limit}`);
    return response.data;
  },
};

// Group Hooks
export function useGroups(page = 1, limit = 20) {
  return useQuery({
    queryKey: ["groups", page, limit],
    queryFn: () => groupApi.getAll(page, limit),
  });
}

export function useGroup(id: string) {
  return useQuery({
    queryKey: ["groups", id],
    queryFn: () => groupApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: groupApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["groups"] }),
  });
}

export function useAddGroupMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, userId, role }: { id: string; userId: string; role?: string }) =>
      groupApi.addMember(id, userId, role),
    onSuccess: (_, vars) => queryClient.invalidateQueries({ queryKey: ["groups", vars.id] }),
  });
}

// Expense Hooks
export function useExpenses(groupId: string, page = 1, limit = 20) {
  return useQuery({
    queryKey: ["expenses", groupId, page, limit],
    queryFn: () => expenseApi.getByGroup(groupId, page, limit),
    enabled: !!groupId,
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: expenseApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["balances"] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}

export function useGroupBalances(groupId: string) {
  return useQuery({
    queryKey: ["balances", groupId],
    queryFn: () => expenseApi.getGroupBalances(groupId),
    enabled: !!groupId,
  });
}

export function useSimplifiedDebts(groupId: string) {
  return useQuery({
    queryKey: ["balances", "simplify", groupId],
    queryFn: () => expenseApi.getSimplifiedDebts(groupId),
    enabled: !!groupId,
  });
}

export function useUserBalanceSummary() {
  return useQuery({
    queryKey: ["balances", "me"],
    queryFn: expenseApi.getUserBalanceSummary,
  });
}

// Settlement Hooks
export function useSettlements(groupId: string, page = 1, limit = 20) {
  return useQuery({
    queryKey: ["settlements", groupId, page, limit],
    queryFn: () => settlementApi.getByGroup(groupId, page, limit),
    enabled: !!groupId,
  });
}

export function useCreateSettlement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: settlementApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settlements"] });
      queryClient.invalidateQueries({ queryKey: ["balances"] });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}
