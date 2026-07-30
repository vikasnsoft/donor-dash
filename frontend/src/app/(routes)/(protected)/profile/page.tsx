"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/providers/auth-provider";
import { profileUpdateSchema, ProfileUpdateFormValues } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ControllerRenderProps } from "react-hook-form";
import { RoleBasedComponent } from "@/components/role-based-component";

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileUpdateFormValues>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: ProfileUpdateFormValues) {
    setSuccess(null);
    setError(null);
    setIsLoading(true);
    
    try {
      // Only send fields that have values
      const updateData: {name?: string; email?: string; password?: string} = {};
      if (values.name) updateData.name = values.name;
      if (values.email) updateData.email = values.email;
      if (values.password) updateData.password = values.password;
      
      await updateProfile(updateData);
      setSuccess("Profile updated successfully");
      
      // Reset password fields
      form.setValue("password", "");
      form.setValue("confirmPassword", "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
        
        <div className="mb-8 p-6 rounded-lg border bg-card shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-xl font-bold text-primary">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user?.name}</h2>
              <p className="text-muted-foreground">{user?.email}</p>
              <div className="mt-1">
                <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
          
          {success && (
            <Alert className="mb-6">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }: { field: ControllerRenderProps<ProfileUpdateFormValues, "name"> }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }: { field: ControllerRenderProps<ProfileUpdateFormValues, "email"> }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }: { field: ControllerRenderProps<ProfileUpdateFormValues, "password"> }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Leave blank to keep current password" 
                        disabled={isLoading} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }: { field: ControllerRenderProps<ProfileUpdateFormValues, "confirmPassword"> }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Leave blank to keep current password" 
                        disabled={isLoading} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Profile"}
              </Button>
            </form>
          </Form>
        </div>
        
        {/* Admin and supervisor have additional options */}
        <RoleBasedComponent requiredRoles={["admin", "supervisor"]}>
          <div className="p-6 rounded-lg border bg-card shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Admin Settings</h2>
            <p className="text-muted-foreground mb-4">
              As an {user?.role}, you have access to additional system settings and user management.
            </p>
            <div className="flex gap-4">
              <Button variant="outline">User Management</Button>
              <Button variant="outline">System Settings</Button>
            </div>
          </div>
        </RoleBasedComponent>
      </div>
    </div>
  );
}
