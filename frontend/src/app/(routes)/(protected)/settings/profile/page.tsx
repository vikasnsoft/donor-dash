"use client";

import { useAuth } from "@/providers/auth-provider";

export default function ProfileSettingsPage() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-6 text-3xl font-bold">Profile Settings</h1>
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Account Information</h2>
        <div className="space-y-2">
          <p><span className="font-medium">Name:</span> {user?.name}</p>
          <p><span className="font-medium">Email:</span> {user?.email}</p>
          <p><span className="font-medium">Role:</span> {user?.role}</p>
        </div>
      </div>
    </div>
  );
}
