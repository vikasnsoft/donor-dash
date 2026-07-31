import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/axios";

export interface Notification {
  _id: string;
  type: string;
  channel: string;
  status: string;
  title: string;
  message: string;
  link?: string;
  organisation?: string;
  event?: string;
  readAt?: string;
  sender?: { _id: string; name: string };
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

const notificationApi = {
  getAll: async (page = 1, limit = 20): Promise<PaginatedResponse<Notification>> => {
    const response = await apiClient.get(`/notifications?page=${page}&limit=${limit}`);
    return response.data;
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await apiClient.get("/notifications/unread");
    return response.data.data.count;
  },

  markRead: async (id: string): Promise<Notification> => {
    const response = await apiClient.put(`/notifications/${id}/read`);
    return response.data.data;
  },

  markAllRead: async (): Promise<void> => {
    await apiClient.put("/notifications/read-all");
  },
};

export function useNotifications(page = 1, limit = 20) {
  return useQuery({
    queryKey: ["notifications", page, limit],
    queryFn: () => notificationApi.getAll(page, limit),
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ["notifications", "unread"],
    queryFn: notificationApi.getUnreadCount,
    refetchInterval: 30000, // Poll every 30 seconds
  });
}

export function useMarkRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationApi.markRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useMarkAllRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationApi.markAllRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
