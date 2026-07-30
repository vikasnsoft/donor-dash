"use client";
import React, { createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { useUserProfile, useLogin, useLogout, useRegister, useUpdateProfile } from "@/hooks/useAuth";
import type { User, LoginCredentials, RegisterData, ProfileUpdateData } from "@/hooks/useAuth";

// Re-export the Role type for convenience
export type { Role } from "@/hooks/useAuth";

// Define context type
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: ProfileUpdateData) => Promise<void>;
  checkPermission: (requiredRoles: string[]) => boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  
  // Use TanStack Query hooks
  const { 
    data, 
    isLoading: isProfileLoading, 
    error: profileError 
  } = useUserProfile();
  
  // Convert undefined to null for consistency
  const user = data || null;
  
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();
  const updateProfileMutation = useUpdateProfile();
  
  // Combined loading state
  const isLoading = 
    isProfileLoading || 
    loginMutation.isPending || 
    registerMutation.isPending || 
    logoutMutation.isPending || 
    updateProfileMutation.isPending;
  
  // Combined error state
  const error = 
    profileError?.message || 
    loginMutation.error?.message || 
    registerMutation.error?.message || 
    logoutMutation.error?.message || 
    updateProfileMutation.error?.message || 
    null;

  // Login function
  const login = async (credentials: LoginCredentials) => {
    try {
      await loginMutation.mutateAsync(credentials);
      router.push("/dashboard");
    } catch (err) {
      throw err;
    }
  };

  // Register function
  const register = async (data: RegisterData) => {
    try {
      await registerMutation.mutateAsync(data);
      router.push("/dashboard");
    } catch (err) {
      throw err;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
      router.push("/login");
    } catch (err) {
      throw err;
    }
  };

  // Update profile function
  const updateProfile = async (data: ProfileUpdateData) => {
    try {
      await updateProfileMutation.mutateAsync(data);
    } catch (err) {
      throw err;
    }
  };

  // Check if user has required role
  const checkPermission = (requiredRoles: string[]) => {
    if (!user) return false;

    // Admin has access to everything
    if (user.isAdmin || user.role === "admin") return true;

    // Check if user's role is in the list of required roles
    return requiredRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        register,
        logout,
        updateProfile,
        checkPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
