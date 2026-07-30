"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import type { Role } from "@/hooks/useAuth";

interface AuthProtectionProps {
  children: React.ReactNode;
  requiredRoles?: Role[];
}

/**
 * Client component that handles authentication and role-based access control
 * This allows us to keep the layout as a server component while handling
 * auth checking in a client component
 */
export function AuthProtection({
  children,
  requiredRoles = [],
}: AuthProtectionProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    } else if (
      !isLoading &&
      user &&
      requiredRoles.length > 0 &&
      !requiredRoles.includes(user.role) &&
      user.role !== "admin"
    ) {
      // If user doesn't have the required role, redirect to dashboard
      router.push("/dashboard");
    }
  }, [user, isLoading, router, requiredRoles]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // If not authenticated, return null while redirecting
  if (!user) {
    return null;
  }

  // If authenticated and has proper role, render the children
  return <>{children}</>;
}
