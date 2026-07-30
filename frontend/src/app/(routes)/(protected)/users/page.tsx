"use client";

import { useEffect } from "react";
import { useUsers } from "@/hooks/useUsers";
import { UsersTable } from "@/components/tables/users-table";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { RoleBasedComponent } from "@/components/role-based-component";
import type { Role } from "@/hooks/useAuth";
import { Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Admin-only page to view all users
export default function UsersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { users, isLoading, updateUser, deleteUser } = useUsers();
  
  // Redirect non-admin users
  useEffect(() => {
    if (user && !user.isAdmin) {
      router.push("/dashboard");
    }
  }, [user, router]);

  // Handle role change
  const handleRoleChange = (userId: string, newRole: string) => {
    // Convert string to Role type
    const roleValue = newRole as Role;
    
    updateUser(
      { userId, userData: { role: roleValue } },
      {
        onSuccess: () => toast.success("User role updated successfully"),
        onError: () => toast.error("Failed to update user role"),
      }
    );
  };

  // Handle user deletion
  const handleDeleteUser = (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUser(userId, {
        onSuccess: () => toast.success("User deleted successfully"),
        onError: () => toast.error("Failed to delete user"),
      });
    }
  };

  if (!user || !user.isAdmin) {
    return null; // Don't render anything while redirecting
  }

  return (
    <RoleBasedComponent allowedRoles={["admin"]}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Users Management</h2>
          <Button className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Add User
          </Button>
        </div>
        
        <p className="text-muted-foreground">
          View and manage all registered users in the system. Only administrators can access this page.
        </p>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <UsersTable 
            data={users || []} 
            isLoading={isLoading} 
            onRoleChange={handleRoleChange}
            onDeleteUser={handleDeleteUser}
          />
        )}
      </div>
    </RoleBasedComponent>
  );
}
