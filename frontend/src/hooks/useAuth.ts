import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
// Define Role type
export type Role = 'admin' | 'supervisor' | 'volunteer' | 'auditor' | 'support' | 'guest';

// Types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  isAdmin: boolean;
  avatar?: string;
  phone?: string;
  defaultCurrency?: string;
  timezone?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface ProfileUpdateData {
  name?: string;
  email?: string;
  password?: string;
}

// Auth API service
export const authApi = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<User> => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },
  
  // Register user
  register: async (data: RegisterData): Promise<User> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },
  
  // Logout user
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },
  
  // Get user profile
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
  
  // Update user profile
  updateProfile: async (data: ProfileUpdateData): Promise<User> => {
    const response = await apiClient.put('/auth/profile', data);
    return response.data;
  },
};

// React Query Hooks

/**
 * Hook to get the current user's profile
 */
export function useUserProfile() {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: authApi.getProfile,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for user login
 */
export function useLogin() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // Update user profile in cache
      queryClient.setQueryData(['user', 'profile'], data);
    },
  });
}

/**
 * Hook for user registration
 */
export function useRegister() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      // Update user profile in cache
      queryClient.setQueryData(['user', 'profile'], data);
    },
  });
}

/**
 * Hook for user logout
 */
export function useLogout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // Clear user profile from cache
      queryClient.setQueryData(['user', 'profile'], null);
      // Invalidate all queries to force refetch
      queryClient.invalidateQueries();
    },
  });
}

/**
 * Hook for updating user profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (data) => {
      // Update user profile in cache
      queryClient.setQueryData(['user', 'profile'], data);
    },
  });
}

// User API service
export const userApi = {
  // Get all users (admin only)
  getUsers: async (): Promise<User[]> => {
    const response = await apiClient.get('/users');
    return response.data;
  },
  
  // Get user by ID (admin only)
  getUserById: async (id: string): Promise<User> => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },
  
  // Update user (admin only)
  updateUser: async (id: string, data: { name?: string; email?: string; role?: string; isAdmin?: boolean }): Promise<User> => {
    const response = await apiClient.put(`/users/${id}`, data);
    return response.data;
  },
  
  // Delete user (admin only)
  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },
};

/**
 * Hook to get all users (admin only)
 */
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: userApi.getUsers,
    retry: false,
  });
}

/**
 * Hook to get a specific user by ID (admin only)
 */
export function useUser(id: string) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => userApi.getUserById(id),
    retry: false,
    enabled: !!id,
  });
}

/**
 * Hook for updating a user (admin only)
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; email?: string; role?: string; isAdmin?: boolean } }) => userApi.updateUser(id, data),
    onSuccess: (data) => {
      // Update user in cache
      queryClient.setQueryData(['users', data._id], data);
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

/**
 * Hook for deleting a user (admin only)
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: userApi.deleteUser,
    onSuccess: (_, variables) => {
      // Remove user from cache
      queryClient.removeQueries({ queryKey: ['users', variables] });
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
