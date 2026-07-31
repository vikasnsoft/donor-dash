"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Bell, Palette } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/profile">
          <Card className="hover:shadow-md transition-shadow h-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <User className="h-6 w-6 text-orange-500" />
                <CardTitle className="text-base">Profile</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Update your name, email, and password
              </p>
            </CardContent>
          </Card>
        </Link>

        <Card className="hover:shadow-md transition-shadow h-full opacity-60">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Bell className="h-6 w-6 text-orange-500" />
              <CardTitle className="text-base">Notifications</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Manage notification preferences
            </p>
            <p className="text-xs text-muted-foreground mt-1">Coming soon</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow h-full opacity-60">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Palette className="h-6 w-6 text-orange-500" />
              <CardTitle className="text-base">Appearance</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Theme and display settings
            </p>
            <p className="text-xs text-muted-foreground mt-1">Coming soon</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
