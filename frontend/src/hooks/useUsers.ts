import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import type { User } from "@/hooks/useAuth";

// Hook for user management operations (admin only)
export function useUsers() {
  const queryClient = useQueryClient();

  // Fetch all users
  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: async (): Promise<User[]> => {
      const response = await axios.get("/users");
      return response.data;
    },
  });

  // Update a user
  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, userData }: { userId: string; userData: Partial<User> }) => {
      const response = await axios.put(`/users/${userId}`, userData);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch users query
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  // Delete a user
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await axios.delete(`/users/${userId}`);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch users query
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return {
    users: usersQuery.data || [],
    isLoading: usersQuery.isLoading,
    isError: usersQuery.isError,
    error: usersQuery.error,
    updateUser: updateUserMutation.mutate,
    deleteUser: deleteUserMutation.mutate,
    isUpdating: updateUserMutation.isPending,
    isDeleting: deleteUserMutation.isPending,
  };
}
